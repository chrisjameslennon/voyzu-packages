import { handleActivate as handleActivateDimension, handleBatchActivate as handleBatchActivateDimensions, handleBatchCreate as handleBatchCreateDimensions, handleBatchDeactivate as handleBatchDeactivateDimensions, handleBatchDelete as handleBatchDeleteDimensions, handleBatchGet as handleBatchGetDimensions, handleBatchPatch as handleBatchPatchDimensions, handleBatchUpdate as handleBatchUpdateDimensions, handleCreate as handleCreateDimension, handleCreateValue as handleCreateDimensionValue, handleDeactivate as handleDeactivateDimension, handleDelete as handleDeleteDimension, handleDeleteValue as handleDeleteDimensionValue, handleFilter as handleFilterDimensions, handleGet as handleGetDimension, handleList as handleListDimensions, handleListValues as handleListDimensionValues, handlePatch as handlePatchDimension, handlePatchValue as handlePatchDimensionValue, handleSearch as handleSearchDimensions, handleUpdate as handleUpdateDimension } from "@voyzu-modules/core/common/dimensions/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const companyDimensionsModule = {
  pageRoutes: {
    list: {
      id: "voyzu.company-dimensions.page.list",
      pageTitle: "Dimensions",
      helpPath: "modules-help/company-ledger/dimensions",
    },
    detail: {
      id: "voyzu.company-dimensions.page.detail",
      pageTitle: "Dimension",
      helpPath: "modules-help/company-ledger/dimensions",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/dimensions",
      handler: (request: any) => handleListDimensions(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Company Dimensions.",
        tags: ["Company Dimensions"],
      },
    },
    filter: {
      method: "POST",
      path: "/finance/[companyCode]/dimensions/filter",
      handler: (request: any) => handleFilterDimensions(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Filter",
        description: "Filter Company Dimensions.",
        tags: ["Company Dimensions"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("DimensionResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    search: {
      method: "GET",
      path: "/finance/[companyCode]/dimensions/search",
      handler: (request: any) => handleSearchDimensions(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Search",
        description: "Search Company Dimensions.",
        tags: ["Company Dimensions"],
        requestQuerystringParams: {
          q: {
            description: "Search text used to match company dimension records.",
            schema: { type: "string" },
          },
        },        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("DimensionResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    create: {
      method: "POST",
      path: "/finance/[companyCode]/dimensions",
      handler: (request: any) => handleCreateDimension(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Create",
        description: "Create Company Dimensions.",
        tags: ["Company Dimensions"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("DimensionResponseDto")
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
      path: "/finance/[companyCode]/dimensions/batch/create",
      handler: (request: any) => handleBatchCreateDimensions(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Create",
        description: "Batch Create Company Dimensions.",
        tags: ["Company Dimensions"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("DimensionResponseDto"))
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
      path: "/finance/[companyCode]/dimensions/batch/get",
      handler: (request: any) => handleBatchGetDimensions(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Get",
        description: "Batch Get Company Dimensions.",
        tags: ["Company Dimensions"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("DimensionResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchUpdate: {
      method: "PUT",
      path: "/finance/[companyCode]/dimensions/batch/update",
      handler: (request: any) => handleBatchUpdateDimensions(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Update",
        description: "Batch Update Company Dimensions.",
        tags: ["Company Dimensions"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("DimensionResponseDto"))
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
      path: "/finance/[companyCode]/dimensions/batch/patch",
      handler: (request: any) => handleBatchPatchDimensions(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Patch",
        description: "Batch Patch Company Dimensions.",
        tags: ["Company Dimensions"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("DimensionResponseDto"))
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
      path: "/finance/[companyCode]/dimensions/batch/delete",
      handler: (request: any) => handleBatchDeleteDimensions(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Delete",
        description: "Batch Delete Company Dimensions.",
        tags: ["Company Dimensions"],
        responses: {
          "204": { description: "Successful response." },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchActivate: {
      method: "POST",
      path: "/finance/[companyCode]/dimensions/batch-activate",
      handler: (request: any) => handleBatchActivateDimensions(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Activate",
        description: "Batch Activate Company Dimensions.",
        tags: ["Company Dimensions"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("DimensionResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchDeactivate: {
      method: "POST",
      path: "/finance/[companyCode]/dimensions/batch-deactivate",
      handler: (request: any) => handleBatchDeactivateDimensions(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Deactivate",
        description: "Batch Deactivate Company Dimensions.",
        tags: ["Company Dimensions"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("DimensionResponseDto"))
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    activate: {
      method: "POST",
      path: "/finance/[companyCode]/dimensions/[code]/activate",
      handler: (request: any, context: any) => handleActivateDimension(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Activate",
        description: "Activate Company Dimensions.",
        tags: ["Company Dimensions"],
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("DimensionResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    deactivate: {
      method: "POST",
      path: "/finance/[companyCode]/dimensions/[code]/deactivate",
      handler: (request: any, context: any) => handleDeactivateDimension(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Deactivate",
        description: "Deactivate Company Dimensions.",
        tags: ["Company Dimensions"],
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("DimensionResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: {
      method: "GET",
      path: "/finance/[companyCode]/dimensions/[code]",
      handler: (request: any, context: any) => handleGetDimension(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Company Dimensions.",
        tags: ["Company Dimensions"],
      },
    },
    update: {
      method: "PUT",
      path: "/finance/[companyCode]/dimensions/[code]",
      handler: (request: any, context: any) => handleUpdateDimension(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Update",
        description: "Update Company Dimensions.",
        tags: ["Company Dimensions"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("DimensionResponseDto")
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
      path: "/finance/[companyCode]/dimensions/[code]",
      handler: (request: any, context: any) => handlePatchDimension(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Company Dimensions.",
        tags: ["Company Dimensions"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("DimensionResponseDto")
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
      path: "/finance/[companyCode]/dimensions/[code]",
      handler: (request: any, context: any) => handleDeleteDimension(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Company Dimensions.",
        tags: ["Company Dimensions"],
      },
    },
    listValues: {
      method: "GET",
      path: "/finance/[companyCode]/dimensions/[code]/values",
      handler: (request: any, context: any) => handleListDimensionValues(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "List Values",
        description: "List Values Company Dimensions.",
        tags: ["Company Dimensions"],
      },
    },
    createValue: {
      method: "POST",
      path: "/finance/[companyCode]/dimensions/[code]/values",
      handler: (request: any, context: any) => handleCreateDimensionValue(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Create Value",
        description: "Create Value Company Dimensions.",
        tags: ["Company Dimensions"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("DimensionValueResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "A dimension value with this name already exists.", schema: dtoRef("ConflictErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    patchValue: {
      method: "PATCH",
      path: "/finance/[companyCode]/dimensions/values/[id]",
      handler: (request: any, context: any) => handlePatchDimensionValue(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, id: { description: "Unique identifier of the requested record.", schema: { type: "string" } } },
        summary: "Patch Value",
        description: "Patch Value Company Dimensions.",
        tags: ["Company Dimensions"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("DimensionValueResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "A dimension value with this name already exists.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    deleteValue: {
      method: "DELETE",
      path: "/finance/[companyCode]/dimensions/values/[id]",
      handler: (request: any, context: any) => handleDeleteDimensionValue(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, id: { description: "Unique identifier of the requested record.", schema: { type: "string" } } },
        summary: "Delete Value",
        description: "Delete Value Company Dimensions.",
        tags: ["Company Dimensions"],
      },
    },
  }
} as const;
