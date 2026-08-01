import type { LedgerJournalReversalRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ledger-journal-reversal.request.dto";
import { InputValidationError } from "@voyzu/capability/errors";

import type {
  CompanyPostingContextRow,
  DocumentProcessorValidationRow,
  FiscalPostingPeriodRow,
  SourceJournalHeaderRow,
} from "../db/ledger-journal-posting.row.types";
import { LEDGER_JOURNAL_ENGINE_CODE } from "./ledger-journal.types";

type FieldValidator<T> = (value: T) => string | null;

function createRequestValidator() {
  return {
    document_type: (_value) => null,
    company_code: (_value) => null,
    document_id: (_value) => null,
    document_memo: (_value) => null,
    bank_cash_details: (_value) => null,
    source_journal_code: (_value) => null,
    posting_date: (_value) => null,
  } satisfies {
    [K in keyof LedgerJournalReversalRequestDto]-?: FieldValidator<LedgerJournalReversalRequestDto[K]>;
  };
}

const ROOT_KEYS = new Set([
  "document_type",
  "company_code",
  "document_id",
  "document_memo",
  "bank_cash_details",
  "source_journal_code",
  "posting_date",
]);

export interface LedgerJournalReversalDataValidationContext {
  company: CompanyPostingContextRow | null;
  documentProcessor: DocumentProcessorValidationRow | null;
  sourceJournal: SourceJournalHeaderRow | null;
  fiscalPeriod: FiscalPostingPeriodRow | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateDate(value: unknown, label: string): string | null {
  if (value == null) return null;
  if (typeof value !== "string" || value.trim().length === 0) return `${label} must be a non-empty string`;
  const d = new Date(value);
  if (isNaN(d.getTime())) return `${label} is not a valid date`;
  return null;
}

export function validateReversalRequest(input: unknown): asserts input is LedgerJournalReversalRequestDto {
  createRequestValidator();
  const errors: string[] = [];
  if (!isRecord(input)) throw new InputValidationError("Request body must be an object");

  for (const key of Object.keys(input)) {
    if (!ROOT_KEYS.has(key)) errors.push(`$.${key} is not allowed`);
  }

  if (input.document_type !== undefined && input.document_type !== "LEDGER_JOURNAL_REVERSAL") {
    errors.push("document_type must be LEDGER_JOURNAL_REVERSAL");
  }
  if (typeof input.company_code !== "string" || input.company_code.trim().length === 0) errors.push("company_code is required");
  if (input.document_id != null && (typeof input.document_id !== "string" || input.document_id.trim().length === 0)) errors.push("document_id must be a non-empty string");
  if (input.document_memo != null && typeof input.document_memo !== "string") errors.push("document_memo must be a string");
  if (input.bank_cash_details != null && !isRecord(input.bank_cash_details)) errors.push("bank_cash_details must be an object");
  if (typeof input.source_journal_code !== "string" || input.source_journal_code.trim().length === 0) errors.push("source_journal_code is required");
  const dateError = validateDate(input.posting_date, "posting_date");
  if (dateError) errors.push(dateError);

  if (errors.length) throw new InputValidationError(errors.join("; "));
}

export function validateReversalData(context: LedgerJournalReversalDataValidationContext): void {
  const errors: string[] = [];
  if (!context.documentProcessor) {
    errors.push("LEDGER_JOURNAL_REVERSAL document processor is not configured");
  } else if (context.documentProcessor.status !== "ACTIVE") {
    errors.push("LEDGER_JOURNAL_REVERSAL document processor is not ACTIVE");
  }

  if (!context.company) {
    errors.push("Company was not found");
  } else if (context.company.status !== "ACTIVE") {
    errors.push(`Company ${context.company.code} is not ACTIVE`);
  }

  const source = context.sourceJournal;
  if (!source) {
    errors.push("Source journal was not found");
  } else {
    if (source.document_type_code !== LEDGER_JOURNAL_ENGINE_CODE || source.posting_engine_code !== LEDGER_JOURNAL_ENGINE_CODE) {
      errors.push(`Source journal ${source.code} is not a LEDGER_JOURNAL`);
    }
    if (source.status !== "POSTED") errors.push(`Source journal ${source.code} is not POSTED`);
    if (source.reversal_of_journal_id != null) errors.push(`Source journal ${source.code} is itself a reversal`);
    if (source.reversed_by_journal_id != null) errors.push(`Source journal ${source.code} has already been reversed`);
  }

  if (!context.fiscalPeriod) {
    errors.push("No fiscal period found for reversal posting_date");
  } else {
    if (context.fiscalPeriod.financial_year_status !== "OPEN") errors.push(`Financial year ${context.fiscalPeriod.financial_year_code} is not OPEN`);
    if (context.fiscalPeriod.financial_period_status !== "OPEN") errors.push(`Financial period ${context.fiscalPeriod.financial_period_code} is not OPEN`);
  }

  if (errors.length) throw new InputValidationError(errors.join("; "));
}

