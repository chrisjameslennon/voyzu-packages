import type { ApCounterpartyResponseDto } from "@voyzu/core/types/modules/ap-subledger";
import { validateFields, type FieldValidator } from "@voyzu/capability/validation";

function validators() {
  return {
    id: (value) => Number.isInteger(value) && value > 0 ? null : "id must be a positive integer",
    companyId: (value) => Number.isInteger(value) && value > 0 ? null : "companyId must be a positive integer",
    code: (value) => value?.trim() ? null : "code is required",
    name: (value) => value?.trim() ? null : "name is required",
    status: (value) => value === "ACTIVE" || value === "INACTIVE" ? null : "status is invalid",
    countryCode: (value) => value === null || value.trim() ? null : "countryCode is invalid",
    countryName: (value) => value === null || value.trim() ? null : "countryName is invalid",
    taxRegionOrProvince: (value) => value === null || value.trim() ? null : "taxRegionOrProvince is invalid",
    audit: (value) => value?.created?.date && value?.updated?.date ? null : "audit timestamps are required",
  } satisfies { [K in keyof ApCounterpartyResponseDto]-?: FieldValidator<ApCounterpartyResponseDto[K]> };
}

export function validateResponse(input: ApCounterpartyResponseDto): string[] {
  return validateFields(input, validators());
}
