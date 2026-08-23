import type { ArCreditNoteRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-credit-note.request.dto";
import type { ArOpeningBalanceRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-opening-balance.request.dto";
import type { ArRefundRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-refund.request.dto";
import type { ArWriteOffRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-write-off.request.dto";
import { InputValidationError } from "@voyzu/capability/errors";

import type { ArAdjustmentDocumentType } from "../db/ar-adjustment-posting.row.types";

type RequestDto = ArCreditNoteRequestDto | ArOpeningBalanceRequestDto | ArRefundRequestDto | ArWriteOffRequestDto;

type FieldValidator<T> = (value: T) => string | null;

function createCreditNoteRequestValidator() {
  return {
    document_type: (_value) => null,
    company_code: (_value) => null,
    ar_counterparty_code: (_value) => null,
    ar_counterparty: (_value) => null,
    document_id: (_value) => null,
    memo: (_value) => null,
    credit_note_date: (_value) => null,
    posting_date: (_value) => null,
    revenue_posting_code: (_value) => null,
    dimensions: (_value) => null,
    lines: (_value) => null,
    allocations: (_value) => null,
  } satisfies {
    [K in keyof ArCreditNoteRequestDto]-?: FieldValidator<ArCreditNoteRequestDto[K]>;
  };
}

function createOpeningBalanceRequestValidator() {
  return {
    document_type: (_value) => null,
    company_code: (_value) => null,
    ar_counterparty_code: (_value) => null,
    ar_counterparty: (_value) => null,
    document_id: (_value) => null,
    memo: (_value) => null,
    opening_balance_date: (_value) => null,
    posting_date: (_value) => null,
    opening_balance_equity_posting_code: (_value) => null,
    items: (_value) => null,
    dimensions: (_value) => null,
  } satisfies {
    [K in keyof ArOpeningBalanceRequestDto]-?: FieldValidator<ArOpeningBalanceRequestDto[K]>;
  };
}

function createRefundRequestValidator() {
  return {
    document_type: (_value) => null,
    company_code: (_value) => null,
    ar_counterparty_code: (_value) => null,
    document_id: (_value) => null,
    memo: (_value) => null,
    refund_date: (_value) => null,
    posting_date: (_value) => null,
    refund_amount: (_value) => null,
    bank_cash_account_code: (_value) => null,
    bank_cash_details: (_value) => null,
    dimensions: (_value) => null,
  } satisfies {
    [K in keyof ArRefundRequestDto]-?: FieldValidator<ArRefundRequestDto[K]>;
  };
}

function createWriteOffRequestValidator() {
  return {
    document_type: (_value) => null,
    company_code: (_value) => null,
    ar_counterparty_code: (_value) => null,
    document_id: (_value) => null,
    memo: (_value) => null,
    write_off_date: (_value) => null,
    posting_date: (_value) => null,
    write_off_expense_posting_code: (_value) => null,
    applications: (_value) => null,
    dimensions: (_value) => null,
  } satisfies {
    [K in keyof ArWriteOffRequestDto]-?: FieldValidator<ArWriteOffRequestDto[K]>;
  };
}

const BUSINESS_CODE_RE = /^[A-Z0-9_-]+$/;
const COUNTRY_RE = /^[A-Z]{2}$/;
const DOCUMENT_ID_RE = /^[A-Za-z0-9_-]{1,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const CALLER_SUPPLIED_TAX_RULE = "CALLER_SUPPLIED";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== "";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function amountNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
  return null;
}

function rejectUnexpected(record: Record<string, unknown>, allowed: readonly string[], path: string, errors: string[]): void {
  for (const key of Object.keys(record)) if (!allowed.includes(key)) errors.push(`${path}.${key} is not allowed`);
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

function validateMemo(value: unknown, path: string, errors: string[]): void {
  if (value !== undefined && value !== null && typeof value !== "string") errors.push(`${path} must be a string or null`);
  if (typeof value === "string" && value.length > 50) errors.push(`${path} must be 50 characters or fewer`);
}

function validateDocumentId(value: unknown, path: string, errors: string[]): void {
  if (!isNonEmptyString(value) || !DOCUMENT_ID_RE.test(value)) errors.push(`${path} must use alphanumeric characters, underscore, or dash, with 20 characters maximum`);
}

function validateDimensions(value: unknown, path: string, errors: string[]): void {
  if (value === undefined || value === null) return;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object or null`);
    return;
  }
  for (const [key, val] of Object.entries(value)) {
    if (!BUSINESS_CODE_RE.test(key)) errors.push(`${path}.${key} must use a valid dimension code`);
    if (!isNonEmptyString(val)) errors.push(`${path}.${key} must be a non-empty dimension value`);
  }
}

function validateCounterparty(value: unknown, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push("ar_counterparty must be an object");
    return;
  }
  rejectUnexpected(value, ["code", "name", "status", "country_code", "state_or_province_code"], "ar_counterparty", errors);
  validateBusinessCode(value.code, "ar_counterparty.code", errors);
  if (!isNonEmptyString(value.name)) errors.push("ar_counterparty.name is required");
  if (value.status !== "ACTIVE" && value.status !== "INACTIVE") errors.push("ar_counterparty.status must be ACTIVE or INACTIVE");
  if (!isNonEmptyString(value.country_code) || !COUNTRY_RE.test(value.country_code)) errors.push("ar_counterparty.country_code must be an ISO country code");
  if (value.state_or_province_code !== undefined && value.state_or_province_code !== null && typeof value.state_or_province_code !== "string") {
    errors.push("ar_counterparty.state_or_province_code must be a string or null");
  }
}

function validateCounterpartyResolver(input: Record<string, unknown>, allowInline: boolean, errors: string[]): void {
  const resolvers = [input.ar_counterparty_code, input.ar_counterparty].filter(hasValue);
  if (resolvers.length !== 1) errors.push("Exactly one of ar_counterparty_code or ar_counterparty is required");
  if (hasValue(input.ar_counterparty_code)) validateBusinessCode(input.ar_counterparty_code, "ar_counterparty_code", errors);
  if (hasValue(input.ar_counterparty)) {
    if (!allowInline) errors.push("ar_counterparty is not supported for this document type");
    else validateCounterparty(input.ar_counterparty, errors);
  }
}

function validateAmount(value: unknown, path: string, errors: string[]): void {
  const amount = amountNumber(value);
  if (amount === null || amount <= 0) errors.push(`${path} must be greater than zero`);
}

function validateCallerSuppliedTaxComponent(value: unknown, path: string, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  rejectUnexpected(value, ["tax_authority_code", "tax_rate", "invoice_label"], path, errors);
  validateBusinessCode(value.tax_authority_code, `${path}.tax_authority_code`, errors);
  const taxRate = amountNumber(value.tax_rate);
  if (taxRate === null || taxRate < 0 || taxRate >= 1) errors.push(`${path}.tax_rate must be a number greater than or equal to zero and less than one`);
  if (value.invoice_label !== undefined && value.invoice_label !== null && typeof value.invoice_label !== "string") errors.push(`${path}.invoice_label must be a string or null`);
}

function validateCreditLine(value: unknown, index: number, errors: string[]): void {
  const path = `lines[${index}]`;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  rejectUnexpected(value, ["line_id", "description", "quantity", "net_unit_price", "net_line_total", "revenue_posting_code", "tax_rule", "tax_components", "dimensions"], path, errors);
  if (value.line_id !== undefined && value.line_id !== null && (!Number.isInteger(value.line_id) || Number(value.line_id) < 1)) errors.push(`${path}.line_id must be a positive integer or null`);
  if (!isNonEmptyString(value.description)) errors.push(`${path}.description is required`);
  if (value.quantity !== undefined && value.quantity !== null) validateAmount(value.quantity, `${path}.quantity`, errors);
  if (value.net_unit_price !== undefined && value.net_unit_price !== null && (amountNumber(value.net_unit_price) === null || Number(value.net_unit_price) < 0)) errors.push(`${path}.net_unit_price must be zero or greater or null`);
  if (value.net_line_total !== undefined && value.net_line_total !== null && (amountNumber(value.net_line_total) === null || Number(value.net_line_total) < 0)) errors.push(`${path}.net_line_total must be zero or greater or null`);
  const hasQuantity = value.quantity !== undefined && value.quantity !== null;
  const hasNetUnitPrice = value.net_unit_price !== undefined && value.net_unit_price !== null;
  const hasLineTotal = value.net_line_total !== undefined && value.net_line_total !== null;
  if (hasQuantity !== hasNetUnitPrice) errors.push(`${path} requires quantity and net_unit_price to be supplied together`);
  if (!hasQuantity && !hasLineTotal) errors.push(`${path} requires quantity + net_unit_price or net_line_total`);
  if (hasQuantity && hasNetUnitPrice && hasLineTotal) {
    const quantity = amountNumber(value.quantity);
    const unit = amountNumber(value.net_unit_price);
    const total = amountNumber(value.net_line_total);
    if (quantity !== null && unit !== null && total !== null) {
      const expected = Math.round((quantity * unit + Number.EPSILON) * 100) / 100;
      const supplied = Math.round((total + Number.EPSILON) * 100) / 100;
      if (expected !== supplied) errors.push(`${path}.net_line_total must equal rounded quantity * net_unit_price`);
    }
  }
  if (value.revenue_posting_code !== undefined && value.revenue_posting_code !== null) validateBusinessCode(value.revenue_posting_code, `${path}.revenue_posting_code`, errors);
  validateBusinessCode(value.tax_rule, `${path}.tax_rule`, errors);
  if (value.tax_rule === CALLER_SUPPLIED_TAX_RULE) {
    if (!Array.isArray(value.tax_components) || value.tax_components.length === 0) errors.push(`${path}.tax_components must contain at least one component when tax_rule is CALLER_SUPPLIED`);
    else value.tax_components.forEach((component, componentIndex) => validateCallerSuppliedTaxComponent(component, `${path}.tax_components[${componentIndex}]`, errors));
  } else if (value.tax_components !== undefined && value.tax_components !== null) {
    if (!Array.isArray(value.tax_components)) errors.push(`${path}.tax_components must be an array or null`);
    else if (value.tax_components.length > 0) errors.push(`${path}.tax_components is only allowed when tax_rule is CALLER_SUPPLIED`);
  }
  validateDimensions(value.dimensions, `${path}.dimensions`, errors);
}

function validateDocumentReference(value: unknown, path: string, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  rejectUnexpected(value, ["document_id"], path, errors);
  validateDocumentId(value.document_id, `${path}.document_id`, errors);
}

function validateDocumentIdAllocation(value: unknown, index: number, errors: string[]): void {
  const path = `allocations[${index}]`;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  rejectUnexpected(value, ["document_id", "amount"], path, errors);
  validateDocumentId(value.document_id, `${path}.document_id`, errors);
  validateAmount(value.amount, `${path}.amount`, errors);
}

function validateReferencedApplication(value: unknown, index: number, key: string, errors: string[]): void {
  const path = `applications[${index}]`;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  rejectUnexpected(value, [key, "amount"], path, errors);
  validateDocumentReference(value[key], `${path}.${key}`, errors);
  validateAmount(value.amount, `${path}.amount`, errors);
}

export function validateArAdjustmentRequest(input: unknown, documentType: ArAdjustmentDocumentType): asserts input is RequestDto {
  if (documentType === "AR_CREDIT_NOTE") createCreditNoteRequestValidator();
  else if (documentType === "AR_OPENING_BALANCE") createOpeningBalanceRequestValidator();
  else if (documentType === "AR_REFUND") createRefundRequestValidator();
  else createWriteOffRequestValidator();
  const errors: string[] = [];
  if (!isRecord(input)) throw new InputValidationError("Request body must be an object");

  if (documentType === "AR_CREDIT_NOTE") {
    rejectUnexpected(input, ["document_type", "company_code", "ar_counterparty_code", "ar_counterparty", "document_id", "memo", "credit_note_date", "posting_date", "revenue_posting_code", "dimensions", "lines", "items", "bank_cash_details", "allocations"], "$", errors);
    if (input.document_type !== undefined && input.document_type !== documentType) errors.push(`document_type must be ${documentType}`);
    if (!hasValue(input.company_code)) errors.push("company_code is required"); else validateBusinessCode(input.company_code, "company_code", errors);
    validateCounterpartyResolver(input, true, errors);
    if (hasValue(input.document_id)) validateDocumentId(input.document_id, "document_id", errors);
    validateMemo(input.memo, "memo", errors);
    validateDate(input.credit_note_date, "credit_note_date", errors);
    validateDate(input.posting_date, "posting_date", errors, true);
    if (input.revenue_posting_code !== undefined && input.revenue_posting_code !== null) validateBusinessCode(input.revenue_posting_code, "revenue_posting_code", errors);
    if (hasValue(input.bank_cash_details)) errors.push("AR_CREDIT_NOTE does not support bank_cash_details");
    if (hasValue(input.items)) errors.push("AR_CREDIT_NOTE uses lines, not items");
    validateDimensions(input.dimensions, "dimensions", errors);
    if (!Array.isArray(input.lines) || input.lines.length === 0) errors.push("lines must contain at least one line");
    else input.lines.forEach((line, index) => validateCreditLine(line, index, errors));
    if (input.allocations !== undefined && input.allocations !== null) {
      if (!Array.isArray(input.allocations)) errors.push("allocations must be an array or null");
      else input.allocations.forEach((allocation, index) => validateDocumentIdAllocation(allocation, index, errors));
    }
  }

  if (documentType === "AR_OPENING_BALANCE") {
    rejectUnexpected(input, ["document_type", "company_code", "ar_counterparty_code", "ar_counterparty", "document_id", "memo", "opening_balance_date", "posting_date", "opening_balance_equity_posting_code", "items", "dimensions", "bank_cash_details"], "$", errors);
    if (input.document_type !== undefined && input.document_type !== documentType) errors.push(`document_type must be ${documentType}`);
    if (!hasValue(input.company_code)) errors.push("company_code is required"); else validateBusinessCode(input.company_code, "company_code", errors);
    validateCounterpartyResolver(input, true, errors);
    if (hasValue(input.document_id)) validateDocumentId(input.document_id, "document_id", errors);
    validateMemo(input.memo, "memo", errors);
    validateDate(input.opening_balance_date, "opening_balance_date", errors);
    validateDate(input.posting_date, "posting_date", errors, true);
    if (input.opening_balance_equity_posting_code !== undefined && input.opening_balance_equity_posting_code !== null) validateBusinessCode(input.opening_balance_equity_posting_code, "opening_balance_equity_posting_code", errors);
    if (hasValue(input.bank_cash_details)) errors.push("AR_OPENING_BALANCE does not support bank_cash_details");
    if (hasValue(input.dimensions)) errors.push("AR_OPENING_BALANCE does not support dimensions");
    if (!Array.isArray(input.items) || input.items.length === 0) errors.push("items must contain at least one item");
    else input.items.forEach((item, index) => {
      const path = `items[${index}]`;
      if (!isRecord(item)) {
        errors.push(`${path} must be an object`);
        return;
      }
      rejectUnexpected(item, ["line_id", "external_reference", "description", "original_invoice_date", "due_date", "amount"], path, errors);
      if (item.line_id !== undefined && item.line_id !== null && (!Number.isInteger(item.line_id) || Number(item.line_id) < 1)) errors.push(`${path}.line_id must be a positive integer or null`);
      if (!isNonEmptyString(item.description)) errors.push(`${path}.description is required`);
      validateDate(item.original_invoice_date, `${path}.original_invoice_date`, errors, true);
      validateDate(item.due_date, `${path}.due_date`, errors, true);
      validateAmount(item.amount, `${path}.amount`, errors);
    });
  }

  if (documentType === "AR_REFUND") {
    rejectUnexpected(input, ["document_type", "company_code", "ar_counterparty_code", "document_id", "memo", "refund_date", "posting_date", "refund_amount", "bank_cash_account_code", "bank_cash_details", "dimensions", "items"], "$", errors);
    if (input.document_type !== undefined && input.document_type !== documentType) errors.push(`document_type must be ${documentType}`);
    if (!hasValue(input.company_code)) errors.push("company_code is required"); else validateBusinessCode(input.company_code, "company_code", errors);
    if (!hasValue(input.ar_counterparty_code)) errors.push("ar_counterparty_code is required"); else validateBusinessCode(input.ar_counterparty_code, "ar_counterparty_code", errors);
    if (hasValue(input.document_id)) validateDocumentId(input.document_id, "document_id", errors);
    validateMemo(input.memo, "memo", errors);
    validateDate(input.refund_date, "refund_date", errors);
    validateDate(input.posting_date, "posting_date", errors, true);
    validateAmount(input.refund_amount, "refund_amount", errors);
    if (input.bank_cash_account_code !== undefined && input.bank_cash_account_code !== null) validateBusinessCode(input.bank_cash_account_code, "bank_cash_account_code", errors);
    if (hasValue(input.dimensions)) errors.push("AR_REFUND does not support dimensions");
    if (hasValue(input.items)) errors.push("AR_REFUND does not support items");
  }

  if (documentType === "AR_WRITE_OFF") {
    rejectUnexpected(input, ["document_type", "company_code", "ar_counterparty_code", "document_id", "memo", "write_off_date", "posting_date", "write_off_expense_posting_code", "applications", "dimensions", "items", "bank_cash_details"], "$", errors);
    if (input.document_type !== undefined && input.document_type !== documentType) errors.push(`document_type must be ${documentType}`);
    if (!hasValue(input.company_code)) errors.push("company_code is required"); else validateBusinessCode(input.company_code, "company_code", errors);
    if (!hasValue(input.ar_counterparty_code)) errors.push("ar_counterparty_code is required"); else validateBusinessCode(input.ar_counterparty_code, "ar_counterparty_code", errors);
    if (hasValue(input.document_id)) validateDocumentId(input.document_id, "document_id", errors);
    validateMemo(input.memo, "memo", errors);
    validateDate(input.write_off_date, "write_off_date", errors);
    validateDate(input.posting_date, "posting_date", errors, true);
    if (input.write_off_expense_posting_code !== undefined && input.write_off_expense_posting_code !== null) validateBusinessCode(input.write_off_expense_posting_code, "write_off_expense_posting_code", errors);
    if (hasValue(input.bank_cash_details)) errors.push("AR_WRITE_OFF does not support bank_cash_details");
    if (hasValue(input.dimensions)) errors.push("AR_WRITE_OFF does not support dimensions");
    if (hasValue(input.items)) errors.push("AR_WRITE_OFF does not support items");
    if (!Array.isArray(input.applications) || input.applications.length === 0) errors.push("applications must contain at least one application");
    else input.applications.forEach((application, index) => validateReferencedApplication(application, index, "target_invoice", errors));
  }

  if (errors.length) throw new InputValidationError(errors.join("; "));
}

export function toAmount(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

