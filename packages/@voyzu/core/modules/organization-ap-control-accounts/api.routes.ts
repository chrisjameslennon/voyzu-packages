import Type from "typebox";
import { handleGet as handleControlAccountsGet, handleListAp as handleApControlAccountsList, handlePatch as handleControlAccountsPatch } from "@voyzu/core/common/control-accounts/server";
import { OrganizationApControlAccountsListPage, OrganizationApControlAccountDetailPage } from "@voyzu/core/organization-ap-control-accounts/server";
import { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ControlAccountResponseDto } from "../../types/modules/control-accounts/control-account.response.dto";
import { ControlAccountPatchRequestDto } from "../../types/modules/control-accounts/control-account.patch.request.dto";
import { ControlAccountSettingResponseDto } from "../../types/modules/control-accounts/control-account-setting.response.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/organization/ap-control-accounts",
    handler: (request: any) => handleApControlAccountsList(request),
    summary: "List",
    description: "List Organization AP Control Accounts.",
    tags: ["Organization AP Control Accounts"],
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
    path: "/organization/ap-control-accounts/[code]",
    handler: (request: any, context: any) => handleControlAccountsGet(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Organization AP Control Accounts.",
    tags: ["Organization AP Control Accounts"],
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
    path: "/organization/ap-control-accounts/[code]",
    handler: (request: any, context: any) => handleControlAccountsPatch(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: ControlAccountPatchRequestDto },
    summary: "Patch",
    description: "Patch Organization AP Control Accounts.",
    tags: ["Organization AP Control Accounts"],
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
