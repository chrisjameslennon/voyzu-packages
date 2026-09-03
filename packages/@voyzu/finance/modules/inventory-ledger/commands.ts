import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { InventoryLedgerEntryDetailResponseDto, InventoryLedgerEntryResponseDto, InventoryValuationResponseDto } from "@voyzu/finance/types/modules/inventory-ledger";



export const listInventoryLedgerEntries = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(InventoryLedgerEntryResponseDto) },
  () => import("./server/lib/inventory-ledger.service").then((module) => module.listInventoryLedgerEntries),
);
export const getInventoryLedgerEntry = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([InventoryLedgerEntryDetailResponseDto, Type.Null()]) },
  () => import("./server/lib/inventory-ledger.service").then((module) => module.getInventoryLedgerEntry),
);
export const listInventoryValuations = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(InventoryValuationResponseDto) },
  () => import("./server/lib/inventory-ledger.service").then((module) => module.listInventoryValuations),
);

export const commands = {
  listInventoryLedgerEntries,
  getInventoryLedgerEntry,
  listInventoryValuations,
} as const;
