import { handleGet as handleGetControlAccount, handleListAr as handleListArControlAccounts, handlePatch as handlePatchControlAccount } from "@voyzu/core/common/control-accounts/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { CompanyArControlAccountsListPage, CompanyArControlAccountDetailPage } from "@voyzu/core/company-ar-control-accounts/server";

export const companyArControlAccountsModule = {
  pageRoutes: {
    list: {
          id: "voyzu.company-ar-control-accounts.page.list",
          pageTitle: "Accounts Receivable Control Accounts",
          helpPath: "modules-help/company-ledger/ar-control-accounts",
          path: "/finance/settings/control-accounts/ar",
          Page: CompanyArControlAccountsListPage,
          breadcrumbBase: [
                { label: "Finance" },
                { label: "Settings" },
                { label: "Control Accounts" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.company-ar-control-accounts.page.detail",
          pageTitle: "Accounts Receivable Control Accounts",
          helpPath: "modules-help/company-ledger/ar-control-accounts",
          path: "/finance/settings/control-accounts/ar/[code]",
          Page: CompanyArControlAccountDetailPage,
          breadcrumbBase: [
                { label: "Finance" },
                { label: "Settings" },
                { label: "Accounts Receivable Control Accounts", href: "/finance/settings/control-accounts/ar" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        }
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/ar-control-accounts",
      handler: (request: any) => handleListArControlAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Company AR Control Accounts.",
        tags: ["Company AR Control Accounts"],
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
      path: "/finance/[companyCode]/ar-control-accounts/[code]",
      handler: (request: any, context: any) => handleGetControlAccount(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Company AR Control Accounts.",
        tags: ["Company AR Control Accounts"],
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
      path: "/finance/[companyCode]/ar-control-accounts/[code]",
      handler: (request: any, context: any) => handlePatchControlAccount(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Company AR Control Accounts.",
        tags: ["Company AR Control Accounts"],
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
} as const satisfies VoyzuPackageModuleDefinition;
