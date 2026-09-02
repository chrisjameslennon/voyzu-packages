import "server-only";
import Type from "typebox";
import { operation } from "@voyzu/capability/operations";
import {
  FinancialActivityDetailDto,
  FinancialActivitySummaryDto,
} from "./types/financial-activity.types";

const load = () => import("./server/lib/financial-activity.service");
export const listInventoryFinancialActivity = operation.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(FinancialActivitySummaryDto) },
  () => load().then((module) => module.listFinancialActivity),
);
export const getInventoryFinancialActivity = operation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.Number()]), result: Type.Union([FinancialActivityDetailDto, Type.Null()]) },
  () => load().then((module) => module.getFinancialActivity),
);
export const markInventoryFinancialActivityProcessed = operation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.Number()]), result: FinancialActivityDetailDto },
  () => load().then((module) => module.markFinancialActivityProcessed),
);
export const operations = {
  listInventoryFinancialActivity,
  getInventoryFinancialActivity,
  markInventoryFinancialActivityProcessed,
} as const;
