import { handleGet as handleControlAccountsGet, handleListAp as handleApControlAccountsList, handlePatch as handleControlAccountsPatch } from "@voyzu-modules/all-modules/common/control-accounts/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const organizationApControlAccountsModule = {
  id: "voyzu.organization-ap-control-accounts",
  name: "Accounts Payable Control Accounts",
  pageRoutes: {
    list: {
      id: "voyzu.organization-ap-control-accounts.page.list",
      pageTitle: "Accounts Payable Control Accounts",
      helpUrl: "modules-help/organization-financial-settings/ap-control-accounts",
    },
    detail: {
      id: "voyzu.organization-ap-control-accounts.page.detail",
      pageTitle: "Accounts Payable Control Accounts",
      helpUrl: "modules-help/organization-financial-settings/ap-control-accounts",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/ap-control-accounts",
      handler: (request: any) => handleApControlAccountsList(request),
      apiDoc: {
        summary: "List",
        description: "List Organization AP Control Accounts.",
        tags: ["Organization AP Control Accounts"],
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
      path: "/organization/ap-control-accounts/[code]",
      handler: (request: any, context: any) => handleControlAccountsGet(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Organization AP Control Accounts.",
        tags: ["Organization AP Control Accounts"],
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
      path: "/organization/ap-control-accounts/[code]",
      handler: (request: any, context: any) => handleControlAccountsPatch(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Organization AP Control Accounts.",
        tags: ["Organization AP Control Accounts"],
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
