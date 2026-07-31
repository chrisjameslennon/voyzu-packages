import { handleActivate as handleFinancialDocumentDefaultsActivate, handleBatchActivate as handleFinancialDocumentDefaultsBatchActivate, handleBatchCreate as handleFinancialDocumentDefaultsBatchCreate, handleBatchDeactivate as handleFinancialDocumentDefaultsBatchDeactivate, handleBatchDelete as handleFinancialDocumentDefaultsBatchDelete, handleBatchGet as handleFinancialDocumentDefaultsBatchGet, handleBatchPatch as handleFinancialDocumentDefaultsBatchPatch, handleBatchUpdate as handleFinancialDocumentDefaultsBatchUpdate, handleCreate as handleFinancialDocumentDefaultsCreate, handleDeactivate as handleFinancialDocumentDefaultsDeactivate, handleDelete as handleFinancialDocumentDefaultsDelete, handleFilter as handleFinancialDocumentDefaultsFilter, handleGet as handleFinancialDocumentDefaultsGet, handleList as handleFinancialDocumentDefaultsList, handlePatch as handleFinancialDocumentDefaultsPatch, handleSearch as handleFinancialDocumentDefaultsSearch, handleUpdate as handleFinancialDocumentDefaultsUpdate } from "@voyzu-modules/core/common/financial-document-defaults/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const organizationFinancialDocumentDefaultsModule = {
  pageRoutes: {
    list: {
      id: "voyzu.organization-financial-document-defaults.page.list",
      pageTitle: "Financial Document Defaults",
      helpUrl: "modules-help/organization-financial-settings/financial-document-defaults",
    },
    detail: {
      id: "voyzu.organization-financial-document-defaults.page.detail",
      pageTitle: "Financial Document Default",
      helpUrl: "modules-help/organization-financial-settings/financial-document-defaults",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/financial-document-defaults",
      handler: (request: any) => handleFinancialDocumentDefaultsList(request),
      apiDoc: {
        summary: "List",
        description: "List Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
      },
    },
    create: {
      method: "POST",
      path: "/organization/financial-document-defaults",
      handler: (request: any) => handleFinancialDocumentDefaultsCreate(request),
      apiDoc: {
        summary: "Create",
        description: "Create Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("FinancialDocumentDefaultResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    filter: {
      method: "POST",
      path: "/organization/financial-document-defaults/filter",
      handler: (request: any) => handleFinancialDocumentDefaultsFilter(request),
      apiDoc: {
        summary: "Filter",
        description: "Filter Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("FinancialDocumentDefaultResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    search: {
      method: "GET",
      path: "/organization/financial-document-defaults/search",
      handler: (request: any) => handleFinancialDocumentDefaultsSearch(request),
      apiDoc: {
        summary: "Search",
        description: "Search Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
        requestQuerystringParams: {
          q: {
            description: "Search text used to match organization financial document default records.",
            schema: { type: "string" },
          },
        },        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("FinancialDocumentDefaultResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchCreate: {
      method: "POST",
      path: "/organization/financial-document-defaults/batch/create",
      handler: (request: any) => handleFinancialDocumentDefaultsBatchCreate(request),
      apiDoc: {
        summary: "Batch Create",
        description: "Batch Create Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("FinancialDocumentDefaultResponseDto"))
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchGet: {
      method: "POST",
      path: "/organization/financial-document-defaults/batch/get",
      handler: (request: any) => handleFinancialDocumentDefaultsBatchGet(request),
      apiDoc: {
        summary: "Batch Get",
        description: "Batch Get Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("FinancialDocumentDefaultResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchUpdate: {
      method: "PUT",
      path: "/organization/financial-document-defaults/batch/update",
      handler: (request: any) => handleFinancialDocumentDefaultsBatchUpdate(request),
      apiDoc: {
        summary: "Batch Update",
        description: "Batch Update Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("FinancialDocumentDefaultResponseDto"))
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchPatch: {
      method: "PATCH",
      path: "/organization/financial-document-defaults/batch/patch",
      handler: (request: any) => handleFinancialDocumentDefaultsBatchPatch(request),
      apiDoc: {
        summary: "Batch Patch",
        description: "Batch Patch Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("FinancialDocumentDefaultResponseDto"))
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchDelete: {
      method: "POST",
      path: "/organization/financial-document-defaults/batch/delete",
      handler: (request: any) => handleFinancialDocumentDefaultsBatchDelete(request),
      apiDoc: {
        summary: "Batch Delete",
        description: "Batch Delete Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
        responses: {
          "204": { description: "Successful response." },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchActivate: {
      method: "POST",
      path: "/organization/financial-document-defaults/batch/activate",
      handler: (request: any) => handleFinancialDocumentDefaultsBatchActivate(request),
      apiDoc: {
        summary: "Batch Activate",
        description: "Batch Activate Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
        requestBody: { required: true, schema: dtoRef("FinancialDocumentDefaultKeysRequestDto") },
        responses: {
          "200": { description: "Successful response.", schema: arrayOf(dtoRef("FinancialDocumentDefaultResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchDeactivate: {
      method: "POST",
      path: "/organization/financial-document-defaults/batch/deactivate",
      handler: (request: any) => handleFinancialDocumentDefaultsBatchDeactivate(request),
      apiDoc: {
        summary: "Batch Deactivate",
        description: "Batch Deactivate Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
        requestBody: { required: true, schema: dtoRef("FinancialDocumentDefaultKeysRequestDto") },
        responses: {
          "200": { description: "Successful response.", schema: arrayOf(dtoRef("FinancialDocumentDefaultResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: {
      method: "GET",
      path: "/organization/financial-document-defaults/[code]",
      handler: (request: any, context: any) => handleFinancialDocumentDefaultsGet(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
      },
    },
    update: {
      method: "PUT",
      path: "/organization/financial-document-defaults/[code]",
      handler: (request: any, context: any) => handleFinancialDocumentDefaultsUpdate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Update",
        description: "Update Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("FinancialDocumentDefaultResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    patch: {
      method: "PATCH",
      path: "/organization/financial-document-defaults/[code]",
      handler: (request: any, context: any) => handleFinancialDocumentDefaultsPatch(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("FinancialDocumentDefaultResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    delete: {
      method: "DELETE",
      path: "/organization/financial-document-defaults/[code]",
      handler: (request: any, context: any) => handleFinancialDocumentDefaultsDelete(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
      },
    },
    activate: {
      method: "POST",
      path: "/organization/financial-document-defaults/[code]/activate",
      handler: (request: any, context: any) => handleFinancialDocumentDefaultsActivate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Activate",
        description: "Activate Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("FinancialDocumentDefaultResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    deactivate: {
      method: "POST",
      path: "/organization/financial-document-defaults/[code]/deactivate",
      handler: (request: any, context: any) => handleFinancialDocumentDefaultsDeactivate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Deactivate",
        description: "Deactivate Organization Financial Document Defaults.",
        tags: ["Organization Financial Document Defaults"],
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("FinancialDocumentDefaultResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
  }
} as const;
