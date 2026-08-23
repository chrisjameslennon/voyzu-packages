import type { LedgerJournalRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ledger-journal.request.dto";
import { InputValidationError } from "@voyzu/capability/errors";

import type {
  CompanyPostingContextRow,
  DimensionValueLookupRow,
  DocumentProcessorValidationRow,
  FiscalPostingPeriodRow,
  GlAccountPostingRow,
  ProtectedGlAccountLinkRow,
} from "../db/ledger-journal-posting.row.types";

type FieldValidator<T> = (value: T) => string | null;

function createRequestValidator() {
  return {
    document_type: (_value) => null,
    company_code: (_value) => null,
    document_id: (_value) => null,
    document_memo: (_value) => null,
    bank_cash_details: (_value) => null,
    posting_date: (_value) => null,
    lines: (_value) => null,
  } satisfies {
    [K in keyof LedgerJournalRequestDto]-?: FieldValidator<LedgerJournalRequestDto[K]>;
  };
}

const ROOT_KEYS = new Set([
  "document_type",
  "company_code",
  "document_id",
  "document_memo",
  "bank_cash_details",
  "posting_date",
  "lines",
  "items",
]);

const LINE_KEYS = new Set([
  "line_id",
  "gl_account_code",
  "description",
  "memo",
  "dr_cr",
  "base_currency_amount",
  "dimensions",
  "inventory_item_code",
]);

export interface LedgerJournalDataValidationContext {
  company: CompanyPostingContextRow | null;
  documentProcessor: DocumentProcessorValidationRow | null;
  fiscalPeriod: FiscalPostingPeriodRow | null;
  glAccountsByCode: Map<string, GlAccountPostingRow>;
  protectedLinksByGlCode: Map<string, ProtectedGlAccountLinkRow[]>;
  dimensionValuesByDimensionCodeAndName: Map<string, DimensionValueLookupRow>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateDate(value: unknown, label: string): string | null {
  if (typeof value !== "string" || value.trim().length === 0) return `${label} is required`;
  const d = new Date(value);
  if (isNaN(d.getTime())) return `${label} is not a valid date`;
  return null;
}

function validateDimensions(value: unknown, path: string, errors: string[]): void {
  if (value == null) return;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  for (const [dimensionCode, dimensionValue] of Object.entries(value)) {
    if (dimensionCode.trim().length === 0) errors.push(`${path} contains an empty dimension code`);
    if (typeof dimensionValue !== "string" || dimensionValue.trim().length === 0) {
      errors.push(`${path}.${dimensionCode} must be a non-empty string`);
    }
  }
}

export function validateRequest(input: unknown): asserts input is LedgerJournalRequestDto {
  createRequestValidator();
  const errors: string[] = [];
  if (!isRecord(input)) throw new InputValidationError("Request body must be an object");

  for (const key of Object.keys(input)) {
    if (!ROOT_KEYS.has(key)) errors.push(`$.${key} is not allowed`);
  }

  if (input.document_type !== undefined && input.document_type !== "LEDGER_JOURNAL") {
    errors.push("document_type must be LEDGER_JOURNAL");
  }
  if (typeof input.company_code !== "string" || input.company_code.trim().length === 0) errors.push("company_code is required");
  if (input.document_id != null && (typeof input.document_id !== "string" || input.document_id.trim().length === 0)) errors.push("document_id must be a non-empty string");
  if (input.document_memo != null && typeof input.document_memo !== "string") errors.push("document_memo must be a string");
  if (input.bank_cash_details != null && !isRecord(input.bank_cash_details)) errors.push("bank_cash_details must be an object");
  if (input.items != null) errors.push("LEDGER_JOURNAL does not support items");
  const dateError = validateDate(input.posting_date, "posting_date");
  if (dateError) errors.push(dateError);

  if (!Array.isArray(input.lines) || input.lines.length === 0) {
    errors.push("lines must contain at least one line");
  } else {
    const lineIds = new Set<number>();
    let totalDr = 0;
    let totalCr = 0;
    let hasDr = false;
    let hasCr = false;

    input.lines.forEach((line, index) => {
      const path = `$.lines[${index}]`;
      if (!isRecord(line)) {
        errors.push(`${path} must be an object`);
        return;
      }
      for (const key of Object.keys(line)) {
        if (!LINE_KEYS.has(key)) errors.push(`${path}.${key} is not allowed`);
      }
      if (!Number.isInteger(line.line_id) || Number(line.line_id) <= 0) {
        errors.push(`${path}.line_id must be a positive integer`);
      } else if (lineIds.has(Number(line.line_id))) {
        errors.push(`${path}.line_id is duplicated`);
      } else {
        lineIds.add(Number(line.line_id));
      }
      if (typeof line.gl_account_code !== "string" || line.gl_account_code.trim().length === 0) {
        errors.push(`${path}.gl_account_code is required`);
      }
      if (line.inventory_item_code != null) errors.push("LEDGER_JOURNAL does not support items");
      if (line.description != null && typeof line.description !== "string") errors.push(`${path}.description must be a string`);
      if (line.memo != null && typeof line.memo !== "string") errors.push(`${path}.memo must be a string`);
      if (line.dr_cr !== "DR" && line.dr_cr !== "CR") errors.push(`${path}.dr_cr must be DR or CR`);
      const amount = typeof line.base_currency_amount === "string" || typeof line.base_currency_amount === "number"
        ? Number(line.base_currency_amount)
        : NaN;
      if (!Number.isFinite(amount) || amount <= 0) {
        errors.push(`${path}.base_currency_amount must be a positive number`);
      } else if (line.dr_cr === "DR") {
        totalDr += amount;
        hasDr = true;
      } else if (line.dr_cr === "CR") {
        totalCr += amount;
        hasCr = true;
      }
      validateDimensions(line.dimensions, `${path}.dimensions`, errors);
    });

    if (!hasDr) errors.push("Journal must contain at least one DR line");
    if (!hasCr) errors.push("Journal must contain at least one CR line");
    if (Math.round(totalDr * 100) !== Math.round(totalCr * 100)) {
      errors.push(`Journal is not balanced. DR total: ${totalDr.toFixed(2)}, CR total: ${totalCr.toFixed(2)}`);
    }
  }

  if (errors.length) throw new InputValidationError(errors.join("; "));
}

export function validateData(input: LedgerJournalRequestDto, context: LedgerJournalDataValidationContext): void {
  const errors: string[] = [];
  if (!context.documentProcessor) {
    errors.push("LEDGER_JOURNAL document processor is not configured");
  } else {
    if (context.documentProcessor.status !== "ACTIVE") errors.push("LEDGER_JOURNAL document processor is not ACTIVE");
    if (!context.documentProcessor.supports_dimensions && input.lines.some((line) => Object.keys(line.dimensions ?? {}).length > 0)) {
      errors.push("LEDGER_JOURNAL does not support dimensions");
    }
  }

  if (!context.company) {
    errors.push(`Company ${input.company_code} was not found`);
  } else if (context.company.status !== "ACTIVE") {
    errors.push(`Company ${input.company_code} is not ACTIVE`);
  }

  if (!context.fiscalPeriod) {
    errors.push(`No fiscal period found for posting_date ${input.posting_date}`);
  } else {
    if (context.fiscalPeriod.financial_year_status !== "OPEN") errors.push(`Financial year ${context.fiscalPeriod.financial_year_code} is not OPEN`);
    if (context.fiscalPeriod.financial_period_status !== "OPEN") errors.push(`Financial period ${context.fiscalPeriod.financial_period_code} is not OPEN`);
  }

  for (const line of input.lines) {
    const account = context.glAccountsByCode.get(line.gl_account_code);
    if (!account) {
      errors.push(`GL account ${line.gl_account_code} was not found`);
      continue;
    }
    if (account.status !== "ACTIVE") errors.push(`GL account ${line.gl_account_code} is not ACTIVE`);
    const protectedLinks = context.protectedLinksByGlCode.get(line.gl_account_code) ?? [];
    for (const link of protectedLinks) {
      if (link.source !== "BANK_CASH") {
        errors.push(`GL account ${line.gl_account_code} cannot be posted directly because it is linked to ${link.source} ${link.source_code} (${link.source_status})`);
      }
    }
  }

  for (const line of input.lines) {
    for (const [dimensionCode, valueName] of Object.entries(line.dimensions ?? {})) {
      const dimension = context.dimensionValuesByDimensionCodeAndName.get(`${dimensionCode}\u0000${valueName}`);
      if (!dimension) {
        errors.push(`Dimension value ${dimensionCode}=${valueName} was not found`);
        continue;
      }
      if (dimension.dimension_status !== "ACTIVE") errors.push(`Dimension ${dimensionCode} is not ACTIVE`);
      if (dimension.dimension_value_status !== "ACTIVE") errors.push(`Dimension value ${dimensionCode}=${valueName} is not ACTIVE`);
    }
  }

  if (errors.length) throw new InputValidationError(errors.join("; "));
}

