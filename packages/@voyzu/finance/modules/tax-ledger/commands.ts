import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { TaxSubledgerEntryResponseDto } from "@voyzu/finance/types/modules/tax-ledger";



export const getTaxSubledgerEntry = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([TaxSubledgerEntryResponseDto, Type.Null()]) },
  () => import("./server/lib/tax-ledger.service").then((module) => module.getTaxSubledgerEntry),
);
export const listTaxSubledgerEntries = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(TaxSubledgerEntryResponseDto) },
  () => import("./server/lib/tax-ledger.service").then((module) => module.listTaxSubledgerEntries),
);

export const commands = {
  getTaxSubledgerEntry,
  listTaxSubledgerEntries,
} as const;
