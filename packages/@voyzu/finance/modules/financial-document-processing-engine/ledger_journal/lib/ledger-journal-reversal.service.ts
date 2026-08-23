import { getDb, withTransaction, type DbExecutor } from "@voyzu/capability/db";
import { BusinessRuleError, InputValidationError } from "@voyzu/capability/errors";
import type { DrCr } from "@voyzu/finance/types/modules/core";
import type { BankCashJournalDetailsDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/bank-cash-details.dto";
import type { LedgerJournalReversalRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ledger-journal-reversal.request.dto";
import type {
  LedgerJournalReversalDetailedDocumentDto,
  LedgerJournalReversalPostingResponseDto,
} from "@voyzu/finance/types/modules/financial-document-processing-engine/ledger-journal-reversal.response.dto";
import type {
  LedgerJournalJournalLineDto,
  LedgerJournalPostingDetailsDto,
} from "@voyzu/finance/types/modules/financial-document-processing-engine/ledger-journal.response.dto";

import { resolveBankCashDetails, toJournalBankCashFields } from "../../../common/bank-cash-accounts/server/lib/bank-cash-account.service";
import { JournalRepo } from "../../../journals/server/db/journal.repo";
import type { JournalHeaderRow, JournalLineRow } from "../../../journals/server/db/journal.row.types";
import { LedgerJournalPostingRepo } from "../db/ledger-journal-posting.repo";
import type { SourceJournalHeaderRow } from "../db/ledger-journal-posting.row.types";
import {
  validateReversalData,
  validateReversalRequest,
  type LedgerJournalReversalDataValidationContext,
} from "./ledger-journal-reversal.validator";
import {
  LEDGER_JOURNAL_REVERSAL_DOCUMENT_LABEL,
  LEDGER_JOURNAL_REVERSAL_ENGINE_CODE,
  type LedgerJournalPostingLine,
} from "./ledger-journal.types";

export interface ProcessLedgerJournalReversalOptions {
  preview?: boolean;
}

type LedgerJournalReversalRequestWithDocumentId = LedgerJournalReversalRequestDto & { document_id: string };
type LedgerJournalReversalResolvedRequest = LedgerJournalReversalRequestWithDocumentId & {
  document_type: "LEDGER_JOURNAL_REVERSAL";
  posting_date: string;
};

interface ResolvedContext {
  request: LedgerJournalReversalResolvedRequest;
  data: LedgerJournalReversalDataValidationContext;
  sourceLines: JournalLineRow[];
  sourceLineDimensions: Map<number, Awaited<ReturnType<JournalRepo["listLineDimensions"]>>>;
  detailedDocument: LedgerJournalReversalDetailedDocumentDto;
  bankCashDetails: BankCashJournalDetailsDto | null;
  generated: {
    journalLines: LedgerJournalPostingLine[];
    totalDebitBaseAmount: number;
    totalCreditBaseAmount: number;
  };
}

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

async function loadSourceLineDimensions(repo: JournalRepo, lines: JournalLineRow[]): Promise<Map<number, Awaited<ReturnType<JournalRepo["listLineDimensions"]>>>> {
  const map = new Map<number, Awaited<ReturnType<JournalRepo["listLineDimensions"]>>>();
  for (const line of lines) {
    map.set(line.id, await repo.listLineDimensions(line.id));
  }
  return map;
}

function invertedDrCr(value: string): DrCr {
  if (value === "DR") return "CR";
  if (value === "CR") return "DR";
  throw new InputValidationError(`Unexpected journal line dr_cr value ${value}`);
}

function buildJournalLines(
  sourceLines: JournalLineRow[],
  dimensionsByLineId: Map<number, Awaited<ReturnType<JournalRepo["listLineDimensions"]>>>,
): LedgerJournalPostingLine[] {
  return sourceLines.map((line) => ({
    line_number: line.line_number,
    gl_account_id: line.gl_account_id,
    gl_account_code: line.gl_account_code,
    gl_account_name: line.gl_account_name,
    source_ledger: line.source_ledger,
    source_control_account: line.source_control_account,
    description: line.description,
    memo: line.memo,
    dr_cr: invertedDrCr(line.dr_cr),
    base_currency_amount: line.base_currency_amount,
    dimensions: (dimensionsByLineId.get(line.id) ?? []).map((dimension) => ({
      dimension_id: dimension.dimension_id,
      dimension_value_id: dimension.dimension_value_id,
      dimension_code: dimension.dimension_code,
      dimension_name: dimension.dimension_name,
      dimension_value_name: dimension.dimension_value_name,
    })),
  }));
}

function lineDto(line: LedgerJournalPostingLine, inserted?: JournalLineRow | null): LedgerJournalJournalLineDto {
  return {
    id: inserted?.id ?? null,
    journal_header_id: inserted?.journal_header_id ?? null,
    line_number: line.line_number,
    gl_account_code: line.gl_account_code,
    gl_account_name: line.gl_account_name,
    source_ledger: inserted?.source_ledger ?? line.source_ledger ?? null,
    source_control_account: inserted?.source_control_account ?? line.source_control_account ?? null,
    dr_cr: line.dr_cr as DrCr,
    base_currency_amount: line.base_currency_amount,
    description: line.description,
    document_memo: line.memo ?? null,
    dimensions: (line.dimensions ?? []).map((dimension) => ({
      dimension_code: dimension.dimension_code,
      dimension_name: dimension.dimension_name,
      dimension_value_name: dimension.dimension_value_name,
    })),
  };
}

function buildDetailedDocument(
  request: LedgerJournalReversalResolvedRequest,
  sourceJournal: SourceJournalHeaderRow,
  context: LedgerJournalReversalDataValidationContext,
  journalLines: LedgerJournalPostingLine[],
  bankCashDetails: BankCashJournalDetailsDto | null,
): LedgerJournalReversalDetailedDocumentDto {
  const totalDebitBaseAmount = round2(journalLines.filter((line) => line.dr_cr === "DR").reduce((sum, line) => sum + line.base_currency_amount, 0));
  const totalCreditBaseAmount = round2(journalLines.filter((line) => line.dr_cr === "CR").reduce((sum, line) => sum + line.base_currency_amount, 0));
  return {
    company: {
      code: context.company!.code,
      base_currency_code: context.company!.base_currency_code,
    },
    document_id: request.document_id,
    document_memo: request.document_memo ?? null,
    bank_cash_details: bankCashDetails,
    generated_description: `${LEDGER_JOURNAL_REVERSAL_DOCUMENT_LABEL} ${request.document_id}`,
    source_journal_code: sourceJournal.code,
    source_document_id: sourceJournal.document_id,
    posting_date: request.posting_date,
    lines: journalLines.map((line) => lineDto(line)),
    total_debit_base_amount: totalDebitBaseAmount,
    total_credit_base_amount: totalCreditBaseAmount,
  };
}

async function resolveReversalBankCashDetails(
  request: LedgerJournalReversalRequestDto,
  context: LedgerJournalReversalDataValidationContext,
  journalLines: LedgerJournalPostingLine[],
): Promise<BankCashJournalDetailsDto | null> {
  if (!request.bank_cash_details) return null;
  if (!context.documentProcessor?.cash_movement) throw new BusinessRuleError("LEDGER_JOURNAL_REVERSAL does not support bank_cash_details");
  const bankLines = journalLines.filter((line) => line.source_ledger === "BANK_CASH");
  if (bankLines.length === 0) throw new InputValidationError("bank_cash_details requires the source journal to include a BANK_CASH linked GL account");
  const details = await resolveBankCashDetails(context.company!.id, context.company!.base_currency_code, request.bank_cash_details);
  if (!bankLines.some((line) => line.source_control_account === details?.code || line.gl_account_code === details?.gl_account_code)) {
    throw new BusinessRuleError(`bank_cash_details.code ${details?.code} does not match a BANK_CASH linked GL account in the source journal`);
  }
  return details;
}

async function resolveContext(db: DbExecutor, input: LedgerJournalReversalRequestWithDocumentId): Promise<ResolvedContext> {
  const repo = new LedgerJournalPostingRepo(db);
  const journalRepo = new JournalRepo(db);
  const company = await repo.getCompanyByCode(input.company_code);
  if (company && company.status !== "ACTIVE") throw new BusinessRuleError(`Company ${company.code} is not ACTIVE`);
  const sourceJournal = company ? await repo.getSourceJournal(company.id, input.source_journal_code) : null;
  const postingDate = input.posting_date ?? sourceJournal?.posting_date ?? "";
  const documentProcessor = company ? await repo.getDocumentProcessorByCode("LEDGER_JOURNAL_REVERSAL") : null;
  const fiscalPeriod = company && postingDate ? await repo.getOpenFiscalPeriod(company.id, postingDate) : null;
  const sourceLines = sourceJournal ? await journalRepo.listLines(sourceJournal.id) : [];
  const sourceLineDimensions = await loadSourceLineDimensions(journalRepo, sourceLines);
  const data: LedgerJournalReversalDataValidationContext = { company, documentProcessor, sourceJournal, fiscalPeriod };
  validateReversalData(data);
  if (!sourceJournal) throw new BusinessRuleError("Source journal was not found");

  const request: LedgerJournalReversalResolvedRequest = {
    ...input,
    document_type: "LEDGER_JOURNAL_REVERSAL",
    posting_date: postingDate,
  };
  const journalLines = buildJournalLines(sourceLines, sourceLineDimensions);
  const bankCashDetails = await resolveReversalBankCashDetails(request, data, journalLines);
  const totalDebitBaseAmount = round2(journalLines.filter((line) => line.dr_cr === "DR").reduce((sum, line) => sum + line.base_currency_amount, 0));
  const totalCreditBaseAmount = round2(journalLines.filter((line) => line.dr_cr === "CR").reduce((sum, line) => sum + line.base_currency_amount, 0));
  const detailedDocument = buildDetailedDocument(request, sourceJournal, data, journalLines, bankCashDetails);
  return {
    request,
    data,
    sourceLines,
    sourceLineDimensions,
    detailedDocument,
    bankCashDetails,
    generated: { journalLines, totalDebitBaseAmount, totalCreditBaseAmount },
  };
}

function postingDetails(context: ResolvedContext, postedJournal?: JournalHeaderRow | null, insertedLines: JournalLineRow[] = []): LedgerJournalPostingDetailsDto {
  return {
    journal_header: {
      id: postedJournal?.id ?? null,
      code: postedJournal?.code ?? null,
      document_type_code: LEDGER_JOURNAL_REVERSAL_ENGINE_CODE,
      document_id: context.detailedDocument.document_id,
      generated_description: context.detailedDocument.generated_description,
      posting_engine_code: LEDGER_JOURNAL_REVERSAL_ENGINE_CODE,
      company_code: context.data.company!.code,
      document_date: context.detailedDocument.posting_date,
      posting_date: context.detailedDocument.posting_date,
      financial_year_code: context.data.fiscalPeriod!.financial_year_code,
      financial_period_code: context.data.fiscalPeriod!.financial_period_code,
      base_currency_code: context.data.company!.base_currency_code,
      total_debit_base_amount: context.generated.totalDebitBaseAmount,
      total_credit_base_amount: context.generated.totalCreditBaseAmount,
      document_memo: context.detailedDocument.document_memo,
      status: postedJournal ? "POSTED" : "EPHEMERAL",
    },
    journal_lines: context.generated.journalLines.map((line, index) => lineDto(line, insertedLines[index])),
  };
}

async function processLedgerJournalReversalUnchecked(
  input: LedgerJournalReversalRequestDto,
  options: ProcessLedgerJournalReversalOptions = {},
): Promise<LedgerJournalReversalPostingResponseDto> {
  validateReversalRequest(input);
  const rawRequest = input;
  let reservedJournalHeaderId: number | null = null;
  let request: LedgerJournalReversalRequestWithDocumentId;
  if (rawRequest.document_id) {
    request = rawRequest as LedgerJournalReversalRequestWithDocumentId;
  } else {
    reservedJournalHeaderId = await new JournalRepo(getDb()).reserveHeaderId();
    request = { ...rawRequest, document_id: `GLJR-${reservedJournalHeaderId}` };
  }
  const context = await resolveContext(getDb(), request);

  if (options.preview) {
    return {
      detailed_document: context.detailedDocument,
      posting_details: postingDetails(context),
    };
  }

  return withTransaction(async (client) => {
    const journalRepo = new JournalRepo(client);
    const txContext = await resolveContext(client, request);
    if (!txContext.data.sourceJournal) throw new BusinessRuleError("Source journal was not found");

    const header = await journalRepo.insert({
      id: reservedJournalHeaderId ?? undefined,
      finance_organization_id: txContext.data.company!.id,
      company_code: txContext.data.company!.code,
      company_name: txContext.data.company!.name,
      document_type_code: LEDGER_JOURNAL_REVERSAL_ENGINE_CODE,
      document_type_label: LEDGER_JOURNAL_REVERSAL_DOCUMENT_LABEL,
      document_id: txContext.detailedDocument.document_id,
      description: txContext.detailedDocument.generated_description,
      document_snapshot_json: txContext.request,
      detailed_document_snapshot_json: txContext.detailedDocument,
      posting_engine_code: LEDGER_JOURNAL_REVERSAL_ENGINE_CODE,
      document_date: txContext.detailedDocument.posting_date,
      posting_date: txContext.detailedDocument.posting_date,
      financial_year_id: txContext.data.fiscalPeriod!.financial_year_id,
      financial_year_code: txContext.data.fiscalPeriod!.financial_year_code,
      financial_period_id: txContext.data.fiscalPeriod!.financial_period_id,
      financial_period_code: txContext.data.fiscalPeriod!.financial_period_code,
      base_currency_code: txContext.data.company!.base_currency_code,
      memo: txContext.detailedDocument.document_memo,
      reversal_of_journal_id: txContext.data.sourceJournal.id,
      ...toJournalBankCashFields(txContext.bankCashDetails),
    });

    const insertedLines: JournalLineRow[] = [];
    for (const line of txContext.generated.journalLines) {
      const inserted = await journalRepo.insertLine({ journal_header_id: header.id, ...line });
      insertedLines.push(inserted);
      for (const dimension of line.dimensions ?? []) {
        await journalRepo.insertLineDimension({
          journal_line_id: inserted.id,
          ...dimension,
        });
      }
    }

    const posted = await journalRepo.setPosted(header.id, txContext.generated.totalDebitBaseAmount, txContext.generated.totalCreditBaseAmount);
    await journalRepo.setReversedBy(txContext.data.sourceJournal.id, header.id);

    return {
      detailed_document: txContext.detailedDocument,
      posting_details: postingDetails(txContext, posted, insertedLines),
    };
  });
}

export const processLedgerJournalReversal = processLedgerJournalReversalUnchecked;
