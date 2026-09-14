import Type from "typebox";
import {
  BusinessRuleErrorResponseDto,
  EntityNotFoundErrorResponseDto,
  InputValidationErrorResponseDto,
  InternalServerErrorResponseDto,
} from "@voyzu/types";
import { FinanceInventoryActivityDto, FinanceInventoryProcessingRuleDto, FinanceInventoryProcessingRulePatchDto } from "./types/index";

const load = () => import("./server/http-api/inventory-processing.http.handlers");
const companyCode = {
  description: "Organization code that identifies the Finance scope.",
  schema: Type.String(),
};

export const httpApiRoutes = {
  "ledger.inventory-processing.listRules": {
    description: "Lists the Finance decision matrix for Inventory activity.",
    method: "GET",
    path: "/ledger/[companyCode]/inventory-processing/rules",
    loadHandler: () => load().then((module) => module.handleListRules),
    request: { path: { companyCode } },
    summary: "List inventory processing rules",
    
    
    responses: {
      "200": { description: "Inventory processing rules.", body: Type.Array(FinanceInventoryProcessingRuleDto) },
      "500": { description: "Unexpected error.", body: InternalServerErrorResponseDto },
    },
  },
  "ledger.inventory-processing.getRule": {
    description: "Gets one Finance Inventory processing rule.",
    method: "GET",
    path: "/ledger/[companyCode]/inventory-processing/rules/[id]",
    loadHandler: () => load().then((module) => module.handleGetRule),
    request: { path: { companyCode, id: { description: "Inventory processing rule id.", schema: Type.String({ pattern: "^[1-9][0-9]*$" }) } } },
    summary: "Get an inventory processing rule",
    
    
    responses: {
      "200": { description: "Inventory processing rule.", body: FinanceInventoryProcessingRuleDto },
      "404": { description: "Rule not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "Unexpected error.", body: InternalServerErrorResponseDto },
    },
  },
  "ledger.inventory-processing.patchRule": {
    description: "Updates the action and offset GL account for an Inventory processing rule.",
    method: "PATCH",
    path: "/ledger/[companyCode]/inventory-processing/rules/[id]",
    loadHandler: () => load().then((module) => module.handlePatchRule),
    request: {
      path: { companyCode, id: { description: "Inventory processing rule id.", schema: Type.String({ pattern: "^[1-9][0-9]*$" }) } },
      contentType: "application/json",
      body: FinanceInventoryProcessingRulePatchDto,
    },
    summary: "Update an inventory processing rule",
    
    
    responses: {
      "200": { description: "Updated rule.", body: FinanceInventoryProcessingRuleDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Rule or account not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "Unexpected error.", body: InternalServerErrorResponseDto },
    },
  },
  "ledger.inventory-processing.listInventoryTransactions": {
    description: "Lists Inventory financial activities received by Finance.",
    method: "GET",
    path: "/ledger/[companyCode]/inventory-processing/inventory-transactions",
    loadHandler: () => load().then((module) => module.handleListInventoryTransactions),
    request: { path: { companyCode } },
    summary: "List Finance inventory transactions",
    
    
    responses: {
      "200": { description: "Inventory transactions.", body: Type.Array(FinanceInventoryActivityDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "Unexpected error.", body: InternalServerErrorResponseDto },
    },
  },
  "ledger.inventory-processing.getInventoryTransaction": {
    description: "Gets one Inventory financial activity received by Finance.",
    method: "GET",
    path: "/ledger/[companyCode]/inventory-processing/inventory-transactions/[id]",
    loadHandler: () => load().then((module) => module.handleGetInventoryTransaction),
    request: {
      path: {
        companyCode,
        id: { description: "Finance inventory activity id.", schema: Type.String({ pattern: "^[1-9][0-9]*$" }) },
      },
    },
    summary: "Get a Finance inventory transaction",
    
    
    responses: {
      "200": { description: "Inventory transaction.", body: FinanceInventoryActivityDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Inventory transaction not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "Unexpected error.", body: InternalServerErrorResponseDto },
    },
  },
} as const;
