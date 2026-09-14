import Type from "typebox";
import { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ControlAccountResponseDto } from "./types/control-account.response.dto";
import { ControlAccountPatchRequestDto } from "./types/control-account.patch.request.dto";
import { ControlAccountSettingResponseDto } from "./types/control-account-setting.response.dto";



export const httpApiRoutes = {
  "finance.control-accounts.ap-list": {
    method: "GET",
    path: "/finance/[companyCode]/ap-control-accounts",
    loadHandler: () => import("./server/http-api/control-account.http.handlers").then((module) => module.handleListAp),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "List",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(ControlAccountSettingResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.control-accounts.ap-get": {
    method: "GET",
    path: "/finance/[companyCode]/ap-control-accounts/[code]",
    loadHandler: () => import("./server/http-api/control-account.http.handlers").then((module) => module.handleGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: ControlAccountResponseDto
      },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.control-accounts.ap-patch": {
    method: "PATCH",
    path: "/finance/[companyCode]/ap-control-accounts/[code]",
    loadHandler: () => import("./server/http-api/control-account.http.handlers").then((module) => module.handlePatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: ControlAccountPatchRequestDto },
    summary: "Patch",
    
    
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
