import { getDb, withTransaction, type DbExecutor } from "@voyzu/capability/db";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";
import type { DrCr } from "@voyzu/finance/types/modules/core";
import type { ArReceiptRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-receipt.request.dto";
import type {
  ArReceiptArSubledgerDetailDto,
  ArReceiptDetailedAllocationDto,
  ArReceiptDetailedReceiptDto,
  ArReceiptPostingDetailsDto,
  ArReceiptPostingResponseDto,
} from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-receipt.response.dto";

import { resolveBankCashDetails, toJournalBankCashFields } from "../../../common/bank-cash-accounts/server/lib/bank-cash-account.service";
import { resolveEffectiveSettingsCompanyId } from "../../../common/server/settings-scope";
import { validateRequest } from "./ar-receipt.validator";
import { JournalRepo } from "../../../journals/server/db/journal.repo";
import type { JournalHeaderRow, JournalLineRow } from "../../../journals/server/db/journal.row.types";
import { ArReceiptPostingRepo } from "../db/ar-receipt-posting.repo";
import {
  AR_RECEIPT_DOCUMENT_LABEL,
  AR_RECEIPT_ENGINE_CODE,
  AR_RECEIVABLE_CONTROL_CODE,
  AR_UNAPPLIED_CASH_CONTROL_CODE,
  CASH_POSTING_CODE,
  CASH_POSTING_CODE_SLOT,
} from "./ar-receipt.types";

interface ProcessOptions {
  preview?: boolean;
}

interface CompanyRow {
  id: number;
  code: string;
  name: string;
  country_code: string;
  base_currency_code: string;
  status: string;
}

interface CounterpartyRow {
  id: number;
  finance_organization_id: number;
  code: string;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  country_code: string;
  tax_region_or_province: string | null;
  country_currency_code: string;
}

interface PeriodRow {
  financial_year_id: number;
  financial_year_code: string;
  financial_period_id: number;
  financial_period_code: string;
}

interface AccountRow {
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  code?: string;
  bank_cash_control_account_code?: string;
  control_account_code?: string;
  control_account_name?: string;
}

interface OpenItemRow {
  ar_subledger_entry_id: number;
  ar_subledger_entry_code: string;
  document_id: string;
  journal_code: string;
  open_amount: number;
}

interface DocumentProcessorRow {
  code: string;
  status: string;
  supports_dimensions: boolean;
  cash_movement: boolean;
  supports_items: boolean;
}

interface Context {
  request: ResolvedArReceiptRequestDto;
  company: CompanyRow;
  counterparty: CounterpartyRow;
  counterpartyWasCreated: boolean;
  period: PeriodRow;
  cashAccount: AccountRow & { code: string };
  arAccount: AccountRow;
  unappliedAccount: AccountRow;
  detailed: ArReceiptDetailedReceiptDto;
  bankCashDetails: ArReceiptDetailedReceiptDto["bank_cash_details"];
  reservedJournalHeaderId: number | null;
}

type ResolvedArReceiptRequestDto = ArReceiptRequestDto & { document_id: string };

interface GeneratedLine {
  line_number: number;
  gl_account_id: number;
  gl_account_code: string;
  gl_account_name: string;
  source_ledger: "ACCOUNTS_RECEIVABLE" | "BANK_CASH" | null;
  source_control_account: "AR_TRADE_RECEIVABLES" | "AR_UNAPPLIED_CASH" | string | null;
  description: string;
  memo: string | null;
  dr_cr: DrCr;
  base_currency_amount: number;
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function postingDateFor(input: ArReceiptRequestDto): string {
  return input.posting_date ?? input.payment_date;
}

function companyRow(row: Record<string, unknown>): CompanyRow {
  return {
    id: Number(row.id),
    code: String(row.code),
    name: String(row.name),
    country_code: String(row.country_code),
    base_currency_code: String(row.base_currency_code),
    status: String(row.status),
  };
}

function counterpartyRow(row: Record<string, unknown>): CounterpartyRow {
  return {
    id: Number(row.id),
    finance_organization_id: Number(row.finance_organization_id),
    code: String(row.code),
    name: String(row.name),
    status: row.status as "ACTIVE" | "INACTIVE",
    country_code: String(row.country_code),
    tax_region_or_province: row.tax_region_or_province == null ? null : String(row.tax_region_or_province),
    country_currency_code: String(row.country_currency_code),
  };
}

function periodRow(row: Record<string, unknown>): PeriodRow {
  return {
    financial_year_id: Number(row.financial_year_id),
    financial_year_code: String(row.financial_year_code),
    financial_period_id: Number(row.financial_period_id),
    financial_period_code: String(row.financial_period_code),
  };
}

function accountRow(row: Record<string, unknown>): AccountRow {
  return {
    gl_account_id: Number(row.gl_account_id),
    gl_account_code: String(row.gl_account_code),
    gl_account_name: String(row.gl_account_name),
    code: row.code == null ? undefined : String(row.code),
    bank_cash_control_account_code: row.bank_cash_control_account_code == null ? undefined : String(row.bank_cash_control_account_code),
    control_account_code: row.control_account_code == null ? undefined : String(row.control_account_code),
    control_account_name: row.control_account_name == null ? undefined : String(row.control_account_name),
  };
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

function documentProcessorRow(row: Record<string, unknown>): DocumentProcessorRow {
  return {
    code: String(row.code),
    status: String(row.status),
    supports_dimensions: Boolean(row.supports_dimensions),
    cash_movement: Boolean(row.cash_movement),
    supports_items: Boolean(row.supports_items),
  };
}

async function getCompany(db: DbExecutor, code: string): Promise<CompanyRow | null> {
  return new ArReceiptPostingRepo(db).getCompany(code);
}

async function getDocumentProcessor(db: DbExecutor): Promise<DocumentProcessorRow | null> {
  return new ArReceiptPostingRepo(db).getDocumentProcessor(AR_RECEIPT_ENGINE_CODE);
}

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== "";
}

function assertDocumentCapabilities(processor: DocumentProcessorRow, request: ResolvedArReceiptRequestDto): void {
  const raw = request as unknown as Record<string, unknown>;
  if (hasValue(raw.bank_cash_details) && !processor.cash_movement) {
    throw new BusinessRuleError("AR_RECEIPT does not support bank_cash_details");
  }
  if (hasValue(raw.dimensions) && !processor.supports_dimensions) {
    throw new BusinessRuleError("AR_RECEIPT does not support dimensions");
  }
  if (hasValue(raw.items) && !processor.supports_items) {
    throw new BusinessRuleError("AR_RECEIPT does not support items");
  }
}

async function getCounterparty(db: DbExecutor, companyId: number, code: string): Promise<CounterpartyRow | null> {
  return new ArReceiptPostingRepo(db).getCounterparty(companyId, code);
}

async function upsertCounterparty(db: DbExecutor, companyId: number, input: NonNullable<ArReceiptRequestDto["ar_counterparty"]>): Promise<CounterpartyRow & { was_created: boolean }> {
  return new ArReceiptPostingRepo(db).upsertCounterparty(companyId, input);
}

async function getPeriod(db: DbExecutor, companyId: number, postingDate: string): Promise<PeriodRow | null> {
  return new ArReceiptPostingRepo(db).getPeriod(companyId, postingDate);
}

async function getCashAccount(db: DbExecutor, companyId: number, code: string | null | undefined): Promise<(AccountRow & { code: string }) | null> {
  return new ArReceiptPostingRepo(db).getCashAccount(companyId, code, AR_RECEIPT_ENGINE_CODE, CASH_POSTING_CODE);
}

async function getControlAccount(db: DbExecutor, companyId: number, code: typeof AR_RECEIVABLE_CONTROL_CODE | typeof AR_UNAPPLIED_CASH_CONTROL_CODE): Promise<AccountRow | null> {
  return new ArReceiptPostingRepo(db).getControlAccount(companyId, code);
}

async function findOpenInvoice(db: DbExecutor, companyId: number, counterpartyId: number, documentId: string): Promise<OpenItemRow | null> {
  return new ArReceiptPostingRepo(db).findOpenInvoice(companyId, counterpartyId, documentId, AR_RECEIVABLE_CONTROL_CODE);
}

async function resolveContext(db: DbExecutor, request: ResolvedArReceiptRequestDto, preview: boolean, reservedJournalHeaderId: number | null): Promise<Context> {
  const company = await getCompany(db, request.company_code ?? "");
  if (!company) throw new BusinessRuleError(`Company ${request.company_code ?? ""} was not found`);
  if (company.status !== "ACTIVE") throw new BusinessRuleError(`Company ${company.code} is not ACTIVE`);
  const documentProcessor = await getDocumentProcessor(db);
  if (!documentProcessor || documentProcessor.status !== "ACTIVE") throw new BusinessRuleError(`${AR_RECEIPT_ENGINE_CODE} document processor is not active`);
  assertDocumentCapabilities(documentProcessor, request);

  let counterparty: CounterpartyRow;
  let counterpartyWasCreated = false;
  if (request.ar_counterparty_code) {
    const existing = await getCounterparty(db, company.id, request.ar_counterparty_code);
    if (!existing) throw new BusinessRuleError(`AR counterparty ${request.ar_counterparty_code} was not found`);
    counterparty = existing;
  } else if (request.ar_counterparty) {
    if (preview) {
      counterparty = {
        id: 0,
        finance_organization_id: company.id,
        code: request.ar_counterparty.code ?? "",
        name: request.ar_counterparty.name,
        status: request.ar_counterparty.status,
        country_code: request.ar_counterparty.country_code,
        tax_region_or_province: request.ar_counterparty.state_or_province_code ?? null,
        country_currency_code: company.base_currency_code,
      };
      counterpartyWasCreated = true;
    } else {
      const upserted = await upsertCounterparty(db, company.id, request.ar_counterparty);
      counterparty = upserted;
      counterpartyWasCreated = upserted.was_created;
    }
  } else {
    throw new InputValidationError("AR counterparty is required");
  }
  if (counterparty.status !== "ACTIVE") throw new BusinessRuleError(`AR counterparty ${counterparty.code} is not ACTIVE`);

  const postingDate = postingDateFor(request);
  const settingsCompanyId = await resolveEffectiveSettingsCompanyId(company.id);
  const [period, cashAccount, arAccount, unappliedAccount] = await Promise.all([
    getPeriod(db, company.id, postingDate),
    getCashAccount(db, settingsCompanyId, request.bank_cash_account_code),
    getControlAccount(db, settingsCompanyId, AR_RECEIVABLE_CONTROL_CODE),
    getControlAccount(db, settingsCompanyId, AR_UNAPPLIED_CASH_CONTROL_CODE),
  ]);
  if (!period) throw new BusinessRuleError(`No OPEN fiscal period contains posting date ${postingDate}`);
  if (!cashAccount) throw new BusinessRuleError(`${CASH_POSTING_CODE_SLOT} ${request.bank_cash_account_code ?? CASH_POSTING_CODE} is not active`);
  if (!arAccount) throw new BusinessRuleError(`${AR_RECEIVABLE_CONTROL_CODE} control account is not configured`);
  if (!unappliedAccount) throw new BusinessRuleError(`${AR_UNAPPLIED_CASH_CONTROL_CODE} control account is not configured`);
  const bankCashDetails = await resolveBankCashDetails(company.id, company.base_currency_code, request.bank_cash_details);
  if (bankCashDetails && bankCashDetails.gl_account_id !== cashAccount.gl_account_id) {
    throw new BusinessRuleError(`bank_cash_details.code ${bankCashDetails.code} GL account does not match bank_cash_account_code ${cashAccount.bank_cash_control_account_code ?? cashAccount.code}`);
  }

  const allocations: ArReceiptDetailedAllocationDto[] = [];
  for (let i = 0; i < (request.allocations ?? []).length; i++) {
    const allocation = request.allocations![i];
    const invoice = await findOpenInvoice(db, company.id, counterparty.id, allocation.document_id ?? "");
    if (!invoice) throw new BusinessRuleError(`allocations[${i}].document_id ${allocation.document_id} was not found`);
    if (invoice.open_amount <= 0) throw new BusinessRuleError(`allocations[${i}] invoice ${invoice.journal_code} has no open balance`);
    const applied = round2(Math.min(allocation.amount, invoice.open_amount));
    allocations.push({
      invoice_document_id: invoice.document_id,
      invoice_journal_code: invoice.journal_code,
      invoice_ar_subledger_entry_code: invoice.ar_subledger_entry_code,
      invoice_ar_subledger_entry_id: invoice.ar_subledger_entry_id,
      invoice_open_amount_before: invoice.open_amount,
      requested_amount: allocation.amount,
      applied_amount: applied,
      surplus_to_unapplied_amount: round2(allocation.amount - applied),
      invoice_open_amount_after: round2(invoice.open_amount - applied),
    });
  }

  const requestedTotal = round2((request.allocations ?? []).reduce((sum, allocation) => sum + allocation.amount, 0));
  const receiptAmount = round2(request.receipt_amount ?? requestedTotal);
  if (receiptAmount <= 0) throw new InputValidationError("receipt_amount must be greater than zero");
  if (receiptAmount < requestedTotal) throw new InputValidationError("receipt_amount is less than the sum of allocation amounts");
  const appliedAmount = round2(allocations.reduce((sum, allocation) => sum + allocation.applied_amount, 0));
  const unappliedAmount = round2(receiptAmount - appliedAmount);

  return {
    request,
    company,
    counterparty,
    counterpartyWasCreated,
    period,
    cashAccount,
    arAccount,
    unappliedAccount,
    bankCashDetails,
    reservedJournalHeaderId,
    detailed: {
      company: { code: company.code, base_currency_code: company.base_currency_code },
      ar_counterparty: {
        code: counterparty.code,
        name: counterparty.name,
        status: counterparty.status,
        country_code: counterparty.country_code,
        tax_region_or_province: counterparty.tax_region_or_province,
      },
      document_id: request.document_id,
      memo: request.memo ?? null,
      generated_description: `Customer Receipt ${request.document_id}`,
      payment_date: request.payment_date,
      posting_date: postingDate,
      bank_cash_account_code: cashAccount.bank_cash_control_account_code ?? "",
      bank_cash_details: bankCashDetails,
      receipt_amount: receiptAmount,
      allocations,
      applied_amount: appliedAmount,
      unapplied_amount: unappliedAmount,
    },
  };
}

function buildJournalLines(context: Context): GeneratedLine[] {
  const lines: GeneratedLine[] = [{
    line_number: 1,
    gl_account_id: context.cashAccount.gl_account_id,
    gl_account_code: context.cashAccount.gl_account_code,
    gl_account_name: context.cashAccount.gl_account_name,
    source_ledger: "BANK_CASH",
    source_control_account: context.cashAccount.bank_cash_control_account_code ?? context.cashAccount.code,
    description: context.detailed.generated_description,
    memo: context.detailed.memo,
    dr_cr: "DR",
    base_currency_amount: context.detailed.receipt_amount,
  }];
  if (context.detailed.applied_amount > 0) {
    lines.push({
      line_number: lines.length + 1,
      gl_account_id: context.arAccount.gl_account_id,
      gl_account_code: context.arAccount.gl_account_code,
      gl_account_name: context.arAccount.gl_account_name,
      source_ledger: "ACCOUNTS_RECEIVABLE",
      source_control_account: AR_RECEIVABLE_CONTROL_CODE,
      description: context.detailed.generated_description,
      memo: context.detailed.memo,
      dr_cr: "CR",
      base_currency_amount: context.detailed.applied_amount,
    });
  }
  if (context.detailed.unapplied_amount > 0) {
    lines.push({
      line_number: lines.length + 1,
      gl_account_id: context.unappliedAccount.gl_account_id,
      gl_account_code: context.unappliedAccount.gl_account_code,
      gl_account_name: context.unappliedAccount.gl_account_name,
      source_ledger: "ACCOUNTS_RECEIVABLE",
      source_control_account: AR_UNAPPLIED_CASH_CONTROL_CODE,
      description: context.detailed.generated_description,
      memo: context.detailed.memo,
      dr_cr: "CR",
      base_currency_amount: context.detailed.unapplied_amount,
    });
  }
  return lines;
}

function postingDetails(context: Context, journalLines = buildJournalLines(context), header?: JournalHeaderRow, rows?: JournalLineRow[]): ArReceiptPostingDetailsDto {
  return {
    journal_header: {
      id: header?.id ?? null,
      code: header?.code ?? null,
      document_type_code: AR_RECEIPT_ENGINE_CODE,
      document_id: context.detailed.document_id,
      generated_description: context.detailed.generated_description,
      posting_engine_code: AR_RECEIPT_ENGINE_CODE,
      company_code: context.company.code,
      document_date: context.detailed.payment_date,
      posting_date: context.detailed.posting_date,
      financial_year_code: context.period.financial_year_code,
      financial_period_code: context.period.financial_period_code,
      base_currency_code: context.company.base_currency_code,
      total_debit_base_amount: header?.total_debit_base_amount ?? context.detailed.receipt_amount,
      total_credit_base_amount: header?.total_credit_base_amount ?? context.detailed.receipt_amount,
      memo: context.detailed.memo,
      status: header ? "POSTED" : "EPHEMERAL",
    },
    journal_lines: (rows ?? journalLines).map((line) => ({
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
      memo: line.memo,
    })),
  };
}

function previewArDetails(context: Context): ArReceiptArSubledgerDetailDto[] {
  const details: ArReceiptArSubledgerDetailDto[] = [];
  for (const allocation of context.detailed.allocations) {
    if (allocation.applied_amount <= 0) continue;
    details.push(arDetail(context, null, null, AR_RECEIVABLE_CONTROL_CODE, allocation.invoice_ar_subledger_entry_id, allocation.applied_amount));
  }
  if (context.detailed.unapplied_amount > 0) {
    details.push(arDetail(context, null, null, AR_UNAPPLIED_CASH_CONTROL_CODE, null, context.detailed.unapplied_amount));
  }
  return details;
}

function arDetail(
  context: Context,
  id: number | null,
  code: string | null,
  control: typeof AR_RECEIVABLE_CONTROL_CODE | typeof AR_UNAPPLIED_CASH_CONTROL_CODE,
  appliedTo: number | null,
  amount: number,
): ArReceiptArSubledgerDetailDto {
  return {
    id,
    code,
    company_code: context.company.code,
    journal_header_id: null,
    ar_counterparty_code: context.counterparty.code,
    control_account_code: control,
    applied_to_ar_subledger_entry_id: appliedTo,
    posting_date: context.detailed.posting_date,
    financial_year_code: context.period.financial_year_code,
    financial_period_code: context.period.financial_period_code,
    base_currency_code: context.company.base_currency_code,
    entry_type: "CREDIT",
    base_currency_amount: amount,
    memo: context.detailed.memo,
    status: id == null ? "EPHEMERAL" : "POSTED",
  };
}

async function insertArEntry(
  db: DbExecutor,
  context: Context,
  arHeaderId: number,
  codePrefix: string,
  sequence: number,
  control: typeof AR_RECEIVABLE_CONTROL_CODE | typeof AR_UNAPPLIED_CASH_CONTROL_CODE,
  appliedTo: number | null,
  amount: number,
  description: string,
) {
  const id = await new ArReceiptPostingRepo(db).insertEntryLine({
    headerId: arHeaderId,
    sequence,
    lineType: control === AR_RECEIVABLE_CONTROL_CODE ? "RECEIPT_ALLOCATION" : "RECEIPT_UNAPPLIED",
    description,
    control,
    amount,
    appliedTo,
    memo: context.detailed.memo,
  });
  return { id, code: `${codePrefix}-${sequence}` };
}

async function insertArHeader(db: DbExecutor, context: Context, journalHeaderId: number): Promise<{ id: number; code: string }> {
  const code = `AR-RCT-${journalHeaderId}`;
  const id = await new ArReceiptPostingRepo(db).insertHeader({
    code,
    companyId: context.company.id,
    journalHeaderId,
    counterpartyId: context.counterparty.id,
    documentType: AR_RECEIPT_ENGINE_CODE,
    documentId: context.detailed.document_id,
    description: context.detailed.generated_description,
    memo: context.detailed.memo,
    documentDate: context.detailed.payment_date,
    postingDate: context.detailed.posting_date,
    financialYearId: context.period.financial_year_id,
    financialPeriodId: context.period.financial_period_id,
    baseCurrencyCode: context.company.base_currency_code,
  });
  return { id, code };
}

function hasDocumentId(request: ArReceiptRequestDto): request is ResolvedArReceiptRequestDto {
  return typeof request.document_id === "string" && request.document_id.trim().length > 0;
}

function withDocumentId(request: ArReceiptRequestDto, journalHeaderId: number): ResolvedArReceiptRequestDto {
  if (hasDocumentId(request)) return request;
  return { ...request, document_id: `RCT-${journalHeaderId}` };
}

async function processArReceiptUnchecked(input: ArReceiptRequestDto, options: ProcessOptions = {}): Promise<ArReceiptPostingResponseDto> {
  validateRequest(input);
  const rawRequest: ArReceiptRequestDto = input;
  const repo = new JournalRepo(getDb());
  let reservedJournalHeaderId: number | null = null;
  let request: ResolvedArReceiptRequestDto;
  if (hasDocumentId(rawRequest)) {
    request = rawRequest;
  } else {
    reservedJournalHeaderId = await repo.reserveHeaderId();
    request = withDocumentId(rawRequest, reservedJournalHeaderId);
  }
  const context = await resolveContext(getDb(), request, Boolean(options.preview), reservedJournalHeaderId);
  const journalLines = buildJournalLines(context);

  if (options.preview) {
    return {
      detailed_document: context.detailed,
      ar_subledger_details: previewArDetails(context),
      posting_details: postingDetails(context, journalLines),
    };
  }

  return withTransaction(async (client) => {
    const txContext = request.ar_counterparty ? await resolveContext(client, request, false, reservedJournalHeaderId) : context;
    const journalRepo = new JournalRepo(client);
    const header = await journalRepo.insert({
      id: txContext.reservedJournalHeaderId ?? undefined,
      finance_organization_id: txContext.company.id,
      company_code: txContext.company.code,
      company_name: txContext.company.name,
      document_type_code: AR_RECEIPT_ENGINE_CODE,
      document_type_label: AR_RECEIPT_DOCUMENT_LABEL,
      document_id: txContext.detailed.document_id,
      description: txContext.detailed.generated_description,
      document_snapshot_json: request,
      detailed_document_snapshot_json: txContext.detailed,
      posting_engine_code: AR_RECEIPT_ENGINE_CODE,
      document_date: txContext.detailed.payment_date,
      posting_date: txContext.detailed.posting_date,
      financial_year_id: txContext.period.financial_year_id,
      financial_year_code: txContext.period.financial_year_code,
      financial_period_id: txContext.period.financial_period_id,
      financial_period_code: txContext.period.financial_period_code,
      base_currency_code: txContext.company.base_currency_code,
      memo: txContext.detailed.memo,
      ...toJournalBankCashFields(txContext.bankCashDetails),
    });
    const insertedLines: JournalLineRow[] = [];
    for (const line of buildJournalLines(txContext)) insertedLines.push(await journalRepo.insertLine({ journal_header_id: header.id, ...line }));
    const posted = await journalRepo.setPosted(header.id, txContext.detailed.receipt_amount, txContext.detailed.receipt_amount);
    const arHeader = await insertArHeader(client, txContext, header.id);
    const arRows: ArReceiptArSubledgerDetailDto[] = [];
    let sequence = 1;
    for (const allocation of txContext.detailed.allocations) {
      if (allocation.applied_amount <= 0) continue;
      const row = await insertArEntry(
        client,
        txContext,
        arHeader.id,
        arHeader.code,
        sequence++,
        AR_RECEIVABLE_CONTROL_CODE,
        allocation.invoice_ar_subledger_entry_id,
        allocation.applied_amount,
        `Receipt allocation to ${allocation.invoice_document_id}`,
      );
      arRows.push({ ...arDetail(txContext, row.id, row.code, AR_RECEIVABLE_CONTROL_CODE, allocation.invoice_ar_subledger_entry_id, allocation.applied_amount), journal_header_id: header.id });
    }
    if (txContext.detailed.unapplied_amount > 0) {
      const row = await insertArEntry(client, txContext, arHeader.id, arHeader.code, sequence, AR_UNAPPLIED_CASH_CONTROL_CODE, null, txContext.detailed.unapplied_amount, "Unapplied receipt");
      arRows.push({ ...arDetail(txContext, row.id, row.code, AR_UNAPPLIED_CASH_CONTROL_CODE, null, txContext.detailed.unapplied_amount), journal_header_id: header.id });
    }
    return {
      detailed_document: txContext.detailed,
      ar_subledger_details: arRows,
      posting_details: postingDetails(txContext, buildJournalLines(txContext), posted, insertedLines),
    };
  });
}

export const processArReceipt = processArReceiptUnchecked;
