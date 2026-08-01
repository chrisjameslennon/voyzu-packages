import type { ArReceiptApplicationRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ar-receipt-application.request.dto";
import { InputValidationError } from "@voyzu/capability/errors";

const BUSINESS_CODE_RE = /^[A-Z0-9_-]+$/;
const DOCUMENT_ID_RE = /^[A-Za-z0-9_-]{1,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type FieldValidator<T> = (value: T) => string | null;

function createRequestValidator() {
  return {
    document_type: (_value) => null,
    company_code: (_value) => null,
    ar_counterparty_code: (_value) => null,
    document_id: (_value) => null,
    document_memo: (_value) => null,
    application_date: (_value) => null,
    posting_date: (_value) => null,
    applications: (_value) => null,
  } satisfies {
    [K in keyof ArReceiptApplicationRequestDto]-?: FieldValidator<ArReceiptApplicationRequestDto[K]>;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== "";
}

function amountNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  return null;
}

function rejectUnexpected(record: Record<string, unknown>, allowed: readonly string[], path: string, errors: string[]): void {
  for (const key of Object.keys(record)) {
    if (!allowed.includes(key)) errors.push(`${path}.${key} is not allowed`);
  }
}

function validateBusinessCode(value: unknown, path: string, errors: string[]): void {
  if (!isNonEmptyString(value) || !BUSINESS_CODE_RE.test(value)) errors.push(`${path} must be a non-empty business code`);
}

function validateDate(value: unknown, path: string, errors: string[], nullable = false): void {
  if ((value === null || value === undefined) && nullable) return;
  if (!isNonEmptyString(value) || !DATE_RE.test(value)) {
    errors.push(`${path} must be an ISO date (YYYY-MM-DD)`);
    return;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value) errors.push(`${path} must be a valid calendar date`);
}

function validateDocumentId(value: unknown, path: string, errors: string[]): void {
  if (!isNonEmptyString(value) || !DOCUMENT_ID_RE.test(value)) errors.push(`${path} must use alphanumeric characters, underscore, or dash, with 20 characters maximum`);
}

function validateDocumentMemo(value: unknown, path: string, errors: string[]): void {
  if (value !== undefined && value !== null && typeof value !== "string") errors.push(`${path} must be a string or null`);
  if (typeof value === "string" && value.length > 50) errors.push(`${path} must be 50 characters or fewer`);
}

function validateDocumentReference(value: unknown, path: string, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  rejectUnexpected(value, ["document_id"], path, errors);
  validateDocumentId(value.document_id, `${path}.document_id`, errors);
}

function validateApplication(value: unknown, index: number, errors: string[]): void {
  const path = `applications[${index}]`;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  rejectUnexpected(value, ["source_receipt", "target_invoice", "amount"], path, errors);
  validateDocumentReference(value.source_receipt, `${path}.source_receipt`, errors);
  validateDocumentReference(value.target_invoice, `${path}.target_invoice`, errors);
  const amount = amountNumber(value.amount);
  if (amount === null || amount <= 0) errors.push(`${path}.amount must be greater than zero`);
}

export function validateRequest(input: unknown): asserts input is ArReceiptApplicationRequestDto {
  createRequestValidator();
  const errors: string[] = [];
  if (!isRecord(input)) throw new InputValidationError("Request body must be an object");
  rejectUnexpected(input, [
    "document_type",
    "company_code",
    "ar_counterparty_code",
    "document_id",
    "document_memo",
    "application_date",
    "posting_date",
    "applications",
  ], "$", errors);
  if (input.document_type !== undefined && input.document_type !== "AR_RECEIPT_APPLICATION") errors.push("document_type must be AR_RECEIPT_APPLICATION");
  if (!hasValue(input.company_code)) errors.push("company_code is required");
  else validateBusinessCode(input.company_code, "company_code", errors);
  if (!hasValue(input.ar_counterparty_code)) errors.push("ar_counterparty_code is required");
  else validateBusinessCode(input.ar_counterparty_code, "ar_counterparty_code", errors);
  if (hasValue(input.document_id)) validateDocumentId(input.document_id, "document_id", errors);
  validateDocumentMemo(input.document_memo, "document_memo", errors);
  validateDate(input.application_date, "application_date", errors);
  validateDate(input.posting_date, "posting_date", errors, true);
  if (!Array.isArray(input.applications) || input.applications.length === 0) errors.push("applications must contain at least one application");
  else input.applications.forEach((application, index) => validateApplication(application, index, errors));
  if (errors.length) throw new InputValidationError(errors.join("; "));
}

