import { handleListInventoryControlAccounts, handlePatchInventoryControlAccount } from "@voyzu-modules/core/common/inventory-control-accounts/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const organizationInventoryControlAccountsModule = {
  id: "voyzu.organization-inventory-control-accounts",
  name: "Inventory Control Accounts",
  pageRoutes: {
    list: {
      id: "voyzu.organization-inventory-control-accounts.page.list",
      pageTitle: "Inventory Control Accounts",
      helpUrl: "modules-help/organization-financial-settings/inventory-control-accounts",
    },
    detail: {
      id: "voyzu.organization-inventory-control-accounts.page.detail",
      pageTitle: "Inventory Control Accounts",
      helpUrl: "modules-help/organization-financial-settings/inventory-control-accounts",
    },
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
} as const;
