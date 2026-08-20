import { getDb, withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";
import type { ApBillRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ap-bill.request.dto";
import type {
  ApBillApCounterpartyDetailsDto,
  ApBillApSubledgerDetailsDto,
  ApBillDetailedDocumentDto,
  ApBillDetailedLineDto,
  ApBillDetailedTaxComponentDto,
  ApBillJournalLineDto,
  ApBillPostingDetailsDto,
  ApBillPostingResponseDto,
  ApBillTaxLedgerDetailDto,
} from "@voyzu/core/types/modules/financial-document-processing-engine/ap-bill.response.dto";
import type { InventoryReceiptRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/inventory-receipt.request.dto";

import { resolveEffectiveSettingsCompanyId } from "../../../common/server/settings-scope";
import { JournalRepo } from "../../../journals/server/db/journal.repo";
import type { JournalHeaderRow, JournalLineRow } from "../../../journals/server/db/journal.row.types";
import { processInventoryReceipt } from "../../inventory/lib/inventory-processing.service";
import { ApBillPostingRepo } from "../db/ap-bill-posting.repo";
import type {
  CounterpartyPostingContextRow,
  DimensionValueLookupRow,
  PostingCodeAccountRow,
  TaxAuthorityRow,
  TaxComponentRow,
  TaxLedgerEntryRow,
  TaxRuleRow,
} from "../db/ap-bill-posting.row.types";
import {
  AP_BILL_DOCUMENT_LABEL,
  AP_BILL_ENGINE_CODE,
  AP_PAYABLE_CONTROL_CODE,
  CALLER_SUPPLIED_TAX_RULE_CODE,
  PURCHASE_POSTING_CODE,
  TAX_ON_PURCHASES_MOVEMENT_CODE,
  type ApBillLineDimension,
  type ApBillPostingLine,
} from "./ap-bill.types";
import { validateData, validateRequest, type ApBillDataValidationContext } from "./ap-bill.validator";

export interface ProcessApBillOptions {
  preview?: boolean;
}

type ResolvedApBillRequestDto = ApBillRequestDto & { document_id: string };

interface ResolvedContext {
  request: ResolvedApBillRequestDto;
  data: ApBillDataValidationContext;
  counterpartyWasCreated: boolean;
  detailedDocument: ApBillDetailedDocumentDto;
  reservedJournalHeaderId: number | null;
  purchaseAccountsByCode: Map<string, PostingCodeAccountRow>;
  dimensionValuesByDimensionCodeAndName: Map<string, DimensionValueLookupRow>;
}

interface GeneratedPosting {
  journalLines: ApBillPostingLine[];
  taxLedgerDetails: ApBillTaxLedgerDetailDto[];
  totalDebitBaseAmount: number;
  totalCreditBaseAmount: number;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function amount(value: number | string | null | undefined): number {
  return typeof value === "number" ? value : Number(value ?? 0);
}

function postingDateFor(input: ApBillRequestDto): string {
  return input.posting_date ?? input.bill_date;
}

function requestedPurchasePostingCodes(input: ApBillRequestDto): string[] {
  return [...new Set([
    input.purchase_posting_code ?? null,
    ...input.lines.map((line) => line.purchase_posting_code ?? null),
  ].filter((code): code is string => Boolean(code)))];
}

function requestedItemCodes(input: ApBillRequestDto): string[] {
  return [...new Set(input.lines.map((line) => line.inventory_item_code).filter((code): code is string => Boolean(code)))];
}

function requestedTaxRuleCodes(input: ApBillRequestDto): string[] {
  return [...new Set(input.lines.map((line) => line.tax_rule))];
}

function requestedTaxAuthorityCodes(input: ApBillRequestDto): string[] {
  return [...new Set(input.lines.flatMap((line) => line.tax_components?.map((component) => component.tax_authority_code) ?? []))];
}

function requestedDimensionPairs(input: ApBillRequestDto): Array<{ dimensionCode: string; valueName: string }> {
  const pairs = new Map<string, { dimensionCode: string; valueName: string }>();
  for (const dimensions of [input.dimensions, ...input.lines.map((line) => line.dimensions)]) {
    for (const [dimensionCode, valueName] of Object.entries(dimensions ?? {})) {
      pairs.set(`${dimensionCode}\u0000${valueName}`, { dimensionCode, valueName });
    }
  }
  return [...pairs.values()];
}

function mapByCode<T extends { code: string }>(rows: T[]): Map<string, T> {
  return new Map(rows.map((row) => [row.code, row]));
}

function mapDimensionValues(rows: DimensionValueLookupRow[]): Map<string, DimensionValueLookupRow> {
  return new Map(rows.map((row) => [`${row.dimension_code}\u0000${row.dimension_value_name}`, row]));
}

function mapTaxComponentsByRuleCode(rows: TaxComponentRow[]): Map<string, TaxComponentRow[]> {
  const map = new Map<string, TaxComponentRow[]>();
  for (const row of rows) {
    const existing = map.get(row.tax_rule_code) ?? [];
    existing.push(row);
    map.set(row.tax_rule_code, existing);
  }
  return map;
}

function syntheticInlineCounterparty(input: ApBillRequestDto, companyId: number, countryCurrencyCode: string): CounterpartyPostingContextRow {
  if (!input.ap_counterparty?.code) throw new InputValidationError("ap_counterparty.code is required");
  return {
    id: 0,
    company_id: companyId,
    code: input.ap_counterparty.code,
    name: input.ap_counterparty.name,
    status: input.ap_counterparty.status,
    country_code: input.ap_counterparty.country_code,
    tax_region_or_province: input.ap_counterparty.state_or_province_code ?? null,
    country_currency_code: countryCurrencyCode,
  };
}

function detailedTaxComponentsForLine(
  line: ApBillRequestDto["lines"][number],
  taxableAmount: number,
  taxRule: TaxRuleRow,
  configuredComponents: TaxComponentRow[],
  authoritiesByCode: Map<string, TaxAuthorityRow>,
  taxRecoverable: boolean,
): ApBillDetailedTaxComponentDto[] {
  if (taxRule.calculation_method === "NO_TAX") return [];

  if (line.tax_rule === CALLER_SUPPLIED_TAX_RULE_CODE) {
    return (line.tax_components ?? []).map((component) => {
      const authority = authoritiesByCode.get(component.tax_authority_code);
      if (!authority) throw new BusinessRuleError(`Tax authority ${component.tax_authority_code} was not resolved`);
      const rawTaxAmount = taxableAmount * component.tax_rate;
      return {
        tax_rule: taxRule.code,
        tax_rule_id: taxRule.id,
        tax_component_id: null,
        tax_authority_id: authority.id,
        tax_authority_code: authority.code,
        tax_authority_name: authority.name,
        scheme_code: null,
        invoice_label: component.invoice_label ?? taxRule.invoice_label,
        report_label: taxRule.report_label,
        tax_rate: component.tax_rate,
        taxable_amount: taxableAmount,
        raw_tax_amount: rawTaxAmount,
        tax_amount: round2(rawTaxAmount),
        tax_recoverable: taxRecoverable,
      };
    });
  }

  return configuredComponents.map((component) => {
    const rawTaxAmount = taxableAmount * component.rate;
    return {
      tax_rule: taxRule.code,
      tax_rule_id: taxRule.id,
      tax_component_id: component.id,
      tax_authority_id: component.tax_authority_id,
      tax_authority_code: component.tax_authority_code,
      tax_authority_name: component.tax_authority_name,
      scheme_code: component.scheme_code,
      invoice_label: component.invoice_label,
      report_label: component.report_label,
      tax_rate: component.rate,
      taxable_amount: taxableAmount,
      raw_tax_amount: rawTaxAmount,
      tax_amount: round2(rawTaxAmount),
      tax_recoverable: taxRecoverable,
    };
  });
}

function buildDetailedLines(context: ApBillDataValidationContext, request: ResolvedApBillRequestDto): ApBillDetailedLineDto[] {
  return request.lines.map((line, index) => {
    const taxRule = context.taxRulesByCode.get(line.tax_rule);
    if (!taxRule) throw new BusinessRuleError(`lines[${index}].tax_rule ${line.tax_rule} was not resolved`);
    const netAmount = round2(amount(line.net_amount));
    const taxRecoverable = line.tax_recoverable ?? request.tax_recoverable ?? true;
    const taxComponents = detailedTaxComponentsForLine(
      line,
      netAmount,
      taxRule,
      context.taxComponentsByRuleCode.get(line.tax_rule) ?? [],
      context.taxAuthoritiesByCode,
      taxRecoverable,
    );
    const taxAmount = round2(taxComponents.reduce((sum, component) => sum + component.tax_amount, 0));
    const grossAmount = round2(line.gross_amount == null ? netAmount + taxAmount : amount(line.gross_amount));
    const recoverableTaxAmount = taxRecoverable ? taxAmount : 0;
    const nonRecoverableTaxAmount = taxRecoverable ? 0 : taxAmount;
    return {
      line_id: line.line_id ?? index + 1,
      line_description: line.description,
      quantity: line.quantity == null ? null : amount(line.quantity),
      purchase_posting_code: line.purchase_posting_code
        ?? request.purchase_posting_code
        ?? (line.inventory_item_code ? context.itemPostingProfilesByItemCode.get(line.inventory_item_code)?.purchase_gl_account_code : null)
        ?? context.defaultPurchasePostingCode?.gl_account_code
        ?? "",
      inventory_item_code: line.inventory_item_code ?? null,
      net_amount: netAmount,
      tax_rule: line.tax_rule,
      tax_amount: taxAmount,
      gross_amount: grossAmount,
      recoverable_tax_amount: recoverableTaxAmount,
      non_recoverable_tax_amount: nonRecoverableTaxAmount,
      purchase_amount: round2(netAmount + nonRecoverableTaxAmount),
      tax_components: taxComponents,
      dimensions: { ...(request.dimensions ?? {}), ...(line.dimensions ?? {}) },
    };
  });
}

function buildDetailedDocument(context: ApBillDataValidationContext, request: ResolvedApBillRequestDto): ApBillDetailedDocumentDto {
  if (!context.company || !context.counterparty) throw new InputValidationError("Company and counterparty are required");
  const lines = buildDetailedLines(context, request);
  const netAmount = round2(lines.reduce((sum, line) => sum + line.net_amount, 0));
  const recoverableTaxAmount = round2(lines.reduce((sum, line) => sum + line.recoverable_tax_amount, 0));
  const nonRecoverableTaxAmount = round2(lines.reduce((sum, line) => sum + line.non_recoverable_tax_amount, 0));
  const grossAmount = round2(lines.reduce((sum, line) => sum + line.gross_amount, 0));
  return {
    company: { code: context.company.code, base_currency_code: context.company.base_currency_code },
    ap_counterparty: {
      code: context.counterparty.code,
      name: context.counterparty.name,
      status: context.counterparty.status,
      country_code: context.counterparty.country_code,
      tax_region_or_province: context.counterparty.tax_region_or_province,
    },
    document_id: request.document_id,
    supplier_invoice_number: request.supplier_invoice_number,
    memo: request.memo ?? null,
    generated_description: `Supplier Bill ${request.document_id}`,
    bill_date: request.bill_date,
    posting_date: postingDateFor(request),
    lines,
    net_amount: netAmount,
    recoverable_tax_amount: recoverableTaxAmount,
    non_recoverable_tax_amount: nonRecoverableTaxAmount,
    tax_amount: round2(recoverableTaxAmount + nonRecoverableTaxAmount),
    gross_amount: grossAmount,
  };
}

async function resolveContext(repo: ApBillPostingRepo, request: ResolvedApBillRequestDto, preview: boolean, reservedJournalHeaderId: number | null): Promise<ResolvedContext> {
  const company = request.company_code ? await repo.getCompanyByCode(request.company_code) : null;
  if (company && company.status !== "ACTIVE") throw new BusinessRuleError(`Company ${company.code} is not ACTIVE`);
  const settingsCompanyId = company ? await resolveEffectiveSettingsCompanyId(company.id) : null;
  const documentProcessor = company ? await repo.getDocumentProcessor() : null;
  const countryCode = company?.country_code ?? "";

  let counterparty: CounterpartyPostingContextRow | null = null;
  let counterpartyWasCreated = false;
  if (company && request.ap_counterparty_code) {
    counterparty = await repo.getCounterpartyByCode(company.id, request.ap_counterparty_code);
  } else if (company && request.ap_counterparty?.code) {
    const countryCurrency = await repo.getCountryCurrency(request.ap_counterparty.country_code);
    if (!countryCurrency) throw new BusinessRuleError(`Country ${request.ap_counterparty.country_code} was not found`);
    counterparty = preview
      ? syntheticInlineCounterparty(request, company.id, countryCurrency)
      : await repo.upsertCounterparty({
        company_id: company.id,
        code: request.ap_counterparty.code,
        name: request.ap_counterparty.name,
        status: request.ap_counterparty.status,
        country_code: request.ap_counterparty.country_code,
        tax_region_or_province: request.ap_counterparty.state_or_province_code ?? null,
      });
    counterpartyWasCreated = preview || Boolean("was_created" in counterparty && counterparty.was_created);
  }

  const [
    fiscalPeriod,
    duplicateSupplierBill,
    apControlAccount,
    inventoryControlAccount,
    taxMovementControlAccount,
    defaultPurchasePostingCode,
    purchasePostingCodes,
    itemPostingProfiles,
    taxRules,
    taxAuthorities,
    dimensionValues,
  ] = await Promise.all([
    company ? repo.getOpenFiscalPeriod(company.id, postingDateFor(request)) : Promise.resolve(null),
    company && counterparty ? repo.getExistingSupplierBill(company.id, counterparty.id, request.supplier_invoice_number) : Promise.resolve(null),
    settingsCompanyId ? repo.getApControlAccount(settingsCompanyId, AP_PAYABLE_CONTROL_CODE) : Promise.resolve(null),
    settingsCompanyId ? repo.getInventoryControlAccount(settingsCompanyId) : Promise.resolve(null),
    settingsCompanyId ? repo.getTaxMovementControlAccount(settingsCompanyId, TAX_ON_PURCHASES_MOVEMENT_CODE) : Promise.resolve(null),
    settingsCompanyId ? repo.getPurchasePostingCode(settingsCompanyId, AP_BILL_ENGINE_CODE, PURCHASE_POSTING_CODE) : Promise.resolve(null),
    settingsCompanyId ? repo.listPurchasePostingCodes(settingsCompanyId, AP_BILL_ENGINE_CODE, requestedPurchasePostingCodes(request)) : Promise.resolve([]),
    company ? repo.listItemPostingProfiles(company.id, requestedItemCodes(request)) : Promise.resolve([]),
    countryCode ? repo.listTaxRules(countryCode, requestedTaxRuleCodes(request)) : Promise.resolve([]),
    countryCode ? repo.listTaxAuthorities(countryCode, requestedTaxAuthorityCodes(request)) : Promise.resolve([]),
    settingsCompanyId ? repo.listDimensionValues(settingsCompanyId, requestedDimensionPairs(request)) : Promise.resolve([]),
  ]);
  const taxComponents = countryCode ? await repo.listTaxComponents(countryCode, taxRules.map((rule) => rule.code)) : [];

  const data: ApBillDataValidationContext = {
    company,
    documentProcessor,
    counterparty,
    duplicateSupplierBill,
    fiscalPeriod,
    apControlAccount,
    inventoryControlAccount,
    taxMovementControlAccount,
    defaultPurchasePostingCode,
    purchasePostingCodesByCode: mapByCode(purchasePostingCodes),
    itemPostingProfilesByItemCode: new Map(itemPostingProfiles.map((row) => [row.item_code, row])),
    taxRulesByCode: mapByCode(taxRules),
    taxComponentsByRuleCode: mapTaxComponentsByRuleCode(taxComponents),
    taxAuthoritiesByCode: mapByCode(taxAuthorities),
    dimensionValuesByDimensionCodeAndName: mapDimensionValues(dimensionValues),
  };
  validateData(request, data);

  return {
    request,
    data,
    counterpartyWasCreated,
    detailedDocument: buildDetailedDocument(data, request),
    reservedJournalHeaderId,
    purchaseAccountsByCode: mapByCode(purchasePostingCodes),
    dimensionValuesByDimensionCodeAndName: mapDimensionValues(dimensionValues),
  };
}

function resolvedPurchaseAccount(context: ResolvedContext, line: ApBillDetailedLineDto): PostingCodeAccountRow {
  const requestLine = context.request.lines.find((candidate, index) => (candidate.line_id ?? index + 1) === line.line_id);
  const hasDocumentOverride = Boolean(requestLine?.purchase_posting_code || context.request.purchase_posting_code);
  if (line.inventory_item_code && !hasDocumentOverride) {
    const profile = context.data.itemPostingProfilesByItemCode.get(line.inventory_item_code);
    if (!profile?.purchase_gl_account_id || !profile.purchase_gl_account_code || !profile.purchase_gl_account_name || !profile.purchase_gl_account_type || !profile.purchase_gl_account_status) {
      throw new BusinessRuleError(`Purchase account for item ${line.inventory_item_code} was not resolved`);
    }
    return {
      code: profile.profile_code,
      document_code: AP_BILL_ENGINE_CODE,
      status: profile.profile_status,
      gl_account_id: profile.purchase_gl_account_id,
      gl_account_code: profile.purchase_gl_account_code,
      gl_account_name: profile.purchase_gl_account_name,
      gl_account_type: profile.purchase_gl_account_type,
      gl_account_status: profile.purchase_gl_account_status,
    };
  }
  const account = context.purchaseAccountsByCode.get(line.purchase_posting_code) ?? context.data.defaultPurchasePostingCode;
  if (!account) throw new BusinessRuleError(`Purchase posting code ${line.purchase_posting_code} was not resolved`);
  return account;
}

function dimensionsForLine(context: ResolvedContext, line: ApBillDetailedLineDto): ApBillLineDimension[] {
  return Object.entries(line.dimensions).map(([dimensionCode, valueName]) => {
    const row = context.dimensionValuesByDimensionCodeAndName.get(`${dimensionCode}\u0000${valueName}`);
    if (!row) throw new BusinessRuleError(`Dimension ${dimensionCode} value ${valueName} was not resolved`);
    return {
      dimension_id: row.dimension_id,
      dimension_value_id: row.dimension_value_id,
      dimension_code: row.dimension_code,
      dimension_name: row.dimension_name,
      dimension_value_name: row.dimension_value_name,
    };
  });
}

function recoverableTaxComponents(document: ApBillDetailedDocumentDto): ApBillDetailedTaxComponentDto[] {
  return document.lines
    .flatMap((line) => line.tax_components)
    .filter((component) => component.tax_recoverable && component.tax_amount > 0);
}

function buildGeneratedPosting(context: ResolvedContext): GeneratedPosting {
  const company = context.data.company!;
  const period = context.data.fiscalPeriod!;
  const apControl = context.data.apControlAccount!;
  const taxControl = context.data.taxMovementControlAccount!;
  const document = context.detailedDocument;
  const lines: ApBillPostingLine[] = [];
  const taxLedgerDetails: ApBillTaxLedgerDetailDto[] = [];

  for (const billLine of document.lines) {
    const inventoryControl = context.data.inventoryControlAccount;
    const item = billLine.inventory_item_code ? context.data.itemPostingProfilesByItemCode.get(billLine.inventory_item_code) : null;
    const isInventoryItem = item?.item_type === "INVENTORY";
    const account = isInventoryItem ? null : resolvedPurchaseAccount(context, billLine);
    lines.push({
      line_number: lines.length + 1,
      gl_account_id: isInventoryItem ? inventoryControl!.gl_account_id : account!.gl_account_id,
      gl_account_code: isInventoryItem ? inventoryControl!.gl_account_code : account!.gl_account_code,
      gl_account_name: isInventoryItem ? inventoryControl!.gl_account_name : account!.gl_account_name,
      source_ledger: isInventoryItem ? "INVENTORY" : "POSTING_CODE",
      source_control_account: isInventoryItem ? "INVENTORY_CONTROL" : account!.code,
      dr_cr: "DR",
      base_currency_amount: billLine.purchase_amount,
      description: billLine.line_description,
      memo: document.memo,
      dimensions: dimensionsForLine(context, billLine),
    });

  }

  for (const component of recoverableTaxComponents(document)) {
    lines.push({
      line_number: lines.length + 1,
      gl_account_id: taxControl.gl_account_id,
      gl_account_code: taxControl.gl_account_code,
      gl_account_name: taxControl.gl_account_name,
      source_ledger: "TAX",
      source_control_account: TAX_ON_PURCHASES_MOVEMENT_CODE,
      dr_cr: "DR",
      base_currency_amount: component.tax_amount,
      description: component.invoice_label ?? component.tax_rule,
      memo: document.memo,
    });
    taxLedgerDetails.push({
      id: null,
      code: null,
      tax_rule: component.tax_rule,
      tax_component_id: component.tax_component_id ?? null,
      tax_authority_code: component.tax_authority_code,
      tax_authority_name: component.tax_authority_name,
      tax_movement_type_code: TAX_ON_PURCHASES_MOVEMENT_CODE,
      description: component.invoice_label ?? component.tax_rule,
      scheme_code: component.scheme_code ?? null,
      invoice_label: component.invoice_label ?? null,
      report_label: component.report_label ?? null,
      tax_rate: component.tax_rate,
      taxable_amount: component.taxable_amount,
      posting_date: document.posting_date,
      financial_year_code: period.financial_year_code,
      financial_period_code: period.financial_period_code,
      base_currency_code: company.base_currency_code,
      entry_type: "DEBIT",
      base_currency_amount: component.tax_amount,
      status: "EPHEMERAL",
    });
  }

  lines.push({
    line_number: lines.length + 1,
    gl_account_id: apControl.gl_account_id,
    gl_account_code: apControl.gl_account_code,
    gl_account_name: apControl.gl_account_name,
    source_ledger: "ACCOUNTS_PAYABLE",
    source_control_account: AP_PAYABLE_CONTROL_CODE,
    dr_cr: "CR",
    base_currency_amount: document.gross_amount,
    description: document.generated_description,
    memo: document.memo,
  });

  return {
    journalLines: lines,
    taxLedgerDetails,
    totalDebitBaseAmount: round2(lines.filter((line) => line.dr_cr === "DR").reduce((sum, line) => sum + line.base_currency_amount, 0)),
    totalCreditBaseAmount: round2(lines.filter((line) => line.dr_cr === "CR").reduce((sum, line) => sum + line.base_currency_amount, 0)),
  };
}

function postingDetails(context: ResolvedContext, generated: GeneratedPosting, header?: JournalHeaderRow, rows?: JournalLineRow[]): ApBillPostingDetailsDto {
  const company = context.data.company!;
  const period = context.data.fiscalPeriod!;
  const document = context.detailedDocument;
  const journalLines: ApBillJournalLineDto[] = rows
    ? rows.map((row) => ({
      id: row.id,
      journal_header_id: row.journal_header_id,
      line_number: row.line_number,
      gl_account_code: row.gl_account_code,
      gl_account_name: row.gl_account_name,
      source_ledger: row.source_ledger,
      source_control_account: row.source_control_account,
      dr_cr: row.dr_cr === "DR" ? "DR" : "CR",
      base_currency_amount: row.base_currency_amount,
      description: row.description,
      memo: row.memo,
      dimensions: generated.journalLines.find((line) => line.line_number === row.line_number)?.dimensions ?? [],
    }))
    : generated.journalLines.map((line) => ({
      id: null,
      journal_header_id: null,
      line_number: line.line_number,
      gl_account_code: line.gl_account_code,
      gl_account_name: line.gl_account_name,
      source_ledger: line.source_ledger,
      source_control_account: line.source_control_account,
      dr_cr: line.dr_cr,
      base_currency_amount: line.base_currency_amount,
      description: line.description,
      memo: line.memo,
      dimensions: line.dimensions ?? [],
    }));

  return {
    journal_header: {
      id: header?.id ?? null,
      code: header?.code ?? null,
      document_type_code: AP_BILL_ENGINE_CODE,
      document_id: document.document_id,
      generated_description: document.generated_description,
      posting_engine_code: AP_BILL_ENGINE_CODE,
      company_code: company.code,
      document_date: document.bill_date,
      posting_date: document.posting_date,
      financial_year_code: period.financial_year_code,
      financial_period_code: period.financial_period_code,
      base_currency_code: company.base_currency_code,
      total_debit_base_amount: header?.total_debit_base_amount ?? generated.totalDebitBaseAmount,
      total_credit_base_amount: header?.total_credit_base_amount ?? generated.totalCreditBaseAmount,
      memo: document.memo,
      status: header ? "POSTED" : "EPHEMERAL",
    },
    journal_lines: journalLines,
  };
}

function apSubledgerDetails(context: ResolvedContext, journalHeaderId: number | null, row?: { id: number; ap_subledger_entry_code: string }): ApBillApSubledgerDetailsDto {
  const company = context.data.company!;
  const period = context.data.fiscalPeriod!;
  const counterparty = context.data.counterparty!;
  const document = context.detailedDocument;
  return {
    id: row?.id ?? null,
    code: row?.ap_subledger_entry_code ?? null,
    company_code: company.code,
    journal_header_id: journalHeaderId,
    ap_counterparty_code: counterparty.code,
    control_account_code: AP_PAYABLE_CONTROL_CODE,
    posting_date: document.posting_date,
    financial_year_code: period.financial_year_code,
    financial_period_code: period.financial_period_code,
    base_currency_code: company.base_currency_code,
    entry_type: "CREDIT",
    base_currency_amount: document.gross_amount,
    open_amount: document.gross_amount,
    memo: document.memo,
    status: row ? "POSTED" : "EPHEMERAL",
  };
}

function counterpartyDetails(context: ResolvedContext, counterparty?: CounterpartyPostingContextRow): ApBillApCounterpartyDetailsDto {
  const company = context.data.company!;
  const resolved = counterparty ?? context.data.counterparty!;
  return {
    id: resolved.id || null,
    company_code: company.code,
    code: resolved.code,
    name: resolved.name,
    status: resolved.status,
    country_code: resolved.country_code,
    tax_region_or_province: resolved.tax_region_or_province,
    was_created: context.counterpartyWasCreated,
  };
}

function taxLedgerHeaderCode(journalHeaderId: number): string {
  return `TAX-BILL-${journalHeaderId}`;
}

function hasDocumentId(request: ApBillRequestDto): request is ResolvedApBillRequestDto {
  return typeof request.document_id === "string" && request.document_id.trim().length > 0;
}

function withDocumentId(request: ApBillRequestDto, journalHeaderId: number): ResolvedApBillRequestDto {
  if (hasDocumentId(request)) return request;
  return { ...request, document_id: `BILL-${journalHeaderId}` };
}

function inventoryReceiptRequest(context: ResolvedContext): InventoryReceiptRequestDto | null {
  const inventoryLines = context.detailedDocument.lines.filter((line) =>
    line.inventory_item_code
    && context.data.itemPostingProfilesByItemCode.get(line.inventory_item_code)?.item_type === "INVENTORY"
  );
  if (inventoryLines.length === 0) return null;

  return {
    document_type: "INVENTORY_RECEIPT",
    company_code: context.data.company!.code,
    memo: `Receipt for ${context.detailedDocument.document_id}`,
    receipt_date: context.detailedDocument.bill_date,
    posting_date: context.detailedDocument.posting_date,
    source: {
      source_document: AP_BILL_ENGINE_CODE,
      source_document_id: context.detailedDocument.document_id,
    },
    lines: inventoryLines.map((line) => {
      if (line.quantity == null || line.quantity <= 0) throw new InputValidationError(`AP bill inventory line ${line.line_id} requires a positive quantity`);
      return {
        line_id: line.line_id,
        inventory_item_code: line.inventory_item_code!,
        description: line.line_description,
        quantity_delta: line.quantity,
        valuation_method: "SUPPLIED_UNIT_BOOK_VALUE",
        unit_book_value: round2(line.purchase_amount / line.quantity),
        dimensions: line.dimensions,
      };
    }),
  };
}

async function processApBillUnchecked(input: ApBillRequestDto, options: ProcessApBillOptions = {}): Promise<ApBillPostingResponseDto> {
  validateRequest(input);
  const rawRequest: ApBillRequestDto = input;
  const repo = new ApBillPostingRepo(getDb());
  const hasCallerDocumentId = hasDocumentId(rawRequest);
  let reservedJournalHeaderId: number | null = null;
  let request: ResolvedApBillRequestDto;
  if (hasCallerDocumentId) {
    request = rawRequest;
  } else {
    reservedJournalHeaderId = await repo.reserveJournalHeaderId();
    request = withDocumentId(rawRequest, reservedJournalHeaderId);
  }
  const context = await resolveContext(repo, request, Boolean(options.preview), reservedJournalHeaderId);
  const generated = buildGeneratedPosting(context);
  if (generated.totalDebitBaseAmount !== generated.totalCreditBaseAmount) {
    throw new BusinessRuleError("AP_BILL generated unbalanced journal lines");
  }

  const downstreamInventoryReceipt = inventoryReceiptRequest(context);

  if (options.preview) {
    if (downstreamInventoryReceipt) await processInventoryReceipt(downstreamInventoryReceipt, { preview: true, suppressJournalPosting: true, sourceJournalHeaderId: 1 });
    return {
      detailed_document: context.detailedDocument,
      ap_subledger_details: apSubledgerDetails(context, null),
      ap_counterparty_details: counterpartyDetails(context),
      tax_ledger_details: generated.taxLedgerDetails,
      posting_details: postingDetails(context, generated),
    };
  }

  return withTransaction(async (client) => {
    const txRepo = new ApBillPostingRepo(client);
    const journalRepo = new JournalRepo(client);
    let counterparty = context.data.counterparty!;

    if (request.ap_counterparty?.code) {
      const upserted = await txRepo.upsertCounterparty({
        company_id: context.data.company!.id,
        code: request.ap_counterparty.code,
        name: request.ap_counterparty.name,
        status: request.ap_counterparty.status,
        country_code: request.ap_counterparty.country_code,
        tax_region_or_province: request.ap_counterparty.state_or_province_code ?? null,
      });
      counterparty = upserted;
      context.data.counterparty = upserted;
      context.counterpartyWasCreated = upserted.was_created;
    }

    const journalHeader = await journalRepo.insert({
      id: context.reservedJournalHeaderId ?? undefined,
      company_id: context.data.company!.id,
      company_code: context.data.company!.code,
      company_name: context.data.company!.name,
      document_type_code: AP_BILL_ENGINE_CODE,
      document_type_label: AP_BILL_DOCUMENT_LABEL,
      document_id: context.detailedDocument.document_id,
      description: context.detailedDocument.generated_description,
      document_snapshot_json: request,
      detailed_document_snapshot_json: context.detailedDocument,
      posting_engine_code: AP_BILL_ENGINE_CODE,
      document_date: context.detailedDocument.bill_date,
      posting_date: context.detailedDocument.posting_date,
      financial_year_id: context.data.fiscalPeriod!.financial_year_id,
      financial_year_code: context.data.fiscalPeriod!.financial_year_code,
      financial_period_id: context.data.fiscalPeriod!.financial_period_id,
      financial_period_code: context.data.fiscalPeriod!.financial_period_code,
      base_currency_code: context.data.company!.base_currency_code,
      memo: context.detailedDocument.memo,
    });

    const journalLines: JournalLineRow[] = [];
    for (const line of generated.journalLines) {
      const insertedLine = await journalRepo.insertLine({ journal_header_id: journalHeader.id, ...line });
      journalLines.push(insertedLine);
      for (const dimension of line.dimensions ?? []) {
        await journalRepo.insertLineDimension({ journal_line_id: insertedLine.id, ...dimension });
      }
    }
    const postedJournal = await journalRepo.setPosted(journalHeader.id, generated.totalDebitBaseAmount, generated.totalCreditBaseAmount);

    const apEntry = await txRepo.insertApSubledgerEntry({
      code: `AP-BILL-${journalHeader.id}`,
      company_id: context.data.company!.id,
      journal_header_id: journalHeader.id,
      ap_counterparty_id: counterparty.id,
      document_type_code: AP_BILL_ENGINE_CODE,
      document_id: context.detailedDocument.document_id,
      supplier_invoice_number: context.detailedDocument.supplier_invoice_number,
      description: context.detailedDocument.generated_description,
      document_date: context.detailedDocument.bill_date,
      posting_date: context.detailedDocument.posting_date,
      financial_year_id: context.data.fiscalPeriod!.financial_year_id,
      financial_period_id: context.data.fiscalPeriod!.financial_period_id,
      base_currency_code: context.data.company!.base_currency_code,
      memo: context.detailedDocument.memo,
    });

    for (const line of context.detailedDocument.lines) {
      await txRepo.insertApSubledgerLine({
        ap_subledger_entry_header_id: apEntry.id,
        line_number: line.line_id,
        line_type: "BILL_LINE",
        description: line.line_description,
        control_account_code: AP_PAYABLE_CONTROL_CODE,
        dr_cr: "CR",
        net_amount: line.net_amount,
        tax_amount: line.tax_amount,
        gross_amount: line.gross_amount,
        purchase_posting_code: line.purchase_posting_code,
        tax_authority_code: line.tax_components[0]?.tax_authority_code ?? null,
        base_currency_amount: line.gross_amount,
        memo: context.detailedDocument.memo,
      });
    }

    const taxHeader = generated.taxLedgerDetails.length
      ? await txRepo.insertTaxLedgerHeader({
        code: taxLedgerHeaderCode(journalHeader.id),
        company_id: context.data.company!.id,
        journal_header_id: journalHeader.id,
        document_type_code: AP_BILL_ENGINE_CODE,
        document_id: context.detailedDocument.document_id,
        description: context.detailedDocument.generated_description,
        document_date: context.detailedDocument.bill_date,
        posting_date: context.detailedDocument.posting_date,
        financial_year_id: context.data.fiscalPeriod!.financial_year_id,
        financial_period_id: context.data.fiscalPeriod!.financial_period_id,
        base_currency_code: context.data.company!.base_currency_code,
      })
      : null;
    const taxRows: TaxLedgerEntryRow[] = [];
    let sequence = 1;
    for (const detail of generated.taxLedgerDetails) {
      const taxRule = context.data.taxRulesByCode.get(detail.tax_rule);
      const component = context.detailedDocument.lines
        .flatMap((line) => line.tax_components)
        .find((candidate) =>
          candidate.tax_rule === detail.tax_rule
          && candidate.tax_authority_code === detail.tax_authority_code
          && candidate.tax_amount === detail.base_currency_amount
        );
      if (!taxRule || !component?.tax_authority_id) throw new BusinessRuleError("Tax detail is missing resolved database ids");
      if (!taxHeader) throw new BusinessRuleError("Tax ledger header was not created");
      const lineNumber = sequence++;
      taxRows.push(await txRepo.insertTaxLedgerLine({
        tax_ledger_entry_header_id: taxHeader.id,
        line_number: lineNumber,
        tax_rule_id: taxRule.id,
        tax_component_id: component.tax_component_id ?? null,
        tax_authority_id: component.tax_authority_id,
        tax_movement_type_code: TAX_ON_PURCHASES_MOVEMENT_CODE,
        scheme_code: detail.scheme_code ?? null,
        invoice_label: detail.invoice_label ?? null,
        report_label: detail.report_label ?? null,
        tax_rate: detail.tax_rate,
        taxable_base_currency_amount: detail.taxable_amount,
        dr_cr: "DR",
        base_currency_amount: detail.base_currency_amount,
      }));
    }

    if (downstreamInventoryReceipt) {
      await processInventoryReceipt(downstreamInventoryReceipt, {
        db: client,
        sourceJournalHeaderId: journalHeader.id,
        suppressJournalPosting: true,
      });
    }

    return {
      detailed_document: context.detailedDocument,
      ap_subledger_details: apSubledgerDetails(context, journalHeader.id, apEntry),
      ap_counterparty_details: counterpartyDetails(context, counterparty),
      tax_ledger_details: generated.taxLedgerDetails.map((detail, index) => ({
        ...detail,
        id: taxRows[index]?.id ?? null,
        code: taxHeader && taxRows[index] ? `${taxHeader.code}-${taxRows[index].line_number}` : null,
        status: "POSTED",
      })),
      posting_details: postingDetails(context, generated, postedJournal, journalLines),
    };
  });
}

export const processApBill = processApBillUnchecked;
