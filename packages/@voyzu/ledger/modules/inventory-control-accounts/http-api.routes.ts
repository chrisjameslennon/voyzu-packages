import Type from "typebox";
import { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { InventoryControlAccountSettingResponseDto } from "./types/inventory-control-account-setting.response.dto";
import { InventoryControlAccountPatchRequestDto } from "./types/inventory-control-account.patch.request.dto";



export const httpApiRoutes = {
  "ledger.inventory-control-accounts.list": {
    description: "List Company Inventory Control Accounts.",
    method: "GET",
    path: "/ledger/[companyCode]/inventory-control-accounts",
    loadHandler: () => import("./server/http-api/inventory-control-account.http.handlers").then((module) => module.handleListInventoryControlAccounts),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "List",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(InventoryControlAccountSettingResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "ledger.inventory-control-accounts.patch": {
    description: "Patch Company Inventory Control Accounts.",
    method: "PATCH",
    path: "/ledger/[companyCode]/inventory-control-accounts/[code]",
    loadHandler: () => import("./server/http-api/inventory-control-account.http.handlers").then((module) => module.handlePatchInventoryControlAccount),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryControlAccountPatchRequestDto },
    summary: "Patch",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: InventoryControlAccountSettingResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
