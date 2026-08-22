import { getDb, withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";
import type { ArInvoiceRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ar-invoice.request.dto";
import type {
  ArInvoiceArCounterpartyDetailsDto,
  ArInvoiceArSubledgerDetailsDto,
  ArInvoiceDetailedInvoiceDto,
  ArInvoiceDetailedLineDto,
  ArInvoiceDetailedTaxComponentDto,
  ArInvoiceJournalLineDto,
  ArInvoicePostingDetailsDto,
  ArInvoicePostingResponseDto,
  ArInvoiceTaxLedgerDetailDto,
} from "@voyzu/core/types/modules/financial-document-processing-engine/ar-invoice.response.dto";
import type { InventoryIssueRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/inventory-issue.request.dto";

import { resolveEffectiveSettingsCompanyId } from "../../../common/server/settings-scope";
import { JournalRepo } from "../../../journals/server/db/journal.repo";
import type { JournalHeaderRow, JournalLineRow } from "../../../journals/server/db/journal.row.types";
import { processInventoryIssue } from "../../inventory/lib/inventory-processing.service";
import { ArInvoicePostingRepo } from "../db/ar-invoice-posting.repo";
import type {
  CounterpartyPostingContextRow,
  DimensionValueLookupRow,
  PostingCodeAccountRow,
  TaxAuthorityRow,
  TaxComponentRow,
  TaxLedgerEntryRow,
  TaxRuleRow,
} from "../db/ar-invoice-posting.row.types";
import {
  AR_INVOICE_DOCUMENT_LABEL,
  AR_INVOICE_ENGINE_CODE,
  AR_RECEIVABLE_CONTROL_CODE,
  CALLER_SUPPLIED_TAX_RULE_CODE,
  REVENUE_POSTING_CODE,
  TAX_ON_SALES_MOVEMENT_CODE,
  type ArInvoiceLineDimension,
  type ArInvoicePostingLine,
} from "./ar-invoice.types";
import { validateData, validateRequest, type ArInvoiceDataValidationContext } from "./ar-invoice.validator";

export interface ProcessArInvoiceOptions {
  preview?: boolean;
}

interface ResolvedContext {
  request: ResolvedArInvoiceRequestDto;
  data: ArInvoiceDataValidationContext;
  counterpartyWasCreated: boolean;
  detailedInvoice: ArInvoiceDetailedInvoiceDto;
  reservedJournalHeaderId: number | null;
  revenueAccountsByCode: Map<string, PostingCodeAccountRow>;
  dimensionValuesByDimensionCodeAndName: Map<string, DimensionValueLookupRow>;
}

type ResolvedArInvoiceRequestDto = ArInvoiceRequestDto & { document_id: string };

interface GeneratedPosting {
  journalLines: ArInvoicePostingLine[];
  taxLedgerDetails: ArInvoiceTaxLedgerDetailDto[];
  totalDebitBaseAmount: number;
  totalCreditBaseAmount: number;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function postingDateFor(input: ArInvoiceRequestDto): string {
  return input.posting_date ?? input.invoice_date;
}

function lineNetAmount(line: ArInvoiceRequestDto["lines"][number]): { raw: number; rounded: number } {
  const raw = line.net_line_total ?? ((line.quantity ?? 0) * (line.net_unit_price ?? 0));
  return { raw, rounded: round2(raw) };
}

function requestedRevenuePostingCodes(input: ArInvoiceRequestDto): string[] {
  return [...new Set([
    input.revenue_posting_code ?? null,
    ...input.lines.map((line) => line.revenue_posting_code ?? null),
  ].filter((code): code is string => Boolean(code)))];
}

function requestedItemCodes(input: ArInvoiceRequestDto): string[] {
  return [...new Set(input.lines.map((line) => line.inventory_item_code).filter((code): code is string => Boolean(code)))];
}

function requestedTaxRuleCodes(input: ArInvoiceRequestDto): string[] {
  return [...new Set(input.lines.map((line) => line.tax_rule))];
}

function requestedTaxAuthorityCodes(input: ArInvoiceRequestDto): string[] {
  return [...new Set(input.lines.flatMap((line) => line.tax_components?.map((component) => component.tax_authority_code) ?? []))];
}

function requestedDimensionPairs(input: ArInvoiceRequestDto): Array<{ dimensionCode: string; valueName: string }> {
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

function mapTaxComponents(rows: TaxComponentRow[]): Map<string, TaxComponentRow[]> {
  const map = new Map<string, TaxComponentRow[]>();
  for (const row of rows) {
    const existing = map.get(row.tax_rule_code) ?? [];
    existing.push(row);
    map.set(row.tax_rule_code, existing);
  }
  return map;
}

function mapDimensionValues(rows: DimensionValueLookupRow[]): Map<string, DimensionValueLookupRow> {
  return new Map(rows.map((row) => [`${row.dimension_code}\u0000${row.dimension_value_name}`, row]));
}

function syntheticInlineCounterparty(input: ArInvoiceRequestDto, companyId: number, countryCurrencyCode: string): CounterpartyPostingContextRow {
  if (!input.ar_counterparty?.code) throw new InputValidationError("ar_counterparty.code is required");
  return {
    id: 0,
    finance_company_id: companyId,
    code: input.ar_counterparty.code,
    name: input.ar_counterparty.name,
    status: input.ar_counterparty.status,
    country_code: input.ar_counterparty.country_code,
    tax_region_or_province: input.ar_counterparty.state_or_province_code ?? null,
    country_currency_code: countryCurrencyCode,
  };
}

function detailedTaxComponentsForLine(
  line: ArInvoiceRequestDto["lines"][number],
  taxableAmount: number,
  taxRule: TaxRuleRow,
  configuredComponents: TaxComponentRow[],
  authoritiesByCode: Map<string, TaxAuthorityRow>,
): ArInvoiceDetailedTaxComponentDto[] {
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
        scheme_code: undefined,
        invoice_label: component.invoice_label ?? taxRule.invoice_label,
        report_label: taxRule.report_label,
        tax_rate: component.tax_rate,
        taxable_amount: taxableAmount,
        raw_tax_amount: rawTaxAmount,
        tax_amount: round2(rawTaxAmount),
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
    };
  });
}

function buildDetailedInvoice(context: ArInvoiceDataValidationContext, request: ResolvedArInvoiceRequestDto): ArInvoiceDetailedInvoiceDto {
  if (!context.company || !context.counterparty) throw new InputValidationError("Company and counterparty are required");

  const detailedLines: ArInvoiceDetailedLineDto[] = request.lines.map((line, index) => {
    const taxRule = context.taxRulesByCode.get(line.tax_rule);
    if (!taxRule) throw new BusinessRuleError(`lines[${index}].tax_rule ${line.tax_rule} was not resolved`);
    const { raw, rounded } = lineNetAmount(line);
    const taxComponents = detailedTaxComponentsForLine(
      line,
      rounded,
      taxRule,
      context.taxComponentsByRuleCode.get(line.tax_rule) ?? [],
      context.taxAuthoritiesByCode,
    );
    const taxAmount = round2(taxComponents.reduce((sum, component) => sum + component.tax_amount, 0));
    return {
      line_id: line.line_id ?? index + 1,
      line_description: line.description,
      quantity: line.quantity ?? null,
      net_unit_price: line.net_unit_price ?? null,
      revenue_posting_code: line.revenue_posting_code
        ?? request.revenue_posting_code
        ?? (line.inventory_item_code ? context.itemPostingProfilesByItemCode.get(line.inventory_item_code)?.revenue_gl_account_code : null)
        ?? context.defaultRevenuePostingCode?.gl_account_code
        ?? "",
      inventory_item_code: line.inventory_item_code ?? null,
      tax_rule: line.tax_rule,
      raw_net_line_total: raw,
      net_line_total: rounded,
      tax_components: taxComponents,
      tax_amount: taxAmount,
      gross_line_total: round2(rounded + taxAmount),
      dimensions: { ...(request.dimensions ?? {}), ...(line.dimensions ?? {}) },
    };
  });

  const netAmount = round2(detailedLines.reduce((sum, line) => sum + line.net_line_total, 0));
  const taxAmount = round2(detailedLines.reduce((sum, line) => sum + line.tax_amount, 0));
  const grossAmount = round2(netAmount + taxAmount);

  return {
    company: {
      code: context.company.code,
      base_currency_code: context.company.base_currency_code,
    },
    ar_counterparty: {
      code: context.counterparty.code,
      name: context.counterparty.name,
      status: context.counterparty.status,
      country_code: context.counterparty.country_code,
      tax_region_or_province: context.counterparty.tax_region_or_province,
    },
    document_id: request.document_id,
    document_memo: request.document_memo ?? null,
    generated_description: `Customer Invoice ${request.document_id}`,
    invoice_date: request.invoice_date,
    posting_date: postingDateFor(request),
    lines: detailedLines,
    net_amount: netAmount,
    tax_amount: taxAmount,
    gross_amount: grossAmount,
  };
}

async function resolveContext(repo: ArInvoicePostingRepo, request: ResolvedArInvoiceRequestDto, preview: boolean, reservedJournalHeaderId: number | null): Promise<ResolvedContext> {
  const company = request.company_code ? await repo.getCompanyByCode(request.company_code) : null;
  if (company && company.status !== "ACTIVE") throw new BusinessRuleError(`Company ${company.code} is not ACTIVE`);
  const settingsCompanyId = company ? await resolveEffectiveSettingsCompanyId(company.id) : null;
  const documentProcessor = company ? await repo.getDocumentProcessor() : null;
  const countryCode = company?.country_code ?? "";

  let counterparty: CounterpartyPostingContextRow | null = null;
  let counterpartyWasCreated = false;
  if (company && request.ar_counterparty_code) {
    counterparty = await repo.getCounterpartyByCode(company.id, request.ar_counterparty_code);
  } else if (company && request.ar_counterparty?.code) {
    const countryCurrency = await repo.getCountryCurrency(request.ar_counterparty.country_code);
    if (!countryCurrency) throw new BusinessRuleError(`Country ${request.ar_counterparty.country_code} was not found`);
    counterparty = preview
      ? syntheticInlineCounterparty(request, company.id, countryCurrency)
      : await repo.upsertCounterparty({
        finance_company_id: company.id,
        code: request.ar_counterparty.code,
        name: request.ar_counterparty.name,
        status: request.ar_counterparty.status,
        country_code: request.ar_counterparty.country_code,
        tax_region_or_province: request.ar_counterparty.state_or_province_code ?? null,
      });
    counterpartyWasCreated = preview || Boolean("was_created" in counterparty && counterparty.was_created);
  }

  const [
    fiscalPeriod,
    arControlAccount,
    taxMovementControlAccount,
    defaultRevenuePostingCode,
    revenuePostingCodes,
    itemPostingProfiles,
    taxRules,
    taxAuthorities,
    dimensionValues,
  ] = await Promise.all([
    company ? repo.getOpenFiscalPeriod(company.id, postingDateFor(request)) : Promise.resolve(null),
    settingsCompanyId ? repo.getArControlAccount(settingsCompanyId, AR_RECEIVABLE_CONTROL_CODE) : Promise.resolve(null),
    settingsCompanyId ? repo.getTaxMovementControlAccount(settingsCompanyId, TAX_ON_SALES_MOVEMENT_CODE) : Promise.resolve(null),
    settingsCompanyId ? repo.getRevenuePostingCode(settingsCompanyId, AR_INVOICE_ENGINE_CODE, REVENUE_POSTING_CODE) : Promise.resolve(null),
    settingsCompanyId ? repo.listRevenuePostingCodes(settingsCompanyId, AR_INVOICE_ENGINE_CODE, requestedRevenuePostingCodes(request)) : Promise.resolve([]),
    company ? repo.listItemPostingProfiles(company.id, requestedItemCodes(request)) : Promise.resolve([]),
    countryCode ? repo.listTaxRules(countryCode, requestedTaxRuleCodes(request)) : Promise.resolve([]),
    countryCode ? repo.listTaxAuthorities(countryCode, requestedTaxAuthorityCodes(request)) : Promise.resolve([]),
    settingsCompanyId ? repo.listDimensionValues(settingsCompanyId, requestedDimensionPairs(request)) : Promise.resolve([]),
  ]);

  const taxComponents = countryCode ? await repo.listTaxComponents(countryCode, taxRules.map((rule) => rule.code)) : [];
  const data: ArInvoiceDataValidationContext = {
    company,
    documentProcessor,
    counterparty,
    fiscalPeriod,
    arControlAccount,
    taxMovementControlAccount,
    defaultRevenuePostingCode,
    revenuePostingCodesByCode: mapByCode(revenuePostingCodes),
    itemPostingProfilesByItemCode: new Map(itemPostingProfiles.map((row) => [row.item_code, row])),
    taxRulesByCode: mapByCode(taxRules),
    taxComponentsByRuleCode: mapTaxComponents(taxComponents),
    taxAuthoritiesByCode: mapByCode(taxAuthorities),
    dimensionValuesByDimensionCodeAndName: mapDimensionValues(dimensionValues),
  };
  validateData(request, data);

  return {
    request,
    data,
    counterpartyWasCreated,
    detailedInvoice: buildDetailedInvoice(data, request),
    reservedJournalHeaderId,
    revenueAccountsByCode: mapByCode(revenuePostingCodes),
    dimensionValuesByDimensionCodeAndName: mapDimensionValues(dimensionValues),
  };
}

function resolvedRevenueAccount(context: ResolvedContext, line: ArInvoiceDetailedLineDto): PostingCodeAccountRow {
  const requestLine = context.request.lines.find((candidate, index) => (candidate.line_id ?? index + 1) === line.line_id);
  const hasDocumentOverride = Boolean(requestLine?.revenue_posting_code || context.request.revenue_posting_code);
  if (line.inventory_item_code && !hasDocumentOverride) {
    const profile = context.data.itemPostingProfilesByItemCode.get(line.inventory_item_code);
    if (!profile?.revenue_gl_account_id || !profile.revenue_gl_account_code || !profile.revenue_gl_account_name || !profile.revenue_gl_account_type || !profile.revenue_gl_account_status) {
      throw new BusinessRuleError(`Revenue account for item ${line.inventory_item_code} was not resolved`);
    }
    return {
      code: profile.profile_code,
      document_code: AR_INVOICE_ENGINE_CODE,
      status: profile.profile_status,
      gl_account_id: profile.revenue_gl_account_id,
      gl_account_code: profile.revenue_gl_account_code,
      gl_account_name: profile.revenue_gl_account_name,
      gl_account_type: profile.revenue_gl_account_type,
      gl_account_status: profile.revenue_gl_account_status,
    };
  }
  const account = context.revenueAccountsByCode.get(line.revenue_posting_code) ?? context.data.defaultRevenuePostingCode;
  if (!account) throw new BusinessRuleError(`Revenue posting code ${line.revenue_posting_code} was not resolved`);
  return account;
}

function dimensionsForLine(context: ResolvedContext, line: ArInvoiceDetailedLineDto): ArInvoiceLineDimension[] {
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

function buildGeneratedPosting(context: ResolvedContext): GeneratedPosting {
  const company = context.data.company!;
  const period = context.data.fiscalPeriod!;
  const arControl = context.data.arControlAccount!;
  const taxControl = context.data.taxMovementControlAccount!;
  const document = context.detailedInvoice;
  const lines: ArInvoicePostingLine[] = [];
  const taxLedgerDetails: ArInvoiceTaxLedgerDetailDto[] = [];

  lines.push({
    line_number: 1,
    gl_account_id: arControl.gl_account_id,
    gl_account_code: arControl.gl_account_code,
    gl_account_name: arControl.gl_account_name,
    source_ledger: "ACCOUNTS_RECEIVABLE",
    source_control_account: AR_RECEIVABLE_CONTROL_CODE,
    dr_cr: "DR",
    base_currency_amount: document.gross_amount,
    description: document.generated_description,
    memo: document.document_memo,
  });

  for (const line of document.lines) {
    const account = resolvedRevenueAccount(context, line);
    lines.push({
      line_number: lines.length + 1,
      gl_account_id: account.gl_account_id,
      gl_account_code: account.gl_account_code,
      gl_account_name: account.gl_account_name,
      source_ledger: "POSTING_CODE",
      source_control_account: account.code,
      dr_cr: "CR",
      base_currency_amount: line.net_line_total,
      description: line.line_description,
      memo: document.document_memo,
      dimensions: dimensionsForLine(context, line),
    });

    for (const component of line.tax_components) {
      if (component.tax_amount <= 0) continue;
      lines.push({
        line_number: lines.length + 1,
        gl_account_id: taxControl.gl_account_id,
        gl_account_code: taxControl.gl_account_code,
        gl_account_name: taxControl.gl_account_name,
        source_ledger: "TAX",
        source_control_account: TAX_ON_SALES_MOVEMENT_CODE,
        dr_cr: "CR",
        base_currency_amount: component.tax_amount,
        description: component.invoice_label ?? component.tax_rule,
        memo: document.document_memo,
      });
      taxLedgerDetails.push({
        id: null,
        code: null,
        tax_rule: component.tax_rule,
        tax_component_id: component.tax_component_id ?? null,
        tax_authority_code: component.tax_authority_code,
        tax_authority_name: component.tax_authority_name,
        tax_movement_type_code: TAX_ON_SALES_MOVEMENT_CODE,
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
        entry_type: "CREDIT",
        base_currency_amount: component.tax_amount,
        status: "EPHEMERAL",
      });
    }
  }

  return {
    journalLines: lines,
    taxLedgerDetails,
    totalDebitBaseAmount: round2(lines.filter((line) => line.dr_cr === "DR").reduce((sum, line) => sum + line.base_currency_amount, 0)),
    totalCreditBaseAmount: round2(lines.filter((line) => line.dr_cr === "CR").reduce((sum, line) => sum + line.base_currency_amount, 0)),
  };
}

function postingDetails(context: ResolvedContext, generated: GeneratedPosting, header?: JournalHeaderRow, rows?: JournalLineRow[]): ArInvoicePostingDetailsDto {
  const company = context.data.company!;
  const period = context.data.fiscalPeriod!;
  const document = context.detailedInvoice;
  const journalLines: ArInvoiceJournalLineDto[] = rows
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
      document_memo: row.memo,
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
      document_memo: line.memo,
      dimensions: line.dimensions ?? [],
    }));

  return {
    journal_header: {
      id: header?.id ?? null,
      code: header?.code ?? null,
      document_type_code: "AR_INVOICE",
      document_id: document.document_id,
      generated_description: document.generated_description,
      posting_engine_code: "AR_INVOICE",
      company_code: company.code,
      document_date: document.invoice_date,
      posting_date: document.posting_date,
      financial_year_code: period.financial_year_code,
      financial_period_code: period.financial_period_code,
      base_currency_code: company.base_currency_code,
      total_debit_base_amount: header?.total_debit_base_amount ?? generated.totalDebitBaseAmount,
      total_credit_base_amount: header?.total_credit_base_amount ?? generated.totalCreditBaseAmount,
      document_memo: document.document_memo,
      status: header ? "POSTED" : "EPHEMERAL",
    },
    journal_lines: journalLines,
  };
}

function arSubledgerDetails(context: ResolvedContext, journalHeaderId: number | null, row?: { id: number; ar_subledger_entry_code: string }): ArInvoiceArSubledgerDetailsDto {
  const company = context.data.company!;
  const period = context.data.fiscalPeriod!;
  const counterparty = context.data.counterparty!;
  const document = context.detailedInvoice;
  return {
    id: row?.id ?? null,
    code: row?.ar_subledger_entry_code ?? null,
    company_code: company.code,
    journal_header_id: journalHeaderId,
    ar_counterparty_code: counterparty.code,
    control_account_code: AR_RECEIVABLE_CONTROL_CODE,
    posting_date: document.posting_date,
    financial_year_code: period.financial_year_code,
    financial_period_code: period.financial_period_code,
    base_currency_code: company.base_currency_code,
    entry_type: "DEBIT",
    base_currency_amount: document.gross_amount,
    open_amount: document.gross_amount,
    document_memo: document.document_memo,
    status: row ? "POSTED" : "EPHEMERAL",
  };
}

function counterpartyDetails(context: ResolvedContext, counterparty?: CounterpartyPostingContextRow): ArInvoiceArCounterpartyDetailsDto {
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
  return `TAX-INV-${journalHeaderId}`;
}

function hasDocumentId(request: ArInvoiceRequestDto): request is ResolvedArInvoiceRequestDto {
  return typeof request.document_id === "string" && request.document_id.trim().length > 0;
}

function withDocumentId(request: ArInvoiceRequestDto, journalHeaderId: number): ResolvedArInvoiceRequestDto {
  if (hasDocumentId(request)) return request;
  return { ...request, document_id: `INV-${journalHeaderId}` };
}

function inventoryIssueRequest(context: ResolvedContext): InventoryIssueRequestDto | null {
  const inventoryLines = context.detailedInvoice.lines.filter((line) =>
    line.inventory_item_code
    && context.data.itemPostingProfilesByItemCode.get(line.inventory_item_code)?.item_type === "INVENTORY"
  );
  if (inventoryLines.length === 0) return null;

  return {
    document_type: "INVENTORY_ISSUE",
    company_code: context.data.company!.code,
    memo: `Issue for ${context.detailedInvoice.document_id}`,
    issue_date: context.detailedInvoice.invoice_date,
    posting_date: context.detailedInvoice.posting_date,
    source: {
      source_document: AR_INVOICE_ENGINE_CODE,
      source_document_id: context.detailedInvoice.document_id,
    },
    lines: inventoryLines.map((line) => {
      if (line.quantity == null) throw new InputValidationError(`AR invoice inventory line ${line.line_id} requires quantity`);
      return {
        line_id: line.line_id,
        inventory_item_code: line.inventory_item_code!,
        description: line.line_description,
        quantity_delta: -line.quantity,
        issue_purpose: "SOLD",
        dimensions: line.dimensions,
      };
    }),
  };
}

async function processArInvoiceUnchecked(
  input: ArInvoiceRequestDto,
  options: ProcessArInvoiceOptions = {},
): Promise<ArInvoicePostingResponseDto> {
  validateRequest(input);
  const rawRequest: ArInvoiceRequestDto = input;
  const repo = new ArInvoicePostingRepo(getDb());
  const hasCallerDocumentId = hasDocumentId(rawRequest);
  let reservedJournalHeaderId: number | null = null;
  let request: ResolvedArInvoiceRequestDto;
  if (hasCallerDocumentId) {
    request = rawRequest;
  } else {
    reservedJournalHeaderId = await repo.reserveJournalHeaderId();
    request = withDocumentId(rawRequest, reservedJournalHeaderId);
  }
  const context = await resolveContext(repo, request, Boolean(options.preview), reservedJournalHeaderId);
  const generated = buildGeneratedPosting(context);

  if (generated.totalDebitBaseAmount !== generated.totalCreditBaseAmount) {
    throw new BusinessRuleError("AR_INVOICE generated unbalanced journal lines");
  }

  const downstreamInventoryIssue = inventoryIssueRequest(context);

  if (options.preview) {
    if (downstreamInventoryIssue) await processInventoryIssue(downstreamInventoryIssue, { preview: true });
    return {
      detailed_document: context.detailedInvoice,
      ar_subledger_details: arSubledgerDetails(context, null),
      ar_counterparty_details: counterpartyDetails(context),
      tax_ledger_details: generated.taxLedgerDetails,
      posting_details: postingDetails(context, generated),
    };
  }

  return withTransaction(async (client) => {
    const txRepo = new ArInvoicePostingRepo(client);
    const journalRepo = new JournalRepo(client);
    let counterparty = context.data.counterparty!;

    if (request.ar_counterparty?.code) {
      const upserted = await txRepo.upsertCounterparty({
        finance_company_id: context.data.company!.id,
        code: request.ar_counterparty.code,
        name: request.ar_counterparty.name,
        status: request.ar_counterparty.status,
        country_code: request.ar_counterparty.country_code,
        tax_region_or_province: request.ar_counterparty.state_or_province_code ?? null,
      });
      counterparty = upserted;
      context.data.counterparty = upserted;
      context.counterpartyWasCreated = upserted.was_created;
    }

    const journalHeader = await journalRepo.insert({
      id: context.reservedJournalHeaderId ?? undefined,
      finance_company_id: context.data.company!.id,
      company_code: context.data.company!.code,
      company_name: context.data.company!.name,
      document_type_code: AR_INVOICE_ENGINE_CODE,
      document_type_label: AR_INVOICE_DOCUMENT_LABEL,
      document_id: context.detailedInvoice.document_id,
      description: context.detailedInvoice.generated_description,
      document_snapshot_json: request,
      detailed_document_snapshot_json: context.detailedInvoice,
      posting_engine_code: AR_INVOICE_ENGINE_CODE,
      document_date: context.detailedInvoice.invoice_date,
      posting_date: context.detailedInvoice.posting_date,
      financial_year_id: context.data.fiscalPeriod!.financial_year_id,
      financial_year_code: context.data.fiscalPeriod!.financial_year_code,
      financial_period_id: context.data.fiscalPeriod!.financial_period_id,
      financial_period_code: context.data.fiscalPeriod!.financial_period_code,
      base_currency_code: context.data.company!.base_currency_code,
      memo: context.detailedInvoice.document_memo,
    });

    const journalLines: JournalLineRow[] = [];
    for (const line of generated.journalLines) {
      const insertedLine = await journalRepo.insertLine({
        journal_header_id: journalHeader.id,
        ...line,
      });
      journalLines.push(insertedLine);
      for (const dimension of line.dimensions ?? []) {
        await journalRepo.insertLineDimension({
          journal_line_id: insertedLine.id,
          ...dimension,
        });
      }
    }

    const postedJournal = await journalRepo.setPosted(journalHeader.id, generated.totalDebitBaseAmount, generated.totalCreditBaseAmount);
    const arEntry = await txRepo.insertArSubledgerEntry({
      code: `AR-INV-${journalHeader.id}`,
      finance_company_id: context.data.company!.id,
      journal_header_id: journalHeader.id,
      ar_counterparty_id: counterparty.id,
      document_type_code: AR_INVOICE_ENGINE_CODE,
      document_id: context.detailedInvoice.document_id,
      description: context.detailedInvoice.generated_description,
      document_date: context.detailedInvoice.invoice_date,
      posting_date: context.detailedInvoice.posting_date,
      financial_year_id: context.data.fiscalPeriod!.financial_year_id,
      financial_period_id: context.data.fiscalPeriod!.financial_period_id,
      base_currency_code: context.data.company!.base_currency_code,
      memo: context.detailedInvoice.document_memo,
    });

    for (const line of context.detailedInvoice.lines) {
      await txRepo.insertArSubledgerLine({
        ar_subledger_entry_header_id: arEntry.id,
        line_number: line.line_id,
        line_type: "INVOICE_LINE",
        description: line.line_description,
        control_account_code: AR_RECEIVABLE_CONTROL_CODE,
        dr_cr: "DR",
        quantity: line.quantity,
        unit_amount: line.net_unit_price,
        net_amount: line.net_line_total,
        tax_amount: line.tax_amount,
        gross_amount: line.gross_line_total,
        revenue_posting_code: line.revenue_posting_code,
        tax_rule_code: line.tax_rule,
        base_currency_amount: line.gross_line_total,
        memo: context.detailedInvoice.document_memo,
      });
    }

    const taxHeader = generated.taxLedgerDetails.length
      ? await txRepo.insertTaxLedgerHeader({
        code: taxLedgerHeaderCode(journalHeader.id),
        finance_company_id: context.data.company!.id,
        journal_header_id: journalHeader.id,
        document_type_code: AR_INVOICE_ENGINE_CODE,
        document_id: context.detailedInvoice.document_id,
        description: context.detailedInvoice.generated_description,
        document_date: context.detailedInvoice.invoice_date,
        posting_date: context.detailedInvoice.posting_date,
        financial_year_id: context.data.fiscalPeriod!.financial_year_id,
        financial_period_id: context.data.fiscalPeriod!.financial_period_id,
        base_currency_code: context.data.company!.base_currency_code,
      })
      : null;
    const taxRows: TaxLedgerEntryRow[] = [];
    let sequence = 1;
    for (const detail of generated.taxLedgerDetails) {
      const taxRule = context.data.taxRulesByCode.get(detail.tax_rule);
      const component = context.detailedInvoice.lines.flatMap((line) => line.tax_components)
        .find((candidate) => candidate.tax_rule === detail.tax_rule && candidate.tax_authority_code === detail.tax_authority_code && candidate.tax_amount === detail.base_currency_amount);
      if (!taxRule || !component?.tax_authority_id) throw new BusinessRuleError("Tax detail is missing resolved database ids");
      if (!taxHeader) throw new BusinessRuleError("Tax ledger header was not created");
      const lineNumber = sequence++;
      taxRows.push(await txRepo.insertTaxLedgerLine({
        tax_ledger_entry_header_id: taxHeader.id,
        line_number: lineNumber,
        tax_rule_id: taxRule.id,
        tax_component_id: detail.tax_component_id,
        tax_authority_id: component.tax_authority_id,
        tax_movement_type_code: TAX_ON_SALES_MOVEMENT_CODE,
        scheme_code: detail.scheme_code ?? null,
        invoice_label: detail.invoice_label ?? null,
        report_label: detail.report_label ?? null,
        tax_rate: detail.tax_rate,
        taxable_base_currency_amount: detail.taxable_amount,
        dr_cr: "CR",
        base_currency_amount: detail.base_currency_amount,
      }));
    }

    if (downstreamInventoryIssue) await processInventoryIssue(downstreamInventoryIssue, { db: client });

    return {
      detailed_document: context.detailedInvoice,
      ar_subledger_details: arSubledgerDetails(context, journalHeader.id, arEntry),
      ar_counterparty_details: counterpartyDetails(context, counterparty),
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

export const processArInvoice = processArInvoiceUnchecked;
