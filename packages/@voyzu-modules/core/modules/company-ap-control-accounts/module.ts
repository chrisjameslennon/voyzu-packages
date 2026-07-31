import { handleGet as handleGetControlAccount, handleListAp as handleListApControlAccounts, handlePatch as handlePatchControlAccount } from "@voyzu-modules/core/common/control-accounts/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const companyApControlAccountsModule = {
  pageRoutes: {
    list: {
      id: "voyzu.company-ap-control-accounts.page.list",
      pageTitle: "Accounts Payable Control Accounts",
      helpUrl: "modules-help/company-ledger/ap-control-accounts",
    },
    detail: {
      id: "voyzu.company-ap-control-accounts.page.detail",
      pageTitle: "Accounts Payable Control Accounts",
      helpUrl: "modules-help/company-ledger/ap-control-accounts",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/ap-control-accounts",
      handler: (request: any) => handleListApControlAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Company AP Control Accounts.",
        tags: ["Company AP Control Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("ControlAccountSettingResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: {
      method: "GET",
      path: "/finance/[companyCode]/ap-control-accounts/[code]",
      handler: (request: any, context: any) => handleGetControlAccount(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Company AP Control Accounts.",
        tags: ["Company AP Control Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("ControlAccountResponseDto")
          },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    patch: {
      method: "PATCH",
      path: "/finance/[companyCode]/ap-control-accounts/[code]",
      handler: (request: any, context: any) => handlePatchControlAccount(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Company AP Control Accounts.",
        tags: ["Company AP Control Accounts"],
        requestBody: { required: true, schema: dtoRef("ControlAccountPatchRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("ControlAccountResponseDto")
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
