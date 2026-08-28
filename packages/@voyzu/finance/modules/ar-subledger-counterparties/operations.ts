import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { ArCounterpartyResponseDto } from "@voyzu/finance/types/modules/ar-subledger";



export const listArCounterparties = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(ArCounterpartyResponseDto) },
  () => import("./server/lib/ar-subledger-counterparty.service").then((module) => module.listArCounterparties),
);
export const getArCounterparty = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([ArCounterpartyResponseDto, Type.Null()]) },
  () => import("./server/lib/ar-subledger-counterparty.service").then((module) => module.getArCounterparty),
);

export const operations = {
  listArCounterparties,
  getArCounterparty,
} as const;
