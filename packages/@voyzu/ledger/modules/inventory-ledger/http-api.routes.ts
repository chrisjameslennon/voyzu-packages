import Type from "typebox";
import { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { InventoryLedgerEntryDetailResponseDto, InventoryLedgerEntryResponseDto } from "./types/index";



export const httpApiRoutes = {
  "ledger.inventory-ledger.list": {
    description: "List Inventory Ledger.",
    method: "GET",
    path: "/ledger/[companyCode]/inventory/ledger",
    loadHandler: () => import("./server/http-api/inventory-ledger.http.handlers").then((module) => module.handleListInventoryEntries),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "List",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(InventoryLedgerEntryResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "ledger.inventory-ledger.get": {
    description: "Get Inventory Ledger.",
    method: "GET",
    path: "/ledger/[companyCode]/inventory/ledger/[code]",
    loadHandler: () => import("./server/http-api/inventory-ledger.http.handlers").then((module) => module.handleGetInventoryEntry),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    
    
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
