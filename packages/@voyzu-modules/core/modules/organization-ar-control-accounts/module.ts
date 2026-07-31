import { handleGet as handleControlAccountsGet, handleListAr as handleArControlAccountsList, handlePatch as handleControlAccountsPatch } from "@voyzu-modules/core/common/control-accounts/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const organizationArControlAccountsModule = {
  pageRoutes: {
    list: {
      id: "voyzu.organization-ar-control-accounts.page.list",
      pageTitle: "Accounts Receivable Control Accounts",
      helpPath: "modules-help/organization-financial-settings/ar-control-accounts",
    },
    detail: {
      id: "voyzu.organization-ar-control-accounts.page.detail",
      pageTitle: "Accounts Receivable Control Accounts",
      helpPath: "modules-help/organization-financial-settings/ar-control-accounts",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/ar-control-accounts",
      handler: (request: any) => handleArControlAccountsList(request),
      apiDoc: {
        summary: "List",
        description: "List Organization AR Control Accounts.",
        tags: ["Organization AR Control Accounts"],
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
      path: "/organization/ar-control-accounts/[code]",
      handler: (request: any, context: any) => handleControlAccountsGet(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Organization AR Control Accounts.",
        tags: ["Organization AR Control Accounts"],
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
      path: "/organization/ar-control-accounts/[code]",
      handler: (request: any, context: any) => handleControlAccountsPatch(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Organization AR Control Accounts.",
        tags: ["Organization AR Control Accounts"],
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
