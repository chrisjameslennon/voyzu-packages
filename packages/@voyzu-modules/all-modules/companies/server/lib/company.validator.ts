import type { CompanyCreateRequestDto } from "@voyzu-modules/types/modules/companies";
import type { CompanyPatchRequestDto } from "@voyzu-modules/types/modules/companies";
import type { CompanyResponseDto } from "@voyzu-modules/types/modules/companies";
import type { CompanyUpdateRequestDto } from "@voyzu-modules/types/modules/companies";

type FieldValidator<T> = (value: T) => string | null;

const VALID_TAX_FILING_INTERVALS = [1, 2, 3, 6, 12];

function validateTaxFilingAnchorMonth(value: number | undefined): string | null {
  if (value === undefined) return null;
  if (!Number.isInteger(value) || value < 1 || value > 12) return "Tax filing anchor month must be between 1 and 12";
  return null;
}

function validateTaxFilingIntervalMonths(value: number | undefined): string | null {
  if (value === undefined) return null;
  if (!VALID_TAX_FILING_INTERVALS.includes(value)) return "Tax filing interval months must be 1, 2, 3, 6, or 12";
  return null;
}

function validateUseOrganizationStandardSettings(value: boolean | undefined): string | null {
  if (value !== undefined && typeof value !== "boolean") return "useOrganizationStandardSettings must be a boolean";
  return null;
}

// Create

function createCreateValidator() {
  return {
    code: (value) => {
      if (!value || value.trim().length === 0) return "Code is required";
      return null;
    },

    name: (value) => {
      if (!value || value.trim().length === 0) return "Name is required";
      return null;
    },

    countryCode: (value) => {
      if (!value || !/^[A-Z]{2}$/.test(value)) {
        return "Country code must be a valid ISO 3166-1 alpha-2 code";
      }
      return null;
    },

    baseCurrencyCode: (value) => {
      if (!value || !/^[A-Z]{3}$/.test(value)) {
        return "Base currency code must be a valid ISO 4217 code";
      }
      return null;
    },

    reportLine1: (_value) => null,
    reportLine2: (_value) => null,
    reportFooter: (_value) => null,
    taxFilingAnchorMonth: validateTaxFilingAnchorMonth,
    taxFilingIntervalMonths: validateTaxFilingIntervalMonths,
    useOrganizationStandardSettings: validateUseOrganizationStandardSettings,
  } satisfies {
    [K in keyof CompanyCreateRequestDto]-?: FieldValidator<CompanyCreateRequestDto[K]>;
  };
}

export function validateCreate(input: CompanyCreateRequestDto): string[] {
  const errors: string[] = [];
  const v = createCreateValidator();

  const codeErr = v.code(input.code);
  if (codeErr) errors.push(codeErr);

  const nameErr = v.name(input.name);
  if (nameErr) errors.push(nameErr);

  const countryErr = v.countryCode(input.countryCode);
  if (countryErr) errors.push(countryErr);

  const currencyErr = v.baseCurrencyCode(input.baseCurrencyCode);
  if (currencyErr) errors.push(currencyErr);

  const line1Err = v.reportLine1(input.reportLine1);
  if (line1Err) errors.push(line1Err);

  const line2Err = v.reportLine2(input.reportLine2);
  if (line2Err) errors.push(line2Err);

  const footerErr = v.reportFooter(input.reportFooter);
  if (footerErr) errors.push(footerErr);

  const taxFilingAnchorErr = v.taxFilingAnchorMonth(input.taxFilingAnchorMonth);
  if (taxFilingAnchorErr) errors.push(taxFilingAnchorErr);

  const taxFilingIntervalErr = v.taxFilingIntervalMonths(input.taxFilingIntervalMonths);
  if (taxFilingIntervalErr) errors.push(taxFilingIntervalErr);

  const useStandardSettingsErr = v.useOrganizationStandardSettings(input.useOrganizationStandardSettings);
  if (useStandardSettingsErr) errors.push(useStandardSettingsErr);

  return errors;
}

// Treat as "replace": required fields must be present/valid


function createUpdateValidator() {
  return {
    code: (value) => {
      if (!value || !/^[A-Z0-9_-]{1,14}$/.test(value)) return "Code must be 1 to 14 capital letters, numbers, dashes or underscores";
      return null;
    },
    name: (value) => {
      if (!value || value.trim().length === 0) return "Name is required";
      return null;
    },

    countryCode: (value) => {
      if (!value || !/^[A-Z]{2}$/.test(value)) {
        return "Country code must be a valid ISO 3166-1 alpha-2 code";
      }
      return null;
    },

    baseCurrencyCode: (value) => {
      if (!value || !/^[A-Z]{3}$/.test(value)) {
        return "Base currency code must be a valid ISO 4217 code";
      }
      return null;
    },

    reportLine1: (_value) => null,
    reportLine2: (_value) => null,
    reportFooter: (_value) => null,
    taxFilingAnchorMonth: validateTaxFilingAnchorMonth,
    taxFilingIntervalMonths: validateTaxFilingIntervalMonths,
    useOrganizationStandardSettings: validateUseOrganizationStandardSettings,
  } satisfies {
    [K in keyof CompanyUpdateRequestDto]-?: FieldValidator<CompanyUpdateRequestDto[K]>;
  };
}

export function validateUpdate(input: CompanyUpdateRequestDto): string[] {
  const errors: string[] = [];
  const v = createUpdateValidator();

  const codeErr = v.code(input.code);
  if (codeErr) errors.push(codeErr);

  const nameErr = v.name(input.name);
  if (nameErr) errors.push(nameErr);

  const countryErr = v.countryCode(input.countryCode);
  if (countryErr) errors.push(countryErr);

  const currencyErr = v.baseCurrencyCode(input.baseCurrencyCode);
  if (currencyErr) errors.push(currencyErr);

  const line1Err = v.reportLine1(input.reportLine1);
  if (line1Err) errors.push(line1Err);

  const line2Err = v.reportLine2(input.reportLine2);
  if (line2Err) errors.push(line2Err);

  const footerErr = v.reportFooter(input.reportFooter);
  if (footerErr) errors.push(footerErr);

  const taxFilingAnchorErr = v.taxFilingAnchorMonth(input.taxFilingAnchorMonth);
  if (taxFilingAnchorErr) errors.push(taxFilingAnchorErr);

  const taxFilingIntervalErr = v.taxFilingIntervalMonths(input.taxFilingIntervalMonths);
  if (taxFilingIntervalErr) errors.push(taxFilingIntervalErr);

  const useStandardSettingsErr = v.useOrganizationStandardSettings(input.useOrganizationStandardSettings);
  if (useStandardSettingsErr) errors.push(useStandardSettingsErr);

  return errors;
}

// Treat as "partial": only validate provided fields


function createPatchValidator() {
  return {
    code: (value) => {
      if (value !== undefined && !/^[A-Z0-9_-]{1,14}$/.test(value)) return "Code must be 1 to 14 capital letters, numbers, dashes or underscores";
      return null;
    },
    name: (value) => {
      if (value !== undefined && value.trim().length === 0) return "Name cannot be empty";
      return null;
    },

    countryCode: (value) => {
      if (value !== undefined && !/^[A-Z]{2}$/.test(value)) {
        return "Country code must be a valid ISO 3166-1 alpha-2 code";
      }
      return null;
    },

    baseCurrencyCode: (value) => {
      if (value !== undefined && !/^[A-Z]{3}$/.test(value)) {
        return "Base currency code must be a valid ISO 4217 code";
      }
      return null;
    },

    reportLine1: (_value) => null,
    reportLine2: (_value) => null,
    reportFooter: (_value) => null,
    taxFilingAnchorMonth: validateTaxFilingAnchorMonth,
    taxFilingIntervalMonths: validateTaxFilingIntervalMonths,
    useOrganizationStandardSettings: validateUseOrganizationStandardSettings,
  } satisfies {
    [K in keyof CompanyPatchRequestDto]-?: FieldValidator<CompanyPatchRequestDto[K]>;
  };
}

const PATCH_ALLOWED_KEYS = new Set<string>(["code", "name", "countryCode", "baseCurrencyCode", "taxFilingAnchorMonth", "taxFilingIntervalMonths", "useOrganizationStandardSettings", "reportLine1", "reportLine2", "reportFooter"]);

export function validatePatch(input: CompanyPatchRequestDto): string[] {
  const errors: string[] = [];

  const suppliedKeys = Object.keys(input);

  const unknownKeys = suppliedKeys.filter((k) => !PATCH_ALLOWED_KEYS.has(k));
  if (unknownKeys.length) {
    errors.push(`Unknown field(s): ${unknownKeys.join(", ")}`);
    return errors;
  }

  const knownSupplied = suppliedKeys.filter((k) => PATCH_ALLOWED_KEYS.has(k));
  if (knownSupplied.length === 0) {
    errors.push("At least one field must be provided");
    return errors;
  }

  const v = createPatchValidator();

  const codeErr = v.code(input.code);
  if (codeErr) errors.push(codeErr);

  const nameErr = v.name(input.name);
  if (nameErr) errors.push(nameErr);

  const countryErr = v.countryCode(input.countryCode);
  if (countryErr) errors.push(countryErr);

  const currencyErr = v.baseCurrencyCode(input.baseCurrencyCode);
  if (currencyErr) errors.push(currencyErr);

  const line1Err = v.reportLine1(input.reportLine1);
  if (line1Err) errors.push(line1Err);

  const line2Err = v.reportLine2(input.reportLine2);
  if (line2Err) errors.push(line2Err);

  const footerErr = v.reportFooter(input.reportFooter);
  if (footerErr) errors.push(footerErr);

  const taxFilingAnchorErr = v.taxFilingAnchorMonth(input.taxFilingAnchorMonth);
  if (taxFilingAnchorErr) errors.push(taxFilingAnchorErr);

  const taxFilingIntervalErr = v.taxFilingIntervalMonths(input.taxFilingIntervalMonths);
  if (taxFilingIntervalErr) errors.push(taxFilingIntervalErr);

  const useStandardSettingsErr = v.useOrganizationStandardSettings(input.useOrganizationStandardSettings);
  if (useStandardSettingsErr) errors.push(useStandardSettingsErr);

  return errors;
}


function createResponseValidator() {
  return {
    id: (value) => {
      if (value === undefined || value === null || !Number.isFinite(value)) return "id is required";
      return null;
    },

    code: (value) => {
      if (!value || value.trim().length === 0) return "code is required";
      return null;
    },

    name: (value) => {
      if (!value || value.trim().length === 0) return "name is required";
      return null;
    },

    countryCode: (value) => {
      if (!value || !/^[A-Z]{2}$/.test(value)) return "countryCode must be a valid ISO 3166-1 alpha-2 code";
      return null;
    },

    country: (_value) => null,

    baseCurrencyCode: (value) => {
      if (!value || !/^[A-Z]{3}$/.test(value)) return "baseCurrencyCode must be a valid ISO 4217 code";
      return null;
    },

    baseCurrency: (_value) => null,

    reportLine1: (_value) => null,
    reportLine2: (_value) => null,
    reportFooter: (_value) => null,
    taxFilingAnchorMonth: validateTaxFilingAnchorMonth,
    taxFilingIntervalMonths: validateTaxFilingIntervalMonths,
    useOrganizationStandardSettings: (value) => {
      if (typeof value !== "boolean") return "useOrganizationStandardSettings must be a boolean";
      return null;
    },

    status: (value) => {
      if (value !== "ACTIVE" && value !== "INACTIVE") return "status must be ACTIVE or INACTIVE";
      return null;
    },

    hasPostings: (value) => {
      if (typeof value !== "boolean") return "hasPostings must be a boolean";
      return null;
    },

    audit: (value) => {
      if (!value) return "audit is required";
      if (!value.created) return "audit.created is required";
      if (!value.updated) return "audit.updated is required";
      if (!value.created.date || value.created.date.trim().length === 0) return "audit.created.date is required";
      if (!value.updated.date || value.updated.date.trim().length === 0) return "audit.updated.date is required";
      return null;
    },
  } satisfies {
    [K in keyof CompanyResponseDto]-?: FieldValidator<CompanyResponseDto[K]>;
  };
}

export function validateResponse(input: CompanyResponseDto): string[] {
  const errors: string[] = [];
  const v = createResponseValidator();

  const idErr = v.id(input.id);
  if (idErr) errors.push(idErr);

  const codeErr = v.code(input.code);
  if (codeErr) errors.push(codeErr);

  const nameErr = v.name(input.name);
  if (nameErr) errors.push(nameErr);

  const countryErr = v.countryCode(input.countryCode);
  if (countryErr) errors.push(countryErr);

  const currencyErr = v.baseCurrencyCode(input.baseCurrencyCode);
  if (currencyErr) errors.push(currencyErr);

  const line1Err = v.reportLine1(input.reportLine1);
  if (line1Err) errors.push(line1Err);

  const line2Err = v.reportLine2(input.reportLine2);
  if (line2Err) errors.push(line2Err);

  const footerErr = v.reportFooter(input.reportFooter);
  if (footerErr) errors.push(footerErr);

  const taxFilingAnchorErr = v.taxFilingAnchorMonth(input.taxFilingAnchorMonth);
  if (taxFilingAnchorErr) errors.push(taxFilingAnchorErr);

  const taxFilingIntervalErr = v.taxFilingIntervalMonths(input.taxFilingIntervalMonths);
  if (taxFilingIntervalErr) errors.push(taxFilingIntervalErr);

  const useStandardSettingsErr = v.useOrganizationStandardSettings(input.useOrganizationStandardSettings);
  if (useStandardSettingsErr) errors.push(useStandardSettingsErr);

  const statusErr = v.status(input.status);
  if (statusErr) errors.push(statusErr);

  const postingsErr = v.hasPostings(input.hasPostings);
  if (postingsErr) errors.push(postingsErr);

  const auditErr = v.audit(input.audit);
  if (auditErr) errors.push(auditErr);

  return errors;
}
