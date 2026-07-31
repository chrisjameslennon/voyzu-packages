import { handleActivate as handleDimensionsActivate, handleBatchActivate as handleDimensionsBatchActivate, handleBatchCreate as handleDimensionsBatchCreate, handleBatchDeactivate as handleDimensionsBatchDeactivate, handleBatchDelete as handleDimensionsBatchDelete, handleBatchGet as handleDimensionsBatchGet, handleBatchPatch as handleDimensionsBatchPatch, handleBatchUpdate as handleDimensionsBatchUpdate, handleCreate as handleDimensionsCreate, handleCreateValue as handleDimensionsCreateValue, handleDeactivate as handleDimensionsDeactivate, handleDelete as handleDimensionsDelete, handleDeleteValue as handleDimensionsDeleteValue, handleFilter as handleDimensionsFilter, handleGet as handleDimensionsGet, handleList as handleDimensionsList, handleListValues as handleDimensionsListValues, handlePatch as handleDimensionsPatch, handlePatchValue as handleDimensionsPatchValue, handleSearch as handleDimensionsSearch, handleUpdate as handleDimensionsUpdate } from "@voyzu-modules/core/common/dimensions/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const organizationDimensionsModule = {
  pageRoutes: {
    list: {
      id: "voyzu.organization-dimensions.page.list",
      pageTitle: "Dimensions",
      helpUrl: "modules-help/organization-financial-settings/dimensions",
    },
    detail: {
      id: "voyzu.organization-dimensions.page.detail",
      pageTitle: "Dimension",
      helpUrl: "modules-help/organization-financial-settings/dimensions",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/dimensions",
      handler: (request: any) => handleDimensionsList(request),
      apiDoc: {
        summary: "List",
        description: "List Organization Dimensions.",
        tags: ["Organization Dimensions"],
      },
    },
    create: {
      method: "POST",
      path: "/organization/dimensions",
      handler: (request: any) => handleDimensionsCreate(request),
      apiDoc: {
        summary: "Create",
        description: "Create Organization Dimensions.",
        tags: ["Organization Dimensions"],
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
    filter: {
      method: "POST",
      path: "/organization/dimensions/filter",
      handler: (request: any) => handleDimensionsFilter(request),
      apiDoc: {
        summary: "Filter",
        description: "Filter Organization Dimensions.",
        tags: ["Organization Dimensions"],
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
      path: "/organization/dimensions/search",
      handler: (request: any) => handleDimensionsSearch(request),
      apiDoc: {
        summary: "Search",
        description: "Search Organization Dimensions.",
        tags: ["Organization Dimensions"],
        requestQuerystringParams: {
          q: {
            description: "Search text used to match organization dimension records.",
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
    batchCreate: {
      method: "POST",
      path: "/organization/dimensions/batch/create",
      handler: (request: any) => handleDimensionsBatchCreate(request),
      apiDoc: {
        summary: "Batch Create",
        description: "Batch Create Organization Dimensions.",
        tags: ["Organization Dimensions"],
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
      path: "/organization/dimensions/batch/get",
      handler: (request: any) => handleDimensionsBatchGet(request),
      apiDoc: {
        summary: "Batch Get",
        description: "Batch Get Organization Dimensions.",
        tags: ["Organization Dimensions"],
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
      path: "/organization/dimensions/batch/update",
      handler: (request: any) => handleDimensionsBatchUpdate(request),
      apiDoc: {
        summary: "Batch Update",
        description: "Batch Update Organization Dimensions.",
        tags: ["Organization Dimensions"],
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
      path: "/organization/dimensions/batch/patch",
      handler: (request: any) => handleDimensionsBatchPatch(request),
      apiDoc: {
        summary: "Batch Patch",
        description: "Batch Patch Organization Dimensions.",
        tags: ["Organization Dimensions"],
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
      path: "/organization/dimensions/batch/delete",
      handler: (request: any) => handleDimensionsBatchDelete(request),
      apiDoc: {
        summary: "Batch Delete",
        description: "Batch Delete Organization Dimensions.",
        tags: ["Organization Dimensions"],
        responses: {
          "204": { description: "Successful response." },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchActivate: {
      method: "POST",
      path: "/organization/dimensions/batch-activate",
      handler: (request: any) => handleDimensionsBatchActivate(request),
      apiDoc: {
        summary: "Batch Activate",
        description: "Batch Activate Organization Dimensions.",
        tags: ["Organization Dimensions"],
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
      path: "/organization/dimensions/batch-deactivate",
      handler: (request: any) => handleDimensionsBatchDeactivate(request),
      apiDoc: {
        summary: "Batch Deactivate",
        description: "Batch Deactivate Organization Dimensions.",
        tags: ["Organization Dimensions"],
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
      path: "/organization/dimensions/[code]/activate",
      handler: (request: any, context: any) => handleDimensionsActivate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Activate",
        description: "Activate Organization Dimensions.",
        tags: ["Organization Dimensions"],
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
      path: "/organization/dimensions/[code]/deactivate",
      handler: (request: any, context: any) => handleDimensionsDeactivate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Deactivate",
        description: "Deactivate Organization Dimensions.",
        tags: ["Organization Dimensions"],
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("DimensionResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    listValues: {
      method: "GET",
      path: "/organization/dimensions/[code]/values",
      handler: (request: any, context: any) => handleDimensionsListValues(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "List Values",
        description: "List Values Organization Dimensions.",
        tags: ["Organization Dimensions"],
      },
    },
    createValue: {
      method: "POST",
      path: "/organization/dimensions/[code]/values",
      handler: (request: any, context: any) => handleDimensionsCreateValue(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Create Value",
        description: "Create Value Organization Dimensions.",
        tags: ["Organization Dimensions"],
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
      path: "/organization/dimensions/values/[id]",
      handler: (request: any, context: any) => handleDimensionsPatchValue(request, context as { params: Promise<{ id: string }> }),
      apiDoc: { requestPathParams: { id: { description: "Unique identifier of the requested record.", schema: { type: "string" } } },
        summary: "Patch Value",
        description: "Patch Value Organization Dimensions.",
        tags: ["Organization Dimensions"],
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
      path: "/organization/dimensions/values/[id]",
      handler: (request: any, context: any) => handleDimensionsDeleteValue(request, context as { params: Promise<{ id: string }> }),
      apiDoc: { requestPathParams: { id: { description: "Unique identifier of the requested record.", schema: { type: "string" } } },
        summary: "Delete Value",
        description: "Delete Value Organization Dimensions.",
        tags: ["Organization Dimensions"],
      },
    },
    get: {
      method: "GET",
      path: "/organization/dimensions/[code]",
      handler: (request: any, context: any) => handleDimensionsGet(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Organization Dimensions.",
        tags: ["Organization Dimensions"],
      },
    },
    update: {
      method: "PUT",
      path: "/organization/dimensions/[code]",
      handler: (request: any, context: any) => handleDimensionsUpdate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Update",
        description: "Update Organization Dimensions.",
        tags: ["Organization Dimensions"],
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
      path: "/organization/dimensions/[code]",
      handler: (request: any, context: any) => handleDimensionsPatch(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Organization Dimensions.",
        tags: ["Organization Dimensions"],
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
      path: "/organization/dimensions/[code]",
      handler: (request: any, context: any) => handleDimensionsDelete(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Organization Dimensions.",
        tags: ["Organization Dimensions"],
      },
    },
  }
} as const;
