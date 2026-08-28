import Type from "typebox";
import { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { InventoryControlAccountSettingResponseDto } from "../../types/modules/inventory-control-accounts/inventory-control-account-setting.response.dto";
import { InventoryControlAccountPatchRequestDto } from "../../types/modules/inventory-control-accounts/inventory-control-account.patch.request.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/inventory-control-accounts",
    loadHandler: () => import("../common/inventory-control-accounts/server/api/inventory-control-account.http.handlers").then((module) => module.handleListInventoryControlAccounts),
    summary: "List",
    description: "List Organization Inventory Control Accounts.",
    tags: ["Organization Inventory Control Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(InventoryControlAccountSettingResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  patch: {
    method: "PATCH",
    path: "/finance/inventory-control-accounts/[code]",
    loadHandler: () => import("../common/inventory-control-accounts/server/api/inventory-control-account.http.handlers").then((module) => module.handlePatchInventoryControlAccount),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryControlAccountPatchRequestDto },
    summary: "Patch",
    description: "Patch Organization Inventory Control Accounts.",
    tags: ["Organization Inventory Control Accounts"],
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
