import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { ArCounterpartyResponseDto } from "@voyzu/finance/types/modules/ar-subledger";



export const listArCounterparties = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(ArCounterpartyResponseDto) },
  () => import("./server/lib/ar-subledger-counterparty.service").then((module) => module.listArCounterparties),
);
export const getArCounterparty = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([ArCounterpartyResponseDto, Type.Null()]) },
  () => import("./server/lib/ar-subledger-counterparty.service").then((module) => module.getArCounterparty),
);

export const commands = {
  listArCounterparties,
  getArCounterparty,
} as const;
