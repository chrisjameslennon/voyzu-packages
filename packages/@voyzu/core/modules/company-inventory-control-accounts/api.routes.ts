import Type from "typebox";
import { handleListInventoryControlAccounts, handlePatchInventoryControlAccount } from "@voyzu/core/common/inventory-control-accounts/server";
import { CompanyInventoryControlAccountsPage, CompanyInventoryControlAccountDetailPage } from "@voyzu/core/company-inventory-control-accounts/server";
import { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { InventoryControlAccountSettingResponseDto } from "../../types/modules/inventory-control-accounts/inventory-control-account-setting.response.dto";
import { InventoryControlAccountPatchRequestDto } from "../../types/modules/inventory-control-accounts/inventory-control-account.patch.request.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/inventory-control-accounts",
    handler: (request: any) => handleListInventoryControlAccounts(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List Company Inventory Control Accounts.",
    tags: ["Company Inventory Control Accounts"],
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
    path: "/finance/[companyCode]/inventory-control-accounts/[code]",
    handler: (request: any, context: any) => handlePatchInventoryControlAccount(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryControlAccountPatchRequestDto },
    summary: "Patch",
    description: "Patch Company Inventory Control Accounts.",
    tags: ["Company Inventory Control Accounts"],
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
