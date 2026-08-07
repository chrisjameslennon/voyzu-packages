import type { ApSubledgerEntryResponseDto } from "@voyzu/core/types/modules/ap-subledger";
import type { ArSubledgerEntryResponseDto } from "@voyzu/core/types/modules/ar-subledger";
import { validateFields, type FieldValidator } from "@voyzu/capability/validation";

type SubledgerEntryResponseDto = ApSubledgerEntryResponseDto | ArSubledgerEntryResponseDto;
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
    bankCashCode: nullableText,
    taxLedgerEntryCode: nullableText,
    postingDate: text,
    documentDate: text,
    baseCurrencyCode: text,
    entryType: (value) => value ? null : "entryType is required",
    baseCurrencyAmount: (value) => Number.isFinite(value) ? null : "baseCurrencyAmount must be a number",
    memo: nullableText,
    status: text,
    documentTypeCode: text,
    documentTypeLabel: text,
    documentId: text,
    description: (value) => typeof value === "string" ? null : "description must be text",
    appliedToDocumentId: nullableText,
    counterpartyCode: text,
    counterpartyName: text,
    controlAccountCode: text,
    controlAccountName: text,
    glAccountCode: text,
    glAccountName: text,
    paymentStatus: (value) => value === null || value === "UNPAID" || value === "PART_PAID" || value === "SETTLED" ? null : "paymentStatus is invalid",
    appliedAmount: nullableNumber,
    paymentAppliedAmount: nullableNumber,
    otherCreditAppliedAmount: nullableNumber,
    openBalance: nullableNumber,
    controlAccountBalances: (value) => value === undefined || Array.isArray(value) ? null : "controlAccountBalances must be an array",
    audit: (value) => value?.created?.date && value?.updated?.date ? null : "audit timestamps are required",
    documentSnapshot: optionalRecord,
    detailedDocumentSnapshot: optionalRecord,
  } satisfies { [K in keyof ApSubledgerEntryResponseDto]-?: FieldValidator<ApSubledgerEntryResponseDto[K]> };
}

const arValidators: { [K in keyof ArSubledgerEntryResponseDto]-?: FieldValidator<ArSubledgerEntryResponseDto[K]> } = validators();
void arValidators;

export function validateSubledgerEntryResponse(input: SubledgerEntryResponseDto): string[] {
  return validateFields(input as ApSubledgerEntryResponseDto, validators());
}
