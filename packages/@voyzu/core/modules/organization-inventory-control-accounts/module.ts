import { handleListInventoryControlAccounts, handlePatchInventoryControlAccount } from "@voyzu/core/common/inventory-control-accounts/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { OrganizationInventoryControlAccountsPage, OrganizationInventoryControlAccountDetailPage } from "@voyzu/core/organization-inventory-control-accounts/server";

export const organizationInventoryControlAccountsModule = {
  pageRoutes: {
    list: {
          id: "voyzu.organization-inventory-control-accounts.page.list",
          pageTitle: "Inventory Control Accounts",
          helpPath: "modules-help/organization-financial-settings/inventory-control-accounts",
          path: "/organization/control-accounts/inventory",
          Page: OrganizationInventoryControlAccountsPage,
          breadcrumbBase: [
                { label: "Organization" },
                { label: "Standard Settings" },
                { label: "Control Accounts" },
              ],
          auth: { required: true, minRole: "ORGANIZATION_USER" }
        },
    detail: {
          id: "voyzu.organization-inventory-control-accounts.page.detail",
          pageTitle: "Inventory Control Accounts",
          helpPath: "modules-help/organization-financial-settings/inventory-control-accounts",
          path: "/organization/control-accounts/inventory/[code]",
          Page: OrganizationInventoryControlAccountDetailPage,
          breadcrumbBase: [
                { label: "Organization" },
                { label: "Standard Settings" },
                { label: "Control Accounts" },
                { label: "Inventory Control Accounts", href: "/organization/control-accounts/inventory" },
              ],
          auth: { required: true, minRole: "ORGANIZATION_USER" }
        }
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/inventory-control-accounts",
      handler: (request: any) => handleListInventoryControlAccounts(request),
      apiDoc: {
        summary: "List",
        description: "List Organization Inventory Control Accounts.",
        tags: ["Organization Inventory Control Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("InventoryControlAccountSettingResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    patch: {
      method: "PATCH",
      path: "/organization/inventory-control-accounts/[code]",
      handler: (request: any, context: any) => handlePatchInventoryControlAccount(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Organization Inventory Control Accounts.",
        tags: ["Organization Inventory Control Accounts"],
        requestBody: { required: true, schema: dtoRef("InventoryControlAccountPatchRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("InventoryControlAccountSettingResponseDto")
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
