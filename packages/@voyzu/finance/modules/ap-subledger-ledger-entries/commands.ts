import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { ApSubledgerEntryResponseDto } from "@voyzu/finance/types/modules/ap-subledger";



export const listApSubledgerEntries = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(ApSubledgerEntryResponseDto) },
  () => import("./server/lib/ap-subledger-ledger-entries.service").then((module) => module.listApSubledgerEntries),
);
export const getApSubledgerEntry = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([ApSubledgerEntryResponseDto, Type.Null()]) },
  () => import("./server/lib/ap-subledger-ledger-entries.service").then((module) => module.getApSubledgerEntry),
);

export const commands = {
  listApSubledgerEntries,
  getApSubledgerEntry,
} as const;
