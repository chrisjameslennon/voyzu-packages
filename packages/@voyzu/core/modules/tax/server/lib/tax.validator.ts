import type { TaxAuthorityResponseDto, TaxComponentResponseDto, TaxRuleResponseDto } from "@voyzu/core/types/modules/tax";
import { validateFields, type FieldValidator } from "@voyzu/capability/validation";

const text = (value: string) => value?.trim() ? null : "value is required";
const nullableText = (value: string | null) => value === null || value.trim() ? null : "value must be non-blank or null";
const status = (value: string) => value === "ACTIVE" || value === "INACTIVE" ? null : "status is invalid";
const audit = (value: TaxAuthorityResponseDto["audit"]) => value?.created?.date && value?.updated?.date ? null : "audit timestamps are required";

function authorityValidators() {
  return {
    id: (value) => Number.isInteger(value) && value > 0 ? null : "id must be a positive integer",
    code: text,
    name: text,
    countryCode: text,
    regionCode: nullableText,
    jurisdictionLevel: text,
    taxFamilyCode: (value) => value === "INDIRECT_TAX" ? null : "taxFamilyCode is invalid",
    description: nullableText,
    status,
    audit,
  } satisfies { [K in keyof TaxAuthorityResponseDto]-?: FieldValidator<TaxAuthorityResponseDto[K]> };
}

function ruleValidators() {
  return {
    id: (value) => Number.isInteger(value) && value > 0 ? null : "id must be a positive integer",
    code: text,
    countryCode: text,
    regionCode: nullableText,
    name: text,
    invoiceLabel: text,
    reportLabel: text,
    calculationMethod: (value) => value === "NO_TAX" || value === "CONFIGURED_COMPONENTS" ? null : "calculationMethod is invalid",
    componentMode: (value) => value === "NONE" || value === "CONFIGURED" ? null : "componentMode is invalid",
    componentCount: (value) => Number.isInteger(value) && value >= 0 ? null : "componentCount must be a non-negative integer",
    description: nullableText,
    status,
    audit,
  } satisfies { [K in keyof TaxRuleResponseDto]-?: FieldValidator<TaxRuleResponseDto[K]> };
}

function componentValidators() {
  return {
    id: (value) => Number.isInteger(value) && value > 0 ? null : "id must be a positive integer",
    code: text,
    taxRuleCode: text,
    taxAuthorityCode: text,
    schemeCode: text,
    invoiceLabel: text,
    reportLabel: text,
    rate: (value) => Number.isFinite(value) ? null : "rate must be a number",
    baseAmountType: (value) => value === "LINE_NET_AMOUNT" ? null : "baseAmountType is invalid",
    calculationOrder: (value) => Number.isInteger(value) && value >= 0 ? null : "calculationOrder must be a non-negative integer",
    description: nullableText,
    status,
    audit,
  } satisfies { [K in keyof TaxComponentResponseDto]-?: FieldValidator<TaxComponentResponseDto[K]> };
}

export const validateTaxAuthorityResponse = (input: TaxAuthorityResponseDto) => validateFields(input, authorityValidators());
export const validateTaxRuleResponse = (input: TaxRuleResponseDto) => validateFields(input, ruleValidators());
export const validateTaxComponentResponse = (input: TaxComponentResponseDto) => validateFields(input, componentValidators());
