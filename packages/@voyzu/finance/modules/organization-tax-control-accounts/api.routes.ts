import Type from "typebox";
import { handleListTaxControlAccounts, handlePatchTaxControlAccount } from "@voyzu/finance/common/tax-control-accounts/server";
import { OrganizationTaxControlAccountsPage, OrganizationTaxControlAccountDetailPage } from "@voyzu/finance/organization-tax-control-accounts/server";
import { BusinessRuleErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { TaxControlAccountResponseDto } from "../../types/modules/tax-control-accounts/tax-control-account.response.dto";
import { TaxControlAccountPatchRequestDto } from "../../types/modules/tax-control-accounts/tax-control-account.patch.request.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/tax-control-accounts",
    handler: (request: any) => handleListTaxControlAccounts(request),
    summary: "List",
    description: "List Organization Tax Control Accounts.",
    tags: ["Organization Tax Control Accounts"],
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
    path: "/finance/tax-control-accounts/[code]",
    handler: (request: any, context: any) => handlePatchTaxControlAccount(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: TaxControlAccountPatchRequestDto },
    summary: "Patch",
    description: "Patch Organization Tax Control Accounts.",
    tags: ["Organization Tax Control Accounts"],
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
