import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { ApSubledgerEntryResponseDto } from "@voyzu/finance/types/modules/ap-subledger";



export const listApSubledgerEntries = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(ApSubledgerEntryResponseDto) },
  () => import("./server/lib/ap-subledger-ledger-entries.service").then((module) => module.listApSubledgerEntries),
);
export const getApSubledgerEntry = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([ApSubledgerEntryResponseDto, Type.Null()]) },
  () => import("./server/lib/ap-subledger-ledger-entries.service").then((module) => module.getApSubledgerEntry),
);

export const operations = {
  listApSubledgerEntries,
  getApSubledgerEntry,
} as const;
