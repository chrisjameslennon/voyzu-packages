import type { InventoryAdjustmentRequestDto } from "@voyzu/types/modules/financial-document-processing-engine/inventory-adjustment.request.dto";
import type { InventoryIssueRequestDto } from "@voyzu/types/modules/financial-document-processing-engine/inventory-issue.request.dto";
import type { InventoryReceiptRequestDto } from "@voyzu/types/modules/financial-document-processing-engine/inventory-receipt.request.dto";
import { InputValidationError } from "@voyzu/capability/errors";

import type {
  CompanyPostingContextRow,
  DimensionValueLookupRow,
  DocumentProcessorValidationRow,
  FiscalPostingPeriodRow,
  InventoryControlAccountPostingRow,
  InventoryItemPostingRow,
} from "../db/inventory-processing.row.types";

export type InventoryDocumentType = "INVENTORY_RECEIPT" | "INVENTORY_ISSUE" | "INVENTORY_ADJUSTMENT";
export type InventoryProcessingRequestDto = InventoryReceiptRequestDto | InventoryIssueRequestDto | InventoryAdjustmentRequestDto;

type FieldValidator<T> = (value: T) => string | null;

function createReceiptRequestValidator() {
  return {
    document_type: (_value) => null,
    company_code: (_value) => null,
    document_id: (_value) => null,
    memo: (_value) => null,
    receipt_date: (_value) => null,
    posting_date: (_value) => null,
    source: (_value) => null,
    lines: (_value) => null,
  } satisfies {
    [K in keyof InventoryReceiptRequestDto]-?: FieldValidator<InventoryReceiptRequestDto[K]>;
  };
}

function createIssueRequestValidator() {
  return {
    document_type: (_value) => null,
    company_code: (_value) => null,
    document_id: (_value) => null,
    memo: (_value) => null,
    issue_date: (_value) => null,
    posting_date: (_value) => null,
    source: (_value) => null,
    lines: (_value) => null,
  } satisfies {
    [K in keyof InventoryIssueRequestDto]-?: FieldValidator<InventoryIssueRequestDto[K]>;
  };
}

function createAdjustmentRequestValidator() {
  return {
    document_type: (_value) => null,
    company_code: (_value) => null,
    document_id: (_value) => null,
    memo: (_value) => null,
    adjustment_date: (_value) => null,
    posting_date: (_value) => null,
    source: (_value) => null,
    lines: (_value) => null,
  } satisfies {
    [K in keyof InventoryAdjustmentRequestDto]-?: FieldValidator<InventoryAdjustmentRequestDto[K]>;
  };
}

export interface InventoryDataValidationContext {
  company: CompanyPostingContextRow | null;
  documentProcessor: DocumentProcessorValidationRow | null;
  fiscalPeriod: FiscalPostingPeriodRow | null;
  inventoryControlAccount: InventoryControlAccountPostingRow | null;
  itemsByCode: Map<string, InventoryItemPostingRow>;
  dimensionValuesByDimensionCodeAndName: Map<string, DimensionValueLookupRow>;
}

const BUSINESS_CODE_RE = /^[A-Z0-9_-]+$/;
const DOCUMENT_ID_RE = /^[A-Za-z0-9_-]{1,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const COMMON_ROOT_KEYS = ["document_type", "company_code", "document_id", "memo", "posting_date", "source", "lines", "bank_cash_details", "items"] as const;
const SOURCE_KEYS = ["source_document", "source_document_id", "source_type", "source_line_id"] as const;
const RECEIPT_LINE_KEYS = ["line_id", "inventory_item_code", "description", "quantity_delta", "valuation_method", "unit_book_value", "dimensions"] as const;
const ISSUE_LINE_KEYS = ["line_id", "inventory_item_code", "description", "quantity_delta", "issue_purpose", "dimensions"] as const;
const ADJUSTMENT_LINE_KEYS = ["line_id", "inventory_item_code", "description", "adjustment_type", "quantity_delta", "unit_book_value", "book_value_delta", "reason_code", "dimensions"] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== "";
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function amount(value: unknown): number {
  return typeof value === "number" ? value : Number(value);
}

function isFiniteNumber(value: unknown): boolean {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string" && value.trim() !== "") return Number.isFinite(Number(value));
  return false;
}

function rejectUnexpected(record: Record<string, unknown>, allowed: readonly string[], path: string, errors: string[]): void {
  for (const key of Object.keys(record)) {
    if (!allowed.includes(key)) errors.push(`${path}.${key} is not allowed`);
  }
}

function validateBusinessCode(value: unknown, path: string, errors: string[]): void {
  if (!isNonEmptyString(value) || !BUSINESS_CODE_RE.test(value)) errors.push(`${path} must be a non-empty business code`);
}

function validateDocumentId(value: unknown, path: string, errors: string[]): void {
  if (!isNonEmptyString(value) || !DOCUMENT_ID_RE.test(value)) {
    errors.push(`${path} must use alphanumeric characters, underscore, or dash, with 20 characters maximum`);
  }
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

function validatePositiveAmount(value: unknown, path: string, errors: string[]): void {
  if (!isFiniteNumber(value) || amount(value) <= 0) errors.push(`${path} must be a positive number`);
}

function validateNonZeroAmount(value: unknown, path: string, errors: string[]): void {
  if (!isFiniteNumber(value) || amount(value) === 0) errors.push(`${path} must be a non-zero number`);
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

function validateSource(value: unknown, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push("source is required");
    return;
  }
  rejectUnexpected(value, SOURCE_KEYS, "source", errors);
  validateBusinessCode(value.source_document, "source.source_document", errors);
  validateNullableString(value.source_document_id, "source.source_document_id", errors);
  validateNullableString(value.source_type, "source.source_type", errors);
  if (value.source_line_id !== undefined && value.source_line_id !== null && (!Number.isInteger(value.source_line_id) || Number(value.source_line_id) < 1)) {
    errors.push("source.source_line_id must be a positive integer or null");
  }
}

function validateLineIds(lines: unknown[], errors: string[]): void {
  const supplied = lines.filter(isRecord).map((line) => line.line_id).filter((lineId) => lineId !== undefined && lineId !== null);
  if (supplied.length > 0 && supplied.length !== lines.length) errors.push("line_id must be supplied for all lines or no lines");
  const numericIds = supplied.filter((lineId): lineId is number => Number.isInteger(lineId));
  if (new Set(numericIds).size !== numericIds.length) errors.push("line_id values must be unique");
}

function validateCommonRoot(input: Record<string, unknown>, documentType: InventoryDocumentType, dateKey: "receipt_date" | "issue_date" | "adjustment_date", errors: string[]): void {
  rejectUnexpected(input, [...COMMON_ROOT_KEYS, dateKey], "$", errors);
  if (hasValue(input.items)) errors.push(`${documentType} uses lines, not items`);
  if (input.document_type !== documentType) errors.push(`document_type must be ${documentType}`);
  if (!hasValue(input.company_code)) errors.push("company_code is required");
  else validateBusinessCode(input.company_code, "company_code", errors);
  if (hasValue(input.document_id)) validateDocumentId(input.document_id, "document_id", errors);
  validateNullableString(input.memo, "memo", errors);
  if (typeof input.memo === "string" && input.memo.length > 50) errors.push("memo must be 50 characters or fewer");
  validateDate(input[dateKey], dateKey, errors);
  validateDate(input.posting_date, "posting_date", errors, true);
  validateSource(input.source, errors);
  if (!Array.isArray(input.lines) || input.lines.length === 0) errors.push("lines must contain at least one line");
}

function validateReceiptLine(value: unknown, index: number, errors: string[]): void {
  const path = `lines[${index}]`;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  rejectUnexpected(value, RECEIPT_LINE_KEYS, path, errors);
  if (value.line_id !== undefined && value.line_id !== null && (!Number.isInteger(value.line_id) || Number(value.line_id) < 1)) errors.push(`${path}.line_id must be a positive integer or null`);
  validateBusinessCode(value.inventory_item_code, `${path}.inventory_item_code`, errors);
  validateNullableString(value.description, `${path}.description`, errors);
  validatePositiveAmount(value.quantity_delta, `${path}.quantity_delta`, errors);
  if (value.valuation_method !== "SUPPLIED_UNIT_BOOK_VALUE" && value.valuation_method !== "CURRENT_AVERAGE_BOOK_VALUE") {
    errors.push(`${path}.valuation_method must be SUPPLIED_UNIT_BOOK_VALUE or CURRENT_AVERAGE_BOOK_VALUE`);
  }
  if (value.valuation_method === "SUPPLIED_UNIT_BOOK_VALUE") validatePositiveAmount(value.unit_book_value, `${path}.unit_book_value`, errors);
  if (value.valuation_method === "CURRENT_AVERAGE_BOOK_VALUE" && value.unit_book_value !== undefined && value.unit_book_value !== null) {
    errors.push(`${path}.unit_book_value is not allowed when valuation_method is CURRENT_AVERAGE_BOOK_VALUE`);
  }
  validateDimensions(value.dimensions, `${path}.dimensions`, errors);
}

function validateIssueLine(value: unknown, index: number, errors: string[]): void {
  const path = `lines[${index}]`;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  rejectUnexpected(value, ISSUE_LINE_KEYS, path, errors);
  if (value.line_id !== undefined && value.line_id !== null && (!Number.isInteger(value.line_id) || Number(value.line_id) < 1)) errors.push(`${path}.line_id must be a positive integer or null`);
  validateBusinessCode(value.inventory_item_code, `${path}.inventory_item_code`, errors);
  validateNullableString(value.description, `${path}.description`, errors);
  if (!isFiniteNumber(value.quantity_delta) || amount(value.quantity_delta) >= 0) errors.push(`${path}.quantity_delta must be a negative number`);
  if (value.issue_purpose !== "SOLD" && value.issue_purpose !== "CONSUMED") errors.push(`${path}.issue_purpose must be SOLD or CONSUMED`);
  validateDimensions(value.dimensions, `${path}.dimensions`, errors);
}

function validateAdjustmentLine(value: unknown, index: number, errors: string[]): void {
  const path = `lines[${index}]`;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  rejectUnexpected(value, ADJUSTMENT_LINE_KEYS, path, errors);
  if (value.line_id !== undefined && value.line_id !== null && (!Number.isInteger(value.line_id) || Number(value.line_id) < 1)) errors.push(`${path}.line_id must be a positive integer or null`);
  validateBusinessCode(value.inventory_item_code, `${path}.inventory_item_code`, errors);
  validateNullableString(value.description, `${path}.description`, errors);
  validateNullableString(value.reason_code, `${path}.reason_code`, errors);
  if (value.adjustment_type === "QUANTITY_ADJUSTMENT") {
    validateNonZeroAmount(value.quantity_delta, `${path}.quantity_delta`, errors);
    if (Number(value.quantity_delta) > 0 && value.unit_book_value !== undefined && value.unit_book_value !== null) validatePositiveAmount(value.unit_book_value, `${path}.unit_book_value`, errors);
    if (Number(value.quantity_delta) < 0 && value.unit_book_value !== undefined && value.unit_book_value !== null) errors.push(`${path}.unit_book_value is only allowed for positive quantity adjustments`);
    if (value.book_value_delta !== undefined && value.book_value_delta !== null) errors.push(`${path}.book_value_delta is not allowed for QUANTITY_ADJUSTMENT`);
  } else if (value.adjustment_type === "VALUE_ADJUSTMENT") {
    validateNonZeroAmount(value.book_value_delta, `${path}.book_value_delta`, errors);
    if (value.quantity_delta !== undefined && value.quantity_delta !== null && Number(value.quantity_delta) !== 0) errors.push(`${path}.quantity_delta must be 0 or omitted for VALUE_ADJUSTMENT`);
    if (value.unit_book_value !== undefined && value.unit_book_value !== null) errors.push(`${path}.unit_book_value is not allowed for VALUE_ADJUSTMENT`);
  } else {
    errors.push(`${path}.adjustment_type must be QUANTITY_ADJUSTMENT or VALUE_ADJUSTMENT`);
  }
  validateDimensions(value.dimensions, `${path}.dimensions`, errors);
}

export function validateInventoryRequest(input: unknown, documentType: InventoryDocumentType): asserts input is InventoryProcessingRequestDto {
  if (documentType === "INVENTORY_RECEIPT") createReceiptRequestValidator();
  else if (documentType === "INVENTORY_ISSUE") createIssueRequestValidator();
  else createAdjustmentRequestValidator();
  const errors: string[] = [];
  if (!isRecord(input)) throw new InputValidationError("Request body must be an object");

  if (documentType === "INVENTORY_RECEIPT") {
    validateCommonRoot(input, documentType, "receipt_date", errors);
    if (Array.isArray(input.lines)) {
      input.lines.forEach((line, index) => validateReceiptLine(line, index, errors));
      validateLineIds(input.lines, errors);
    }
  } else if (documentType === "INVENTORY_ISSUE") {
    validateCommonRoot(input, documentType, "issue_date", errors);
    if (Array.isArray(input.lines)) {
      input.lines.forEach((line, index) => validateIssueLine(line, index, errors));
      validateLineIds(input.lines, errors);
    }
  } else {
    validateCommonRoot(input, documentType, "adjustment_date", errors);
    if (Array.isArray(input.lines)) {
      input.lines.forEach((line, index) => validateAdjustmentLine(line, index, errors));
      validateLineIds(input.lines, errors);
    }
  }

  if (errors.length) throw new InputValidationError(errors.join("; "));
}

export function postingDateFor(input: InventoryProcessingRequestDto): string {
  if (input.document_type === "INVENTORY_RECEIPT") return input.posting_date ?? input.receipt_date;
  if (input.document_type === "INVENTORY_ISSUE") return input.posting_date ?? input.issue_date;
  return input.posting_date ?? input.adjustment_date;
}

export function documentDateFor(input: InventoryProcessingRequestDto): string {
  if (input.document_type === "INVENTORY_RECEIPT") return input.receipt_date;
  if (input.document_type === "INVENTORY_ISSUE") return input.issue_date;
  return input.adjustment_date;
}

export function requestedItemCodes(input: InventoryProcessingRequestDto): string[] {
  return [...new Set(input.lines.map((line) => line.inventory_item_code))];
}

export function requestedDimensionPairs(input: InventoryProcessingRequestDto): Array<{ dimensionCode: string; valueName: string }> {
  const pairs = new Map<string, { dimensionCode: string; valueName: string }>();
  for (const line of input.lines) {
    for (const [dimensionCode, valueName] of Object.entries(line.dimensions ?? {})) {
      pairs.set(`${dimensionCode}\u0000${valueName}`, { dimensionCode, valueName });
    }
  }
  return [...pairs.values()];
}

export function validateInventoryData(input: InventoryProcessingRequestDto, data: InventoryDataValidationContext): void {
  const errors: string[] = [];
  const hasDimensions = input.lines.some((line) => Object.keys(line.dimensions ?? {}).length > 0);
  const hasBankCashDetails = hasValue((input as unknown as Record<string, unknown>).bank_cash_details);

  if (!data.documentProcessor) errors.push(`${input.document_type} document processor is not configured`);
  else {
    if (data.documentProcessor.status !== "ACTIVE") errors.push(`${input.document_type} document processor is not ACTIVE`);
    if (hasDimensions && !data.documentProcessor.supports_dimensions) errors.push(`${input.document_type} does not support dimensions`);
    if (hasBankCashDetails && !data.documentProcessor.cash_movement) errors.push(`${input.document_type} does not support bank_cash_details`);
    if (input.lines.length > 0 && !data.documentProcessor.supports_items) errors.push(`${input.document_type} does not support items`);
  }

  if (!data.company) errors.push(`Company ${input.company_code} was not found`);
  else if (data.company.status !== "ACTIVE") errors.push(`Company ${data.company.code} is not ACTIVE`);

  if (!data.fiscalPeriod) errors.push(`No OPEN fiscal period contains posting date ${postingDateFor(input)}`);
  else {
    if (data.fiscalPeriod.financial_year_status !== "OPEN") errors.push(`Financial year ${data.fiscalPeriod.financial_year_code} is not OPEN`);
    if (data.fiscalPeriod.financial_period_status !== "OPEN") errors.push(`Financial period ${data.fiscalPeriod.financial_period_code} is not OPEN`);
  }

  if (!data.inventoryControlAccount) errors.push("INVENTORY_CONTROL account is not configured");
  else {
    if (data.inventoryControlAccount.status !== "ACTIVE") errors.push("INVENTORY_CONTROL account is not ACTIVE");
    if (data.inventoryControlAccount.gl_account.status !== "ACTIVE") errors.push("INVENTORY_CONTROL resolves to an inactive GL account");
    if (data.inventoryControlAccount.gl_account.account_type !== "ASSET") errors.push("INVENTORY_CONTROL must resolve to an ASSET GL account");
  }

  for (const line of input.lines) {
    const item = data.itemsByCode.get(line.inventory_item_code);
    if (!item) {
      errors.push(`Inventory item ${line.inventory_item_code} was not found`);
      continue;
    }
    if (item.status !== "ACTIVE") errors.push(`Inventory item ${item.code} is not ACTIVE`);
    if (item.item_type !== "INVENTORY") errors.push(`Inventory item ${item.code} must have item_type INVENTORY`);
    if (item.posting_profile_status !== "ACTIVE") errors.push(`Item posting profile ${item.posting_profile_code} is not ACTIVE`);
    if (input.document_type === "INVENTORY_RECEIPT" && !item.is_purchased) errors.push(`Item posting profile for ${item.code} does not permit purchases`);
    if (input.document_type === "INVENTORY_ISSUE") {
      const issueLine = line as InventoryIssueRequestDto["lines"][number];
      if (issueLine.issue_purpose === "SOLD" && !item.is_sold) errors.push(`Item posting profile for ${item.code} does not permit sales`);
      if (issueLine.issue_purpose === "CONSUMED" && !item.is_consumed) errors.push(`Item posting profile for ${item.code} does not permit consumption`);
    }
  }

  for (const line of input.lines) {
    for (const [dimensionCode, valueName] of Object.entries(line.dimensions ?? {})) {
      const row = data.dimensionValuesByDimensionCodeAndName.get(`${dimensionCode}\u0000${valueName}`);
      if (!row) {
        errors.push(`Dimension value ${dimensionCode}=${valueName} was not found`);
        continue;
      }
      if (row.dimension_status !== "ACTIVE") errors.push(`Dimension ${dimensionCode} is not ACTIVE`);
      if (row.dimension_value_status !== "ACTIVE") errors.push(`Dimension value ${dimensionCode}=${valueName} is not ACTIVE`);
    }
  }

  if (errors.length) throw new InputValidationError(errors.join("; "));
}

