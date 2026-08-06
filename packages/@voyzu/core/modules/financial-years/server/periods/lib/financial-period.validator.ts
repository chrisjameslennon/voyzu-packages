import type { FinancialPeriodResponseDto } from "@voyzu/core/types/modules/financial-periods";
import { validateFields, type FieldValidator } from "@voyzu/capability/validation";

function createResponseValidator() {
  return {
    id: (value) => Number.isInteger(value) && value > 0 ? null : "id must be a positive integer",
    financialYearId: (value) => Number.isInteger(value) && value > 0 ? null : "financialYearId must be a positive integer",
    companyId: (value) => Number.isInteger(value) && value > 0 ? null : "companyId must be a positive integer",
    code: (value) => value?.trim() ? null : "code is required",
    name: (value) => value?.trim() ? null : "name is required",
    startDate: (value) => value?.trim() ? null : "startDate is required",
    endDate: (value) => value?.trim() ? null : "endDate is required",
    status: (value) => value === "OPEN" || value === "CLOSED" ? null : "status is invalid",
    hasPostings: (value) => typeof value === "boolean" ? null : "hasPostings must be a boolean",
    audit: (value) => value?.created?.date && value?.updated?.date ? null : "audit timestamps are required",
  } satisfies {
    [K in keyof FinancialPeriodResponseDto]-?: FieldValidator<FinancialPeriodResponseDto[K]>;
  };
}

export function validateResponse(input: FinancialPeriodResponseDto): string[] {
  return validateFields(input, createResponseValidator());
}
