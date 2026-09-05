import "server-only";

import { command } from "@voyzu/capability/commands";
import { FinanceInventoryActivityDto, FinanceInventoryProcessingRuleDto, FinanceInventoryProcessingRulePatchDto } from "@voyzu/finance/types/modules/inventory-processing";
import Type from "typebox";

const load = () => import("./server/lib/inventory-processing.service");

export const listFinanceInventoryActivities = command.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(FinanceInventoryActivityDto) },
  () => load().then((module) => module.listFinanceInventoryActivities),
);

export const getFinanceInventoryActivity = command.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), Type.Number()]),
    result: Type.Union([FinanceInventoryActivityDto, Type.Null()]),
  },
  () => load().then((module) => module.getFinanceInventoryActivity),
);

export const listFinanceInventoryProcessingRules = command.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(FinanceInventoryProcessingRuleDto) },
  () => load().then((module) => module.listFinanceInventoryProcessingRules),
);

export const getFinanceInventoryProcessingRule = command.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.Number()]), result: Type.Union([FinanceInventoryProcessingRuleDto, Type.Null()]) },
  () => load().then((module) => module.getFinanceInventoryProcessingRule),
);

export const updateFinanceInventoryProcessingRule = command.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.Number(), FinanceInventoryProcessingRulePatchDto]), result: FinanceInventoryProcessingRuleDto },
  () => load().then((module) => module.updateFinanceInventoryProcessingRule),
);

export const commands = {
  listFinanceInventoryActivities,
  getFinanceInventoryActivity,
  listFinanceInventoryProcessingRules,
  getFinanceInventoryProcessingRule,
  updateFinanceInventoryProcessingRule,
} as const;
