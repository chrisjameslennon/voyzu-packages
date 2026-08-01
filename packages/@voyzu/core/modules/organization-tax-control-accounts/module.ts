import { handleListTaxControlAccounts, handlePatchTaxControlAccount } from "@voyzu/core/common/tax-control-accounts/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { OrganizationTaxControlAccountsPage, OrganizationTaxControlAccountDetailPage } from "@voyzu/core/organization-tax-control-accounts/server";

export const organizationTaxControlAccountsModule = {
  pageRoutes: {
    list: {
          id: "voyzu.organization-tax-control-accounts.page.list",
          pageTitle: "Tax Control Accounts",
          helpPath: "modules-help/organization-financial-settings/tax-accounts",
          path: "/organization/control-accounts/tax",
          Page: OrganizationTaxControlAccountsPage,
          breadcrumbBase: [
                { label: "Organization" },
                { label: "Standard Settings" },
                { label: "Control Accounts" },
              ],
          auth: { required: true, minRole: "ORGANIZATION_USER" }
        },
    detail: {
          id: "voyzu.organization-tax-control-accounts.page.detail",
          pageTitle: "Tax Control Accounts",
          helpPath: "modules-help/organization-financial-settings/tax-accounts",
          path: "/organization/control-accounts/tax/[code]",
          Page: OrganizationTaxControlAccountDetailPage,
          breadcrumbBase: [
                { label: "Organization" },
                { label: "Standard Settings" },
                { label: "Control Accounts" },
                { label: "Tax Control Accounts", href: "/organization/control-accounts/tax" },
              ],
          auth: { required: true, minRole: "ORGANIZATION_USER" }
        }
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/tax-control-accounts",
      handler: (request: any) => handleListTaxControlAccounts(request),
      apiDoc: {
        summary: "List",
        description: "List Organization Tax Control Accounts.",
        tags: ["Organization Tax Control Accounts"],
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
      path: "/organization/tax-control-accounts/[code]",
      handler: (request: any, context: any) => handlePatchTaxControlAccount(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Organization Tax Control Accounts.",
        tags: ["Organization Tax Control Accounts"],
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
} as const satisfies VoyzuPackageModuleDefinition;
