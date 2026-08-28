import Type from "typebox";
import { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { TaxControlAccountResponseDto } from "../../types/modules/tax-control-accounts/tax-control-account.response.dto";
import { TaxControlAccountPatchRequestDto } from "../../types/modules/tax-control-accounts/tax-control-account.patch.request.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/tax-control-accounts",
    loadHandler: () => import("../common/tax-control-accounts/server/api/tax-control-account.http.handlers").then((module) => module.handleListTaxControlAccounts),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List Company Tax Control Accounts.",
    tags: ["Company Tax Control Accounts"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(TaxControlAccountResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  patch: {
    method: "PATCH",
    path: "/finance/[companyCode]/tax-control-accounts/[code]",
    loadHandler: () => import("../common/tax-control-accounts/server/api/tax-control-account.http.handlers").then((module) => module.handlePatchTaxControlAccount),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: TaxControlAccountPatchRequestDto },
    summary: "Patch",
    description: "Patch Company Tax Control Accounts.",
    tags: ["Company Tax Control Accounts"],
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
