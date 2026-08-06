import type { JournalResponseDto } from "@voyzu/core/types/modules/journals";
import { validateFields, type FieldValidator } from "@voyzu/capability/validation";

const text = (value: string) => value?.trim() ? null : "value is required";
const nullableText = (value: string | null | undefined) => value == null || value.trim() ? null : "value must be non-blank or null";
const positiveId = (value: number) => Number.isInteger(value) && value > 0 ? null : "value must be a positive integer";
const optionalId = (value: number | null | undefined) => value == null || Number.isInteger(value) && value > 0 ? null : "value must be a positive integer or null";

function validators() {
  return {
    id: positiveId,
    code: text,
    arSubledgerEntryCode: nullableText,
    apSubledgerEntryCode: nullableText,
    taxLedgerEntryCode: nullableText,
    companyId: positiveId,
    companyCode: text,
    companyName: text,
    documentTypeCode: text,
    documentTypeLabel: text,
    documentId: text,
    description: (value) => typeof value === "string" ? null : "description must be text",
    documentSnapshot: (value) => value && typeof value === "object" && !Array.isArray(value) ? null : "documentSnapshot is invalid",
    detailedDocumentSnapshot: (value) => value && typeof value === "object" && !Array.isArray(value) ? null : "detailedDocumentSnapshot is invalid",
    postingEngineCode: text,
    documentDate: text,
    postingDate: text,
    financialYearId: positiveId,
    financialYearCode: text,
    financialPeriodId: positiveId,
    financialPeriodCode: text,
    baseCurrencyCode: text,
    numberLines: (value) => Number.isInteger(value) && value >= 0 ? null : "numberLines must be a non-negative integer",
    totalDr: (value) => Number.isFinite(value) ? null : "totalDr must be a number",
    totalCr: (value) => Number.isFinite(value) ? null : "totalCr must be a number",
    memo: nullableText,
    status: (value) => value === "DRAFT" || value === "POSTED" ? null : "status is invalid",
    reversalOfJournalId: optionalId,
    reversalOfJournalCode: nullableText,
    reversedByJournalId: optionalId,
    reversedByJournalCode: nullableText,
    bankCashDetails: (value) => value === null || value === undefined || typeof value === "object" ? null : "bankCashDetails is invalid",
    lines: (value) => value === undefined || Array.isArray(value) ? null : "lines must be an array",
    audit: (value) => value?.created?.date && value?.updated?.date ? null : "audit timestamps are required",
  } satisfies { [K in keyof JournalResponseDto]-?: FieldValidator<JournalResponseDto[K]> };
}

export function validateResponse(input: JournalResponseDto): string[] {
  return validateFields(input, validators());
}
