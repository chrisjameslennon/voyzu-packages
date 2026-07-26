import type { ApBillRequestDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ap-bill.request.dto";
import { InputValidationError } from "@voyzu/capability/errors";

import type {
  ApBillItemPostingProfileRow,
  CompanyPostingContextRow,
  ControlAccountPostingRow,
  CounterpartyPostingContextRow,
  DimensionValueLookupRow,
  DocumentProcessorValidationRow,
  FiscalPostingPeriodRow,
  InventoryControlAccountPostingRow,
  PostingCodeAccountRow,
  TaxAuthorityRow,
  TaxComponentRow,
  TaxMovementControlAccountRow,
  TaxRuleRow,
} from "../db/ap-bill-posting.row.types";
import { AP_BILL_ENGINE_CODE, CALLER_SUPPLIED_TAX_RULE_CODE, PURCHASE_POSTING_CODE, PURCHASE_POSTING_CODE_SLOT } from "./ap-bill.types";

type FieldValidator<T> = (value: T) => string | null;

function createRequestValidator() {
  return {
    document_type: (_value) => null,
    company_code: (_value) => null,
    ap_counterparty_code: (_value) => null,
    ap_counterparty: (_value) => null,
    document_id: (_value) => null,
    supplier_invoice_number: (_value) => null,
    memo: (_value) => null,
    bill_date: (_value) => null,
    posting_date: (_value) => null,
    tax_recoverable: (_value) => null,
    purchase_posting_code: (_value) => null,
    dimensions: (_value) => null,
    lines: (_value) => null,
  } satisfies {
    [K in keyof ApBillRequestDto]-?: FieldValidator<ApBillRequestDto[K]>;
  };
}

const BUSINESS_CODE_RE = /^[A-Z0-9_-]+$/;
const COUNTRY_RE = /^[A-Z]{2}$/;
const DOCUMENT_ID_RE = /^[A-Za-z0-9_-]{1,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface ApBillDataValidationContext {
  company: CompanyPostingContextRow | null;
  documentProcessor: DocumentProcessorValidationRow | null;
  counterparty: CounterpartyPostingContextRow | null;
  duplicateSupplierBill: { id: number } | null;
  fiscalPeriod: FiscalPostingPeriodRow | null;
  apControlAccount: ControlAccountPostingRow | null;
  inventoryControlAccount: InventoryControlAccountPostingRow | null;
  taxMovementControlAccount: TaxMovementControlAccountRow | null;
  defaultPurchasePostingCode: PostingCodeAccountRow | null;
  purchasePostingCodesByCode: Map<string, PostingCodeAccountRow>;
  itemPostingProfilesByItemCode: Map<string, ApBillItemPostingProfileRow>;
  taxRulesByCode: Map<string, TaxRuleRow>;
  taxComponentsByRuleCode: Map<string, TaxComponentRow[]>;
  taxAuthoritiesByCode: Map<string, TaxAuthorityRow>;
  dimensionValuesByDimensionCodeAndName: Map<string, DimensionValueLookupRow>;
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

function isFiniteAmount(value: unknown): boolean {
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "string" && value.trim() !== "") return Number.isFinite(Number(value));
  return false;
}

function amount(value: unknown): number {
  return typeof value === "number" ? value : Number(value);
}

function rejectUnexpected(record: Record<string, unknown>, allowed: readonly string[], path: string, errors: string[]): void {
  for (const key of Object.keys(record)) {
    if (!allowed.includes(key)) errors.push(`${path}.${key} is not allowed`);
  }
}

function validateBusinessCode(value: unknown, path: string, errors: string[]): void {
  if (!isNonEmptyString(value) || !BUSINESS_CODE_RE.test(value)) errors.push(`${path} must be a non-empty business code`);
}

function validateCountry(value: unknown, path: string, errors: string[]): void {
  if (!isNonEmptyString(value) || !COUNTRY_RE.test(value)) errors.push(`${path} must be an ISO country code`);
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

function validateAmount(value: unknown, path: string, errors: string[]): void {
  if (!isFiniteAmount(value) || amount(value) < 0) errors.push(`${path} must be a number zero or greater`);
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

function validateCallerSuppliedTaxComponent(value: unknown, path: string, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  rejectUnexpected(value, ["tax_authority_code", "tax_rate", "invoice_label"], path, errors);
  validateBusinessCode(value.tax_authority_code, `${path}.tax_authority_code`, errors);
  if (typeof value.tax_rate !== "number" || value.tax_rate < 0 || value.tax_rate >= 1) {
    errors.push(`${path}.tax_rate must be a number greater than or equal to zero and less than one`);
  }
  validateNullableString(value.invoice_label, `${path}.invoice_label`, errors);
}

function validateCounterpartyInput(value: unknown, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push("ap_counterparty must be an object");
    return;
  }
  rejectUnexpected(value, ["code", "name", "status", "country_code", "state_or_province_code"], "ap_counterparty", errors);
  validateBusinessCode(value.code, "ap_counterparty.code", errors);
  if (!isNonEmptyString(value.name)) errors.push("ap_counterparty.name is required");
  if (value.status !== "ACTIVE" && value.status !== "INACTIVE") errors.push("ap_counterparty.status must be ACTIVE or INACTIVE");
  validateCountry(value.country_code, "ap_counterparty.country_code", errors);
  validateNullableString(value.state_or_province_code, "ap_counterparty.state_or_province_code", errors);
}

function validateLine(value: unknown, index: number, errors: string[]): void {
  const path = `lines[${index}]`;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }
  rejectUnexpected(value, [
    "line_id", "description", "quantity", "net_amount", "gross_amount", "tax_rule", "tax_components",
    "tax_recoverable", "purchase_posting_code", "inventory_item_code", "dimensions",
  ], path, errors);
  if (value.line_id !== undefined && value.line_id !== null && (!Number.isInteger(value.line_id) || Number(value.line_id) < 1)) {
    errors.push(`${path}.line_id must be a positive integer or null`);
  }
  if (!isNonEmptyString(value.description)) errors.push(`${path}.description is required`);
  if (value.quantity !== undefined && value.quantity !== null) {
    if (!isFiniteAmount(value.quantity) || amount(value.quantity) <= 0) errors.push(`${path}.quantity must be greater than zero or null`);
  }
  validateBusinessCode(value.tax_rule, `${path}.tax_rule`, errors);
  const isCallerSupplied = value.tax_rule === CALLER_SUPPLIED_TAX_RULE_CODE;
  if (isCallerSupplied) {
    if (!Array.isArray(value.tax_components) || value.tax_components.length === 0) {
      errors.push(`${path}.tax_components must contain at least one component when tax_rule is ${CALLER_SUPPLIED_TAX_RULE_CODE}`);
    } else {
      value.tax_components.forEach((component, componentIndex) => {
        validateCallerSuppliedTaxComponent(component, `${path}.tax_components[${componentIndex}]`, errors);
      });
    }
  } else if (value.tax_components !== undefined && value.tax_components !== null) {
    if (!Array.isArray(value.tax_components)) errors.push(`${path}.tax_components must be an array or null`);
    else if (value.tax_components.length > 0) errors.push(`${path}.tax_components is only allowed when tax_rule is ${CALLER_SUPPLIED_TAX_RULE_CODE}`);
  }
  if (value.tax_recoverable !== undefined && value.tax_recoverable !== null && typeof value.tax_recoverable !== "boolean") {
    errors.push(`${path}.tax_recoverable must be a boolean or null`);
  }
  if (value.purchase_posting_code !== undefined && value.purchase_posting_code !== null) validateBusinessCode(value.purchase_posting_code, `${path}.purchase_posting_code`, errors);
  if (value.inventory_item_code !== undefined && value.inventory_item_code !== null) validateBusinessCode(value.inventory_item_code, `${path}.inventory_item_code`, errors);
  if (value.inventory_item_code && !hasValue(value.quantity)) errors.push(`${path}.quantity is required when inventory_item_code is supplied`);
  validateDimensions(value.dimensions, `${path}.dimensions`, errors);

  validateAmount(value.net_amount, `${path}.net_amount`, errors);
  if (value.gross_amount !== undefined && value.gross_amount !== null) {
    validateAmount(value.gross_amount, `${path}.gross_amount`, errors);
  }
}

function validateLineIds(lines: unknown[], errors: string[]): void {
  const supplied = lines.filter(isRecord).map((line) => line.line_id).filter((lineId) => lineId !== undefined && lineId !== null);
  if (supplied.length > 0 && supplied.length !== lines.length) errors.push("line_id must be supplied for all lines or no lines");
  const numericIds = supplied.filter((lineId): lineId is number => Number.isInteger(lineId));
  if (new Set(numericIds).size !== numericIds.length) errors.push("line_id values must be unique");
}

export function validateRequest(input: unknown): asserts input is ApBillRequestDto {
  createRequestValidator();
  const errors: string[] = [];
  if (!isRecord(input)) throw new InputValidationError("Request body must be an object");
  rejectUnexpected(input, [
    "document_type", "company_code", "ap_counterparty_code", "ap_counterparty",
    "document_id", "supplier_invoice_number", "memo", "bill_date", "posting_date",
    "tax_recoverable", "purchase_posting_code",
    "dimensions", "lines", "bank_cash_details", "items",
  ], "$", errors);
  if (hasValue(input.items)) errors.push("AP_BILL uses lines, not items");
  if (input.document_type !== undefined && input.document_type !== "AP_BILL") errors.push("document_type must be AP_BILL");
  if (!hasValue(input.company_code)) errors.push("company_code is required");
  else validateBusinessCode(input.company_code, "company_code", errors);
  const counterpartyResolvers = [input.ap_counterparty_code, input.ap_counterparty].filter(hasValue);
  if (counterpartyResolvers.length !== 1) errors.push("Exactly one of ap_counterparty_code or ap_counterparty is required");
  if (hasValue(input.ap_counterparty_code)) validateBusinessCode(input.ap_counterparty_code, "ap_counterparty_code", errors);
  if (hasValue(input.ap_counterparty)) validateCounterpartyInput(input.ap_counterparty, errors);
  if (hasValue(input.document_id)) validateDocumentId(input.document_id, "document_id", errors);
  if (!isNonEmptyString(input.supplier_invoice_number)) errors.push("supplier_invoice_number is required");
  validateNullableString(input.memo, "memo", errors);
  if (typeof input.memo === "string" && input.memo.length > 50) errors.push("memo must be 50 characters or fewer");
  validateDate(input.bill_date, "bill_date", errors);
  validateDate(input.posting_date, "posting_date", errors, true);
  if (input.tax_recoverable !== undefined && input.tax_recoverable !== null && typeof input.tax_recoverable !== "boolean") {
    errors.push("tax_recoverable must be a boolean or null");
  }
  if (input.purchase_posting_code !== undefined && input.purchase_posting_code !== null) validateBusinessCode(input.purchase_posting_code, "purchase_posting_code", errors);
  validateDimensions(input.dimensions, "dimensions", errors);
  if (!Array.isArray(input.lines) || input.lines.length === 0) {
    errors.push("lines must contain at least one line");
  } else {
    input.lines.forEach((line, index) => validateLine(line, index, errors));
    validateLineIds(input.lines, errors);
  }
  if (errors.length) throw new InputValidationError(errors.join("; "));
}

function postingDateFor(input: ApBillRequestDto): string {
  return input.posting_date ?? input.bill_date;
}

function mergedLineDimensions(input: ApBillRequestDto): Array<{ lineIndex: number; dimensions: Record<string, string> }> {
  const headerDimensions = input.dimensions ?? {};
  return input.lines.map((line, lineIndex) => ({ lineIndex, dimensions: { ...headerDimensions, ...(line.dimensions ?? {}) } }));
}

function requestedPurchasePostingCodes(input: ApBillRequestDto): string[] {
  return [...new Set([
    input.purchase_posting_code ?? null,
    ...input.lines.map((line) => line.purchase_posting_code ?? null),
  ].filter((code): code is string => Boolean(code)))];
}

function needsDefaultPurchasePostingCode(input: ApBillRequestDto): boolean {
  return input.lines.some((line) => !line.inventory_item_code && !line.purchase_posting_code && !input.purchase_posting_code);
}

function validateItemPostingProfiles(input: ApBillRequestDto, data: ApBillDataValidationContext, errors: string[]): void {
  input.lines.forEach((line, index) => {
    if (!line.inventory_item_code) return;
    const item = data.itemPostingProfilesByItemCode.get(line.inventory_item_code);
    if (!item) {
      errors.push(`lines[${index}].inventory_item_code ${line.inventory_item_code} was not found`);
      return;
    }
    if (item.item_status !== "ACTIVE") errors.push(`Inventory item ${item.item_code} is not ACTIVE`);
    if (item.profile_status !== "ACTIVE") errors.push(`Item posting profile ${item.profile_code} is not ACTIVE`);
    if (!item.is_purchased) errors.push(`Item posting profile ${item.profile_code} does not permit purchases`);

    const hasDocumentOverride = Boolean(line.purchase_posting_code || input.purchase_posting_code);
    if (hasDocumentOverride || item.item_type === "INVENTORY") return;
    if (!item.purchase_gl_account_id || !item.purchase_gl_account_code) {
      errors.push(`Item posting profile ${item.profile_code} does not have a purchase expense GL account`);
      return;
    }
    if (item.purchase_gl_account_type !== "EXPENSE" && item.purchase_gl_account_type !== "ASSET") {
      errors.push(`Item posting profile ${item.profile_code} purchase account is not an EXPENSE or ASSET GL account`);
    }
    if (item.purchase_gl_account_status !== "ACTIVE") {
      errors.push(`Item posting profile ${item.profile_code} purchase account is not ACTIVE`);
    }
  });
}

function validateCompany(input: ApBillRequestDto, data: ApBillDataValidationContext, errors: string[]): void {
  if (!data.company) {
    errors.push(`Company ${input.company_code ?? ""} was not found`);
    return;
  }
  if (data.company.status !== "ACTIVE") errors.push(`Company ${data.company.code} is not ACTIVE`);
}

function validateDocumentProcessor(data: ApBillDataValidationContext, hasDimensions: boolean, hasBankCashDetails: boolean, hasItems: boolean, errors: string[]): void {
  if (!data.documentProcessor) {
    errors.push("AP_BILL document processor is not configured");
    return;
  }
  if (data.documentProcessor.status !== "ACTIVE") errors.push("AP_BILL document processor is not ACTIVE");
  if (hasDimensions && !data.documentProcessor.supports_dimensions) errors.push("AP_BILL does not support dimensions");
  if (hasBankCashDetails && !data.documentProcessor.cash_movement) errors.push("AP_BILL does not support bank_cash_details");
  if (hasItems && !data.documentProcessor.supports_items) errors.push("AP_BILL does not support items");
}

function validateCounterparty(input: ApBillRequestDto, data: ApBillDataValidationContext, errors: string[]): void {
  if (!data.counterparty) {
    const code = input.ap_counterparty_code ?? input.ap_counterparty?.code ?? "";
    errors.push(`AP counterparty ${code} was not found or created`);
    return;
  }
  if (data.company && data.counterparty.company_id !== data.company.id) errors.push(`AP counterparty ${data.counterparty.code} does not belong to company ${data.company.code}`);
  if (input.ap_counterparty_code && data.counterparty.code !== input.ap_counterparty_code) errors.push(`Resolved AP counterparty ${data.counterparty.code} does not match requested counterparty ${input.ap_counterparty_code}`);
  if (data.counterparty.status !== "ACTIVE") errors.push(`AP counterparty ${data.counterparty.code} is not ACTIVE`);
}

function validateFiscalPeriod(input: ApBillRequestDto, data: ApBillDataValidationContext, errors: string[]): void {
  const postingDate = postingDateFor(input);
  if (!data.fiscalPeriod) {
    errors.push(`No OPEN fiscal period contains posting date ${postingDate}`);
    return;
  }
  if (data.fiscalPeriod.financial_year_status !== "OPEN") errors.push(`Financial year ${data.fiscalPeriod.financial_year_code} is not OPEN`);
  if (data.fiscalPeriod.financial_period_status !== "OPEN") errors.push(`Financial period ${data.fiscalPeriod.financial_period_code} is not OPEN`);
}

function validatePostingCodeAccount(row: PostingCodeAccountRow, code: string, errors: string[]): void {
  if (row.code !== code) errors.push(`Resolved purchase posting code ${row.code} does not match requested code ${code}`);
  if (row.document_code !== AP_BILL_ENGINE_CODE) errors.push(`Purchase posting code ${code} is not valid for ${AP_BILL_ENGINE_CODE}.${PURCHASE_POSTING_CODE_SLOT}`);
  if (row.status !== "ACTIVE") errors.push(`Purchase posting code ${code} is not ACTIVE`);
  if (row.gl_account_type !== "EXPENSE" && row.gl_account_type !== "ASSET") errors.push(`Purchase posting code ${code} does not resolve to an EXPENSE or ASSET GL account`);
  if (row.gl_account_status !== "ACTIVE") errors.push(`Purchase posting code ${code} resolves to an inactive GL account`);
}

function validatePurchasePostingCodes(input: ApBillRequestDto, data: ApBillDataValidationContext, errors: string[]): void {
  for (const code of requestedPurchasePostingCodes(input)) {
    const row = data.purchasePostingCodesByCode.get(code);
    if (!row) {
      errors.push(`Purchase posting code ${code} was not found for AP_BILL.purchase_posting_code`);
      continue;
    }
    validatePostingCodeAccount(row, code, errors);
  }
  if (needsDefaultPurchasePostingCode(input)) {
    if (!data.defaultPurchasePostingCode) errors.push(`Default purchase posting code ${PURCHASE_POSTING_CODE} is not configured for ${AP_BILL_ENGINE_CODE}.${PURCHASE_POSTING_CODE_SLOT}`);
    else {
      validatePostingCodeAccount(data.defaultPurchasePostingCode, PURCHASE_POSTING_CODE, errors);
    }
  }
}

function validateControlAccounts(data: ApBillDataValidationContext, errors: string[]): void {
  if (!data.apControlAccount) errors.push("AP_TRADE_PAYABLES control account is not configured");
  else {
    if (data.apControlAccount.control_account_status !== "ACTIVE") errors.push("AP_TRADE_PAYABLES control account is not ACTIVE");
    if (data.apControlAccount.gl_account_status !== "ACTIVE") errors.push("AP_TRADE_PAYABLES control account resolves to an inactive GL account");
  }
  if (!data.taxMovementControlAccount) errors.push("TAX_ON_PURCHASES tax control account is not configured");
  else {
    if (data.taxMovementControlAccount.tax_movement_type_status !== "ACTIVE") errors.push("TAX_ON_PURCHASES Tax control account is not ACTIVE");
    if (data.taxMovementControlAccount.gl_account_status !== "ACTIVE") errors.push("TAX_ON_PURCHASES Tax control account resolves to an inactive GL account");
  }

  if (!data.inventoryControlAccount) errors.push("INVENTORY_CONTROL account is not configured");
  else {
    if (data.inventoryControlAccount.control_account_status !== "ACTIVE") errors.push("INVENTORY_CONTROL account is not ACTIVE");
    if (data.inventoryControlAccount.gl_account_status !== "ACTIVE") errors.push("INVENTORY_CONTROL resolves to an inactive GL account");
  }
}

function validateTaxData(input: ApBillRequestDto, data: ApBillDataValidationContext, errors: string[]): void {
  for (let lineIndex = 0; lineIndex < input.lines.length; lineIndex++) {
    const line = input.lines[lineIndex];
    const taxRule = data.taxRulesByCode.get(line.tax_rule);
    if (!taxRule) {
      errors.push(`lines[${lineIndex}].tax_rule ${line.tax_rule} was not found`);
      continue;
    }
    if (taxRule.status !== "ACTIVE") errors.push(`lines[${lineIndex}].tax_rule ${line.tax_rule} is not ACTIVE`);
    if (data.company && taxRule.country_code !== data.company.country_code) {
      errors.push(`lines[${lineIndex}].tax_rule ${line.tax_rule} is not valid for company country ${data.company.country_code}`);
    }

    if (line.tax_rule === CALLER_SUPPLIED_TAX_RULE_CODE) {
      if (taxRule.calculation_method !== "CALLER_SUPPLIED") errors.push(`lines[${lineIndex}].tax_rule ${CALLER_SUPPLIED_TAX_RULE_CODE} is not configured as CALLER_SUPPLIED`);
      for (let componentIndex = 0; componentIndex < (line.tax_components ?? []).length; componentIndex++) {
        const supplied = line.tax_components?.[componentIndex];
        if (!supplied) continue;
        const authority = data.taxAuthoritiesByCode.get(supplied.tax_authority_code);
        if (!authority) {
          errors.push(`lines[${lineIndex}].tax_components[${componentIndex}].tax_authority_code ${supplied.tax_authority_code} was not found`);
          continue;
        }
        if (authority.status !== "ACTIVE") errors.push(`Tax authority ${authority.code} is not ACTIVE`);
        if (data.company && authority.country_code !== data.company.country_code) errors.push(`Tax authority ${authority.code} is not valid for company country ${data.company.country_code}`);
      }
      continue;
    }

    if (taxRule.calculation_method === "CALLER_SUPPLIED") {
      errors.push(`lines[${lineIndex}].tax_rule ${line.tax_rule} requires caller supplied tax components`);
      continue;
    }

    const components = data.taxComponentsByRuleCode.get(line.tax_rule) ?? [];
    if (taxRule.calculation_method === "NO_TAX") {
      if (components.length > 0) errors.push(`lines[${lineIndex}].tax_rule ${line.tax_rule} is NO_TAX but has configured tax components`);
      continue;
    }

    if (taxRule.calculation_method === "CONFIGURED_COMPONENTS") {
      if (components.length === 0) errors.push(`lines[${lineIndex}].tax_rule ${line.tax_rule} has no configured tax components`);
      if (components.length !== taxRule.component_count) {
        errors.push(`lines[${lineIndex}].tax_rule ${line.tax_rule} expected ${taxRule.component_count} tax components but resolved ${components.length}`);
      }
      for (const component of components) {
        if (component.status !== "ACTIVE") errors.push(`Tax component ${component.code} is not ACTIVE`);
        if (component.tax_rule_code !== taxRule.code || component.tax_rule_country_code !== taxRule.country_code) {
          errors.push(`Tax component ${component.code} does not belong to tax rule ${taxRule.code}`);
        }
      }
    }
  }
}

function validateDimensionsData(input: ApBillRequestDto, data: ApBillDataValidationContext, errors: string[]): void {
  for (const { lineIndex, dimensions } of mergedLineDimensions(input)) {
    for (const [dimensionCode, dimensionValueName] of Object.entries(dimensions)) {
      const row = data.dimensionValuesByDimensionCodeAndName.get(`${dimensionCode}\u0000${dimensionValueName}`);
      if (!row) {
        errors.push(`lines[${lineIndex}].dimensions.${dimensionCode} value ${dimensionValueName} was not found`);
        continue;
      }
      if (row.dimension_status !== "ACTIVE") errors.push(`Dimension ${dimensionCode} is not ACTIVE`);
      if (row.dimension_value_status !== "ACTIVE") errors.push(`Dimension ${dimensionCode} value ${dimensionValueName} is not ACTIVE`);
    }
  }
}

export function validateData(input: ApBillRequestDto, data: ApBillDataValidationContext): void {
  const errors: string[] = [];
  const hasDimensions = mergedLineDimensions(input).some(({ dimensions }) => Object.keys(dimensions).length > 0);
  const hasBankCashDetails = hasValue((input as unknown as Record<string, unknown>).bank_cash_details);
  const hasItems = input.lines.length > 0 || input.lines.some((line) => Boolean(line.inventory_item_code));
  validateCompany(input, data, errors);
  validateDocumentProcessor(data, hasDimensions, hasBankCashDetails, hasItems, errors);
  validateCounterparty(input, data, errors);
  if (data.duplicateSupplierBill) errors.push(`Supplier invoice number ${input.supplier_invoice_number} has already been posted for this AP counterparty`);
  validateFiscalPeriod(input, data, errors);
  validatePurchasePostingCodes(input, data, errors);
  validateItemPostingProfiles(input, data, errors);
  validateControlAccounts(data, errors);
  validateTaxData(input, data, errors);
  if (hasDimensions) validateDimensionsData(input, data, errors);
  if (errors.length) throw new InputValidationError(errors.join("; "));
}

