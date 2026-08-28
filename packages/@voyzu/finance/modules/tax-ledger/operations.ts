import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { TaxSubledgerEntryResponseDto } from "@voyzu/finance/types/modules/tax-ledger";



export const getTaxSubledgerEntry = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([TaxSubledgerEntryResponseDto, Type.Null()]) },
  () => import("./server/lib/tax-ledger.service").then((module) => module.getTaxSubledgerEntry),
);
export const listTaxSubledgerEntries = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(TaxSubledgerEntryResponseDto) },
  () => import("./server/lib/tax-ledger.service").then((module) => module.listTaxSubledgerEntries),
);

export const operations = {
  getTaxSubledgerEntry,
  listTaxSubledgerEntries,
} as const;
