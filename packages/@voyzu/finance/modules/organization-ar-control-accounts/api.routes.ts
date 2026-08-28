import Type from "typebox";
import { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ControlAccountResponseDto } from "../../types/modules/control-accounts/control-account.response.dto";
import { ControlAccountPatchRequestDto } from "../../types/modules/control-accounts/control-account.patch.request.dto";
import { ControlAccountSettingResponseDto } from "../../types/modules/control-accounts/control-account-setting.response.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/ar-control-accounts",
    loadHandler: () => import("../common/control-accounts/server/api/control-account.http.handlers").then((module) => module.handleListAr),
    summary: "List",
    description: "List Organization AR Control Accounts.",
    tags: ["Organization AR Control Accounts"],
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
    path: "/finance/ar-control-accounts/[code]",
    loadHandler: () => import("../common/control-accounts/server/api/control-account.http.handlers").then((module) => module.handleGet),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Organization AR Control Accounts.",
    tags: ["Organization AR Control Accounts"],
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
    path: "/finance/ar-control-accounts/[code]",
    loadHandler: () => import("../common/control-accounts/server/api/control-account.http.handlers").then((module) => module.handlePatch),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: ControlAccountPatchRequestDto },
    summary: "Patch",
    description: "Patch Organization AR Control Accounts.",
    tags: ["Organization AR Control Accounts"],
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
