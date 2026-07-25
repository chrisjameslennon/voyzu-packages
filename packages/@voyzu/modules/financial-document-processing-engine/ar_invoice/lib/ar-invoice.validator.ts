import type { ArInvoiceRequestDto } from "@voyzu/types/modules/financial-document-processing-engine/ar-invoice.request.dto";
import { InputValidationError } from "@voyzu/capability/errors";
import type {
  CompanyPostingContextRow,
  ArInvoiceItemPostingProfileRow,
  ControlAccountPostingRow,
  CounterpartyPostingContextRow,
  DimensionValueLookupRow,
  DocumentProcessorValidationRow,
  FiscalPostingPeriodRow,
  PostingCodeAccountRow,
  TaxAuthorityRow,
  TaxComponentRow,
  TaxMovementControlAccountRow,
  TaxRuleRow,
} from "../db/ar-invoice-posting.row.types";
import {
  AR_INVOICE_ENGINE_CODE,
  AR_RECEIVABLE_CONTROL_CODE,
  REVENUE_POSTING_CODE,
  REVENUE_POSTING_CODE_SLOT,
  TAX_ON_SALES_MOVEMENT_CODE,
} from "./ar-invoice.types";

type FieldValidator<T> = (value: T) => string | null;

function createRequestValidator() {
  return {
    document_type: (_value) => null,
    company_code: (_value) => null,
    ar_counterparty_code: (_value) => null,
    ar_counterparty: (_value) => null,
    document_id: (_value) => null,
    document_memo: (_value) => null,
    invoice_date: (_value) => null,
    posting_date: (_value) => null,
    revenue_posting_code: (_value) => null,
    dimensions: (_value) => null,
    lines: (_value) => null,
  } satisfies {
    [K in keyof ArInvoiceRequestDto]-?: FieldValidator<ArInvoiceRequestDto[K]>;
  };
}

const BUSINESS_CODE_RE = /^[A-Z0-9_-]+$/;
const COUNTRY_RE = /^[A-Z]{2}$/;
const DOCUMENT_ID_RE = /^[A-Za-z0-9_-]{1,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const CALLER_SUPPLIED_TAX_RULE = "CALLER_SUPPLIED";

export interface ArInvoiceDataValidationContext {
  company: CompanyPostingContextRow | null;
  documentProcessor: DocumentProcessorValidationRow | null;
  counterparty: CounterpartyPostingContextRow | null;
  fiscalPeriod: FiscalPostingPeriodRow | null;
  arControlAccount: ControlAccountPostingRow | null;
  taxMovementControlAccount: TaxMovementControlAccountRow | null;
  defaultRevenuePostingCode: PostingCodeAccountRow | null;
  revenuePostingCodesByCode: Map<string, PostingCodeAccountRow>;
  itemPostingProfilesByItemCode: Map<string, ArInvoiceItemPostingProfileRow>;
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

function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== "";
}

function rejectUnexpected(record: Record<string, unknown>, allowed: readonly string[], path: string, errors: string[]): void {
  for (const key of Object.keys(record)) {
    if (!allowed.includes(key)) {
      errors.push(`${path}.${key} is not allowed`);
    }
  }
}

function validateBusinessCode(value: unknown, path: string, errors: string[]): void {
  if (!isNonEmptyString(value) || !BUSINESS_CODE_RE.test(value)) {
    errors.push(`${path} must be a non-empty business code`);
  }
}

function validateCountry(value: unknown, path: string, errors: string[]): void {
  if (!isNonEmptyString(value) || !COUNTRY_RE.test(value)) {
    errors.push(`${path} must be an ISO country code`);
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
  if (value !== undefined && value !== null && typeof value !== "string") {
    errors.push(`${path} must be a string or null`);
  }
}

function validateDocumentId(value: unknown, path: string, errors: string[]): void {
  if (!isNonEmptyString(value) || !DOCUMENT_ID_RE.test(value)) {
    errors.push(`${path} must use alphanumeric characters, underscore, or dash, with 20 characters maximum`);
  }
}

function validateDocumentMemo(value: unknown, path: string, errors: string[]): void {
  validateNullableString(value, path, errors);
  if (typeof value === "string" && value.length > 50) {
    errors.push(`${path} must be 50 characters or fewer`);
  }
}

function validateDimensions(value: unknown, path: string, errors: string[]): void {
  if (value === undefined || value === null) return;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object or null`);
    return;
  }

  for (const [key, val] of Object.entries(value)) {
    if (!BUSINESS_CODE_RE.test(key)) {
      errors.push(`${path}.${key} must use a valid dimension code`);
    }
    if (!isNonEmptyString(val)) {
      errors.push(`${path}.${key} must be a non-empty dimension value`);
    }
  }
}

function validateCounterpartyInput(value: unknown, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push("ar_counterparty must be an object");
    return;
  }

  rejectUnexpected(value, ["code", "name", "status", "country_code", "state_or_province_code"], "ar_counterparty", errors);

  validateBusinessCode(value.code, "ar_counterparty.code", errors);
  if (!isNonEmptyString(value.name)) {
    errors.push("ar_counterparty.name is required");
  }
  if (value.status !== "ACTIVE" && value.status !== "INACTIVE") {
    errors.push("ar_counterparty.status must be ACTIVE or INACTIVE");
  }
  validateCountry(value.country_code, "ar_counterparty.country_code", errors);
  validateNullableString(value.state_or_province_code, "ar_counterparty.state_or_province_code", errors);
}

function validateCallerSuppliedTaxComponent(value: unknown, path: string, errors: string[]): void {
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }

  rejectUnexpected(value, ["tax_authority_code", "tax_rate", "invoice_label"], path, errors);
  validateBusinessCode(value.tax_authority_code, `${path}.tax_authority_code`, errors);

  if (!isNumber(value.tax_rate) || value.tax_rate < 0 || value.tax_rate >= 1) {
    errors.push(`${path}.tax_rate must be a number greater than or equal to zero and less than one`);
  }
  validateNullableString(value.invoice_label, `${path}.invoice_label`, errors);
}

function validateLine(value: unknown, index: number, errors: string[]): void {
  const path = `lines[${index}]`;
  if (!isRecord(value)) {
    errors.push(`${path} must be an object`);
    return;
  }

  rejectUnexpected(value, [
    "line_id",
    "description",
    "quantity",
    "net_unit_price",
    "net_line_total",
    "revenue_posting_code",
    "inventory_item_code",
    "tax_rule",
    "tax_components",
    "dimensions",
  ], path, errors);

  if (value.line_id !== undefined && value.line_id !== null && (!Number.isInteger(value.line_id) || Number(value.line_id) < 1)) {
    errors.push(`${path}.line_id must be a positive integer or null`);
  }
  if (!isNonEmptyString(value.description)) {
    errors.push(`${path}.description is required`);
  }
  if (value.quantity !== undefined && value.quantity !== null && (!isNumber(value.quantity) || value.quantity <= 0)) {
    errors.push(`${path}.quantity must be greater than zero or null`);
  }
  if (value.net_unit_price !== undefined && value.net_unit_price !== null && (!isNumber(value.net_unit_price) || value.net_unit_price < 0)) {
    errors.push(`${path}.net_unit_price must be zero or greater or null`);
  }
  if (value.net_line_total !== undefined && value.net_line_total !== null && (!isNumber(value.net_line_total) || value.net_line_total < 0)) {
    errors.push(`${path}.net_line_total must be zero or greater or null`);
  }

  const hasQuantity = value.quantity !== undefined && value.quantity !== null;
  const hasNetUnitPrice = value.net_unit_price !== undefined && value.net_unit_price !== null;
  const hasLineTotal = value.net_line_total !== undefined && value.net_line_total !== null;
  if (hasQuantity !== hasNetUnitPrice) {
    errors.push(`${path} requires quantity and net_unit_price to be supplied together`);
  }
  if (!hasQuantity && !hasLineTotal) {
    errors.push(`${path} requires quantity + net_unit_price or net_line_total`);
  }
  if (hasQuantity && hasNetUnitPrice && hasLineTotal && isNumber(value.quantity) && isNumber(value.net_unit_price) && isNumber(value.net_line_total)) {
    const expected = Math.round((value.quantity * value.net_unit_price + Number.EPSILON) * 100) / 100;
    const supplied = Math.round((value.net_line_total + Number.EPSILON) * 100) / 100;
    if (expected !== supplied) {
      errors.push(`${path}.net_line_total must equal rounded quantity * net_unit_price`);
    }
  }

  if (value.revenue_posting_code !== undefined && value.revenue_posting_code !== null) {
    validateBusinessCode(value.revenue_posting_code, `${path}.revenue_posting_code`, errors);
  }
  if (value.inventory_item_code !== undefined && value.inventory_item_code !== null) {
    validateBusinessCode(value.inventory_item_code, `${path}.inventory_item_code`, errors);
  }
  validateBusinessCode(value.tax_rule, `${path}.tax_rule`, errors);

  const isCallerSupplied = value.tax_rule === CALLER_SUPPLIED_TAX_RULE;
  if (isCallerSupplied) {
    if (!Array.isArray(value.tax_components) || value.tax_components.length === 0) {
      errors.push(`${path}.tax_components must contain at least one component when tax_rule is CALLER_SUPPLIED`);
    } else {
      value.tax_components.forEach((component, componentIndex) => {
        validateCallerSuppliedTaxComponent(component, `${path}.tax_components[${componentIndex}]`, errors);
      });
    }
  } else if (value.tax_components !== undefined && value.tax_components !== null) {
    if (!Array.isArray(value.tax_components)) {
      errors.push(`${path}.tax_components must be an array or null`);
    } else if (value.tax_components.length > 0) {
      errors.push(`${path}.tax_components is only allowed when tax_rule is CALLER_SUPPLIED`);
    }
  }

  validateDimensions(value.dimensions, `${path}.dimensions`, errors);
}

function validateLineIds(lines: unknown[], errors: string[]): void {
  const supplied = lines
    .filter(isRecord)
    .map((line) => line.line_id)
    .filter((lineId) => lineId !== undefined && lineId !== null);

  if (supplied.length > 0 && supplied.length !== lines.length) {
    errors.push("line_id must be supplied for all lines or no lines");
  }

  const numericIds = supplied.filter((lineId): lineId is number => Number.isInteger(lineId));
  if (new Set(numericIds).size !== numericIds.length) {
    errors.push("line_id values must be unique");
  }
}

export function validateRequest(input: unknown): asserts input is ArInvoiceRequestDto {
  createRequestValidator();
  const errors: string[] = [];
  if (!isRecord(input)) throw new InputValidationError("Request body must be an object");

  rejectUnexpected(input, [
    "document_type",
    "company_code",
    "ar_counterparty_code",
    "ar_counterparty",
    "document_id",
    "document_memo",
    "invoice_date",
    "posting_date",
    "revenue_posting_code",
    "dimensions",
    "lines",
    "bank_cash_details",
    "items",
  ], "$", errors);
  if (hasValue(input.items)) errors.push("AR_INVOICE uses lines, not items");

  if (input.document_type !== undefined && input.document_type !== "AR_INVOICE") {
    errors.push("document_type must be AR_INVOICE");
  }

  if (!hasValue(input.company_code)) errors.push("company_code is required");
  else validateBusinessCode(input.company_code, "company_code", errors);

  const counterpartyResolvers = [input.ar_counterparty_code, input.ar_counterparty].filter(hasValue);
  if (counterpartyResolvers.length !== 1) {
    errors.push("Exactly one of ar_counterparty_code or ar_counterparty is required");
  }
  if (hasValue(input.ar_counterparty_code)) validateBusinessCode(input.ar_counterparty_code, "ar_counterparty_code", errors);
  if (hasValue(input.ar_counterparty)) validateCounterpartyInput(input.ar_counterparty, errors);

  if (hasValue(input.document_id)) validateDocumentId(input.document_id, "document_id", errors);
  validateDocumentMemo(input.document_memo, "document_memo", errors);
  validateDate(input.invoice_date, "invoice_date", errors);
  validateDate(input.posting_date, "posting_date", errors, true);

  if (input.revenue_posting_code !== undefined && input.revenue_posting_code !== null) {
    validateBusinessCode(input.revenue_posting_code, "revenue_posting_code", errors);
  }
  validateDimensions(input.dimensions, "dimensions", errors);

  if (!Array.isArray(input.lines) || input.lines.length === 0) {
    errors.push("lines must contain at least one line");
  } else {
    input.lines.forEach((line, index) => validateLine(line, index, errors));
    validateLineIds(input.lines, errors);
  }

  if (errors.length) throw new InputValidationError(errors.join("; "));
}

function postingDateFor(input: ArInvoiceRequestDto): string {
  return input.posting_date ?? input.invoice_date;
}

function mergedLineDimensions(input: ArInvoiceRequestDto): Array<{ lineIndex: number; dimensions: Record<string, string> }> {
  const headerDimensions = input.dimensions ?? {};
  return input.lines.map((line, lineIndex) => ({
    lineIndex,
    dimensions: { ...headerDimensions, ...(line.dimensions ?? {}) },
  }));
}

function requestedRevenuePostingCodes(input: ArInvoiceRequestDto): string[] {
  return [...new Set([
    input.revenue_posting_code ?? null,
    ...input.lines.map((line) => line.revenue_posting_code ?? null),
  ].filter((code): code is string => Boolean(code)))];
}

function needsDefaultRevenuePostingCode(input: ArInvoiceRequestDto): boolean {
  return input.lines.some((line) => !line.inventory_item_code && !line.revenue_posting_code && !input.revenue_posting_code);
}

function validateItemPostingProfiles(input: ArInvoiceRequestDto, data: ArInvoiceDataValidationContext, errors: string[]): void {
  input.lines.forEach((line, index) => {
    if (!line.inventory_item_code) return;
    const item = data.itemPostingProfilesByItemCode.get(line.inventory_item_code);
    if (!item) {
      errors.push(`lines[${index}].inventory_item_code ${line.inventory_item_code} was not found`);
      return;
    }
    if (item.item_status !== "ACTIVE") errors.push(`Inventory item ${item.item_code} is not ACTIVE`);
    if (item.profile_status !== "ACTIVE") errors.push(`Item posting profile ${item.profile_code} is not ACTIVE`);
    if (!item.is_sold) errors.push(`Item posting profile ${item.profile_code} does not permit sales`);

    const hasDocumentOverride = Boolean(line.revenue_posting_code || input.revenue_posting_code);
    if (hasDocumentOverride) return;
    if (!item.revenue_gl_account_id || !item.revenue_gl_account_code) {
      errors.push(`Item posting profile ${item.profile_code} does not have a revenue GL account`);
      return;
    }
    if (item.revenue_gl_account_type !== "REVENUE") {
      errors.push(`Item posting profile ${item.profile_code} revenue account is not a REVENUE GL account`);
    }
    if (item.revenue_gl_account_status !== "ACTIVE") {
      errors.push(`Item posting profile ${item.profile_code} revenue account is not ACTIVE`);
    }
  });
}

function validateCompany(input: ArInvoiceRequestDto, data: ArInvoiceDataValidationContext, errors: string[]): void {
  if (!data.company) {
    errors.push(`Company ${input.company_code ?? ""} was not found`);
    return;
  }
  if (data.company.code !== input.company_code) {
    errors.push(`Resolved company ${data.company.code} does not match requested company ${input.company_code}`);
  }
  if (data.company.status !== "ACTIVE") {
    errors.push(`Company ${data.company.code} is not ACTIVE`);
  }
}

function validateDocumentProcessor(data: ArInvoiceDataValidationContext, hasDimensions: boolean, hasBankCashDetails: boolean, hasItems: boolean, errors: string[]): void {
  if (!data.documentProcessor) {
    errors.push(`${AR_INVOICE_ENGINE_CODE} document processor is not configured`);
    return;
  }
  if (data.documentProcessor.status !== "ACTIVE") {
    errors.push(`${AR_INVOICE_ENGINE_CODE} document processor is not ACTIVE`);
  }
  if (hasDimensions && !data.documentProcessor.supports_dimensions) {
    errors.push(`${AR_INVOICE_ENGINE_CODE} does not support dimensions`);
  }
  if (hasBankCashDetails && !data.documentProcessor.cash_movement) {
    errors.push(`${AR_INVOICE_ENGINE_CODE} does not support bank_cash_details`);
  }
  if (hasItems && !data.documentProcessor.supports_items) {
    errors.push(`${AR_INVOICE_ENGINE_CODE} does not support items`);
  }
}

function validateCounterparty(input: ArInvoiceRequestDto, data: ArInvoiceDataValidationContext, errors: string[]): void {
  if (!data.counterparty) {
    const code = input.ar_counterparty_code ?? input.ar_counterparty?.code ?? "";
    errors.push(`AR counterparty ${code} was not found or created`);
    return;
  }
  if (data.company && data.counterparty.company_id !== data.company.id) {
    errors.push(`AR counterparty ${data.counterparty.code} does not belong to company ${data.company.code}`);
  }
  if (input.ar_counterparty_code && data.counterparty.code !== input.ar_counterparty_code) {
    errors.push(`Resolved AR counterparty ${data.counterparty.code} does not match requested counterparty ${input.ar_counterparty_code}`);
  }
  if (input.ar_counterparty?.code && data.counterparty.code !== input.ar_counterparty.code) {
    errors.push(`Resolved AR counterparty ${data.counterparty.code} does not match inline counterparty ${input.ar_counterparty.code}`);
  }
  if (data.counterparty.status !== "ACTIVE") {
    errors.push(`AR counterparty ${data.counterparty.code} is not ACTIVE`);
  }
}

function validateFiscalPeriod(input: ArInvoiceRequestDto, data: ArInvoiceDataValidationContext, errors: string[]): void {
  const postingDate = postingDateFor(input);
  if (!data.fiscalPeriod) {
    errors.push(`No OPEN fiscal period contains posting date ${postingDate}`);
    return;
  }
  if (data.fiscalPeriod.financial_year_status !== "OPEN") {
    errors.push(`Financial year ${data.fiscalPeriod.financial_year_code} is not OPEN`);
  }
  if (data.fiscalPeriod.financial_period_status !== "OPEN") {
    errors.push(`Financial period ${data.fiscalPeriod.financial_period_code} is not OPEN`);
  }
  if (postingDate < data.fiscalPeriod.period_start_date || postingDate > data.fiscalPeriod.period_end_date) {
    errors.push(`Posting date ${postingDate} is outside fiscal period ${data.fiscalPeriod.financial_period_code}`);
  }
}

function validatePostingCodeAccount(row: PostingCodeAccountRow, code: string, errors: string[]): void {
  if (row.code !== code) {
    errors.push(`Resolved revenue posting code ${row.code} does not match requested code ${code}`);
  }
  if (row.document_code !== AR_INVOICE_ENGINE_CODE) {
    errors.push(`Revenue posting code ${code} is not valid for ${AR_INVOICE_ENGINE_CODE}.${REVENUE_POSTING_CODE_SLOT}`);
  }
  if (row.status !== "ACTIVE") {
    errors.push(`Revenue posting code ${code} is not ACTIVE`);
  }
  if (row.gl_account_type !== "REVENUE") {
    errors.push(`Revenue posting code ${code} does not resolve to a REVENUE GL account`);
  }
  if (row.gl_account_status !== "ACTIVE") {
    errors.push(`Revenue posting code ${code} resolves to an inactive GL account`);
  }
}

function validateRevenuePostingCodes(input: ArInvoiceRequestDto, data: ArInvoiceDataValidationContext, errors: string[]): void {
  for (const code of requestedRevenuePostingCodes(input)) {
    const row = data.revenuePostingCodesByCode.get(code);
    if (!row) {
      errors.push(`Revenue posting code ${code} was not found for ${AR_INVOICE_ENGINE_CODE}.${REVENUE_POSTING_CODE_SLOT}`);
      continue;
    }
    validatePostingCodeAccount(row, code, errors);
  }

  if (needsDefaultRevenuePostingCode(input)) {
    if (!data.defaultRevenuePostingCode) {
      errors.push(`No active default revenue posting code ${REVENUE_POSTING_CODE} is configured for ${AR_INVOICE_ENGINE_CODE}.${REVENUE_POSTING_CODE_SLOT}`);
    } else {
      validatePostingCodeAccount(data.defaultRevenuePostingCode, data.defaultRevenuePostingCode.code, errors);
      if (data.defaultRevenuePostingCode.code !== REVENUE_POSTING_CODE) {
        errors.push(`Default revenue posting code ${data.defaultRevenuePostingCode.code} does not match configured posting code ${REVENUE_POSTING_CODE}`);
      }
    }
  }
}

function validateControlAccounts(data: ArInvoiceDataValidationContext, errors: string[]): void {
  if (!data.arControlAccount) {
    errors.push(`${AR_RECEIVABLE_CONTROL_CODE} control account is not configured`);
  } else {
    if (data.arControlAccount.control_account_status !== "ACTIVE") {
      errors.push(`${AR_RECEIVABLE_CONTROL_CODE} control account is not ACTIVE`);
    }
    if (data.arControlAccount.gl_account_status !== "ACTIVE") {
      errors.push(`${AR_RECEIVABLE_CONTROL_CODE} control account resolves to an inactive GL account`);
    }
  }

  if (!data.taxMovementControlAccount) {
    errors.push(`${TAX_ON_SALES_MOVEMENT_CODE} tax control account is not configured`);
  } else {
    if (data.taxMovementControlAccount.tax_movement_type_status !== "ACTIVE") {
      errors.push(`${TAX_ON_SALES_MOVEMENT_CODE} Tax control account is not ACTIVE`);
    }
    if (data.taxMovementControlAccount.gl_account_status !== "ACTIVE") {
      errors.push(`${TAX_ON_SALES_MOVEMENT_CODE} Tax control account resolves to an inactive GL account`);
    }
  }
}

function validateDimensionsData(input: ArInvoiceRequestDto, data: ArInvoiceDataValidationContext, errors: string[]): void {
  for (const { lineIndex, dimensions } of mergedLineDimensions(input)) {
    for (const [dimensionCode, dimensionValueName] of Object.entries(dimensions)) {
      const row = data.dimensionValuesByDimensionCodeAndName.get(`${dimensionCode}\u0000${dimensionValueName}`);
      if (!row) {
        errors.push(`lines[${lineIndex}].dimensions.${dimensionCode} value ${dimensionValueName} was not found`);
        continue;
      }
      if (row.dimension_status !== "ACTIVE") {
        errors.push(`Dimension ${dimensionCode} is not ACTIVE`);
      }
      if (row.dimension_value_status !== "ACTIVE") {
        errors.push(`Dimension ${dimensionCode} value ${dimensionValueName} is not ACTIVE`);
      }
    }
  }
}

function validateTaxData(input: ArInvoiceRequestDto, data: ArInvoiceDataValidationContext, errors: string[]): void {
  for (let lineIndex = 0; lineIndex < input.lines.length; lineIndex++) {
    const line = input.lines[lineIndex];
    const taxRule = data.taxRulesByCode.get(line.tax_rule);
    if (!taxRule) {
      errors.push(`lines[${lineIndex}].tax_rule ${line.tax_rule} was not found`);
      continue;
    }
    if (taxRule.status !== "ACTIVE") {
      errors.push(`lines[${lineIndex}].tax_rule ${line.tax_rule} is not ACTIVE`);
    }
    if (data.company && taxRule.country_code !== data.company.country_code) {
      errors.push(`lines[${lineIndex}].tax_rule ${line.tax_rule} is not valid for company country ${data.company.country_code}`);
    }

    if (line.tax_rule === CALLER_SUPPLIED_TAX_RULE) {
      if (taxRule.calculation_method !== "CALLER_SUPPLIED") {
        errors.push(`lines[${lineIndex}].tax_rule CALLER_SUPPLIED is not configured as CALLER_SUPPLIED`);
      }
      for (let componentIndex = 0; componentIndex < (line.tax_components ?? []).length; componentIndex++) {
        const supplied = line.tax_components?.[componentIndex];
        if (!supplied) continue;
        const authority = data.taxAuthoritiesByCode.get(supplied.tax_authority_code);
        if (!authority) {
          errors.push(`lines[${lineIndex}].tax_components[${componentIndex}].tax_authority_code ${supplied.tax_authority_code} was not found`);
          continue;
        }
        if (authority.status !== "ACTIVE") {
          errors.push(`Tax authority ${authority.code} is not ACTIVE`);
        }
        if (data.company && authority.country_code !== data.company.country_code) {
          errors.push(`Tax authority ${authority.code} is not valid for company country ${data.company.country_code}`);
        }
      }
      continue;
    }

    if (taxRule.calculation_method === "CALLER_SUPPLIED") {
      errors.push(`lines[${lineIndex}].tax_rule ${line.tax_rule} requires caller supplied tax components`);
      continue;
    }

    const components = data.taxComponentsByRuleCode.get(line.tax_rule) ?? [];
    if (taxRule.calculation_method === "NO_TAX") {
      if (components.length > 0) {
        errors.push(`lines[${lineIndex}].tax_rule ${line.tax_rule} is NO_TAX but has configured tax components`);
      }
      continue;
    }

    if (taxRule.calculation_method === "CONFIGURED_COMPONENTS") {
      if (components.length === 0) {
        errors.push(`lines[${lineIndex}].tax_rule ${line.tax_rule} has no configured tax components`);
      }
      if (components.length !== taxRule.component_count) {
        errors.push(`lines[${lineIndex}].tax_rule ${line.tax_rule} expected ${taxRule.component_count} tax components but resolved ${components.length}`);
      }
      for (const component of components) {
        if (component.status !== "ACTIVE") {
          errors.push(`Tax component ${component.code} is not ACTIVE`);
        }
        if (component.tax_rule_code !== taxRule.code || component.tax_rule_country_code !== taxRule.country_code) {
          errors.push(`Tax component ${component.code} does not belong to tax rule ${taxRule.code}`);
        }
      }
    }
  }
}

export function validateData(input: ArInvoiceRequestDto, data: ArInvoiceDataValidationContext): void {
  const errors: string[] = [];
  const hasDimensions = mergedLineDimensions(input).some(({ dimensions }) => Object.keys(dimensions).length > 0);
  const hasBankCashDetails = hasValue((input as unknown as Record<string, unknown>).bank_cash_details);
  const hasItems = input.lines.length > 0;

  validateCompany(input, data, errors);
  validateDocumentProcessor(data, hasDimensions, hasBankCashDetails, hasItems, errors);
  validateCounterparty(input, data, errors);
  validateFiscalPeriod(input, data, errors);
  validateRevenuePostingCodes(input, data, errors);
  validateItemPostingProfiles(input, data, errors);
  validateControlAccounts(data, errors);
  if (hasDimensions) validateDimensionsData(input, data, errors);
  validateTaxData(input, data, errors);

  if (errors.length) throw new InputValidationError(errors.join("; "));
}

