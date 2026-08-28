import "server-only";

import { operation } from "@voyzu/capability/operations";
import Type from "typebox";

import { FinanceItemDto, ItemPostingCodeUsageDto } from "./types/finance-item.types";

export const getItemsForFinance = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), Type.Array(Type.String())]),
    result: Type.Array(FinanceItemDto),
  },
  () => import("./server/lib/item.service").then((module) => module.getItemsForFinance),
);

export const getItemPostingCodeUsages = operation.defineLazy(
  {
    parameters: Type.Tuple([Type.Array(Type.Number())]),
    result: Type.Array(ItemPostingCodeUsageDto),
  },
  () => import("./server/lib/item.service").then((module) => module.getItemPostingCodeUsages),
);

export const operations = { getItemsForFinance, getItemPostingCodeUsages } as const;
