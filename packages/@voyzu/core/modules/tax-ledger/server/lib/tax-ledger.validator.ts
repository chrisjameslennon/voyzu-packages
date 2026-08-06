import type { TaxSubledgerEntryResponseDto } from "@voyzu/core/types/modules/tax-ledger";
import { validateFields, type FieldValidator } from "@voyzu/capability/validation";

const text = (value: string) => value?.trim() ? null : "value is required";
const nullableText = (value: string | null) => value === null || value.trim() ? null : "value must be non-blank or null";
const nullableNumber = (value: number | null) => value === null || Number.isFinite(value) ? null : "value must be a number or null";
const optionalRecord = (value: Record<string, unknown> | undefined) => value === undefined || value && typeof value === "object" && !Array.isArray(value) ? null : "value must be an object";

function validators() {
  return {
    id: (value) => Number.isInteger(value) && value > 0 ? null : "id must be a positive integer",
    code: text,
    journalHeaderId: (value) => Number.isInteger(value) && value > 0 ? null : "journalHeaderId must be a positive integer",
    journalCode: text,
    hasBankCashDetails: (value) => typeof value === "boolean" ? null : "hasBankCashDetails must be a boolean",
    arSubledgerEntryCode: nullableText,
    apSubledgerEntryCode: nullableText,
    postingDate: text,
    documentDate: text,
    baseCurrencyCode: text,
    entryType: (value) => value ? null : "entryType is required",
    baseCurrencyAmount: (value) => Number.isFinite(value) ? null : "baseCurrencyAmount must be a number",
    status: text,
    documentTypeCode: text,
    documentTypeLabel: text,
    documentId: text,
    description: (value) => typeof value === "string" ? null : "description must be text",
    taxRuleCode: text,
    taxControlAccountCode: nullableText,
    taxControlAccountName: nullableText,
    taxAuthorityCode: text,
    taxAuthorityName: text,
    schemeLabel: nullableText,
    taxRate: nullableNumber,
    taxLines: (value) => Array.isArray(value) ? null : "taxLines must be an array",
    audit: (value) => value?.created?.date && value?.updated?.date ? null : "audit timestamps are required",
    documentSnapshot: optionalRecord,
    detailedDocumentSnapshot: optionalRecord,
  } satisfies { [K in keyof TaxSubledgerEntryResponseDto]-?: FieldValidator<TaxSubledgerEntryResponseDto[K]> };
}

export function validateResponse(input: TaxSubledgerEntryResponseDto): string[] {
  return validateFields(input, validators());
}
