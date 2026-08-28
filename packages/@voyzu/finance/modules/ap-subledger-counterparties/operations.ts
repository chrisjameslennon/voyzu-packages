import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { ApCounterpartyResponseDto } from "@voyzu/finance/types/modules/ap-subledger";



export const listApCounterparties = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(ApCounterpartyResponseDto) },
  () => import("./server/lib/ap-subledger-counterparty.service").then((module) => module.listApCounterparties),
);
export const getApCounterparty = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([ApCounterpartyResponseDto, Type.Null()]) },
  () => import("./server/lib/ap-subledger-counterparty.service").then((module) => module.getApCounterparty),
);

export const operations = {
  listApCounterparties,
  getApCounterparty,
} as const;
