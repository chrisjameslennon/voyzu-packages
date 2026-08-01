import type { ControlAccountPatchRequestDto, ControlAccountResponseDto } from "@voyzu/core/types/modules/control-accounts";

const VALID_STATUSES = ["ACTIVE", "INACTIVE"] as const;
const VALID_LEDGERS = ["ACCOUNTS_RECEIVABLE", "ACCOUNTS_PAYABLE"] as const;

type FieldValidator<T> = (value: T) => string | null;

function validateFields<T extends object>(input: T, validators: { [K in keyof T]-?: FieldValidator<T[K]> }): string[] {
  return (Object.keys(validators) as Array<keyof T>)
    .map((key) => validators[key](input[key]))
    .filter((error): error is string => error !== null);
}

function createResponseValidator() {
  return {
    code: (value) => value?.trim() ? null : "code is required",
    ledger: (value) => VALID_LEDGERS.includes(value) ? null : "ledger must be ACCOUNTS_RECEIVABLE or ACCOUNTS_PAYABLE",
    name: (value) => value?.trim() ? null : "name is required",
    glAccountId: (value) => Number.isFinite(value) ? null : "glAccountId is required",
    glAccount: (value) => value?.code && value?.name && value?.accountType ? null : "glAccount is required",
    status: (value) => VALID_STATUSES.includes(value) ? null : "status must be ACTIVE or INACTIVE",
    hasPostings: (value) => typeof value === "boolean" ? null : "hasPostings must be a boolean",
    companiesWithPostings: (value) => {
      if (!Array.isArray(value)) return "companiesWithPostings must be an array";
      return value.some((companyCode) => typeof companyCode !== "string") ? "companiesWithPostings must contain strings" : null;
    },
    linkedBy: (value) => {
      if (!Array.isArray(value)) return "linkedBy must be an array";
      return value.some((reference) => typeof reference.type !== "string" || typeof reference.code !== "string")
        ? "linkedBy must contain pointer references"
        : null;
    },
    audit: (value) => {
      if (!value?.created?.date?.trim()) return "audit.created.date is required";
      if (!value?.updated?.date?.trim()) return "audit.updated.date is required";
      return null;
    },
  } satisfies {
    [K in keyof ControlAccountResponseDto]-?: FieldValidator<ControlAccountResponseDto[K]>;
  };
}

export function validateResponse(input: ControlAccountResponseDto): string[] {
  return validateFields(input, createResponseValidator());
}

function createPatchValidator() {
  return {
    glAccountId: (value) => {
      if (value == null) return "glAccountId is required";
      return Number.isInteger(value) && value > 0 ? null : "glAccountId must be a positive integer";
    },
  } satisfies {
    [K in keyof ControlAccountPatchRequestDto]-?: FieldValidator<ControlAccountPatchRequestDto[K]>;
  };
}

export function validatePatch(input: ControlAccountPatchRequestDto): string[] {
  return validateFields(input, createPatchValidator());
}
