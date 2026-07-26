import type {
  GlAccountCategoryCreateRequestDto,
  GlAccountCategoryPatchRequestDto,
  GlAccountCategoryResponseDto,
  GlAccountCategoryUpdateRequestDto,
} from "@voyzu-modules/core/types/modules/gl-account-categories";

const VALID_ACCOUNT_TYPES = ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"];
const VALID_STATUSES = ["ACTIVE", "INACTIVE"];

type FieldValidator<T> = (value: T) => string | null;

function validateFields<T extends object>(input: T, validators: { [K in keyof T]-?: FieldValidator<T[K]> }): string[] {
  return (Object.keys(validators) as Array<keyof T>)
    .map((key) => validators[key](input[key]))
    .filter((error): error is string => error !== null);
}

function validateCode(value: string | undefined): string | null {
  if (!value?.trim()) return "Code is required";
  return null;
}

function validateName(value: string | undefined): string | null {
  if (!value?.trim()) return "Name is required";
  return null;
}

function validateAccountType(value: string | undefined): string | null {
  if (!value || !VALID_ACCOUNT_TYPES.includes(value)) {
    return "Account type must be ASSET, LIABILITY, EQUITY, REVENUE, or EXPENSE";
  }
  return null;
}

function validateSequence(value: number | undefined): string | null {
  if (value === undefined || !Number.isInteger(value) || value <= 0) {
    return "Sequence must be a positive integer";
  }
  return null;
}

function validateStatus(value: string | undefined): string | null {
  if (!value || !VALID_STATUSES.includes(value)) return "Status must be ACTIVE or INACTIVE";
  return null;
}

function createCreateValidator() {
  return {
    code: validateCode,
    name: validateName,
    accountType: validateAccountType,
    sequence: validateSequence,
  } satisfies {
    [K in keyof GlAccountCategoryCreateRequestDto]-?: FieldValidator<GlAccountCategoryCreateRequestDto[K]>;
  };
}

export function validateCreate(input: GlAccountCategoryCreateRequestDto): string[] {
  return validateFields(input, createCreateValidator());
}

function createUpdateValidator() {
  return {
    name: validateName,
    accountType: validateAccountType,
    sequence: validateSequence,
  } satisfies {
    [K in keyof GlAccountCategoryUpdateRequestDto]-?: FieldValidator<GlAccountCategoryUpdateRequestDto[K]>;
  };
}

export function validateUpdate(input: GlAccountCategoryUpdateRequestDto): string[] {
  return validateFields(input, createUpdateValidator());
}

function createPatchValidator() {
  return {
    name: (value) => value === undefined ? null : validateName(value),
    accountType: (value) => value === undefined ? null : validateAccountType(value),
    sequence: (value) => value === undefined ? null : validateSequence(value),
  } satisfies {
    [K in keyof GlAccountCategoryPatchRequestDto]-?: FieldValidator<GlAccountCategoryPatchRequestDto[K]>;
  };
}

export function validatePatch(input: GlAccountCategoryPatchRequestDto): string[] {
  return validateFields(input, createPatchValidator());
}

function createResponseValidator() {
  return {
    id: (value) => Number.isInteger(value) ? null : "id is required",
    code: validateCode,
    name: validateName,
    accountType: validateAccountType,
    sequence: validateSequence,
    status: validateStatus,
    hasPostings: (value) => typeof value === "boolean" ? null : "hasPostings must be a boolean",
    companiesWithPostings: (value) => {
      if (!Array.isArray(value)) return "companiesWithPostings must be an array";
      return value.some((companyCode) => typeof companyCode !== "string") ? "companiesWithPostings must contain strings" : null;
    },
    linkedBy: (value) => Array.isArray(value) ? null : "linkedBy must be an array",
    audit: (value) => {
      if (!value?.created?.date) return "audit.created.date is required";
      if (!value?.updated?.date) return "audit.updated.date is required";
      return null;
    },
  } satisfies {
    [K in keyof GlAccountCategoryResponseDto]-?: FieldValidator<GlAccountCategoryResponseDto[K]>;
  };
}

export function validateResponse(input: GlAccountCategoryResponseDto): string[] {
  return validateFields(input, createResponseValidator());
}
