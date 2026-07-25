import { handleActivate as handleGlAccountsActivate, handleBatchCreate as handleGlAccountsBatchCreate, handleBatchActivate as handleGlAccountsBatchActivate, handleBatchDeactivate as handleGlAccountsBatchDeactivate, handleBatchDelete as handleGlAccountsBatchDelete, handleBatchGet as handleGlAccountsBatchGet, handleBatchPatch as handleGlAccountsBatchPatch, handleBatchUpdate as handleGlAccountsBatchUpdate, handleCreate as handleGlAccountsCreate, handleDeactivate as handleGlAccountsDeactivate, handleDelete as handleGlAccountsDelete, handleFilter as handleGlAccountsFilter, handleGet as handleGlAccountsGet, handleList as handleGlAccountsList, handlePatch as handleGlAccountsPatch, handleSearch as handleGlAccountsSearch, handleUpdate as handleGlAccountsUpdate } from "@voyzu/modules/common/gl-accounts/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const organizationGlAccountsModule = {
  id: "voyzu.organization-gl-accounts",
  name: "Organization General Ledger Accounts",
  pageRoutes: {
    list: {
      id: "voyzu.organization-gl-accounts.page.list",
      pageTitle: "General Ledger Accounts",
      helpUrl: "modules-help/organization-financial-settings/general-ledger-accounts",
    },
    detail: {
      id: "voyzu.organization-gl-accounts.page.detail",
      pageTitle: "General Ledger Account",
      helpUrl: "modules-help/organization-financial-settings/general-ledger-accounts",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/gl-accounts",
      handler: (request: any) => handleGlAccountsList(request),
      apiDoc: {
        summary: "List",
        description: "List Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
      },
    },
    create: {
      method: "POST",
      path: "/organization/gl-accounts",
      handler: (request: any) => handleGlAccountsCreate(request),
      apiDoc: {
        summary: "Create",
        description: "Create Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("GlAccountResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    filter: {
      method: "POST",
      path: "/organization/gl-accounts/filter",
      handler: (request: any) => handleGlAccountsFilter(request),
      apiDoc: {
        summary: "Filter",
        description: "Filter Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    search: {
      method: "GET",
      path: "/organization/gl-accounts/search",
      handler: (request: any) => handleGlAccountsSearch(request),
      apiDoc: {
        summary: "Search",
        description: "Search Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
        requestQuerystringParams: {
          q: {
            description: "Search text used to match organization GL account records.",
            schema: { type: "string" },
          },
        },        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchCreate: {
      method: "POST",
      path: "/organization/gl-accounts/batch/create",
      handler: (request: any) => handleGlAccountsBatchCreate(request),
      apiDoc: {
        summary: "Batch Create",
        description: "Batch Create Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchGet: {
      method: "POST",
      path: "/organization/gl-accounts/batch/get",
      handler: (request: any) => handleGlAccountsBatchGet(request),
      apiDoc: {
        summary: "Batch Get",
        description: "Batch Get Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchUpdate: {
      method: "PUT",
      path: "/organization/gl-accounts/batch/update",
      handler: (request: any) => handleGlAccountsBatchUpdate(request),
      apiDoc: {
        summary: "Batch Update",
        description: "Batch Update Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchPatch: {
      method: "PATCH",
      path: "/organization/gl-accounts/batch/patch",
      handler: (request: any) => handleGlAccountsBatchPatch(request),
      apiDoc: {
        summary: "Batch Patch",
        description: "Batch Patch Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchDelete: {
      method: "POST",
      path: "/organization/gl-accounts/batch/delete",
      handler: (request: any) => handleGlAccountsBatchDelete(request),
      apiDoc: {
        summary: "Batch Delete",
        description: "Batch Delete Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
        responses: {
          "204": { description: "Successful response." },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchActivate: {
      method: "POST",
      path: "/organization/gl-accounts/batch-activate",
      handler: (request: any) => handleGlAccountsBatchActivate(request),
      apiDoc: {
        summary: "Batch Activate",
        description: "Batch Activate Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchDeactivate: {
      method: "POST",
      path: "/organization/gl-accounts/batch-deactivate",
      handler: (request: any) => handleGlAccountsBatchDeactivate(request),
      apiDoc: {
        summary: "Batch Deactivate",
        description: "Batch Deactivate Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("GlAccountResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    activate: {
      method: "POST",
      path: "/organization/gl-accounts/[code]/activate",
      handler: (request: any, context: any) => handleGlAccountsActivate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Activate",
        description: "Activate Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("GlAccountResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    deactivate: {
      method: "POST",
      path: "/organization/gl-accounts/[code]/deactivate",
      handler: (request: any, context: any) => handleGlAccountsDeactivate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Deactivate",
        description: "Deactivate Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("GlAccountResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: {
      method: "GET",
      path: "/organization/gl-accounts/[code]",
      handler: (request: any, context: any) => handleGlAccountsGet(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
      },
    },
    update: {
      method: "PUT",
      path: "/organization/gl-accounts/[code]",
      handler: (request: any, context: any) => handleGlAccountsUpdate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Update",
        description: "Update Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("GlAccountResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    patch: {
      method: "PATCH",
      path: "/organization/gl-accounts/[code]",
      handler: (request: any, context: any) => handleGlAccountsPatch(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("GlAccountResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    delete: {
      method: "DELETE",
      path: "/organization/gl-accounts/[code]",
      handler: (request: any, context: any) => handleGlAccountsDelete(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Organization GL Accounts.",
        tags: ["Organization GL Accounts"],
      },
    },
  }
} as const;
