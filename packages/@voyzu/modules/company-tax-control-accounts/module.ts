import { handleListTaxControlAccounts, handlePatchTaxControlAccount } from "@voyzu/modules/common/tax-control-accounts/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const companyTaxControlAccountsModule = {
  id: "voyzu.company-tax-control-accounts",
  name: "Tax Control Accounts",
  pageRoutes: {
    list: {
      id: "voyzu.company-tax-control-accounts.page.list",
      pageTitle: "Tax Control Accounts",
      helpUrl: "modules-help/company-ledger/tax-accounts",
    },
    detail: {
      id: "voyzu.company-tax-control-accounts.page.detail",
      pageTitle: "Tax Control Accounts",
      helpUrl: "modules-help/company-ledger/tax-accounts",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/tax-control-accounts",
      handler: (request: any) => handleListTaxControlAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Company Tax Control Accounts.",
        tags: ["Company Tax Control Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("TaxControlAccountResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    patch: {
      method: "PATCH",
      path: "/finance/[companyCode]/tax-control-accounts/[code]",
      handler: (request: any, context: any) => handlePatchTaxControlAccount(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Company Tax Control Accounts.",
        tags: ["Company Tax Control Accounts"],
        requestBody: { required: true, schema: dtoRef("TaxControlAccountPatchRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("TaxControlAccountResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
  }
} as const;
