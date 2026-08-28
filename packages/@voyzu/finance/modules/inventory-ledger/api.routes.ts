import Type from "typebox";
import { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { InventoryLedgerEntryDetailResponseDto, InventoryLedgerEntryResponseDto } from "../../types/modules/inventory-ledger/index";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/inventory/ledger",
    loadHandler: () => import("./server/api/inventory-ledger.http.handlers").then((module) => module.handleListInventoryEntries),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List Inventory Ledger.",
    tags: ["Inventory Ledger"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(InventoryLedgerEntryResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET",
    path: "/finance/[companyCode]/inventory/ledger/[code]",
    loadHandler: () => import("./server/api/inventory-ledger.http.handlers").then((module) => module.handleGetInventoryEntry),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Inventory Ledger.",
    tags: ["Inventory Ledger"],
    responses: {
      "200": {
        description: "Successful response.",
        body: InventoryLedgerEntryDetailResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
