import Type from "typebox";
import {
  BusinessRuleErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InputValidationErrorResponseDto,
  InternalServerErrorResponseDto,
} from "@voyzu/types";
import { FinanceInventoryActivityDto, FinanceInventoryProcessingRuleDto, FinanceInventoryProcessingRulePatchDto } from "@voyzu/finance/types/modules/inventory-processing";

const load = () => import("./server/api/inventory-processing.http.handlers");
const companyCode = {
  description: "Organization code that identifies the Finance scope.",
  schema: Type.String(),
};

export const apiDefinitions = {
  listRules: {
    method: "GET",
    path: "/finance/[companyCode]/inventory-processing/rules",
    loadHandler: () => load().then((module) => module.handleListRules),
    request: { path: { companyCode } },
    summary: "List inventory processing rules",
    description: "Lists the Finance decision matrix for Inventory activity.",
    tags: ["Inventory Processing"],
    responses: {
      "200": { description: "Inventory processing rules.", body: Type.Array(FinanceInventoryProcessingRuleDto) },
      "500": { description: "Unexpected error.", body: InternalServerErrorResponseDto },
    },
  },
  getRule: {
    method: "GET",
    path: "/finance/[companyCode]/inventory-processing/rules/[id]",
    loadHandler: () => load().then((module) => module.handleGetRule),
    request: { path: { companyCode, id: { description: "Inventory processing rule id.", schema: Type.Integer({ minimum: 1 }) } } },
    summary: "Get an inventory processing rule",
    description: "Gets one Finance Inventory processing rule.",
    tags: ["Inventory Processing"],
    responses: {
      "200": { description: "Inventory processing rule.", body: FinanceInventoryProcessingRuleDto },
      "404": { description: "Rule not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "Unexpected error.", body: InternalServerErrorResponseDto },
    },
  },
  patchRule: {
    method: "PATCH",
    path: "/finance/[companyCode]/inventory-processing/rules/[id]",
    loadHandler: () => load().then((module) => module.handlePatchRule),
    request: {
      path: { companyCode, id: { description: "Inventory processing rule id.", schema: Type.Integer({ minimum: 1 }) } },
      contentType: "application/json",
      body: FinanceInventoryProcessingRulePatchDto,
    },
    summary: "Update an inventory processing rule",
    description: "Updates the action and offset GL account for an Inventory processing rule.",
    tags: ["Inventory Processing"],
    responses: {
      "200": { description: "Updated rule.", body: FinanceInventoryProcessingRuleDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Rule or account not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "Unexpected error.", body: InternalServerErrorResponseDto },
    },
  },
  listInventoryTransactions: {
    method: "GET",
    path: "/finance/[companyCode]/inventory-processing/inventory-transactions",
    loadHandler: () => load().then((module) => module.handleListInventoryTransactions),
    request: { path: { companyCode } },
    summary: "List Finance inventory transactions",
    description: "Lists Inventory financial activities received by Finance.",
    tags: ["Inventory Processing"],
    responses: {
      "200": { description: "Inventory transactions.", body: Type.Array(FinanceInventoryActivityDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "Unexpected error.", body: InternalServerErrorResponseDto },
    },
  },
  getInventoryTransaction: {
    method: "GET",
    path: "/finance/[companyCode]/inventory-processing/inventory-transactions/[id]",
    loadHandler: () => load().then((module) => module.handleGetInventoryTransaction),
    request: {
      path: {
        companyCode,
        id: { description: "Finance inventory activity id.", schema: Type.Integer({ minimum: 1 }) },
      },
    },
    summary: "Get a Finance inventory transaction",
    description: "Gets one Inventory financial activity received by Finance.",
    tags: ["Inventory Processing"],
    responses: {
      "200": { description: "Inventory transaction.", body: FinanceInventoryActivityDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Inventory transaction not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "Unexpected error.", body: InternalServerErrorResponseDto },
    },
  },
} as const;
