import { getDb, withTransaction, type DbExecutor } from "@voyzu/capability/db";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";
import type { DrCr } from "@voyzu/finance/types/modules/core";
import type { ArInvoiceCancellationRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-invoice-cancellation.request.dto";
import type {
  ArInvoiceCancellationArSubledgerDetailDto,
  ArInvoiceCancellationDetailedDocumentDto,
  ArInvoiceCancellationJournalLineDto,
  ArInvoiceCancellationPostingDetailsDto,
  ArInvoiceCancellationPostingResponseDto,
  ArInvoiceCancellationTaxLedgerDetailDto,
} from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-invoice-cancellation.response.dto";
import type { ArInvoiceDetailedInvoiceDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-invoice.response.dto";

import { resolveEffectiveSettingsCompanyId } from "../../../common/server/settings-scope";
import { JournalRepo } from "../../../journals/server/db/journal.repo";
import type { JournalHeaderRow, JournalLineRow } from "../../../journals/server/db/journal.row.types";
import arInvoiceCancellationPosting from "../journal-posting-components";
import { validateRequest } from "./ar-invoice-cancellation.validator";
import { ArInvoiceCancellationPostingRepo } from "../db/ar-invoice-cancellation-posting.repo";

interface ProcessOptions {
  preview?: boolean;
}

interface CompanyRow {
  id: number;
  code: string;
  name: string;
  base_currency_code: string;
  status: string;
}

interface CounterpartyRow {
  id: number;
  finance_organization_id: number;
  code: string;
  name: string;
  status: string;
}

interface PeriodRow {
  financial_year_id: number;
  financial_year_code: string;
  financial_period_id: number;
  financial_period_code: string;
}

interface ControlAccountRow {
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  control_account_code: string;
  control_account_name: string;
}

interface PostingCodeAccountRow {
  code: string;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
}

interface TaxMovementAccountRow {
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  tax_movement_type_code: string;
}

interface DimensionValueRow {
  dimension_id: number;
  dimension_code: string;
  dimension_name: string;
  dimension_value_id: number;
  dimension_value_name: string;
}

interface OpenInvoiceRow {
  ar_subledger_entry_id: number;
  ar_subledger_entry_code: string;
  journal_header_id: number;
  document_id: string;
  journal_code: string;
  posting_date: string;
  base_currency_amount: number;
  open_amount: number;
  original_invoice: ArInvoiceDetailedInvoiceDto;
}

interface GeneratedLine {
  line_number: number;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  source_ledger: "ACCOUNTS_RECEIVABLE" | "TAX" | "POSTING_CODE" | null;
  source_control_account: string | null;
  dr_cr: DrCr;
  base_currency_amount: number;
  description: string;
  memo: string | null;
  dimensions?: ArInvoiceCancellationJournalLineDto["dimensions"];
}

interface GeneratedPosting {
  journalLines: GeneratedLine[];
  taxLedgerDetails: ArInvoiceCancellationTaxLedgerDetailDto[];
  totalDebitBaseAmount: number;
  totalCreditBaseAmount: number;
}

interface Context {
  request: ResolvedArInvoiceCancellationRequestDto;
  company: CompanyRow;
  counterparty: CounterpartyRow;
  period: PeriodRow;
  sourceInvoice: OpenInvoiceRow;
  arAccount: ControlAccountRow;
  taxAccount: TaxMovementAccountRow;
  revenueAccountsByCode: Map<string, PostingCodeAccountRow>;
  dimensionValuesByCodeAndName: Map<string, DimensionValueRow>;
  detailed: ArInvoiceCancellationDetailedDocumentDto;
  reservedJournalHeaderId: number | null;
}

type ResolvedArInvoiceCancellationRequestDto = ArInvoiceCancellationRequestDto & { document_id: string };

const DOCUMENT_TYPE = "AR_INVOICE_CANCELLATION";
const DOCUMENT_LABEL = "Invoice withdrawal";
const AR_CONTROL = arInvoiceCancellationPosting.components.cr_ar_receivable.code;
const TAX_MOVEMENT = arInvoiceCancellationPosting.components.dr_tax_output.code;

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function dateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

function companyRow(row: Record<string, unknown>): CompanyRow {
  return { id: Number(row.id), code: String(row.code), name: String(row.name), base_currency_code: String(row.base_currency_code), status: String(row.status) };
}

function counterpartyRow(row: Record<string, unknown>): CounterpartyRow {
  return { id: Number(row.id), finance_organization_id: Number(row.finance_organization_id), code: String(row.code), name: String(row.name), status: String(row.status) };
}

function periodRow(row: Record<string, unknown>): PeriodRow {
  return {
    financial_year_id: Number(row.financial_year_id),
    financial_year_code: String(row.financial_year_code),
    financial_period_id: Number(row.financial_period_id),
    financial_period_code: String(row.financial_period_code),
  };
}

function controlAccountRow(row: Record<string, unknown>): ControlAccountRow {
  return {
    gl_account_id: Number(row.gl_account_id),
    gl_account_code: String(row.gl_account_code),
    gl_account_name: String(row.gl_account_name),
    control_account_code: String(row.control_account_code),
    control_account_name: String(row.control_account_name),
  };
}

function postingCodeAccountRow(row: Record<string, unknown>): PostingCodeAccountRow {
  return {
    code: String(row.code),
    gl_account_id: Number(row.gl_account_id),
    gl_account_code: String(row.gl_account_code),
    gl_account_name: String(row.gl_account_name),
  };
}

function taxMovementAccountRow(row: Record<string, unknown>): TaxMovementAccountRow {
  return {
    gl_account_id: Number(row.gl_account_id),
    gl_account_code: String(row.gl_account_code),
    gl_account_name: String(row.gl_account_name),
    tax_movement_type_code: TAX_MOVEMENT,
  };
}

function dimensionValueRow(row: Record<string, unknown>): DimensionValueRow {
  return {
    dimension_id: Number(row.dimension_id),
    dimension_code: String(row.dimension_code),
    dimension_name: String(row.dimension_name),
    dimension_value_id: Number(row.dimension_value_id),
    dimension_value_name: String(row.dimension_value_name),
  };
}

function openInvoiceRow(row: Record<string, unknown>): OpenInvoiceRow {
  return {
    ar_subledger_entry_id: Number(row.ar_subledger_entry_id),
    ar_subledger_entry_code: String(row.ar_subledger_entry_code),
    journal_header_id: Number(row.journal_header_id),
    document_id: String(row.document_id),
    journal_code: String(row.journal_code),
    posting_date: dateString(row.posting_date),
    base_currency_amount: Number(row.base_currency_amount),
    open_amount: Number(row.open_amount),
    original_invoice: row.original_invoice as ArInvoiceDetailedInvoiceDto,
  };
}

function mapByCode<T extends { code: string }>(rows: T[]): Map<string, T> {
  return new Map(rows.map((row) => [row.code, row]));
}

function mapDimensionValues(rows: DimensionValueRow[]): Map<string, DimensionValueRow> {
  return new Map(rows.map((row) => [`${row.dimension_code}\u0000${row.dimension_value_name}`, row]));
}

async function getCompany(db: DbExecutor, code: string): Promise<CompanyRow | null> {
  return new ArInvoiceCancellationPostingRepo(db).getCompany(code);
}

async function getCounterparty(db: DbExecutor, companyId: number, code: string): Promise<CounterpartyRow | null> {
  return new ArInvoiceCancellationPostingRepo(db).getCounterparty(companyId, code);
}

async function getPeriod(db: DbExecutor, companyId: number, postingDate: string): Promise<PeriodRow | null> {
  return new ArInvoiceCancellationPostingRepo(db).getPeriod(companyId, postingDate);
}

async function getArControlAccount(db: DbExecutor, companyId: number): Promise<ControlAccountRow | null> {
  return new ArInvoiceCancellationPostingRepo(db).getArControlAccount(companyId, AR_CONTROL);
}

async function getTaxMovementAccount(db: DbExecutor, companyId: number): Promise<TaxMovementAccountRow | null> {
  return new ArInvoiceCancellationPostingRepo(db).getTaxMovementAccount(companyId, TAX_MOVEMENT);
}

async function getOpenInvoice(db: DbExecutor, companyId: number, counterpartyId: number, documentId: string): Promise<OpenInvoiceRow | null> {
  return new ArInvoiceCancellationPostingRepo(db).getOpenInvoice(companyId, counterpartyId, documentId, AR_CONTROL);
}

async function listRevenuePostingCodes(db: DbExecutor, companyId: number, codes: string[]): Promise<PostingCodeAccountRow[]> {
  return new ArInvoiceCancellationPostingRepo(db).listRevenuePostingCodes(companyId, codes);
}

async function listDimensionValues(db: DbExecutor, companyId: number, pairs: Array<{ dimensionCode: string; valueName: string }>): Promise<DimensionValueRow[]> {
  return new ArInvoiceCancellationPostingRepo(db).listDimensionValues(companyId, pairs);
}

function revenueCodes(invoice: ArInvoiceDetailedInvoiceDto): string[] {
  return [...new Set(invoice.lines.map((line) => line.revenue_posting_code).filter(Boolean))];
}

function dimensionPairs(invoice: ArInvoiceDetailedInvoiceDto): Array<{ dimensionCode: string; valueName: string }> {
  const pairs = new Map<string, { dimensionCode: string; valueName: string }>();
  for (const line of invoice.lines) {
    for (const [dimensionCode, valueName] of Object.entries(line.dimensions ?? {})) {
      pairs.set(`${dimensionCode}\u0000${valueName}`, { dimensionCode, valueName });
    }
  }
  return [...pairs.values()];
}

async function resolveContext(db: DbExecutor, request: ResolvedArInvoiceCancellationRequestDto, reservedJournalHeaderId: number | null): Promise<Context> {
  const company = await getCompany(db, request.company_code ?? "");
  if (!company) throw new BusinessRuleError(`Company ${request.company_code ?? ""} was not found`);
  if (company.status !== "ACTIVE") throw new BusinessRuleError(`Company ${company.code} is not ACTIVE`);

  const counterparty = await getCounterparty(db, company.id, request.ar_counterparty_code ?? "");
  if (!counterparty) throw new BusinessRuleError(`AR counterparty ${request.ar_counterparty_code ?? ""} was not found`);
  if (counterparty.status !== "ACTIVE") throw new BusinessRuleError(`AR counterparty ${counterparty.code} is not ACTIVE`);

  const sourceInvoiceDocumentId = request.source_invoice?.document_id ?? "";
  const sourceInvoice = await getOpenInvoice(db, company.id, counterparty.id, sourceInvoiceDocumentId);
  if (!sourceInvoice) throw new BusinessRuleError(`source_invoice.document_id ${sourceInvoiceDocumentId} was not found`);
  if (round2(sourceInvoice.open_amount) !== round2(sourceInvoice.base_currency_amount)) {
    throw new BusinessRuleError(`source_invoice.document_id ${sourceInvoice.document_id} is not fully open`);
  }
  if (!sourceInvoice.original_invoice?.lines?.length) throw new InputValidationError(`source_invoice.document_id ${sourceInvoice.document_id} is missing an invoice snapshot`);

  const postingDate = request.posting_date ?? sourceInvoice.original_invoice.invoice_date ?? sourceInvoice.posting_date;
  const settingsCompanyId = await resolveEffectiveSettingsCompanyId(company.id, db);
  const [period, arAccount, taxAccount, revenueAccounts, dimensionValues] = await Promise.all([
    getPeriod(db, company.id, postingDate),
    getArControlAccount(db, settingsCompanyId),
    getTaxMovementAccount(db, settingsCompanyId),
    listRevenuePostingCodes(db, settingsCompanyId, revenueCodes(sourceInvoice.original_invoice)),
    listDimensionValues(db, settingsCompanyId, dimensionPairs(sourceInvoice.original_invoice)),
  ]);
  if (!period) throw new BusinessRuleError(`No OPEN fiscal period contains posting date ${postingDate}`);
  if (!arAccount) throw new BusinessRuleError(`${AR_CONTROL} control account is not configured`);
  if (!taxAccount) throw new BusinessRuleError(`${TAX_MOVEMENT} tax control account is not configured`);

  const revenueAccountsByCode = mapByCode(revenueAccounts);
  for (const code of revenueCodes(sourceInvoice.original_invoice)) {
    if (!revenueAccountsByCode.has(code)) throw new BusinessRuleError(`Original invoice revenue posting code ${code} is not active`);
  }
  const dimensionValuesByCodeAndName = mapDimensionValues(dimensionValues);
  for (const pair of dimensionPairs(sourceInvoice.original_invoice)) {
    if (!dimensionValuesByCodeAndName.has(`${pair.dimensionCode}\u0000${pair.valueName}`)) {
      throw new BusinessRuleError(`Original invoice dimension ${pair.dimensionCode} value ${pair.valueName} was not found`);
    }
  }

  const original = sourceInvoice.original_invoice;
  return {
    request,
    company,
    counterparty,
    period,
    sourceInvoice,
    arAccount,
    taxAccount,
    revenueAccountsByCode,
    dimensionValuesByCodeAndName,
    reservedJournalHeaderId,
    detailed: {
      company: { code: company.code, base_currency_code: company.base_currency_code },
      ar_counterparty: { code: counterparty.code, name: counterparty.name },
      document_id: request.document_id,
      document_memo: request.document_memo ?? null,
      generated_description: `Invoice Cancellation ${request.document_id}`,
      source_invoice_document_id: sourceInvoice.document_id,
      source_invoice_journal_code: sourceInvoice.journal_code,
      source_invoice_ar_subledger_entry_code: sourceInvoice.ar_subledger_entry_code,
      source_invoice_ar_subledger_entry_id: sourceInvoice.ar_subledger_entry_id,
      source_invoice_open_amount_before: round2(sourceInvoice.open_amount),
      source_invoice_open_amount_after: 0,
      cancellation_date: request.cancellation_date,
      posting_date: postingDate,
      original_invoice: original,
      net_amount: original.net_amount,
      tax_amount: original.tax_amount,
      gross_amount: original.gross_amount,
    },
  };
}

function dimensionsForLine(context: Context, line: ArInvoiceDetailedInvoiceDto["lines"][number]): ArInvoiceCancellationJournalLineDto["dimensions"] {
  return Object.entries(line.dimensions ?? {}).map(([dimensionCode, valueName]) => {
    const row = context.dimensionValuesByCodeAndName.get(`${dimensionCode}\u0000${valueName}`);
    if (!row) throw new BusinessRuleError(`Dimension ${dimensionCode} value ${valueName} was not resolved`);
    return {
      dimension_code: row.dimension_code,
      dimension_name: row.dimension_name,
      dimension_value_name: row.dimension_value_name,
    };
  });
}

function buildGeneratedPosting(context: Context): GeneratedPosting {
  const lines: GeneratedLine[] = [];
  const taxLedgerDetails: ArInvoiceCancellationTaxLedgerDetailDto[] = [];
  const document = context.detailed;

  for (const originalLine of document.original_invoice.lines) {
    const account = context.revenueAccountsByCode.get(originalLine.revenue_posting_code);
    if (!account) throw new BusinessRuleError(`Revenue posting code ${originalLine.revenue_posting_code} was not resolved`);
    lines.push({
      line_number: lines.length + 1,
      gl_account_id: account.gl_account_id,
      gl_account_code: account.gl_account_code,
      gl_account_name: account.gl_account_name,
      source_ledger: "POSTING_CODE",
      source_control_account: account.code,
      dr_cr: "DR",
      base_currency_amount: originalLine.net_line_total,
      description: originalLine.line_description,
      memo: document.document_memo,
      dimensions: dimensionsForLine(context, originalLine),
    });

    for (const component of originalLine.tax_components) {
      if (component.tax_amount <= 0) continue;
      lines.push({
        line_number: lines.length + 1,
        gl_account_id: context.taxAccount.gl_account_id,
        gl_account_code: context.taxAccount.gl_account_code,
        gl_account_name: context.taxAccount.gl_account_name,
        source_ledger: "TAX",
        source_control_account: TAX_MOVEMENT,
        dr_cr: "DR",
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
        tax_movement_type_code: TAX_MOVEMENT,
        description: component.invoice_label ?? component.tax_rule,
        scheme_code: component.scheme_code ?? null,
        invoice_label: component.invoice_label ?? null,
        report_label: component.report_label ?? null,
        tax_rate: component.tax_rate,
        taxable_amount: component.taxable_amount,
        posting_date: document.posting_date,
        financial_year_code: context.period.financial_year_code,
        financial_period_code: context.period.financial_period_code,
        base_currency_code: context.company.base_currency_code,
        entry_type: "DEBIT",
        base_currency_amount: component.tax_amount,
        status: "EPHEMERAL",
      });
    }
  }

  lines.push({
    line_number: lines.length + 1,
    gl_account_id: context.arAccount.gl_account_id,
    gl_account_code: context.arAccount.gl_account_code,
    gl_account_name: context.arAccount.gl_account_name,
    source_ledger: "ACCOUNTS_RECEIVABLE",
    source_control_account: AR_CONTROL,
    dr_cr: "CR",
    base_currency_amount: document.gross_amount,
    description: document.generated_description,
    memo: document.document_memo,
  });

  return {
    journalLines: lines,
    taxLedgerDetails,
    totalDebitBaseAmount: round2(lines.filter((line) => line.dr_cr === "DR").reduce((sum, line) => sum + line.base_currency_amount, 0)),
    totalCreditBaseAmount: round2(lines.filter((line) => line.dr_cr === "CR").reduce((sum, line) => sum + line.base_currency_amount, 0)),
  };
}

function postingDetails(context: Context, generated: GeneratedPosting, header?: JournalHeaderRow, rows?: JournalLineRow[]): ArInvoiceCancellationPostingDetailsDto {
  const journalLines = rows
    ? rows.map((row) => ({
      id: row.id,
      journal_header_id: row.journal_header_id,
      line_number: row.line_number,
      gl_account_code: row.gl_account_code,
      gl_account_name: row.gl_account_name,
      source_ledger: row.source_ledger,
      source_control_account: row.source_control_account,
      dr_cr: row.dr_cr === "DR" ? "DR" as const : "CR" as const,
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
      document_type_code: DOCUMENT_TYPE,
      document_id: context.detailed.document_id,
      generated_description: context.detailed.generated_description,
      posting_engine_code: DOCUMENT_TYPE,
      company_code: context.company.code,
      document_date: context.detailed.cancellation_date,
      posting_date: context.detailed.posting_date,
      financial_year_code: context.period.financial_year_code,
      financial_period_code: context.period.financial_period_code,
      base_currency_code: context.company.base_currency_code,
      total_debit_base_amount: header?.total_debit_base_amount ?? generated.totalDebitBaseAmount,
      total_credit_base_amount: header?.total_credit_base_amount ?? generated.totalCreditBaseAmount,
      document_memo: context.detailed.document_memo,
      status: header ? "POSTED" : "EPHEMERAL",
    },
    journal_lines: journalLines,
  };
}

function arDetail(context: Context, id: number | null, code: string | null, journalHeaderId: number | null): ArInvoiceCancellationArSubledgerDetailDto {
  return {
    id,
    code,
    company_code: context.company.code,
    journal_header_id: journalHeaderId,
    ar_counterparty_code: context.counterparty.code,
    control_account_code: AR_CONTROL,
    applied_to_ar_subledger_entry_id: context.sourceInvoice.ar_subledger_entry_id,
    posting_date: context.detailed.posting_date,
    financial_year_code: context.period.financial_year_code,
    financial_period_code: context.period.financial_period_code,
    base_currency_code: context.company.base_currency_code,
    entry_type: "CREDIT",
    base_currency_amount: context.detailed.gross_amount,
    document_memo: context.detailed.document_memo,
    status: id == null ? "EPHEMERAL" : "POSTED",
  };
}

async function insertArEntry(db: DbExecutor, context: Context, journalHeaderId: number): Promise<{ id: number; code: string }> {
  const code = `AR-WD-${journalHeaderId}`;
  const id = await new ArInvoiceCancellationPostingRepo(db).insertArHeader([code, context.company.id, journalHeaderId, context.counterparty.id, DOCUMENT_TYPE, context.detailed.document_id, context.detailed.generated_description, context.detailed.document_memo, context.detailed.cancellation_date, context.detailed.posting_date, context.period.financial_year_id, context.period.financial_period_id, context.company.base_currency_code]);
  return { id, code };
}

async function originalInvoiceLineIds(db: DbExecutor, sourceHeaderId: number): Promise<Map<number, number>> {
  return new ArInvoiceCancellationPostingRepo(db).originalInvoiceLineIds(sourceHeaderId);
}

async function insertCancellationLines(db: DbExecutor, context: Context, cancellationHeaderId: number): Promise<void> {
  const reverseIds = await originalInvoiceLineIds(db, context.sourceInvoice.ar_subledger_entry_id);
  for (const line of context.detailed.original_invoice.lines) {
    await new ArInvoiceCancellationPostingRepo(db).insertCancellationLine([
        cancellationHeaderId,
        line.line_id,
        line.line_description,
        AR_CONTROL,
        line.quantity,
        line.net_unit_price,
        line.net_line_total,
        line.tax_amount,
        line.gross_line_total,
        line.revenue_posting_code,
        line.tax_rule,
        context.sourceInvoice.ar_subledger_entry_id,
        reverseIds.get(line.line_id) ?? null,
        line.gross_line_total,
        context.detailed.document_memo,
      ]);
  }
}

async function insertTaxHeader(db: DbExecutor, context: Context, journalHeaderId: number): Promise<{ id: number; code: string }> {
  const code = `TAX-WD-${journalHeaderId}`;
  const id = await new ArInvoiceCancellationPostingRepo(db).insertTaxHeader([code, context.company.id, journalHeaderId, context.detailed.document_id, context.detailed.generated_description, context.detailed.cancellation_date, context.detailed.posting_date, context.period.financial_year_id, context.period.financial_period_id, context.company.base_currency_code]);
  return { id, code };
}

async function insertTaxEntry(db: DbExecutor, context: Context, taxHeader: { id: number; code: string }, sequence: number, detail: ArInvoiceCancellationTaxLedgerDetailDto): Promise<{ id: number; code: string }> {
  const component = context.detailed.original_invoice.lines.flatMap((line) => line.tax_components)
    .find((candidate) => candidate.tax_rule === detail.tax_rule && candidate.tax_authority_code === detail.tax_authority_code && candidate.tax_amount === detail.base_currency_amount);
  if (!component?.tax_rule_id || !component.tax_authority_id) throw new BusinessRuleError("Original invoice tax detail is missing resolved database ids");
  const id = await new ArInvoiceCancellationPostingRepo(db).insertTaxLine([
      taxHeader.id,
      sequence,
      component.tax_rule_id,
      component.tax_component_id ?? null,
      component.tax_authority_id,
      TAX_MOVEMENT,
      detail.scheme_code ?? null,
      detail.invoice_label ?? null,
      detail.report_label ?? null,
      detail.tax_rate,
      detail.taxable_amount,
      detail.base_currency_amount,
    ]);
  return { id, code: `${taxHeader.code}-${sequence}` };
}

function hasDocumentId(request: ArInvoiceCancellationRequestDto): request is ResolvedArInvoiceCancellationRequestDto {
  return typeof request.document_id === "string" && request.document_id.trim().length > 0;
}

function withDocumentId(request: ArInvoiceCancellationRequestDto, journalHeaderId: number): ResolvedArInvoiceCancellationRequestDto {
  if (hasDocumentId(request)) return request;
  return { ...request, document_id: `WD-${journalHeaderId}` };
}

async function processArInvoiceCancellationUnchecked(input: ArInvoiceCancellationRequestDto, options: ProcessOptions = {}): Promise<ArInvoiceCancellationPostingResponseDto> {
  validateRequest(input);
  const rawRequest: ArInvoiceCancellationRequestDto = input;
  const repo = new JournalRepo(getDb());
  let reservedJournalHeaderId: number | null = null;
  let request: ResolvedArInvoiceCancellationRequestDto;
  if (hasDocumentId(rawRequest)) {
    request = rawRequest;
  } else {
    reservedJournalHeaderId = await repo.reserveHeaderId();
    request = withDocumentId(rawRequest, reservedJournalHeaderId);
  }
  const context = await resolveContext(getDb(), request, reservedJournalHeaderId);
  const generated = buildGeneratedPosting(context);

  if (generated.totalDebitBaseAmount !== generated.totalCreditBaseAmount) {
    throw new BusinessRuleError(`${DOCUMENT_TYPE} generated unbalanced journal lines`);
  }

  if (options.preview) {
    return {
      detailed_document: context.detailed,
      ar_subledger_details: arDetail(context, null, null, null),
      tax_ledger_details: generated.taxLedgerDetails,
      posting_details: postingDetails(context, generated),
    };
  }

  return withTransaction(async (client) => {
    const txContext = await resolveContext(client, request, reservedJournalHeaderId);
    const txGenerated = buildGeneratedPosting(txContext);
    const journalRepo = new JournalRepo(client);

    const header = await journalRepo.insert({
      id: txContext.reservedJournalHeaderId ?? undefined,
      finance_organization_id: txContext.company.id,
      company_code: txContext.company.code,
      company_name: txContext.company.name,
      document_type_code: DOCUMENT_TYPE,
      document_type_label: DOCUMENT_LABEL,
      document_id: txContext.detailed.document_id,
      description: txContext.detailed.generated_description,
      document_snapshot_json: request,
      detailed_document_snapshot_json: txContext.detailed,
      posting_engine_code: DOCUMENT_TYPE,
      document_date: txContext.detailed.cancellation_date,
      posting_date: txContext.detailed.posting_date,
      financial_year_id: txContext.period.financial_year_id,
      financial_year_code: txContext.period.financial_year_code,
      financial_period_id: txContext.period.financial_period_id,
      financial_period_code: txContext.period.financial_period_code,
      base_currency_code: txContext.company.base_currency_code,
      memo: txContext.detailed.document_memo,
      reversal_of_journal_id: txContext.sourceInvoice.journal_header_id,
    });

    const journalLines: JournalLineRow[] = [];
    for (const line of txGenerated.journalLines) {
      const { dimensions, ...journalLine } = line;
      const insertedLine = await journalRepo.insertLine({ journal_header_id: header.id, ...journalLine });
      journalLines.push(insertedLine);
      for (const dimension of dimensions ?? []) {
        const row = txContext.dimensionValuesByCodeAndName.get(`${dimension.dimension_code}\u0000${dimension.dimension_value_name}`);
        if (!row) throw new BusinessRuleError(`Dimension ${dimension.dimension_code} value ${dimension.dimension_value_name} was not resolved`);
        await journalRepo.insertLineDimension({
          journal_line_id: insertedLine.id,
          dimension_id: row.dimension_id,
          dimension_value_id: row.dimension_value_id,
          dimension_code: row.dimension_code,
          dimension_name: row.dimension_name,
          dimension_value_name: row.dimension_value_name,
        });
      }
    }
    const posted = await journalRepo.setPosted(header.id, txGenerated.totalDebitBaseAmount, txGenerated.totalCreditBaseAmount);
    await journalRepo.setReversedBy(txContext.sourceInvoice.journal_header_id, header.id);
    const arRow = await insertArEntry(client, txContext, header.id);
    await insertCancellationLines(client, txContext, arRow.id);
    const taxRows: Array<{ id: number; code: string }> = [];
    const taxHeader = txGenerated.taxLedgerDetails.length ? await insertTaxHeader(client, txContext, header.id) : null;
    for (let i = 0; i < txGenerated.taxLedgerDetails.length; i++) {
      if (!taxHeader) throw new BusinessRuleError("Tax ledger header was not created");
      taxRows.push(await insertTaxEntry(client, txContext, taxHeader, i + 1, txGenerated.taxLedgerDetails[i]));
    }
    return {
      detailed_document: txContext.detailed,
      ar_subledger_details: arDetail(txContext, arRow.id, arRow.code, header.id),
      tax_ledger_details: txGenerated.taxLedgerDetails.map((detail, index) => ({
        ...detail,
        id: taxRows[index]?.id ?? null,
        code: taxRows[index]?.code ?? null,
        status: "POSTED",
      })),
      posting_details: postingDetails(txContext, txGenerated, posted, journalLines),
    };
  });
}

export const processArInvoiceCancellation = processArInvoiceCancellationUnchecked;
