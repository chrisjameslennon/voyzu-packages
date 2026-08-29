import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { InventoryLedgerEntryDetailResponseDto, InventoryLedgerEntryResponseDto, InventoryValuationResponseDto } from "@voyzu/finance/types/modules/inventory-ledger";



export const listInventoryLedgerEntries = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(InventoryLedgerEntryResponseDto) },
  () => import("./server/lib/inventory-ledger.service").then((module) => module.listInventoryLedgerEntries),
);
export const getInventoryLedgerEntry = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([InventoryLedgerEntryDetailResponseDto, Type.Null()]) },
  () => import("./server/lib/inventory-ledger.service").then((module) => module.getInventoryLedgerEntry),
);
export const listInventoryValuations = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(InventoryValuationResponseDto) },
  () => import("./server/lib/inventory-ledger.service").then((module) => module.listInventoryValuations),
);

export const operations = {
  listInventoryLedgerEntries,
  getInventoryLedgerEntry,
  listInventoryValuations,
} as const;
