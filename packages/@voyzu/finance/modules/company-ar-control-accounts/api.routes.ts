import Type from "typebox";
import { handleGet as handleGetControlAccount, handleListAr as handleListArControlAccounts, handlePatch as handlePatchControlAccount } from "@voyzu/finance/common/control-accounts/server";
import { CompanyArControlAccountsListPage, CompanyArControlAccountDetailPage } from "@voyzu/finance/company-ar-control-accounts/server";
import { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ControlAccountResponseDto } from "../../types/modules/control-accounts/control-account.response.dto";
import { ControlAccountPatchRequestDto } from "../../types/modules/control-accounts/control-account.patch.request.dto";
import { ControlAccountSettingResponseDto } from "../../types/modules/control-accounts/control-account-setting.response.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/ar-control-accounts",
    handler: (request: any) => handleListArControlAccounts(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List Company AR Control Accounts.",
    tags: ["Company AR Control Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(ControlAccountSettingResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET",
    path: "/finance/[companyCode]/ar-control-accounts/[code]",
    handler: (request: any, context: any) => handleGetControlAccount(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Company AR Control Accounts.",
    tags: ["Company AR Control Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: ControlAccountResponseDto
      },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  patch: {
    method: "PATCH",
    path: "/finance/[companyCode]/ar-control-accounts/[code]",
    handler: (request: any, context: any) => handlePatchControlAccount(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: ControlAccountPatchRequestDto },
    summary: "Patch",
    description: "Patch Company AR Control Accounts.",
    tags: ["Company AR Control Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: ControlAccountResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
