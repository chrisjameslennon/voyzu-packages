import { getDb, withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";
import type { DrCr, EntryType } from "@voyzu/finance/types/modules/core";
import type {
  ArAdjustmentArSubledgerDetailDto,
  ArAdjustmentDetailedDocumentDto,
  ArAdjustmentDocumentType,
  ArAdjustmentJournalLineDto,
  ArAdjustmentPostingResponseDto,
  ArAdjustmentTaxLedgerDetailDto,
  ArCreditNoteDetailedLineDto,
} from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-adjustment.response.dto";
import type { ArCreditNoteRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-credit-note.request.dto";
import type { ArInvoiceDetailedTaxComponentDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-invoice.response.dto";
import type { ArOpeningBalanceRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-opening-balance.request.dto";
import type { ArRefundRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-refund.request.dto";
import type { ArWriteOffRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-write-off.request.dto";
import type { BankCashJournalDetailsDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/bank-cash-details.dto";

import { resolveBankCashDetails, toJournalBankCashFields } from "../../../../common/bank-cash-accounts/server/lib/bank-cash-account.service";
import { resolveEffectiveSettingsCompanyId } from "../../../../common/server/settings-scope";
import { JournalRepo } from "../../../../journals/server/db/journal.repo";
import type { JournalHeaderRow, JournalLineRow } from "../../../../journals/server/db/journal.row.types";
import { ArAdjustmentPostingRepo } from "../db/ar-adjustment-posting.repo";
import type {
  AccountRow,
  CompanyRow,
  CounterpartyRow,
  DimensionValueRow,
  DocumentProcessorRow,
  PeriodRow,
  TaxAuthorityRow,
  TaxComponentRow,
  TaxRuleRow,
} from "../db/ar-adjustment-posting.row.types";
import { toAmount, validateArAdjustmentRequest } from "./ar-adjustment.validator";
import {
  AR_CREDIT_NOTE_AR_RECEIVABLE_CONTROL_CODE,
  AR_CREDIT_NOTE_REVENUE_POSTING_CODE,
  AR_CREDIT_NOTE_TAX_ON_SALES_MOVEMENT_CODE,
  AR_CREDIT_NOTE_UNAPPLIED_CASH_CONTROL_CODE,
  AR_OPENING_BALANCE_EQUITY_ACCOUNT_POSTING_CODE,
  AR_REFUND_CASH_POSTING_CODE,
  AR_WRITE_OFF_EXPENSE_POSTING_CODE,
} from "./journal-posting-component-constants";

export interface ProcessArAdjustmentOptions {
  preview?: boolean;
}

type RequestDto = ArCreditNoteRequestDto | ArOpeningBalanceRequestDto | ArRefundRequestDto | ArWriteOffRequestDto;
type ResolvedRequestDto = RequestDto & { document_id: string };

type PostingLine = {
  line_number: number;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  source_ledger: "ACCOUNTS_RECEIVABLE" | "TAX" | "BANK_CASH" | "POSTING_CODE" | null;
  source_control_account: string | null;
  dr_cr: DrCr;
  base_currency_amount: number;
  description: string;
  memo: string | null;
  dimensions?: DimensionValueRow[];
};

type ResolvedContext = {
  request: ResolvedRequestDto;
  documentType: ArAdjustmentDocumentType;
  company: CompanyRow;
  settingsCompanyId: number;
  documentProcessor: DocumentProcessorRow;
  counterparty: CounterpartyRow;
  counterpartyWasCreated: boolean;
  fiscalPeriod: PeriodRow;
  arTradeControl: AccountRow;
  arUnappliedCreditControl: AccountRow;
  taxMovementControl: AccountRow | null;
  detailedDocument: ArAdjustmentDetailedDocumentDto;
  bankCashDetails: BankCashJournalDetailsDto | null;
  reservedJournalHeaderId: number | null;
  accountsByCode: Map<string, AccountRow>;
  dimensionValuesByKey: Map<string, DimensionValueRow>;
  taxRulesByCode: Map<string, TaxRuleRow>;
};

type GeneratedPosting = {
  journalLines: PostingLine[];
  arDetails: ArAdjustmentArSubledgerDetailDto[];
  taxDetails: ArAdjustmentTaxLedgerDetailDto[];
  totalDebitBaseAmount: number;
  totalCreditBaseAmount: number;
};

const CALLER_SUPPLIED_TAX_RULE_CODE = "CALLER_SUPPLIED";
const TAX_ON_SALES_MOVEMENT_CODE = AR_CREDIT_NOTE_TAX_ON_SALES_MOVEMENT_CODE;
const AR_TRADE_RECEIVABLES = AR_CREDIT_NOTE_AR_RECEIVABLE_CONTROL_CODE;
const AR_UNAPPLIED_CASH = AR_CREDIT_NOTE_UNAPPLIED_CASH_CONTROL_CODE;

const CONFIG: Record<ArAdjustmentDocumentType, {
  label: string;
  documentDate: (request: RequestDto) => string;
  defaultDocumentIdPrefix: string;
  arCodePrefix: string;
  taxCodePrefix?: string;
}> = {
  AR_CREDIT_NOTE: {
    label: "Customer Credit Note",
    documentDate: (request) => (request as ArCreditNoteRequestDto).credit_note_date,
    defaultDocumentIdPrefix: "CN",
    arCodePrefix: "AR-CN",
    taxCodePrefix: "TAX-CN",
  },
  AR_OPENING_BALANCE: {
    label: "AR Opening Balance",
    documentDate: (request) => (request as ArOpeningBalanceRequestDto).opening_balance_date,
    defaultDocumentIdPrefix: "OB",
    arCodePrefix: "AR-OB",
  },
  AR_REFUND: {
    label: "Customer Refund",
    documentDate: (request) => (request as ArRefundRequestDto).refund_date,
    defaultDocumentIdPrefix: "REF",
    arCodePrefix: "AR-REF",
  },
  AR_WRITE_OFF: {
    label: "Receivable Write-off",
    documentDate: (request) => (request as ArWriteOffRequestDto).write_off_date,
    defaultDocumentIdPrefix: "WO",
    arCodePrefix: "AR-WO",
  },
};

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function mapByCode<T extends { code: string }>(rows: T[]): Map<string, T> {
  return new Map(rows.map((row) => [row.code, row]));
}

function mapAccountsByCode(rows: AccountRow[]): Map<string, AccountRow> {
  return new Map(rows.flatMap((row) => row.code ? [[row.code, row] as const] : []));
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

function mapDimensionValues(rows: DimensionValueRow[]): Map<string, DimensionValueRow> {
  return new Map(rows.map((row) => [`${row.dimension_code}\u0000${row.dimension_value_name}`, row]));
}

function postingDateFor(documentType: ArAdjustmentDocumentType, request: RequestDto): string {
  const explicit = "posting_date" in request ? request.posting_date : null;
  return explicit ?? CONFIG[documentType].documentDate(request);
}

function hasDocumentId(request: RequestDto): request is ResolvedRequestDto {
  return typeof request.document_id === "string" && request.document_id.trim().length > 0;
}

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== "";
}

function withDocumentId(documentType: ArAdjustmentDocumentType, request: RequestDto, journalHeaderId: number): ResolvedRequestDto {
  if (hasDocumentId(request)) return request;
  return { ...request, document_id: `${CONFIG[documentType].defaultDocumentIdPrefix}-${journalHeaderId}` } as ResolvedRequestDto;
}

function syntheticInlineCounterparty(request: ArCreditNoteRequestDto | ArOpeningBalanceRequestDto, companyId: number, baseCurrencyCode: string): CounterpartyRow {
  if (!request.ar_counterparty?.code) throw new InputValidationError("ar_counterparty.code is required");
  return {
    id: 0,
    finance_organization_id: companyId,
    code: request.ar_counterparty.code,
    name: request.ar_counterparty.name,
    status: request.ar_counterparty.status,
    country_code: request.ar_counterparty.country_code,
    tax_region_or_province: request.ar_counterparty.state_or_province_code ?? null,
    country_currency_code: baseCurrencyCode,
    was_created: true,
  };
}

function companySnapshot(company: CompanyRow): { code: string; base_currency_code: string } {
  return { code: company.code, base_currency_code: company.base_currency_code };
}

function counterpartySnapshot(counterparty: CounterpartyRow): {
  code: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  country_code: string;
  tax_region_or_province: string | null;
} {
  return {
    code: counterparty.code,
    name: counterparty.name,
    status: counterparty.status,
    country_code: counterparty.country_code,
    tax_region_or_province: counterparty.tax_region_or_province,
  };
}

function requestedDimensionPairs(request: ArCreditNoteRequestDto): Array<{ dimensionCode: string; valueName: string }> {
  const pairs = new Map<string, { dimensionCode: string; valueName: string }>();
  for (const dimensions of [request.dimensions, ...request.lines.map((line) => line.dimensions)]) {
    for (const [dimensionCode, valueName] of Object.entries(dimensions ?? {})) {
      pairs.set(`${dimensionCode}\u0000${valueName}`, { dimensionCode, valueName });
    }
  }
  return [...pairs.values()];
}

function lineNetAmount(line: ArCreditNoteRequestDto["lines"][number]): { raw: number; rounded: number } {
  const raw = line.net_line_total != null ? toAmount(line.net_line_total) : toAmount(line.quantity ?? 0) * toAmount(line.net_unit_price ?? 0);
  return { raw, rounded: round2(raw) };
}

function taxComponentsForLine(
  line: ArCreditNoteRequestDto["lines"][number],
  taxableAmount: number,
  taxRule: TaxRuleRow,
  configuredComponents: TaxComponentRow[],
  authoritiesByCode: Map<string, TaxAuthorityRow>,
): ArInvoiceDetailedTaxComponentDto[] {
  if (taxRule.calculation_method === "NO_TAX") return [];

  if (line.tax_rule === CALLER_SUPPLIED_TAX_RULE_CODE) {
    if (taxRule.calculation_method !== "CALLER_SUPPLIED") throw new BusinessRuleError(`${CALLER_SUPPLIED_TAX_RULE_CODE} tax rule is not configured as CALLER_SUPPLIED`);
    if (!line.tax_components?.length) throw new InputValidationError("CALLER_SUPPLIED tax requires tax_components");
    return line.tax_components.map((component) => {
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

  if (taxRule.calculation_method === "CALLER_SUPPLIED") throw new InputValidationError(`Tax rule ${line.tax_rule} requires caller supplied tax components`);
  if (configuredComponents.length === 0) throw new BusinessRuleError(`Tax rule ${line.tax_rule} has no active tax components`);
  return configuredComponents.map((component) => {
    const rawTaxAmount = taxableAmount * component.rate;
    return {
      tax_rule: taxRule.code,
      tax_rule_id: taxRule.id,
      tax_component_id: component.id,
      tax_authority_id: component.tax_authority_id,
      tax_authority_code: component.tax_authority_code,
      tax_authority_name: component.tax_authority_name,
      scheme_code: component.scheme_code ?? undefined,
      invoice_label: component.invoice_label,
      report_label: component.report_label,
      tax_rate: component.rate,
      taxable_amount: taxableAmount,
      raw_tax_amount: rawTaxAmount,
      tax_amount: round2(rawTaxAmount),
    };
  });
}

async function resolveBase(
  repo: ArAdjustmentPostingRepo,
  request: ResolvedRequestDto,
  documentType: ArAdjustmentDocumentType,
  preview: boolean,
): Promise<{
  company: CompanyRow;
  settingsCompanyId: number;
  documentProcessor: DocumentProcessorRow;
  counterparty: CounterpartyRow;
  counterpartyWasCreated: boolean;
  fiscalPeriod: PeriodRow;
  arTradeControl: AccountRow;
  arUnappliedCreditControl: AccountRow;
}> {
  const company = request.company_code ? await repo.getCompany(request.company_code) : null;
  if (!company || company.status !== "ACTIVE") throw new BusinessRuleError(`Company ${request.company_code ?? ""} was not found or is inactive`);

  const documentProcessor = await repo.getDocumentProcessor(documentType);
  if (!documentProcessor || documentProcessor.status !== "ACTIVE") throw new BusinessRuleError(`${documentType} document processor is not active`);

  let counterparty: CounterpartyRow | null = null;
  let counterpartyWasCreated = false;
  if ("ar_counterparty_code" in request && request.ar_counterparty_code) {
    counterparty = await repo.getCounterparty(company.id, request.ar_counterparty_code);
  } else if ((documentType === "AR_CREDIT_NOTE" || documentType === "AR_OPENING_BALANCE") && "ar_counterparty" in request && request.ar_counterparty?.code) {
    counterparty = preview
      ? syntheticInlineCounterparty(request, company.id, company.base_currency_code)
      : await repo.upsertCounterparty(company.id, request.ar_counterparty);
    counterpartyWasCreated = preview || Boolean(counterparty.was_created);
  }
  if (!counterparty || counterparty.status !== "ACTIVE") throw new BusinessRuleError("AR counterparty was not found or is inactive");

  const settingsCompanyId = await resolveEffectiveSettingsCompanyId(company.id);
  const fiscalPeriod = await repo.getPeriod(company.id, postingDateFor(documentType, request));
  if (!fiscalPeriod) throw new BusinessRuleError(`No open financial period exists for posting date ${postingDateFor(documentType, request)}`);

  const arTradeControl = await repo.getControlAccount(settingsCompanyId, AR_TRADE_RECEIVABLES);
  if (!arTradeControl) throw new BusinessRuleError("AR trade receivables control account is not active");
  const arUnappliedCreditControl = await repo.getControlAccount(settingsCompanyId, AR_CREDIT_NOTE_UNAPPLIED_CASH_CONTROL_CODE);
  if (!arUnappliedCreditControl) throw new BusinessRuleError("AR unapplied credit control account is not active");

  return { company, settingsCompanyId, documentProcessor, counterparty, counterpartyWasCreated, fiscalPeriod, arTradeControl, arUnappliedCreditControl };
}

async function resolveCreditNoteContext(
  repo: ArAdjustmentPostingRepo,
  request: ResolvedRequestDto,
  preview: boolean,
  reservedJournalHeaderId: number | null,
): Promise<ResolvedContext> {
  const typed = request as ArCreditNoteRequestDto & { document_id: string };
  const base = await resolveBase(repo, request, "AR_CREDIT_NOTE", preview);
  if (hasValue((request as unknown as Record<string, unknown>).bank_cash_details) && !base.documentProcessor.cash_movement) {
    throw new BusinessRuleError("AR_CREDIT_NOTE does not support bank_cash_details");
  }
  if (!base.documentProcessor.supports_dimensions && (typed.dimensions || typed.lines.some((line) => line.dimensions))) {
    throw new BusinessRuleError("AR_CREDIT_NOTE does not support dimensions");
  }
  if (typed.lines.length > 0 && !base.documentProcessor.supports_items) {
    throw new BusinessRuleError("AR_CREDIT_NOTE does not support items");
  }

  const requestedPostingCodes = [...new Set([typed.revenue_posting_code, ...typed.lines.map((line) => line.revenue_posting_code)].filter(Boolean) as string[])];
  const requestedTaxRules = [...new Set(typed.lines.map((line) => line.tax_rule))];
  const requestedAuthorities = [...new Set(typed.lines.flatMap((line) => line.tax_components?.map((component) => component.tax_authority_code) ?? []))];

  const [
    defaultRevenueAccount,
    revenueAccounts,
    taxMovementControl,
    taxRules,
    taxAuthorities,
    dimensionValues,
  ] = await Promise.all([
    repo.getPostingCode(base.settingsCompanyId, "AR_CREDIT_NOTE", AR_CREDIT_NOTE_REVENUE_POSTING_CODE, typed.revenue_posting_code),
    repo.listPostingCodes(base.settingsCompanyId, "AR_CREDIT_NOTE", requestedPostingCodes),
    repo.getTaxMovementAccount(base.settingsCompanyId, AR_CREDIT_NOTE_TAX_ON_SALES_MOVEMENT_CODE),
    repo.listTaxRules(base.company.country_code, requestedTaxRules),
    repo.listTaxAuthorities(base.company.country_code, requestedAuthorities),
    repo.listDimensionValues(base.settingsCompanyId, requestedDimensionPairs(typed)),
  ]);
  if (!defaultRevenueAccount) throw new BusinessRuleError("Default AR_CREDIT_NOTE revenue posting code was not resolved");
  if (!taxMovementControl) throw new BusinessRuleError("Tax on sales movement account is not active");

  const accountsByCode = mapAccountsByCode(revenueAccounts);
  accountsByCode.set(defaultRevenueAccount.gl_account_code, defaultRevenueAccount);
  for (const code of requestedPostingCodes) {
    if (!accountsByCode.has(code)) throw new BusinessRuleError(`Revenue posting code ${code} was not found for AR_CREDIT_NOTE`);
  }

  const taxRulesByCode = mapByCode(taxRules);
  const taxComponentsByRule = mapTaxComponents(await repo.listTaxComponents(base.company.country_code, requestedTaxRules));
  const taxAuthoritiesByCode = mapByCode(taxAuthorities);
  for (const code of requestedTaxRules) {
    if (!taxRulesByCode.has(code)) throw new BusinessRuleError(`Tax rule ${code} was not found for ${base.company.country_code}`);
  }

  const dimensionValuesByKey = mapDimensionValues(dimensionValues);
  for (const pair of requestedDimensionPairs(typed)) {
    const dimensionValue = dimensionValuesByKey.get(`${pair.dimensionCode}\u0000${pair.valueName}`);
    if (!dimensionValue) throw new BusinessRuleError(`Dimension ${pair.dimensionCode} value ${pair.valueName} was not found`);
    if (dimensionValue.dimension_status !== "ACTIVE") throw new BusinessRuleError(`Dimension ${pair.dimensionCode} is not ACTIVE`);
    if (dimensionValue.dimension_value_status !== "ACTIVE") throw new BusinessRuleError(`Dimension value ${pair.dimensionCode}=${pair.valueName} is not ACTIVE`);
  }

  const lines: ArCreditNoteDetailedLineDto[] = typed.lines.map((line, index) => {
    const taxRule = taxRulesByCode.get(line.tax_rule);
    if (!taxRule) throw new BusinessRuleError(`lines[${index}].tax_rule ${line.tax_rule} was not resolved`);
    const net = lineNetAmount(line);
    const taxComponents = taxComponentsForLine(line, net.rounded, taxRule, taxComponentsByRule.get(line.tax_rule) ?? [], taxAuthoritiesByCode);
    const taxAmount = round2(taxComponents.reduce((sum, component) => sum + component.tax_amount, 0));
    return {
      line_id: line.line_id ?? index + 1,
      line_description: line.description,
      quantity: line.quantity == null ? null : toAmount(line.quantity),
      net_unit_price: line.net_unit_price == null ? null : toAmount(line.net_unit_price),
      revenue_posting_code: line.revenue_posting_code ?? typed.revenue_posting_code ?? defaultRevenueAccount.gl_account_code ?? "",
      tax_rule: line.tax_rule,
      raw_net_line_total: net.raw,
      net_line_total: net.rounded,
      tax_components: taxComponents,
      tax_amount: taxAmount,
      gross_line_total: round2(net.rounded + taxAmount),
      dimensions: { ...(typed.dimensions ?? {}), ...(line.dimensions ?? {}) },
    };
  });

  const netAmount = round2(lines.reduce((sum, line) => sum + line.net_line_total, 0));
  const taxAmount = round2(lines.reduce((sum, line) => sum + line.tax_amount, 0));
  const grossAmount = round2(netAmount + taxAmount);

  const allocations = [];
  let appliedAmount = 0;
  const appliedByDocument = new Map<string, number>();
  for (const allocation of typed.allocations ?? []) {
    const requested = round2(toAmount(allocation.amount));
    const alreadyApplied = appliedByDocument.get(allocation.document_id) ?? 0;
    const open = await repo.findOpenInvoice(base.company.id, base.counterparty.id, allocation.document_id);
    if (!open || open.open_amount <= 0) throw new BusinessRuleError(`Open invoice ${allocation.document_id} was not found`);
    if (round2(alreadyApplied + requested) > round2(open.open_amount)) throw new BusinessRuleError(`Allocation to ${allocation.document_id} exceeds open amount`);
    appliedByDocument.set(allocation.document_id, round2(alreadyApplied + requested));
    appliedAmount = round2(appliedAmount + requested);
    allocations.push({
      invoice_document_id: open.document_id,
      invoice_journal_code: open.journal_code,
      invoice_ar_subledger_entry_code: open.ar_subledger_entry_code,
      invoice_ar_subledger_entry_id: open.ar_subledger_entry_id,
      invoice_open_amount_before: open.open_amount,
      requested_amount: requested,
      applied_amount: requested,
      invoice_open_amount_after: round2(open.open_amount - alreadyApplied - requested),
    });
  }
  if (appliedAmount > grossAmount) throw new InputValidationError("Credit note allocations exceed credit note gross amount");

  return {
    ...base,
    request,
    documentType: "AR_CREDIT_NOTE",
    taxMovementControl,
    detailedDocument: {
      document_type: "AR_CREDIT_NOTE",
      company: companySnapshot(base.company),
      ar_counterparty: counterpartySnapshot(base.counterparty),
      document_id: typed.document_id,
      memo: typed.memo ?? null,
      generated_description: `Customer Credit Note ${typed.document_id}`,
      credit_note_date: typed.credit_note_date,
      posting_date: postingDateFor("AR_CREDIT_NOTE", typed),
      lines,
      allocations,
      net_amount: netAmount,
      tax_amount: taxAmount,
      gross_amount: grossAmount,
      applied_amount: appliedAmount,
      unapplied_amount: round2(grossAmount - appliedAmount),
    },
    bankCashDetails: null,
    reservedJournalHeaderId,
    accountsByCode,
    dimensionValuesByKey,
    taxRulesByCode,
  };
}

async function resolveOpeningBalanceContext(
  repo: ArAdjustmentPostingRepo,
  request: ResolvedRequestDto,
  preview: boolean,
  reservedJournalHeaderId: number | null,
): Promise<ResolvedContext> {
  const typed = request as ArOpeningBalanceRequestDto & { document_id: string };
  const base = await resolveBase(repo, request, "AR_OPENING_BALANCE", preview);
  if (hasValue((request as unknown as Record<string, unknown>).bank_cash_details) && !base.documentProcessor.cash_movement) {
    throw new BusinessRuleError("AR_OPENING_BALANCE does not support bank_cash_details");
  }
  if (hasValue((request as unknown as Record<string, unknown>).dimensions) && !base.documentProcessor.supports_dimensions) {
    throw new BusinessRuleError("AR_OPENING_BALANCE does not support dimensions");
  }
  if (typed.items.length > 0 && !base.documentProcessor.supports_items) {
    throw new BusinessRuleError("AR_OPENING_BALANCE does not support items");
  }
  const equityAccount = await repo.getPostingCode(base.settingsCompanyId, "AR_OPENING_BALANCE", AR_OPENING_BALANCE_EQUITY_ACCOUNT_POSTING_CODE, typed.opening_balance_equity_posting_code);
  if (!equityAccount) throw new BusinessRuleError("Opening balance equity posting code was not resolved");
  const items = typed.items.map((item, index) => ({
    line_id: item.line_id ?? index + 1,
    external_reference: item.external_reference ?? null,
    description: item.description,
    original_invoice_date: item.original_invoice_date ?? null,
    due_date: item.due_date ?? null,
    amount: round2(toAmount(item.amount)),
  }));
  return {
    ...base,
    request,
    documentType: "AR_OPENING_BALANCE",
    taxMovementControl: null,
    detailedDocument: {
      document_type: "AR_OPENING_BALANCE",
      company: companySnapshot(base.company),
      ar_counterparty: counterpartySnapshot(base.counterparty),
      document_id: typed.document_id,
      memo: typed.memo ?? null,
      generated_description: `AR Opening Balance ${typed.document_id}`,
      opening_balance_date: typed.opening_balance_date,
      posting_date: postingDateFor("AR_OPENING_BALANCE", typed),
      opening_balance_equity_posting_code: equityAccount.gl_account_code ?? "",
      items,
      total_amount: round2(items.reduce((sum, item) => sum + item.amount, 0)),
    },
    bankCashDetails: null,
    reservedJournalHeaderId,
    accountsByCode: new Map([[equityAccount.gl_account_code, equityAccount]]),
    dimensionValuesByKey: new Map(),
    taxRulesByCode: new Map(),
  };
}

async function resolveRefundContext(
  repo: ArAdjustmentPostingRepo,
  request: ResolvedRequestDto,
  preview: boolean,
  reservedJournalHeaderId: number | null,
): Promise<ResolvedContext> {
  const typed = request as ArRefundRequestDto & { document_id: string };
  const base = await resolveBase(repo, request, "AR_REFUND", preview);
  if (hasValue((request as unknown as Record<string, unknown>).bank_cash_details) && !base.documentProcessor.cash_movement) {
    throw new BusinessRuleError("AR_REFUND does not support bank_cash_details");
  }
  if (hasValue((request as unknown as Record<string, unknown>).dimensions) && !base.documentProcessor.supports_dimensions) {
    throw new BusinessRuleError("AR_REFUND does not support dimensions");
  }
  if (hasValue((request as unknown as Record<string, unknown>).items) && !base.documentProcessor.supports_items) {
    throw new BusinessRuleError("AR_REFUND does not support items");
  }
  const cashAccount = await repo.getPostingCode(base.settingsCompanyId, "AR_REFUND", AR_REFUND_CASH_POSTING_CODE, typed.bank_cash_account_code);
  if (!cashAccount) throw new BusinessRuleError("Refund cash posting code was not resolved");
  const bankCashDetails = await resolveBankCashDetails(base.company.id, base.company.base_currency_code, typed.bank_cash_details);
  if (bankCashDetails && bankCashDetails.gl_account_id !== cashAccount.gl_account_id) {
    throw new BusinessRuleError(`bank_cash_details.code ${bankCashDetails.code} GL account does not match bank_cash_account_code ${cashAccount.bank_cash_control_account_code ?? cashAccount.code}`);
  }
  const refundAmount = round2(toAmount(typed.refund_amount));
  const unappliedBalance = round2(await repo.getOpenUnappliedCreditBalance(base.company.id, base.counterparty.id));
  if (unappliedBalance <= 0) throw new BusinessRuleError(`AR counterparty ${base.counterparty.code} has no open unapplied balance`);
  if (refundAmount > unappliedBalance) throw new BusinessRuleError(`refund_amount exceeds open unapplied balance for AR counterparty ${base.counterparty.code}`);
  return {
    ...base,
    request,
    documentType: "AR_REFUND",
    taxMovementControl: null,
    bankCashDetails,
    detailedDocument: {
      document_type: "AR_REFUND",
      company: companySnapshot(base.company),
      ar_counterparty: counterpartySnapshot(base.counterparty),
      document_id: typed.document_id,
      memo: typed.memo ?? null,
      generated_description: `Customer Refund ${typed.document_id}`,
      refund_date: typed.refund_date,
      posting_date: postingDateFor("AR_REFUND", typed),
      bank_cash_account_code: cashAccount.bank_cash_control_account_code ?? "",
      bank_cash_details: bankCashDetails,
      refund_amount: refundAmount,
      unapplied_balance_before: unappliedBalance,
      unapplied_balance_after: round2(unappliedBalance - refundAmount),
    },
    reservedJournalHeaderId,
    accountsByCode: new Map([[cashAccount.bank_cash_control_account_code ?? "", cashAccount]]),
    dimensionValuesByKey: new Map(),
    taxRulesByCode: new Map(),
  };
}

async function resolveWriteOffContext(
  repo: ArAdjustmentPostingRepo,
  request: ResolvedRequestDto,
  preview: boolean,
  reservedJournalHeaderId: number | null,
): Promise<ResolvedContext> {
  const typed = request as ArWriteOffRequestDto & { document_id: string };
  const base = await resolveBase(repo, request, "AR_WRITE_OFF", preview);
  if (hasValue((request as unknown as Record<string, unknown>).bank_cash_details) && !base.documentProcessor.cash_movement) {
    throw new BusinessRuleError("AR_WRITE_OFF does not support bank_cash_details");
  }
  if (hasValue((request as unknown as Record<string, unknown>).dimensions) && !base.documentProcessor.supports_dimensions) {
    throw new BusinessRuleError("AR_WRITE_OFF does not support dimensions");
  }
  if (hasValue((request as unknown as Record<string, unknown>).items) && !base.documentProcessor.supports_items) {
    throw new BusinessRuleError("AR_WRITE_OFF does not support items");
  }
  const expenseAccount = await repo.getPostingCode(base.settingsCompanyId, "AR_WRITE_OFF", AR_WRITE_OFF_EXPENSE_POSTING_CODE, typed.write_off_expense_posting_code);
  if (!expenseAccount) throw new BusinessRuleError("Write-off expense posting code was not resolved");
  const applications = [];
  let total = 0;
  const appliedByDocument = new Map<string, number>();
  for (const application of typed.applications) {
    const requested = round2(toAmount(application.amount));
    const targetInvoiceDocumentId = application.target_invoice?.document_id ?? "";
    const alreadyApplied = appliedByDocument.get(targetInvoiceDocumentId) ?? 0;
    const open = await repo.findOpenInvoice(base.company.id, base.counterparty.id, targetInvoiceDocumentId);
    if (!open || open.open_amount <= 0) throw new BusinessRuleError(`Open invoice ${targetInvoiceDocumentId} was not found`);
    if (round2(alreadyApplied + requested) > round2(open.open_amount)) throw new BusinessRuleError(`Write-off application to ${targetInvoiceDocumentId} exceeds open amount`);
    appliedByDocument.set(targetInvoiceDocumentId, round2(alreadyApplied + requested));
    total = round2(total + requested);
    applications.push({
      target_invoice_document_id: open.document_id,
      target_invoice_journal_code: open.journal_code,
      target_invoice_ar_subledger_entry_code: open.ar_subledger_entry_code,
      target_invoice_ar_subledger_entry_id: open.ar_subledger_entry_id,
      target_invoice_open_amount_before: open.open_amount,
      target_invoice_open_amount_after: round2(open.open_amount - alreadyApplied - requested),
      amount: requested,
    });
  }
  return {
    ...base,
    request,
    documentType: "AR_WRITE_OFF",
    taxMovementControl: null,
    detailedDocument: {
      document_type: "AR_WRITE_OFF",
      company: companySnapshot(base.company),
      ar_counterparty: counterpartySnapshot(base.counterparty),
      document_id: typed.document_id,
      memo: typed.memo ?? null,
      generated_description: `Receivable Write-off ${typed.document_id}`,
      write_off_date: typed.write_off_date,
      posting_date: postingDateFor("AR_WRITE_OFF", typed),
      write_off_expense_posting_code: expenseAccount.gl_account_code ?? "",
      applications,
      total_write_off_amount: total,
    },
    bankCashDetails: null,
    reservedJournalHeaderId,
    accountsByCode: new Map([[expenseAccount.gl_account_code, expenseAccount]]),
    dimensionValuesByKey: new Map(),
    taxRulesByCode: new Map(),
  };
}

async function resolveContext(
  repo: ArAdjustmentPostingRepo,
  request: ResolvedRequestDto,
  documentType: ArAdjustmentDocumentType,
  preview: boolean,
  reservedJournalHeaderId: number | null,
): Promise<ResolvedContext> {
  if (documentType === "AR_CREDIT_NOTE") return resolveCreditNoteContext(repo, request, preview, reservedJournalHeaderId);
  if (documentType === "AR_OPENING_BALANCE") return resolveOpeningBalanceContext(repo, request, preview, reservedJournalHeaderId);
  if (documentType === "AR_REFUND") return resolveRefundContext(repo, request, preview, reservedJournalHeaderId);
  return resolveWriteOffContext(repo, request, preview, reservedJournalHeaderId);
}

function account(context: ResolvedContext, code: string): AccountRow {
  const resolved = context.accountsByCode.get(code);
  if (!resolved) throw new BusinessRuleError(`Posting code ${code} was not resolved`);
  return resolved;
}

function dimensionsForLine(context: ResolvedContext, line: ArCreditNoteDetailedLineDto): DimensionValueRow[] {
  return Object.entries(line.dimensions).map(([dimensionCode, valueName]) => {
    const row = context.dimensionValuesByKey.get(`${dimensionCode}\u0000${valueName}`);
    if (!row) throw new BusinessRuleError(`Dimension ${dimensionCode} value ${valueName} was not resolved`);
    return row;
  });
}

function buildCreditNotePosting(context: ResolvedContext): GeneratedPosting {
  const document = context.detailedDocument;
  if (document.document_type !== "AR_CREDIT_NOTE" || !context.taxMovementControl) throw new BusinessRuleError("Invalid AR_CREDIT_NOTE context");
  const journalLines: PostingLine[] = [];
  const arDetails: ArAdjustmentArSubledgerDetailDto[] = [];
  const taxDetails: ArAdjustmentTaxLedgerDetailDto[] = [];

  for (const line of document.lines) {
    const revenueAccount = account(context, line.revenue_posting_code);
    journalLines.push({
      line_number: journalLines.length + 1,
      gl_account_id: revenueAccount.gl_account_id,
      gl_account_code: revenueAccount.gl_account_code,
      gl_account_name: revenueAccount.gl_account_name,
      source_ledger: "POSTING_CODE",
      source_control_account: revenueAccount.code ?? null,
      dr_cr: "DR",
      base_currency_amount: line.net_line_total,
      description: line.line_description,
      memo: document.memo,
      dimensions: dimensionsForLine(context, line),
    });
    for (const component of line.tax_components) {
      if (component.tax_amount <= 0) continue;
      journalLines.push({
        line_number: journalLines.length + 1,
        gl_account_id: context.taxMovementControl.gl_account_id,
        gl_account_code: context.taxMovementControl.gl_account_code,
        gl_account_name: context.taxMovementControl.gl_account_name,
        source_ledger: "TAX",
        source_control_account: TAX_ON_SALES_MOVEMENT_CODE,
        dr_cr: "DR",
        base_currency_amount: component.tax_amount,
        description: component.invoice_label ?? component.tax_rule,
        memo: document.memo,
      });
      taxDetails.push({
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
        financial_year_code: context.fiscalPeriod.financial_year_code,
        financial_period_code: context.fiscalPeriod.financial_period_code,
        base_currency_code: context.company.base_currency_code,
        entry_type: "DEBIT",
        base_currency_amount: component.tax_amount,
        status: "EPHEMERAL",
      });
    }
  }

  if (document.applied_amount > 0) {
    journalLines.push({
      line_number: journalLines.length + 1,
      gl_account_id: context.arTradeControl.gl_account_id,
      gl_account_code: context.arTradeControl.gl_account_code,
      gl_account_name: context.arTradeControl.gl_account_name,
      source_ledger: "ACCOUNTS_RECEIVABLE",
      source_control_account: AR_TRADE_RECEIVABLES,
      dr_cr: "CR",
      base_currency_amount: document.applied_amount,
      description: document.generated_description,
      memo: document.memo,
    });
  }
  if (document.unapplied_amount > 0) {
    journalLines.push({
      line_number: journalLines.length + 1,
      gl_account_id: context.arUnappliedCreditControl.gl_account_id,
      gl_account_code: context.arUnappliedCreditControl.gl_account_code,
      gl_account_name: context.arUnappliedCreditControl.gl_account_name,
      source_ledger: "ACCOUNTS_RECEIVABLE",
      source_control_account: AR_UNAPPLIED_CASH,
      dr_cr: "CR",
      base_currency_amount: document.unapplied_amount,
      description: document.generated_description,
      memo: document.memo,
    });
  }

  for (const allocation of document.allocations) {
    arDetails.push(arDetail(context, AR_TRADE_RECEIVABLES, "CREDIT", allocation.applied_amount, allocation.invoice_ar_subledger_entry_id));
  }
  if (document.unapplied_amount > 0) arDetails.push(arDetail(context, AR_UNAPPLIED_CASH, "CREDIT", document.unapplied_amount));

  return totals(journalLines, arDetails, taxDetails);
}

function buildOpeningBalancePosting(context: ResolvedContext): GeneratedPosting {
  const document = context.detailedDocument;
  if (document.document_type !== "AR_OPENING_BALANCE") throw new BusinessRuleError("Invalid AR_OPENING_BALANCE context");
  const equityAccount = account(context, document.opening_balance_equity_posting_code);
  const journalLines: PostingLine[] = [
    glLine(1, context.arTradeControl, null, AR_TRADE_RECEIVABLES, context.arTradeControl.control_account_name ?? null, "DR", document.total_amount, document.generated_description, document.memo),
    glLine(2, equityAccount, equityAccount.code ?? null, null, null, "CR", document.total_amount, document.generated_description, document.memo),
  ];
  const arDetails = document.items.map((item) => arDetail(context, AR_TRADE_RECEIVABLES, "DEBIT", item.amount));
  return totals(journalLines, arDetails, []);
}

function buildRefundPosting(context: ResolvedContext): GeneratedPosting {
  const document = context.detailedDocument;
  if (document.document_type !== "AR_REFUND") throw new BusinessRuleError("Invalid AR_REFUND context");
  const cashAccount = account(context, document.bank_cash_account_code);
  const journalLines: PostingLine[] = [
    glLine(1, context.arUnappliedCreditControl, null, AR_UNAPPLIED_CASH, context.arUnappliedCreditControl.control_account_name ?? null, "DR", document.refund_amount, document.generated_description, document.memo),
    glLine(2, cashAccount, cashAccount.code ?? null, null, null, "CR", document.refund_amount, document.generated_description, document.memo),
  ];
  const arDetails = [arDetail(context, AR_UNAPPLIED_CASH, "DEBIT", document.refund_amount)];
  return totals(journalLines, arDetails, []);
}

function buildWriteOffPosting(context: ResolvedContext): GeneratedPosting {
  const document = context.detailedDocument;
  if (document.document_type !== "AR_WRITE_OFF") throw new BusinessRuleError("Invalid AR_WRITE_OFF context");
  const expenseAccount = account(context, document.write_off_expense_posting_code);
  const journalLines: PostingLine[] = [
    glLine(1, expenseAccount, expenseAccount.code ?? null, null, null, "DR", document.total_write_off_amount, document.generated_description, document.memo),
    glLine(2, context.arTradeControl, null, AR_TRADE_RECEIVABLES, context.arTradeControl.control_account_name ?? null, "CR", document.total_write_off_amount, document.generated_description, document.memo),
  ];
  const arDetails = document.applications.map((application) => arDetail(context, AR_TRADE_RECEIVABLES, "CREDIT", application.amount, application.target_invoice_ar_subledger_entry_id));
  return totals(journalLines, arDetails, []);
}

function glLine(
  lineNumber: number,
  accountRow: AccountRow,
  postingCode: string | null,
  controlAccountCode: string | null,
  controlAccountName: string | null,
  drCr: DrCr,
  amount: number,
  description: string,
  memo: string | null,
  sourceLedger?: "ACCOUNTS_RECEIVABLE" | "TAX" | "BANK_CASH" | null,
  sourceControlAccount?: string | null,
): PostingLine {
  const inferredSource = sourceLedger !== undefined || sourceControlAccount !== undefined
    ? { sourceLedger: sourceLedger ?? null, sourceControlAccount: sourceControlAccount ?? controlAccountCode }
    : postingCodeSource(accountRow, postingCode, controlAccountCode);
  return {
    line_number: lineNumber,
    gl_account_id: accountRow.gl_account_id,
    gl_account_code: accountRow.gl_account_code,
    gl_account_name: accountRow.gl_account_name,
    source_ledger: inferredSource.sourceLedger,
    source_control_account: inferredSource.sourceControlAccount,
    dr_cr: drCr,
    base_currency_amount: amount,
    description,
    memo,
  };
}

function postingCodeSource(
  accountRow: AccountRow,
  postingCode: string | null,
  controlAccountCode: string | null,
): { sourceLedger: "ACCOUNTS_RECEIVABLE" | "BANK_CASH" | "POSTING_CODE" | null; sourceControlAccount: string | null } {
  if (controlAccountCode) return { sourceLedger: "ACCOUNTS_RECEIVABLE", sourceControlAccount: controlAccountCode };
  if (accountRow.bank_cash_control_account_code) return { sourceLedger: "BANK_CASH", sourceControlAccount: accountRow.bank_cash_control_account_code };
  if (postingCode) return { sourceLedger: "POSTING_CODE", sourceControlAccount: postingCode };
  return { sourceLedger: null, sourceControlAccount: null };
}

function arDetail(
  context: ResolvedContext,
  controlAccountCode: "AR_TRADE_RECEIVABLES" | "AR_UNAPPLIED_CASH",
  entryType: EntryType,
  amount: number,
  appliedToArSubledgerEntryId: number | null = null,
  sourceEntryHeaderId: number | null = null,
): ArAdjustmentArSubledgerDetailDto {
  return {
    id: null,
    code: null,
    company_code: context.company.code,
    journal_header_id: null,
    ar_counterparty_code: context.counterparty.code,
    control_account_code: controlAccountCode,
    source_entry_header_id: sourceEntryHeaderId,
    applied_to_ar_subledger_entry_id: appliedToArSubledgerEntryId,
    posting_date: context.detailedDocument.posting_date,
    financial_year_code: context.fiscalPeriod.financial_year_code,
    financial_period_code: context.fiscalPeriod.financial_period_code,
    base_currency_code: context.company.base_currency_code,
    entry_type: entryType,
    base_currency_amount: amount,
    memo: context.detailedDocument.memo,
    status: "EPHEMERAL",
  };
}

function totals(journalLines: PostingLine[], arDetails: ArAdjustmentArSubledgerDetailDto[], taxDetails: ArAdjustmentTaxLedgerDetailDto[]): GeneratedPosting {
  return {
    journalLines,
    arDetails,
    taxDetails,
    totalDebitBaseAmount: round2(journalLines.filter((line) => line.dr_cr === "DR").reduce((sum, line) => sum + line.base_currency_amount, 0)),
    totalCreditBaseAmount: round2(journalLines.filter((line) => line.dr_cr === "CR").reduce((sum, line) => sum + line.base_currency_amount, 0)),
  };
}

function buildGeneratedPosting(context: ResolvedContext): GeneratedPosting {
  if (context.documentType === "AR_CREDIT_NOTE") return buildCreditNotePosting(context);
  if (context.documentType === "AR_OPENING_BALANCE") return buildOpeningBalancePosting(context);
  if (context.documentType === "AR_REFUND") return buildRefundPosting(context);
  return buildWriteOffPosting(context);
}

function postingDetails(context: ResolvedContext, generated: GeneratedPosting, header?: JournalHeaderRow, rows?: JournalLineRow[]): ArAdjustmentPostingResponseDto["posting_details"] {
  const sourceLines = rows
    ? rows.map((row): ArAdjustmentJournalLineDto => ({
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
      dimensions: (generated.journalLines.find((line) => line.line_number === row.line_number)?.dimensions ?? []).map((dimension) => ({
        dimension_code: dimension.dimension_code,
        dimension_name: dimension.dimension_name,
        dimension_value_name: dimension.dimension_value_name,
      })),
    }))
    : generated.journalLines.map((line): ArAdjustmentJournalLineDto => ({
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
      dimensions: (line.dimensions ?? []).map((dimension) => ({
        dimension_code: dimension.dimension_code,
        dimension_name: dimension.dimension_name,
        dimension_value_name: dimension.dimension_value_name,
      })),
    }));

  return {
    journal_header: {
      id: header?.id ?? null,
      code: header?.code ?? null,
      document_type_code: context.documentType,
      document_id: context.detailedDocument.document_id,
      generated_description: context.detailedDocument.generated_description,
      posting_engine_code: context.documentType,
      company_code: context.company.code,
      document_date: CONFIG[context.documentType].documentDate(context.request),
      posting_date: context.detailedDocument.posting_date,
      financial_year_code: context.fiscalPeriod.financial_year_code,
      financial_period_code: context.fiscalPeriod.financial_period_code,
      base_currency_code: context.company.base_currency_code,
      total_debit_base_amount: header?.total_debit_base_amount ?? generated.totalDebitBaseAmount,
      total_credit_base_amount: header?.total_credit_base_amount ?? generated.totalCreditBaseAmount,
      memo: context.detailedDocument.memo,
      status: header ? "POSTED" : "EPHEMERAL",
    },
    journal_lines: sourceLines,
  };
}

function applyPostedIds(details: ArAdjustmentArSubledgerDetailDto[], journalHeaderId: number, arHeader: { id: number; code: string }): ArAdjustmentArSubledgerDetailDto[] {
  return details.map((detail, index) => ({
    ...detail,
    id: arHeader.id,
    code: `${arHeader.code}-${index + 1}`,
    journal_header_id: journalHeaderId,
    status: "POSTED",
  }));
}

async function insertArLines(repo: ArAdjustmentPostingRepo, context: ResolvedContext, arHeader: { id: number }): Promise<void> {
  const document = context.detailedDocument;
  if (document.document_type === "AR_CREDIT_NOTE") {
    let lineNumber = 1;
    for (const allocation of document.allocations) {
      await repo.insertArLine({
        ar_subledger_entry_header_id: arHeader.id,
        line_number: lineNumber++,
        line_type: "CREDIT_NOTE_LINE",
        description: document.generated_description,
        control_account_code: AR_TRADE_RECEIVABLES,
        dr_cr: "CR",
        gross_amount: allocation.applied_amount,
        target_entry_header_id: allocation.invoice_ar_subledger_entry_id,
        base_currency_amount: allocation.applied_amount,
        memo: document.memo,
      });
    }
    if (document.unapplied_amount > 0) {
      await repo.insertArLine({
        ar_subledger_entry_header_id: arHeader.id,
        line_number: lineNumber,
        line_type: "CREDIT_NOTE_LINE",
        description: document.generated_description,
        control_account_code: AR_UNAPPLIED_CASH,
        dr_cr: "CR",
        gross_amount: document.unapplied_amount,
        base_currency_amount: document.unapplied_amount,
        memo: document.memo,
      });
    }
    return;
  }

  if (document.document_type === "AR_OPENING_BALANCE") {
    for (const item of document.items) {
      await repo.insertArLine({
        ar_subledger_entry_header_id: arHeader.id,
        line_number: item.line_id,
        line_type: "OPENING_BALANCE_ITEM",
        description: item.description,
        control_account_code: AR_TRADE_RECEIVABLES,
        dr_cr: "DR",
        gross_amount: item.amount,
        base_currency_amount: item.amount,
        memo: document.memo,
      });
    }
    return;
  }

  if (document.document_type === "AR_REFUND") {
    await repo.insertArLine({
      ar_subledger_entry_header_id: arHeader.id,
      line_number: 1,
      line_type: "REFUND_APPLICATION",
      description: document.generated_description,
      control_account_code: AR_UNAPPLIED_CASH,
      dr_cr: "DR",
      gross_amount: document.refund_amount,
      base_currency_amount: document.refund_amount,
      memo: document.memo,
    });
    return;
  }

  for (const [index, application] of document.applications.entries()) {
    await repo.insertArLine({
      ar_subledger_entry_header_id: arHeader.id,
      line_number: index + 1,
      line_type: "WRITE_OFF_APPLICATION",
      description: document.generated_description,
      control_account_code: AR_TRADE_RECEIVABLES,
      dr_cr: "CR",
      gross_amount: application.amount,
      target_entry_header_id: application.target_invoice_ar_subledger_entry_id,
      base_currency_amount: application.amount,
      memo: document.memo,
    });
  }
}

async function insertTaxLines(repo: ArAdjustmentPostingRepo, context: ResolvedContext, journalHeaderId: number, generated: GeneratedPosting): Promise<ArAdjustmentTaxLedgerDetailDto[]> {
  if (context.documentType !== "AR_CREDIT_NOTE" || generated.taxDetails.length === 0) return [];
  const taxHeader = await repo.insertTaxHeader({
    code: `${CONFIG.AR_CREDIT_NOTE.taxCodePrefix}-${journalHeaderId}`,
    finance_organization_id: context.company.id,
    journal_header_id: journalHeaderId,
    document_type_code: context.documentType,
    document_id: context.detailedDocument.document_id,
    description: context.detailedDocument.generated_description,
    document_date: CONFIG[context.documentType].documentDate(context.request),
    posting_date: context.detailedDocument.posting_date,
    financial_year_id: context.fiscalPeriod.financial_year_id,
    financial_period_id: context.fiscalPeriod.financial_period_id,
    base_currency_code: context.company.base_currency_code,
  });
  const rows: Array<{ id: number; code: string }> = [];
  let sequence = 1;
  for (const detail of generated.taxDetails) {
    const taxRule = context.taxRulesByCode.get(detail.tax_rule);
    const component = (context.detailedDocument as Extract<ArAdjustmentDetailedDocumentDto, { document_type: "AR_CREDIT_NOTE" }>).lines
      .flatMap((line) => line.tax_components)
      .find((candidate) => candidate.tax_rule === detail.tax_rule && candidate.tax_authority_code === detail.tax_authority_code && candidate.tax_amount === detail.base_currency_amount);
    if (!taxRule || !component?.tax_authority_id) throw new BusinessRuleError("Tax detail is missing resolved database ids");
    rows.push(await repo.insertTaxLine({
      tax_ledger_entry_header_id: taxHeader.id,
      line_number: sequence++,
      tax_rule_id: taxRule.id,
      tax_component_id: detail.tax_component_id,
      tax_authority_id: component.tax_authority_id,
      tax_movement_type_code: TAX_ON_SALES_MOVEMENT_CODE,
      scheme_code: detail.scheme_code ?? null,
      invoice_label: detail.invoice_label ?? null,
      report_label: detail.report_label ?? null,
      tax_rate: detail.tax_rate,
      taxable_base_currency_amount: detail.taxable_amount,
      dr_cr: "DR",
      base_currency_amount: detail.base_currency_amount,
    }));
  }
  return generated.taxDetails.map((detail, index) => ({
    ...detail,
    id: rows[index]?.id ?? null,
    code: rows[index] ? `${taxHeader.code}-${index + 1}` : null,
    status: "POSTED",
  }));
}

async function processArAdjustmentUnchecked(
  documentType: ArAdjustmentDocumentType,
  input: RequestDto,
  options: ProcessArAdjustmentOptions = {},
): Promise<ArAdjustmentPostingResponseDto> {
  validateArAdjustmentRequest(input, documentType);
  const rawRequest: RequestDto = input;
  const repo = new ArAdjustmentPostingRepo(getDb());
  const journalRepo = new JournalRepo(getDb());
  const reservedJournalHeaderId = hasDocumentId(rawRequest) ? null : await journalRepo.reserveHeaderId();
  const request = reservedJournalHeaderId ? withDocumentId(documentType, rawRequest, reservedJournalHeaderId) : rawRequest as ResolvedRequestDto;
  const context = await resolveContext(repo, request, documentType, Boolean(options.preview), reservedJournalHeaderId);
  const generated = buildGeneratedPosting(context);

  if (generated.totalDebitBaseAmount !== generated.totalCreditBaseAmount) {
    throw new BusinessRuleError(`${documentType} generated unbalanced journal lines`);
  }

  if (options.preview) {
    return {
      detailed_document: context.detailedDocument,
      ar_subledger_details: generated.arDetails,
      tax_ledger_details: generated.taxDetails,
      posting_details: postingDetails(context, generated),
    };
  }

  return withTransaction(async (client) => {
    const txRepo = new ArAdjustmentPostingRepo(client);
    const txJournalRepo = new JournalRepo(client);
    const txContext = await resolveContext(txRepo, request, documentType, false, reservedJournalHeaderId);
    const txGenerated = buildGeneratedPosting(txContext);
    if (txGenerated.totalDebitBaseAmount !== txGenerated.totalCreditBaseAmount) {
      throw new BusinessRuleError(`${documentType} generated unbalanced journal lines`);
    }

    const journalHeader = await txJournalRepo.insert({
      id: txContext.reservedJournalHeaderId ?? undefined,
      finance_organization_id: txContext.company.id,
      company_code: txContext.company.code,
      company_name: txContext.company.name,
      document_type_code: documentType,
      document_type_label: CONFIG[documentType].label,
      document_id: txContext.detailedDocument.document_id,
      description: txContext.detailedDocument.generated_description,
      document_snapshot_json: request,
      detailed_document_snapshot_json: txContext.detailedDocument,
      posting_engine_code: documentType,
      document_date: CONFIG[documentType].documentDate(txContext.request),
      posting_date: txContext.detailedDocument.posting_date,
      financial_year_id: txContext.fiscalPeriod.financial_year_id,
      financial_year_code: txContext.fiscalPeriod.financial_year_code,
      financial_period_id: txContext.fiscalPeriod.financial_period_id,
      financial_period_code: txContext.fiscalPeriod.financial_period_code,
      base_currency_code: txContext.company.base_currency_code,
      memo: txContext.detailedDocument.memo,
      ...toJournalBankCashFields(txContext.bankCashDetails),
    });

    const journalLines: JournalLineRow[] = [];
    for (const line of txGenerated.journalLines) {
      const insertedLine = await txJournalRepo.insertLine({ journal_header_id: journalHeader.id, ...line });
      journalLines.push(insertedLine);
      for (const dimension of line.dimensions ?? []) {
        await txJournalRepo.insertLineDimension({
          journal_line_id: insertedLine.id,
          dimension_id: dimension.dimension_id,
          dimension_value_id: dimension.dimension_value_id,
          dimension_code: dimension.dimension_code,
          dimension_name: dimension.dimension_name,
          dimension_value_name: dimension.dimension_value_name,
        });
      }
    }

    const postedJournal = await txJournalRepo.setPosted(journalHeader.id, txGenerated.totalDebitBaseAmount, txGenerated.totalCreditBaseAmount);
    const arHeader = await txRepo.insertArHeader({
      code: `${CONFIG[documentType].arCodePrefix}-${journalHeader.id}`,
      finance_organization_id: txContext.company.id,
      journal_header_id: journalHeader.id,
      ar_counterparty_id: txContext.counterparty.id,
      document_type_code: documentType,
      document_id: txContext.detailedDocument.document_id,
      description: txContext.detailedDocument.generated_description,
      memo: txContext.detailedDocument.memo,
      document_date: CONFIG[documentType].documentDate(txContext.request),
      posting_date: txContext.detailedDocument.posting_date,
      financial_year_id: txContext.fiscalPeriod.financial_year_id,
      financial_period_id: txContext.fiscalPeriod.financial_period_id,
      base_currency_code: txContext.company.base_currency_code,
    });
    await insertArLines(txRepo, txContext, arHeader);
    const taxDetails = await insertTaxLines(txRepo, txContext, journalHeader.id, txGenerated);

    return {
      detailed_document: txContext.detailedDocument,
      ar_subledger_details: applyPostedIds(txGenerated.arDetails, journalHeader.id, arHeader),
      tax_ledger_details: taxDetails,
      posting_details: postingDetails(txContext, txGenerated, postedJournal, journalLines),
    };
  });
}

export const processArAdjustment = processArAdjustmentUnchecked;
