import Type from "typebox";
import { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { TaxControlAccountResponseDto } from "./types/tax-control-account.response.dto";
import { TaxControlAccountPatchRequestDto } from "./types/tax-control-account.patch.request.dto";



export const httpApiRoutes = {
  "ledger.tax-control-accounts.list": {
    description: "List Company Tax Control Accounts.",
    method: "GET",
    path: "/ledger/[companyCode]/tax-control-accounts",
    loadHandler: () => import("./server/http-api/tax-control-account.http.handlers").then((module) => module.handleListTaxControlAccounts),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "List",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(TaxControlAccountResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "ledger.tax-control-accounts.patch": {
    description: "Patch Company Tax Control Accounts.",
    method: "PATCH",
    path: "/ledger/[companyCode]/tax-control-accounts/[code]",
    loadHandler: () => import("./server/http-api/tax-control-account.http.handlers").then((module) => module.handlePatchTaxControlAccount),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: TaxControlAccountPatchRequestDto },
    summary: "Patch",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: TaxControlAccountResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
