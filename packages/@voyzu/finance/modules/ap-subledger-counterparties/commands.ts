import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { ApCounterpartyResponseDto } from "@voyzu/finance/types/modules/ap-subledger";



export const listApCounterparties = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(ApCounterpartyResponseDto) },
  () => import("./server/lib/ap-subledger-counterparty.service").then((module) => module.listApCounterparties),
);
export const getApCounterparty = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([ApCounterpartyResponseDto, Type.Null()]) },
  () => import("./server/lib/ap-subledger-counterparty.service").then((module) => module.getApCounterparty),
);

export const commands = {
  listApCounterparties,
  getApCounterparty,
} as const;
