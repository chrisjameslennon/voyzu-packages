import { handleActivate as handleActivateFinancialDocumentDefault, handleBatchActivate as handleBatchActivateFinancialDocumentDefaults, handleBatchCreate as handleBatchCreateFinancialDocumentDefaults, handleBatchDeactivate as handleBatchDeactivateFinancialDocumentDefaults, handleBatchDelete as handleBatchDeleteFinancialDocumentDefaults, handleBatchGet as handleBatchGetFinancialDocumentDefaults, handleBatchPatch as handleBatchPatchFinancialDocumentDefaults, handleBatchUpdate as handleBatchUpdateFinancialDocumentDefaults, handleCreate as handleCreateFinancialDocumentDefault, handleDeactivate as handleDeactivateFinancialDocumentDefault, handleDelete as handleDeleteFinancialDocumentDefault, handleFilter as handleFilterFinancialDocumentDefaults, handleGet as handleGetFinancialDocumentDefault, handleList as handleListFinancialDocumentDefaults, handlePatch as handlePatchFinancialDocumentDefault, handleSearch as handleSearchFinancialDocumentDefaults, handleUpdate as handleUpdateFinancialDocumentDefault } from "@voyzu/modules/common/financial-document-defaults/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const companyFinancialDocumentDefaultsModule = {
  id: "voyzu.company-financial-document-defaults",
  name: "Financial Document Defaults",
  pageRoutes: {
    list: {
      id: "voyzu.company-financial-document-defaults.page.list",
      pageTitle: "Financial Document Defaults",
      helpUrl: "modules-help/company-ledger/financial-document-defaults",
    },
    detail: {
      id: "voyzu.company-financial-document-defaults.page.detail",
      pageTitle: "Financial Document Default",
      helpUrl: "modules-help/company-ledger/financial-document-defaults",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/financial-document-defaults",
      handler: (request: any) => handleListFinancialDocumentDefaults(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
      },
    },
    filter: {
      method: "POST",
      path: "/finance/[companyCode]/financial-document-defaults/filter",
      handler: (request: any) => handleFilterFinancialDocumentDefaults(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Filter",
        description: "Filter Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
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
      path: "/finance/[companyCode]/financial-document-defaults/search",
      handler: (request: any) => handleSearchFinancialDocumentDefaults(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Search",
        description: "Search Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
        requestQuerystringParams: {
          q: {
            description: "Search text used to match company financial document default records.",
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
    create: {
      method: "POST",
      path: "/finance/[companyCode]/financial-document-defaults",
      handler: (request: any) => handleCreateFinancialDocumentDefault(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Create",
        description: "Create Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
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
    batchCreate: {
      method: "POST",
      path: "/finance/[companyCode]/financial-document-defaults/batch",
      handler: (request: any) => handleBatchCreateFinancialDocumentDefaults(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Create",
        description: "Batch Create Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
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
      path: "/finance/[companyCode]/financial-document-defaults/batch/get",
      handler: (request: any) => handleBatchGetFinancialDocumentDefaults(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Get",
        description: "Batch Get Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
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
      path: "/finance/[companyCode]/financial-document-defaults/batch",
      handler: (request: any) => handleBatchUpdateFinancialDocumentDefaults(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Update",
        description: "Batch Update Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
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
      path: "/finance/[companyCode]/financial-document-defaults/batch",
      handler: (request: any) => handleBatchPatchFinancialDocumentDefaults(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Patch",
        description: "Batch Patch Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
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
      method: "DELETE",
      path: "/finance/[companyCode]/financial-document-defaults/batch",
      handler: (request: any) => handleBatchDeleteFinancialDocumentDefaults(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Delete",
        description: "Batch Delete Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
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
      path: "/finance/[companyCode]/financial-document-defaults/batch/activate",
      handler: (request: any) => handleBatchActivateFinancialDocumentDefaults(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Activate",
        description: "Batch Activate Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
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
      path: "/finance/[companyCode]/financial-document-defaults/batch/deactivate",
      handler: (request: any) => handleBatchDeactivateFinancialDocumentDefaults(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Deactivate",
        description: "Batch Deactivate Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
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
      path: "/finance/[companyCode]/financial-document-defaults/[code]",
      handler: (request: any, context: any) => handleGetFinancialDocumentDefault(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
      },
    },
    update: {
      method: "PUT",
      path: "/finance/[companyCode]/financial-document-defaults/[code]",
      handler: (request: any, context: any) => handleUpdateFinancialDocumentDefault(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Update",
        description: "Update Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
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
      path: "/finance/[companyCode]/financial-document-defaults/[code]",
      handler: (request: any, context: any) => handlePatchFinancialDocumentDefault(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
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
      path: "/finance/[companyCode]/financial-document-defaults/[code]",
      handler: (request: any, context: any) => handleDeleteFinancialDocumentDefault(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
      },
    },
    activate: {
      method: "POST",
      path: "/finance/[companyCode]/financial-document-defaults/[code]/activate",
      handler: (request: any, context: any) => handleActivateFinancialDocumentDefault(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Activate",
        description: "Activate Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
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
      path: "/finance/[companyCode]/financial-document-defaults/[code]/deactivate",
      handler: (request: any, context: any) => handleDeactivateFinancialDocumentDefault(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Deactivate",
        description: "Deactivate Company Financial Document Defaults.",
        tags: ["Company Financial Document Defaults"],
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
