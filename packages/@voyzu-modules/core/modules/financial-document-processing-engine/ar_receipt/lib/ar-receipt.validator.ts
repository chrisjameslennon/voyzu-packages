import type { ArReceiptRequestDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ar-receipt.request.dto";
import { InputValidationError } from "@voyzu/capability/errors";

const BUSINESS_CODE_RE = /^[A-Z0-9_-]+$/;
const COUNTRY_RE = /^[A-Z]{2}$/;
const DOCUMENT_ID_RE = /^[A-Za-z0-9_-]{1,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

type FieldValidator<T> = (value: T) => string | null;

function createRequestValidator() {
  return {
    document_type: (_value) => null,
    company_code: (_value) => null,
    ar_counterparty_code: (_value) => null,
    ar_counterparty: (_value) => null,
    document_id: (_value) => null,
    memo: (_value) => null,
    payment_date: (_value) => null,
    posting_date: (_value) => null,
    receipt_amount: (_value) => null,
    bank_cash_account_code: (_value) => null,
    bank_cash_details: (_value) => null,
    allocations: (_value) => null,
  } satisfies {
    [K in keyof ArReceiptRequestDto]-?: FieldValidator<ArReceiptRequestDto[K]>;
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== "";
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
  if (Number.isNaN(date.valueOf()) || date.toISOString().slice(0, 10) !== value) {
    errors.push(`${path} must be a valid calendar date`);
  }
}

function validateNullableString(value: unknown, path: string, errors: string[]): void {
  if (value !== undefined && value !== null && typeof value !== "string") errors.push(`${path} must be a string or null`);
}

function validateDocumentId(value: unknown, path: string, errors: string[]): void {
  if (!isNonEmptyString(value) || !DOCUMENT_ID_RE.test(value)) {
    errors.push(`${path} must use alphanumeric characters, underscore, or dash, with 20 characters maximum`);
  }
}

function validateDocumentMemo(value: unknown, path: string, errors: string[]): void {
  validateNullableString(value, path, errors);
  if (typeof value === "string" && value.length > 50) errors.push(`${path} must be 50 characters or fewer`);
}

function validateCounterpartyInput(value: unknown, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push("ar_counterparty must be an object");
    return;
  }
  rejectUnexpected(value, ["code", "name", "status", "country_code", "state_or_province_code"], "ar_counterparty", errors);
  validateBusinessCode(value.code, "ar_counterparty.code", errors);
  if (!isNonEmptyString(value.name)) errors.push("ar_counterparty.name is required");
  if (value.status !== "ACTIVE" && value.status !== "INACTIVE") errors.push("ar_counterparty.status must be ACTIVE or INACTIVE");
  if (!isNonEmptyString(value.country_code) || !COUNTRY_RE.test(value.country_code)) errors.push("ar_counterparty.country_code must be an ISO country code");
  validateNullableString(value.state_or_province_code, "ar_counterparty.state_or_province_code", errors);
}

function validateAllocation(value: unknown, index: number, errors: string[]): void {
  const path = `allocations[${index}]`;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  rejectUnexpected(value, ["document_id", "amount"], path, errors);
  validateDocumentId(value.document_id, `${path}.document_id`, errors);
  if (!isNumber(value.amount) || value.amount <= 0) errors.push(`${path}.amount must be greater than zero`);
}

export function validateRequest(input: unknown): asserts input is ArReceiptRequestDto {
  createRequestValidator();
  const errors: string[] = [];
  if (!isRecord(input)) throw new InputValidationError("Request body must be an object");

  rejectUnexpected(input, [
    "document_type",
    "company_code",
    "ar_counterparty_code",
    "ar_counterparty",
    "document_id",
    "memo",
    "payment_date",
    "posting_date",
    "receipt_amount",
    "bank_cash_account_code",
    "bank_cash_details",
    "dimensions",
    "items",
    "allocations",
  ], "$", errors);

  if (input.document_type !== undefined && input.document_type !== "AR_RECEIPT") errors.push("document_type must be AR_RECEIPT");
  if (!hasValue(input.company_code)) errors.push("company_code is required");
  else validateBusinessCode(input.company_code, "company_code", errors);

  const counterpartyResolvers = [input.ar_counterparty_code, input.ar_counterparty].filter(hasValue);
  if (counterpartyResolvers.length !== 1) errors.push("Exactly one of ar_counterparty_code or ar_counterparty is required");
  if (hasValue(input.ar_counterparty_code)) validateBusinessCode(input.ar_counterparty_code, "ar_counterparty_code", errors);
  if (hasValue(input.ar_counterparty)) validateCounterpartyInput(input.ar_counterparty, errors);

  if (hasValue(input.document_id)) validateDocumentId(input.document_id, "document_id", errors);
  validateDocumentMemo(input.memo, "memo", errors);
  validateDate(input.payment_date, "payment_date", errors);
  validateDate(input.posting_date, "posting_date", errors, true);
  if (input.receipt_amount !== undefined && input.receipt_amount !== null && (!isNumber(input.receipt_amount) || input.receipt_amount <= 0)) {
    errors.push("receipt_amount must be greater than zero");
  }
  if (input.bank_cash_account_code !== undefined && input.bank_cash_account_code !== null) validateBusinessCode(input.bank_cash_account_code, "bank_cash_account_code", errors);
  if (hasValue(input.dimensions)) errors.push("AR_RECEIPT does not support dimensions");
  if (hasValue(input.items)) errors.push("AR_RECEIPT does not support items");
  if (input.allocations !== undefined && input.allocations !== null) {
    if (!Array.isArray(input.allocations)) errors.push("allocations must be an array or null");
    else input.allocations.forEach((allocation, index) => validateAllocation(allocation, index, errors));
  }
  if (input.ar_counterparty && Array.isArray(input.allocations) && input.allocations.length > 0) {
    errors.push("allocations cannot be supplied when creating an inline ar_counterparty");
  }

  if (errors.length) throw new InputValidationError(errors.join("; "));
}

