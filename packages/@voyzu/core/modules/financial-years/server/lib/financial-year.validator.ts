import type { FinancialYearCreateRequestDto } from "@voyzu/core/types/modules/financial-years";
import type { FinancialYearPatchRequestDto } from "@voyzu/core/types/modules/financial-years";
import type { FinancialYearResponseDto, FinancialYearStatus } from "@voyzu/core/types/modules/financial-years";

const CODE_PATTERN = /^[A-Z0-9_-]+$/;
const VALID_STATUSES: FinancialYearStatus[] = ["INACTIVE", "PLANNED", "OPEN", "CLOSED"];

type FieldValidator<T> = (value: T) => string | null;

function validateFields<T extends object>(input: T, validators: { [K in keyof T]-?: FieldValidator<T[K]> }): string[] {
  return (Object.keys(validators) as Array<keyof T>)
    .map((key) => validators[key](input[key]))
    .filter((error): error is string => error !== null);
}

function validateCode(value: string | undefined): string | null {
  if (!value || value.trim().length === 0) return "Code is required";
  if (!CODE_PATTERN.test(value)) return "Code can only contain capital letters, numbers, dashes and underscores";
  if (value.length > 14) return "Code must be 14 characters or less";
  return null;
}

function validateDateRange(startDate: string | undefined, endDate: string | undefined): string[] {
  const errors: string[] = [];
  if (!startDate || startDate.trim().length === 0) {
    errors.push("Start date is required");
  }
  if (!endDate || endDate.trim().length === 0) {
    errors.push("End date is required");
  }
  if (errors.length) return errors;

  const start = new Date(startDate!);
  const end = new Date(endDate!);

  if (isNaN(start.getTime())) {
    errors.push("Start date is not a valid date");
    return errors;
  }
  if (isNaN(end.getTime())) {
    errors.push("End date is not a valid date");
    return errors;
  }
  if (start >= end) {
    errors.push("Start date must be before end date");
    return errors;
  }

  // Must be exactly one calendar year (365 or 366 days)
  const diffMs = end.getTime() - start.getTime() + 86_400_000; // include end day
  const diffDays = Math.round(diffMs / 86_400_000);
  if (diffDays !== 365 && diffDays !== 366) {
    errors.push("Financial year must span exactly one calendar year (365 or 366 days)");
  }

  return errors;
}

function validateName(value: string | undefined): string | null {
  if (value === undefined) return null;
  if (value.trim().length === 0) return "Name cannot be blank";
  if (value.length > 120) return "Name must be 120 characters or less";
  return null;
}

function validateRequiredDate(value: string | undefined, label: string): string | null {
  if (!value?.trim()) return `${label} is required`;
  return Number.isNaN(new Date(value).getTime()) ? `${label} is not a valid date` : null;
}

function createCreateValidator() {
  return {
    code: validateCode,
    name: validateName,
    startDate: (value) => validateRequiredDate(value, "Start date"),
    endDate: (value) => validateRequiredDate(value, "End date"),
    status: (value) => VALID_STATUSES.includes(value) ? null : "Status must be one of: INACTIVE, PLANNED, OPEN, CLOSED",
  } satisfies {
    [K in keyof FinancialYearCreateRequestDto]-?: FieldValidator<FinancialYearCreateRequestDto[K]>;
  };
}

// ── Create ────────────────────────────────────────────────────

export function validateCreate(input: FinancialYearCreateRequestDto): string[] {
  const errors = validateFields(input, createCreateValidator());
  if (!errors.some((error) => error.startsWith("Start date") || error.startsWith("End date"))) {
    errors.push(...validateDateRange(input.startDate, input.endDate));
  }
  return errors;
}

// ── Patch ─────────────────────────────────────────────────────

function createPatchValidator() {
  return {
    code: (value) => value === undefined ? null : validateCode(value),
    name: validateName,
    startDate: (value) => value === undefined ? null : validateRequiredDate(value, "Start date"),
    endDate: (value) => value === undefined ? null : validateRequiredDate(value, "End date"),
  } satisfies {
    [K in keyof FinancialYearPatchRequestDto]-?: FieldValidator<FinancialYearPatchRequestDto[K]>;
  };
}

export function validatePatch(input: FinancialYearPatchRequestDto): string[] {
  const errors = validateFields(input, createPatchValidator());
  if ((input.startDate !== undefined || input.endDate !== undefined)
    && !errors.some((error) => error.startsWith("Start date") || error.startsWith("End date"))) {
    errors.push(...validateDateRange(input.startDate, input.endDate));
  }
  return errors;
}

// ── Response ──────────────────────────────────────────────────

function createResponseValidator() {
  return {
    id: (value) => value && Number.isFinite(value) ? null : "id is required",
    code: (value) => value?.trim() ? null : "code is required",
    name: (value) => value?.trim() ? null : "name is required",
    companyId: (value) => value && Number.isFinite(value) ? null : "companyId is required",
    startDate: (value) => value?.trim() ? null : "startDate is required",
    endDate: (value) => value?.trim() ? null : "endDate is required",
    status: (value) => VALID_STATUSES.includes(value) ? null : "status is invalid",
    hasPostings: (value) => typeof value === "boolean" ? null : "hasPostings is required",
    audit: (value) => {
      if (!value?.created?.date?.trim()) return "audit.created.date is required";
      if (!value?.updated?.date?.trim()) return "audit.updated.date is required";
      return null;
    },
  } satisfies {
    [K in keyof FinancialYearResponseDto]-?: FieldValidator<FinancialYearResponseDto[K]>;
  };
}

export function validateResponse(input: FinancialYearResponseDto): string[] {
  return validateFields(input, createResponseValidator());
}
