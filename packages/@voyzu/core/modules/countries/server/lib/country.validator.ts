import type {
  CountryCreateRequestDto,
  CountryPatchRequestDto,
  CountryResponseDto,
  CountryUpdateRequestDto,
} from "@voyzu/core/types/modules/countries";

const VALID_STATUSES = ["ACTIVE", "INACTIVE"];
const VALID_TAX_FILING_INTERVALS = [1, 2, 3, 6, 12];

type FieldValidator<T> = (value: T) => string | null;

function validateFields<T extends object>(input: T, validators: { [K in keyof T]-?: FieldValidator<T[K]> }): string[] {
  return (Object.keys(validators) as Array<keyof T>)
    .map((key) => validators[key](input[key]))
    .filter((error): error is string => error !== null);
}

function requiredText(value: string | undefined, label: string): string | null {
  return value?.trim() ? null : `${label} is required`;
}

function validateTaxFilingAnchorMonth(value: number | undefined): string | null {
  return value === undefined || (Number.isInteger(value) && value >= 1 && value <= 12)
    ? null
    : "Tax filing anchor month must be between 1 and 12";
}

function validateTaxFilingIntervalMonths(value: number | undefined): string | null {
  return value === undefined || VALID_TAX_FILING_INTERVALS.includes(value)
    ? null
    : "Tax filing interval months must be 1, 2, 3, 6, or 12";
}

function createCreateValidator() {
  return {
    code: (value) => requiredText(value, "Code"),
    name: (value) => requiredText(value, "Name"),
    currencyCode: (value) => requiredText(value, "Default currency code"),
    taxFilingAnchorMonth: validateTaxFilingAnchorMonth,
    taxFilingIntervalMonths: validateTaxFilingIntervalMonths,
  } satisfies {
    [K in keyof CountryCreateRequestDto]-?: FieldValidator<CountryCreateRequestDto[K]>;
  };
}

export function validateCreate(input: CountryCreateRequestDto): string[] {
  return validateFields(input, createCreateValidator());
}

function createUpdateValidator() {
  return {
    name: (value) => requiredText(value, "Name"),
    currencyCode: (value) => requiredText(value, "Default currency code"),
    taxFilingAnchorMonth: validateTaxFilingAnchorMonth,
    taxFilingIntervalMonths: validateTaxFilingIntervalMonths,
  } satisfies {
    [K in keyof CountryUpdateRequestDto]-?: FieldValidator<CountryUpdateRequestDto[K]>;
  };
}

export function validateUpdate(input: CountryUpdateRequestDto): string[] {
  return validateFields(input, createUpdateValidator());
}

function createPatchValidator() {
  return {
    name: (value) => value === undefined || value.trim() ? null : "name must not be empty",
    currencyCode: (value) => value === undefined || value.trim() ? null : "currencyCode must not be empty",
    taxFilingAnchorMonth: validateTaxFilingAnchorMonth,
    taxFilingIntervalMonths: validateTaxFilingIntervalMonths,
  } satisfies {
    [K in keyof CountryPatchRequestDto]-?: FieldValidator<CountryPatchRequestDto[K]>;
  };
}

export function validatePatch(input: CountryPatchRequestDto): string[] {
  return validateFields(input, createPatchValidator());
}

function createResponseValidator() {
  return {
    id: (value) => requiredText(value, "id"),
    code: (value) => requiredText(value, "code"),
    name: (value) => requiredText(value, "name"),
    currencyCode: (value) => requiredText(value, "currencyCode"),
    financialPeriodStartMonth: (value) => value === null || typeof value === "string" ? null : "financialPeriodStartMonth must be text or null",
    taxFilingAnchorMonth: validateTaxFilingAnchorMonth,
    taxFilingIntervalMonths: validateTaxFilingIntervalMonths,
    taxAuthorities: (value) => value === undefined || Array.isArray(value) ? null : "taxAuthorities must be an array",
    taxRules: (value) => value === undefined || Array.isArray(value) ? null : "taxRules must be an array",
    taxComponents: (value) => value === undefined || Array.isArray(value) ? null : "taxComponents must be an array",
    currency: (value) => value?.code && value?.name ? null : "currency code and name are required",
    status: (value) => VALID_STATUSES.includes(value) ? null : "status must be ACTIVE or INACTIVE",
    hasPostings: (value) => typeof value === "boolean" ? null : "hasPostings must be a boolean",
    linkedBy: (value) => Array.isArray(value) ? null : "linkedBy must be an array",
    audit: (value) => {
      if (!value?.created?.date?.trim()) return "audit.created.date is required";
      if (!value?.updated?.date?.trim()) return "audit.updated.date is required";
      return null;
    },
  } satisfies {
    [K in keyof CountryResponseDto]-?: FieldValidator<CountryResponseDto[K]>;
  };
}

export function validateResponse(input: CountryResponseDto): string[] {
  return validateFields(input, createResponseValidator());
}
