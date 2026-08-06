import type { InventoryLedgerEntryDetailResponseDto, InventoryLedgerEntryResponseDto } from "@voyzu/core/types/modules/inventory-ledger";
import { validateFields, type FieldValidator } from "@voyzu/capability/validation";

const text = (value: string) => value?.trim() ? null : "value is required";
const nullableText = (value: string | null) => value === null || value.trim() ? null : "value must be non-blank or null";
const number = (value: number) => Number.isFinite(value) ? null : "value must be a number";
const nullableNumber = (value: number | null) => value === null || Number.isFinite(value) ? null : "value must be a number or null";
const positiveId = (value: number) => Number.isInteger(value) && value > 0 ? null : "value must be a positive integer";
const audit = (value: InventoryLedgerEntryResponseDto["audit"]) => value?.created?.date && value?.updated?.date ? null : "audit timestamps are required";

function entryValidators() {
  return {
    id: positiveId, code: text, journalHeaderId: positiveId, journalCode: text,
    postingDate: text, sourceDocument: text, movement: text, documentId: text,
    itemCode: text, itemName: text, qtyDelta: number, unitValueSupplied: nullableNumber,
    bookValueDelta: number, qtyBalance: number, avgUnitValue: number, bookValueBalance: number,
    baseCurrencyCode: text,
    status: (value) => value === "POSTED" ? null : "status must be POSTED",
    controlAccountCode: text, controlAccountName: text, glAccountCode: text, glAccountName: text,
    controlAccountBalances: (value) => Array.isArray(value) ? null : "controlAccountBalances must be an array",
    audit,
  } satisfies { [K in keyof InventoryLedgerEntryResponseDto]-?: FieldValidator<InventoryLedgerEntryResponseDto[K]> };
}

function detailValidators() {
  return {
    id: positiveId, code: text, journalHeaderId: positiveId, journalCode: text,
    postingDate: text, documentDate: text, sourceDocument: text, documentId: text,
    upstreamDocumentTypeCode: nullableText, upstreamDocumentId: nullableText,
    description: nullableText, memo: nullableText, baseCurrencyCode: text,
    status: (value) => value === "POSTED" ? null : "status must be POSTED",
    controlAccountCode: text, controlAccountName: text, glAccountCode: text, glAccountName: text,
    controlAccountBalances: (value) => Array.isArray(value) ? null : "controlAccountBalances must be an array",
    documentSnapshot: (value) => value && typeof value === "object" && !Array.isArray(value) ? null : "documentSnapshot is invalid",
    detailedDocumentSnapshot: (value) => value && typeof value === "object" && !Array.isArray(value) ? null : "detailedDocumentSnapshot is invalid",
    audit,
    lines: (value) => Array.isArray(value) ? null : "lines must be an array",
  } satisfies { [K in keyof InventoryLedgerEntryDetailResponseDto]-?: FieldValidator<InventoryLedgerEntryDetailResponseDto[K]> };
}

export const validateEntryResponse = (input: InventoryLedgerEntryResponseDto) => validateFields(input, entryValidators());
export const validateDetailResponse = (input: InventoryLedgerEntryDetailResponseDto) => validateFields(input, detailValidators());
