import type {
  BankCashAccountCreateRequestDto,
  BankCashAccountPatchRequestDto,
  BankCashAccountResponseDto,
  BankCashAccountUpdateRequestDto,
} from "@voyzu/core/types/modules/bank-cash-accounts";

const CODE_RE = /^[A-Z0-9_-]{1,40}$/;

type FieldValidator<T> = (value: T) => string | null;

function validateFields<T extends object>(input: T, validators: { [K in keyof T]-?: FieldValidator<T[K]> }): string[] {
  return (Object.keys(validators) as Array<keyof T>)
    .map((key) => validators[key](input[key]))
    .filter((error): error is string => error !== null);
}

function validateCode(value: string | undefined): string | null {
  return CODE_RE.test(value ?? "") ? null : "code must be 1-40 characters using capital letters, numbers, dashes or underscores";
}

function validateType(value: string | undefined): string | null {
  return value && ["BANK", "CASH", "OTHER"].includes(value) ? null : "type must be BANK, CASH or OTHER";
}

function validateGlAccountId(value: number | undefined): string | null {
  return Number.isFinite(value) ? null : "glAccountId is required";
}

function optionalText(value: string | null | undefined, label: string, max: number): string | null {
  if (value == null) return null;
  return typeof value === "string" && value.trim() === value && value.length <= max
    ? null
    : `${label} must be trimmed text of ${max} characters or less`;
}

function createCreateValidator() {
  return {
    code: validateCode,
    type: validateType,
    glAccountId: validateGlAccountId,
    bankName: (value) => optionalText(value, "bankName", 50),
    bankBranchName: (value) => optionalText(value, "bankBranchName", 50),
    bankAccountIdentifier: (value) => optionalText(value, "bankAccountIdentifier", 100),
    cashAccountIdentifier: (value) => optionalText(value, "cashAccountIdentifier", 100),
  } satisfies {
    [K in keyof BankCashAccountCreateRequestDto]-?: FieldValidator<BankCashAccountCreateRequestDto[K]>;
  };
}

export function validateCreate(input: BankCashAccountCreateRequestDto): string[] {
  return validateFields(input, createCreateValidator());
}

function createUpdateValidator() {
  return {
    code: validateCode,
    type: validateType,
    glAccountId: validateGlAccountId,
    bankName: (value) => optionalText(value, "bankName", 50),
    bankBranchName: (value) => optionalText(value, "bankBranchName", 50),
    bankAccountIdentifier: (value) => optionalText(value, "bankAccountIdentifier", 100),
    cashAccountIdentifier: (value) => optionalText(value, "cashAccountIdentifier", 100),
  } satisfies {
    [K in keyof BankCashAccountUpdateRequestDto]-?: FieldValidator<BankCashAccountUpdateRequestDto[K]>;
  };
}

export function validateUpdate(input: BankCashAccountUpdateRequestDto): string[] {
  return validateFields(input, createUpdateValidator());
}

function createPatchValidator() {
  return {
    code: (value) => value === undefined ? null : validateCode(value),
    type: (value) => value === undefined ? null : validateType(value),
    glAccountId: (value) => value === undefined ? null : validateGlAccountId(value),
    bankName: (value) => optionalText(value, "bankName", 50),
    bankBranchName: (value) => optionalText(value, "bankBranchName", 50),
    bankAccountIdentifier: (value) => optionalText(value, "bankAccountIdentifier", 100),
    cashAccountIdentifier: (value) => optionalText(value, "cashAccountIdentifier", 100),
  } satisfies {
    [K in keyof BankCashAccountPatchRequestDto]-?: FieldValidator<BankCashAccountPatchRequestDto[K]>;
  };
}

export function validatePatch(input: BankCashAccountPatchRequestDto): string[] {
  return validateFields(input, createPatchValidator());
}

function createResponseValidator() {
  return {
    id: (value) => Number.isInteger(value) && value > 0 ? null : "id must be a positive integer",
    code: validateCode,
    ledger: (value) => value === "BANK_CASH" ? null : "ledger must be BANK_CASH",
    type: validateType,
    glAccountId: validateGlAccountId,
    glAccount: (value) => value === null || Boolean(value.code?.trim() && value.name?.trim() && value.accountType) ? null : "glAccount is invalid",
    bankName: (value) => optionalText(value, "bankName", 50),
    bankBranchName: (value) => optionalText(value, "bankBranchName", 50),
    bankAccountIdentifier: (value) => optionalText(value, "bankAccountIdentifier", 100),
    cashAccountIdentifier: (value) => optionalText(value, "cashAccountIdentifier", 100),
    status: (value) => value === "ACTIVE" || value === "INACTIVE" ? null : "status is invalid",
    hasPostings: (value) => typeof value === "boolean" ? null : "hasPostings must be a boolean",
    companiesWithPostings: (value) => Array.isArray(value) && value.every((code) => typeof code === "string") ? null : "companiesWithPostings is invalid",
    linkedBy: (value) => Array.isArray(value) ? null : "linkedBy must be an array",
    audit: (value) => value?.created?.date && value?.updated?.date ? null : "audit timestamps are required",
  } satisfies {
    [K in keyof BankCashAccountResponseDto]-?: FieldValidator<BankCashAccountResponseDto[K]>;
  };
}

export function validateResponse(input: BankCashAccountResponseDto): string[] {
  return validateFields(input, createResponseValidator());
}
