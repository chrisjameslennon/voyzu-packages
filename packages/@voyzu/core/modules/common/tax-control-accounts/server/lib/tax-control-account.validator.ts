import type { TaxControlAccountResponseDto } from "@voyzu/core/types/modules/tax-control-accounts";
import { validateFields, type FieldValidator } from "@voyzu/capability/validation";

function createResponseValidator() {
  return {
    code: (value) => value?.trim() ? null : "code is required",
    ledger: (value) => value === "TAX" ? null : "ledger must be TAX",
    name: (value) => value?.trim() ? null : "name is required",
    description: (value) => typeof value === "string" ? null : "description must be text",
    requiredAccountType: (value) => value === null || typeof value === "string" ? null : "requiredAccountType is invalid",
    glAccountId: (value) => Number.isInteger(value) && value > 0 ? null : "glAccountId must be a positive integer",
    glAccount: (value) => value && value.code?.trim() && value.name?.trim() && value.accountType ? null : "glAccount is invalid",
    status: (value) => value === null || value === "ACTIVE" || value === "INACTIVE" ? null : "status is invalid",
    hasPostings: (value) => typeof value === "boolean" ? null : "hasPostings must be a boolean",
    companiesWithPostings: (value) => Array.isArray(value) && value.every((code) => typeof code === "string") ? null : "companiesWithPostings is invalid",
    linkedBy: (value) => Array.isArray(value) ? null : "linkedBy must be an array",
    audit: (value) => value?.created?.date && value?.updated?.date ? null : "audit timestamps are required",
  } satisfies {
    [K in keyof TaxControlAccountResponseDto]-?: FieldValidator<TaxControlAccountResponseDto[K]>;
  };
}

export function validateResponse(input: TaxControlAccountResponseDto): string[] {
  return validateFields(input, createResponseValidator());
}
