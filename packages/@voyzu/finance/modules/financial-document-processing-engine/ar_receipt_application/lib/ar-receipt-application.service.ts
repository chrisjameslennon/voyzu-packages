import { getDb, withTransaction, type DbExecutor } from "@voyzu/capability/db";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";
import type { EntryType } from "@voyzu/finance/types/modules/core";
import type { ArReceiptApplicationRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-receipt-application.request.dto";
import type {
  ArReceiptApplicationArSubledgerDetailDto,
  ArReceiptApplicationDetailedDto,
  ArReceiptApplicationDetailedLineDto,
  ArReceiptApplicationPostingDetailsDto,
  ArReceiptApplicationPostingResponseDto,
} from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-receipt-application.response.dto";

import { resolveEffectiveSettingsCompanyId } from "../../../common/server/settings-scope";
import { JournalRepo } from "../../../journals/server/db/journal.repo";
import type { JournalHeaderRow, JournalLineRow } from "../../../journals/server/db/journal.row.types";
import arReceiptApplicationPosting from "../journal-posting-components";
import { validateRequest } from "./ar-receipt-application.validator";
import { ArReceiptApplicationPostingRepo } from "../db/ar-receipt-application-posting.repo";
import { ArReceiptPostingRepo } from "../../ar_receipt/db/ar-receipt-posting.repo";

interface ProcessOptions { preview?: boolean; }
interface CompanyRow { id: number; code: string; name: string; base_currency_code: string; status: string; }
interface CounterpartyRow { id: number; finance_organization_id: number; code: string; name: string; status: string; }
interface PeriodRow { financial_year_id: number; financial_year_code: string; financial_period_id: number; financial_period_code: string; }
interface AccountRow { gl_account_id: number; gl_account_code: string; gl_account_name: string; control_account_code: string; control_account_name: string; }
interface OpenItemRow {
  ar_subledger_entry_id: number;
  ar_subledger_entry_code: string;
  document_id: string;
  journal_code: string;
  open_amount: number;
}
interface Context {
  request: ResolvedArReceiptApplicationRequestDto;
  company: CompanyRow;
  counterparty: CounterpartyRow;
  period: PeriodRow;
  tradeReceivables: AccountRow;
  unappliedCash: AccountRow;
  detailed: ArReceiptApplicationDetailedDto;
  reservedJournalHeaderId: number | null;
}

type ResolvedArReceiptApplicationRequestDto = ArReceiptApplicationRequestDto & { document_id: string };

type ArReceiptApplicationControlCode = "AR_UNAPPLIED_CASH" | "AR_TRADE_RECEIVABLES";

const AR_UNAPPLIED_CASH: ArReceiptApplicationControlCode = arReceiptApplicationPosting.components.dr_unapplied_cash.code;
const AR_TRADE_RECEIVABLES: ArReceiptApplicationControlCode = arReceiptApplicationPosting.components.cr_ar_receivable.code;

function round2(value: number): number { return Math.round((value + Number.EPSILON) * 100) / 100; }
function postingDateFor(input: ArReceiptApplicationRequestDto): string { return input.posting_date ?? input.application_date; }
function amount(value: number | string): number { return typeof value === "number" ? value : Number(value); }

function companyRow(row: Record<string, unknown>): CompanyRow {
  return { id: Number(row.id), code: String(row.code), name: String(row.name), base_currency_code: String(row.base_currency_code), status: String(row.status) };
}
function counterpartyRow(row: Record<string, unknown>): CounterpartyRow {
  return { id: Number(row.id), finance_organization_id: Number(row.finance_organization_id), code: String(row.code), name: String(row.name), status: String(row.status) };
}
function periodRow(row: Record<string, unknown>): PeriodRow {
  return { financial_year_id: Number(row.financial_year_id), financial_year_code: String(row.financial_year_code), financial_period_id: Number(row.financial_period_id), financial_period_code: String(row.financial_period_code) };
}
function accountRow(row: Record<string, unknown>): AccountRow {
  return { gl_account_id: Number(row.gl_account_id), gl_account_code: String(row.gl_account_code), gl_account_name: String(row.gl_account_name), control_account_code: String(row.control_account_code), control_account_name: String(row.control_account_name) };
}
function openItemRow(row: Record<string, unknown>): OpenItemRow {
  return {
    ar_subledger_entry_id: Number(row.ar_subledger_entry_id),
    ar_subledger_entry_code: String(row.ar_subledger_entry_code),
    document_id: String(row.document_id),
    journal_code: String(row.journal_code),
    open_amount: Number(row.open_amount),
  };
}

async function getCompany(db: DbExecutor, code: string): Promise<CompanyRow | null> {
  return new ArReceiptPostingRepo(db).getCompany(code);
}
async function getCounterparty(db: DbExecutor, companyId: number, code: string): Promise<CounterpartyRow | null> {
  return new ArReceiptPostingRepo(db).getCounterparty(companyId, code);
}
async function getPeriod(db: DbExecutor, companyId: number, postingDate: string): Promise<PeriodRow | null> {
  return new ArReceiptPostingRepo(db).getPeriod(companyId, postingDate);
}
async function getControlAccount(db: DbExecutor, companyId: number, code: string): Promise<AccountRow | null> {
  const row = await new ArReceiptPostingRepo(db).getControlAccount(companyId, code);
  return row?.control_account_code && row.control_account_name ? row as AccountRow : null;
}

async function findOpenInvoice(db: DbExecutor, companyId: number, counterpartyId: number, documentId: string): Promise<OpenItemRow | null> {
  return new ArReceiptPostingRepo(db).findOpenInvoice(companyId, counterpartyId, documentId, AR_TRADE_RECEIVABLES);
}

async function findOpenReceipt(db: DbExecutor, companyId: number, counterpartyId: number, documentId: string): Promise<OpenItemRow | null> {
  return new ArReceiptPostingRepo(db).findOpenReceipt(companyId, counterpartyId, documentId, AR_UNAPPLIED_CASH);
}

async function resolveContext(db: DbExecutor, request: ResolvedArReceiptApplicationRequestDto, reservedJournalHeaderId: number | null): Promise<Context> {
  const company = await getCompany(db, request.company_code ?? "");
  if (!company) throw new BusinessRuleError(`Company ${request.company_code ?? ""} was not found`);
  if (company.status !== "ACTIVE") throw new BusinessRuleError(`Company ${company.code} is not ACTIVE`);
  const counterparty = await getCounterparty(db, company.id, request.ar_counterparty_code ?? "");
  if (!counterparty) throw new BusinessRuleError(`AR counterparty ${request.ar_counterparty_code ?? ""} was not found`);
  if (counterparty.status !== "ACTIVE") throw new BusinessRuleError(`AR counterparty ${counterparty.code} is not ACTIVE`);
  const postingDate = postingDateFor(request);
  const settingsCompanyId = await resolveEffectiveSettingsCompanyId(company.id);
  const [period, tradeReceivables, unappliedCash] = await Promise.all([
    getPeriod(db, company.id, postingDate),
    getControlAccount(db, settingsCompanyId, AR_TRADE_RECEIVABLES),
    getControlAccount(db, settingsCompanyId, AR_UNAPPLIED_CASH),
  ]);
  if (!period) throw new BusinessRuleError(`No OPEN fiscal period contains posting date ${postingDate}`);
  if (!tradeReceivables) throw new BusinessRuleError(`${AR_TRADE_RECEIVABLES} control account is not configured`);
  if (!unappliedCash) throw new BusinessRuleError(`${AR_UNAPPLIED_CASH} control account is not configured`);

  const sourceTotals = new Map<number, number>();
  const targetTotals = new Map<number, number>();
  const applications: ArReceiptApplicationDetailedLineDto[] = [];
  for (let i = 0; i < request.applications.length; i++) {
    const input = request.applications[i];
    const sourceDocumentId = input.source_receipt?.document_id ?? "";
    const targetDocumentId = input.target_invoice?.document_id ?? "";
    const source = await findOpenReceipt(db, company.id, counterparty.id, sourceDocumentId);
    if (!source) throw new BusinessRuleError(`applications[${i}].source_receipt.document_id ${sourceDocumentId} was not found`);
    const target = await findOpenInvoice(db, company.id, counterparty.id, targetDocumentId);
    if (!target) throw new BusinessRuleError(`applications[${i}].target_invoice.document_id ${targetDocumentId} was not found`);
    const value = round2(amount(input.amount));
    const sourceUsed = round2((sourceTotals.get(source.ar_subledger_entry_id) ?? 0) + value);
    const targetUsed = round2((targetTotals.get(target.ar_subledger_entry_id) ?? 0) + value);
    if (sourceUsed > source.open_amount) throw new BusinessRuleError(`applications[${i}] amount exceeds source receipt ${source.journal_code} unapplied balance`);
    if (targetUsed > target.open_amount) throw new BusinessRuleError(`applications[${i}] amount exceeds target invoice ${target.journal_code} open balance`);
    sourceTotals.set(source.ar_subledger_entry_id, sourceUsed);
    targetTotals.set(target.ar_subledger_entry_id, targetUsed);
    applications.push({
      source_receipt_document_id: source.document_id,
      source_receipt_journal_code: source.journal_code,
      source_receipt_ar_subledger_entry_code: source.ar_subledger_entry_code,
      source_receipt_ar_subledger_entry_id: source.ar_subledger_entry_id,
      source_receipt_open_amount_before: source.open_amount,
      source_receipt_open_amount_after: round2(source.open_amount - sourceUsed),
      target_invoice_document_id: target.document_id,
      target_invoice_journal_code: target.journal_code,
      target_invoice_ar_subledger_entry_code: target.ar_subledger_entry_code,
      target_invoice_ar_subledger_entry_id: target.ar_subledger_entry_id,
      target_invoice_open_amount_before: target.open_amount,
      target_invoice_open_amount_after: round2(target.open_amount - targetUsed),
      amount: value,
    });
  }
  const total = round2(applications.reduce((sum, application) => sum + application.amount, 0));
  if (total <= 0) throw new InputValidationError("total application amount must be greater than zero");
  return {
    request,
    company,
    counterparty,
    period,
    tradeReceivables,
    unappliedCash,
    reservedJournalHeaderId,
    detailed: {
      company: { code: company.code, base_currency_code: company.base_currency_code },
      ar_counterparty: { code: counterparty.code, name: counterparty.name },
      document_id: request.document_id,
      document_memo: request.document_memo ?? null,
      generated_description: `Receipt Application ${request.document_id}`,
      application_date: request.application_date,
      posting_date: postingDate,
      applications,
      total_application_amount: total,
    },
  };
}

function buildJournalLines(context: Context) {
  return [
    {
      line_number: 1,
      gl_account_id: context.unappliedCash.gl_account_id,
      gl_account_code: context.unappliedCash.gl_account_code,
      gl_account_name: context.unappliedCash.gl_account_name,
      source_ledger: "ACCOUNTS_RECEIVABLE",
      source_control_account: AR_UNAPPLIED_CASH,
      description: context.detailed.generated_description,
      memo: context.detailed.document_memo,
      dr_cr: "DR",
      base_currency_amount: context.detailed.total_application_amount,
    },
    {
      line_number: 2,
      gl_account_id: context.tradeReceivables.gl_account_id,
      gl_account_code: context.tradeReceivables.gl_account_code,
      gl_account_name: context.tradeReceivables.gl_account_name,
      source_ledger: "ACCOUNTS_RECEIVABLE",
      source_control_account: AR_TRADE_RECEIVABLES,
      description: context.detailed.generated_description,
      memo: context.detailed.document_memo,
      dr_cr: "CR",
      base_currency_amount: context.detailed.total_application_amount,
    },
  ];
}

function postingDetails(context: Context, header?: JournalHeaderRow, rows?: JournalLineRow[]): ArReceiptApplicationPostingDetailsDto {
  const source = rows ?? buildJournalLines(context);
  return {
    journal_header: {
      id: header?.id ?? null,
      code: header?.code ?? null,
      document_type_code: "AR_RECEIPT_APPLICATION",
      document_id: context.detailed.document_id,
      generated_description: context.detailed.generated_description,
      posting_engine_code: "AR_RECEIPT_APPLICATION",
      company_code: context.company.code,
      document_date: context.detailed.application_date,
      posting_date: context.detailed.posting_date,
      financial_year_code: context.period.financial_year_code,
      financial_period_code: context.period.financial_period_code,
      base_currency_code: context.company.base_currency_code,
      total_debit_base_amount: header?.total_debit_base_amount ?? context.detailed.total_application_amount,
      total_credit_base_amount: header?.total_credit_base_amount ?? context.detailed.total_application_amount,
      document_memo: context.detailed.document_memo,
      status: header ? "POSTED" : "EPHEMERAL",
    },
    journal_lines: source.map((line) => ({
      id: "id" in line ? line.id : null,
      journal_header_id: "journal_header_id" in line ? line.journal_header_id : null,
      line_number: line.line_number,
      gl_account_code: line.gl_account_code,
      gl_account_name: line.gl_account_name,
      source_ledger: line.source_ledger,
      source_control_account: line.source_control_account,
      dr_cr: line.dr_cr === "DR" ? "DR" : "CR",
      base_currency_amount: line.base_currency_amount,
      description: line.description,
      document_memo: line.memo,
    })),
  };
}

function arDetail(context: Context, id: number | null, code: string | null, control: ArReceiptApplicationControlCode, appliedTo: number | null, entryType: EntryType, amountValue: number, journalHeaderId: number | null): ArReceiptApplicationArSubledgerDetailDto {
  return {
    id,
    code,
    company_code: context.company.code,
    journal_header_id: journalHeaderId,
    ar_counterparty_code: context.counterparty.code,
    control_account_code: control,
    applied_to_ar_subledger_entry_id: appliedTo,
    posting_date: context.detailed.posting_date,
    financial_year_code: context.period.financial_year_code,
    financial_period_code: context.period.financial_period_code,
    base_currency_code: context.company.base_currency_code,
    entry_type: entryType,
    base_currency_amount: amountValue,
    document_memo: context.detailed.document_memo,
    status: id == null ? "EPHEMERAL" : "POSTED",
  };
}

function previewArDetails(context: Context): ArReceiptApplicationArSubledgerDetailDto[] {
  return context.detailed.applications.flatMap((application) => [
    arDetail(context, null, null, AR_UNAPPLIED_CASH, application.source_receipt_ar_subledger_entry_id, "DEBIT", application.amount, null),
    arDetail(context, null, null, AR_TRADE_RECEIVABLES, application.target_invoice_ar_subledger_entry_id, "CREDIT", application.amount, null),
  ]);
}

async function insertArEntry(
  db: DbExecutor,
  context: Context,
  arHeaderId: number,
  codePrefix: string,
  sequence: number,
  control: ArReceiptApplicationControlCode,
  appliedTo: number,
  entryType: EntryType,
  amountValue: number,
  description: string,
) {
  const id = await new ArReceiptApplicationPostingRepo(db).insertEntryLine({
    headerId: arHeaderId,
    sequence,
    description,
    control,
    drCr: entryType === "DEBIT" ? "DR" : "CR",
    amount: amountValue,
    sourceId: control === AR_UNAPPLIED_CASH ? appliedTo : null,
    targetId: control === AR_TRADE_RECEIVABLES ? appliedTo : null,
    memo: context.detailed.document_memo,
  });
  return { id, code: `${codePrefix}-${sequence}` };
}

async function insertArHeader(db: DbExecutor, context: Context, journalHeaderId: number): Promise<{ id: number; code: string }> {
  const code = `AR-APP-${journalHeaderId}`;
  const id = await new ArReceiptApplicationPostingRepo(db).insertHeader({
    code,
    companyId: context.company.id,
    journalHeaderId,
    counterpartyId: context.counterparty.id,
    documentId: context.detailed.document_id,
    description: context.detailed.generated_description,
    memo: context.detailed.document_memo,
    documentDate: context.detailed.application_date,
    postingDate: context.detailed.posting_date,
    financialYearId: context.period.financial_year_id,
    financialPeriodId: context.period.financial_period_id,
    baseCurrencyCode: context.company.base_currency_code,
  });
  return { id, code };
}

function hasDocumentId(request: ArReceiptApplicationRequestDto): request is ResolvedArReceiptApplicationRequestDto {
  return typeof request.document_id === "string" && request.document_id.trim().length > 0;
}

function withDocumentId(request: ArReceiptApplicationRequestDto, journalHeaderId: number): ResolvedArReceiptApplicationRequestDto {
  if (hasDocumentId(request)) return request;
  return { ...request, document_id: `APP-${journalHeaderId}` };
}

async function processArReceiptApplicationUnchecked(input: ArReceiptApplicationRequestDto, options: ProcessOptions = {}): Promise<ArReceiptApplicationPostingResponseDto> {
  validateRequest(input);
  const rawRequest: ArReceiptApplicationRequestDto = input;
  const repo = new JournalRepo(getDb());
  let reservedJournalHeaderId: number | null = null;
  let request: ResolvedArReceiptApplicationRequestDto;
  if (hasDocumentId(rawRequest)) {
    request = rawRequest;
  } else {
    reservedJournalHeaderId = await repo.reserveHeaderId();
    request = withDocumentId(rawRequest, reservedJournalHeaderId);
  }
  const context = await resolveContext(getDb(), request, reservedJournalHeaderId);
  if (options.preview) {
    return { detailed_document: context.detailed, ar_subledger_details: previewArDetails(context), posting_details: postingDetails(context) };
  }
  return withTransaction(async (client) => {
    const txContext = await resolveContext(client, request, reservedJournalHeaderId);
    const journalRepo = new JournalRepo(client);
    const header = await journalRepo.insert({
      id: txContext.reservedJournalHeaderId ?? undefined,
      finance_organization_id: txContext.company.id,
      company_code: txContext.company.code,
      company_name: txContext.company.name,
      document_type_code: "AR_RECEIPT_APPLICATION",
      document_type_label: "Receipt Application",
      document_id: txContext.detailed.document_id,
      description: txContext.detailed.generated_description,
      document_snapshot_json: request,
      detailed_document_snapshot_json: txContext.detailed,
      posting_engine_code: "AR_RECEIPT_APPLICATION",
      document_date: txContext.detailed.application_date,
      posting_date: txContext.detailed.posting_date,
      financial_year_id: txContext.period.financial_year_id,
      financial_year_code: txContext.period.financial_year_code,
      financial_period_id: txContext.period.financial_period_id,
      financial_period_code: txContext.period.financial_period_code,
      base_currency_code: txContext.company.base_currency_code,
      memo: txContext.detailed.document_memo,
    });
    const insertedLines: JournalLineRow[] = [];
    for (const line of buildJournalLines(txContext)) insertedLines.push(await journalRepo.insertLine({ journal_header_id: header.id, ...line }));
    const posted = await journalRepo.setPosted(header.id, txContext.detailed.total_application_amount, txContext.detailed.total_application_amount);
    const arHeader = await insertArHeader(client, txContext, header.id);
    const arRows: ArReceiptApplicationArSubledgerDetailDto[] = [];
    let sequence = 1;
    for (const application of txContext.detailed.applications) {
      const debit = await insertArEntry(
        client,
        txContext,
        arHeader.id,
        arHeader.code,
        sequence++,
        AR_UNAPPLIED_CASH,
        application.source_receipt_ar_subledger_entry_id,
        "DEBIT",
        application.amount,
        `Apply ${application.source_receipt_document_id} to ${application.target_invoice_document_id}`,
      );
      arRows.push(arDetail(txContext, debit.id, debit.code, AR_UNAPPLIED_CASH, application.source_receipt_ar_subledger_entry_id, "DEBIT", application.amount, header.id));
      const credit = await insertArEntry(
        client,
        txContext,
        arHeader.id,
        arHeader.code,
        sequence++,
        AR_TRADE_RECEIVABLES,
        application.target_invoice_ar_subledger_entry_id,
        "CREDIT",
        application.amount,
        `Apply ${application.source_receipt_document_id} to ${application.target_invoice_document_id}`,
      );
      arRows.push(arDetail(txContext, credit.id, credit.code, AR_TRADE_RECEIVABLES, application.target_invoice_ar_subledger_entry_id, "CREDIT", application.amount, header.id));
    }
    return { detailed_document: txContext.detailed, ar_subledger_details: arRows, posting_details: postingDetails(txContext, posted, insertedLines) };
  });
}

export const processArReceiptApplication = processArReceiptApplicationUnchecked;
