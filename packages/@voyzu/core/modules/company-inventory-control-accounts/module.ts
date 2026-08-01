import { handleListInventoryControlAccounts, handlePatchInventoryControlAccount } from "@voyzu/core/common/inventory-control-accounts/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { CompanyInventoryControlAccountsPage, CompanyInventoryControlAccountDetailPage } from "@voyzu/core/company-inventory-control-accounts/server";

export const companyInventoryControlAccountsModule = {
  pageRoutes: {
    list: {
          id: "voyzu.company-inventory-control-accounts.page.list",
          pageTitle: "Inventory Control Accounts",
          helpPath: "modules-help/company-ledger/inventory-control-accounts",
          path: "/finance/settings/control-accounts/inventory",
          Page: CompanyInventoryControlAccountsPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Settings", href: "/finance/settings/control-accounts/inventory" },
                { label: "Control Accounts", href: "/finance/settings/control-accounts/ap" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.company-inventory-control-accounts.page.detail",
          pageTitle: "Inventory Control Accounts",
          helpPath: "modules-help/company-ledger/inventory-control-accounts",
          path: "/finance/settings/control-accounts/inventory/[code]",
          Page: CompanyInventoryControlAccountDetailPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Settings", href: "/finance/settings/control-accounts/inventory" },
                { label: "Inventory Control Accounts", href: "/finance/settings/control-accounts/inventory" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        }
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/inventory-control-accounts",
      handler: (request: any) => handleListInventoryControlAccounts(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Company Inventory Control Accounts.",
        tags: ["Company Inventory Control Accounts"],
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
      path: "/finance/[companyCode]/inventory-control-accounts/[code]",
      handler: (request: any, context: any) => handlePatchInventoryControlAccount(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Company Inventory Control Accounts.",
        tags: ["Company Inventory Control Accounts"],
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
