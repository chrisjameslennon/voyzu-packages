import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import { ArLedgerEntryDocumentReportResponseDto, ArSubledgerEntryResponseDto } from "@voyzu/finance/types/modules/ar-subledger";



export const getArSubledgerEntry = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([ArSubledgerEntryResponseDto, Type.Null()]) },
  () => import("./server/lib/ar-subledger-ledger-entries.service").then((module) => module.getArSubledgerEntry),
);
export const listArSubledgerEntries = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(ArSubledgerEntryResponseDto) },
  () => import("./server/lib/ar-subledger-ledger-entries.service").then((module) => module.listArSubledgerEntries),
);
export const getArLedgerEntryDocumentReport = platformOperation.defineLazy(
  { parameters: Type.Tuple([OrganizationResponseDto, ArSubledgerEntryResponseDto]), result: Type.Union([ArLedgerEntryDocumentReportResponseDto, Type.Null()]) },
  () => import("./server/lib/ar-subledger-ledger-entries.service").then((module) => module.getArLedgerEntryDocumentReport),
);

export const operations = {
  getArSubledgerEntry,
  listArSubledgerEntries,
  getArLedgerEntryDocumentReport,
} as const;
