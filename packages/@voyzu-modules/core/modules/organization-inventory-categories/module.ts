import { handleActivate as handleInventoryCategoriesActivate, handleBatchActivate as handleInventoryCategoriesBatchActivate, handleBatchCreate as handleInventoryCategoriesBatchCreate, handleBatchDeactivate as handleInventoryCategoriesBatchDeactivate, handleBatchDelete as handleInventoryCategoriesBatchDelete, handleBatchGet as handleInventoryCategoriesBatchGet, handleBatchPatch as handleInventoryCategoriesBatchPatch, handleBatchUpdate as handleInventoryCategoriesBatchUpdate, handleCreate as handleInventoryCategoriesCreate, handleDeactivate as handleInventoryCategoriesDeactivate, handleDelete as handleInventoryCategoriesDelete, handleFilter as handleInventoryCategoriesFilter, handleGet as handleInventoryCategoriesGet, handleList as handleInventoryCategoriesList, handlePatch as handleInventoryCategoriesPatch, handleSearch as handleInventoryCategoriesSearch, handleUpdate as handleInventoryCategoriesUpdate } from "@voyzu-modules/core/common/inventory-categories/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const organizationInventoryCategoriesModule = {
  id: "voyzu.organization-inventory-categories",
  name: "Inventory Categories",
  pageRoutes: {
    list: {
      id: "voyzu.organization-inventory-categories.page.list",
      pageTitle: "Inventory Categories",
      helpUrl: "modules-help/organization-financial-settings/inventory-categories",
    },
    detail: {
      id: "voyzu.organization-inventory-categories.page.detail",
      pageTitle: "Inventory Category",
      helpUrl: "modules-help/organization-financial-settings/inventory-categories",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/inventory/categories",
      handler: (request: any) => handleInventoryCategoriesList(request),
      apiDoc: {
        summary: "List",
        description: "List Organization Inventory Categories.",
        tags: ["Organization Inventory Categories"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("InventoryCategoryResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    filter: {
      method: "POST",
      path: "/organization/inventory/categories/filter",
      handler: (request: any) => handleInventoryCategoriesFilter(request),
      apiDoc: { summary: "Filter", description: "Filter Organization Inventory Categories.", tags: ["Organization Inventory Categories"], requestBody: { required: true, schema: dtoRef("FilterRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryCategoryResponseDto")) }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    search: {
      method: "GET",
      path: "/organization/inventory/categories/search",
      handler: (request: any) => handleInventoryCategoriesSearch(request),
      apiDoc: { summary: "Search", description: "Search Organization Inventory Categories.", tags: ["Organization Inventory Categories"], requestQuerystringParams: { q: { description: "Search text used to match organization inventory category records.", schema: { type: "string" } } }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryCategoryResponseDto")) }, "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    batchGet: {
      method: "POST",
      path: "/organization/inventory/categories/batch/get",
      handler: (request: any) => handleInventoryCategoriesBatchGet(request),
      apiDoc: { summary: "Batch Get", description: "Batch Get Organization Inventory Categories.", tags: ["Organization Inventory Categories"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryCategoryResponseDto")) }, "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    batchCreate: {
      method: "POST",
      path: "/organization/inventory/categories/batch/create",
      handler: (request: any) => handleInventoryCategoriesBatchCreate(request),
      apiDoc: { summary: "Batch Create", description: "Batch Create Organization Inventory Categories.", tags: ["Organization Inventory Categories"], requestBody: { required: true, schema: arrayOf(dtoRef("InventoryCategoryCreateRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryCategoryResponseDto")) }, "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") }, "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    batchUpdate: {
      method: "PUT",
      path: "/organization/inventory/categories/batch",
      handler: (request: any) => handleInventoryCategoriesBatchUpdate(request),
      apiDoc: { summary: "Batch Update", description: "Batch Update Organization Inventory Categories.", tags: ["Organization Inventory Categories"], requestBody: { required: true, schema: arrayOf(dtoRef("InventoryCategoryBatchUpdateRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryCategoryResponseDto")) }, "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") }, "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    batchPatch: {
      method: "PATCH",
      path: "/organization/inventory/categories/batch",
      handler: (request: any) => handleInventoryCategoriesBatchPatch(request),
      apiDoc: { summary: "Batch Patch", description: "Batch Patch Organization Inventory Categories.", tags: ["Organization Inventory Categories"], requestBody: { required: true, schema: arrayOf(dtoRef("InventoryCategoryBatchPatchRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryCategoryResponseDto")) }, "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") }, "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    batchDelete: {
      method: "DELETE",
      path: "/organization/inventory/categories/batch",
      handler: (request: any) => handleInventoryCategoriesBatchDelete(request),
      apiDoc: { summary: "Batch Delete", description: "Batch Delete Organization Inventory Categories.", tags: ["Organization Inventory Categories"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "204": { description: "Successful response." }, "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") }, "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    create: {
      method: "POST",
      path: "/organization/inventory/categories",
      handler: (request: any) => handleInventoryCategoriesCreate(request),
      apiDoc: {
        summary: "Create",
        description: "Create Organization Inventory Categories.",
        tags: ["Organization Inventory Categories"],
        requestBody: { required: true, schema: dtoRef("InventoryCategoryCreateRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("InventoryCategoryResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: {
      method: "GET",
      path: "/organization/inventory/categories/[code]",
      handler: (request: any, context: any) => handleInventoryCategoriesGet(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Get", description: "Get Organization Inventory Categories.", tags: ["Organization Inventory Categories"], responses: { "200": { description: "Successful response.", schema: dtoRef("InventoryCategoryResponseDto") }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    update: {
      method: "PUT",
      path: "/organization/inventory/categories/[code]",
      handler: (request: any, context: any) => handleInventoryCategoriesUpdate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Update",
        description: "Update Organization Inventory Categories.",
        tags: ["Organization Inventory Categories"],
        requestBody: { required: true, schema: dtoRef("InventoryCategoryUpdateRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("InventoryCategoryResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    patch: {
      method: "PATCH",
      path: "/organization/inventory/categories/[code]",
      handler: (request: any, context: any) => handleInventoryCategoriesPatch(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Organization Inventory Categories.",
        tags: ["Organization Inventory Categories"],
        requestBody: { required: true, schema: dtoRef("InventoryCategoryPatchRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("InventoryCategoryResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    delete: {
      method: "DELETE",
      path: "/organization/inventory/categories/[code]",
      handler: (request: any, context: any) => handleInventoryCategoriesDelete(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Organization Inventory Categories.",
        tags: ["Organization Inventory Categories"],
        responses: {
          "204": { description: "Successful response." },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    activate: {
      method: "POST",
      path: "/organization/inventory/categories/[code]/activate",
      handler: (request: any, context: any) => handleInventoryCategoriesActivate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Activate", description: "Activate Organization Inventory Categories.", tags: ["Organization Inventory Categories"], responses: { "200": { description: "Successful response.", schema: dtoRef("InventoryCategoryResponseDto") }, "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    deactivate: {
      method: "POST",
      path: "/organization/inventory/categories/[code]/deactivate",
      handler: (request: any, context: any) => handleInventoryCategoriesDeactivate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Deactivate", description: "Deactivate Organization Inventory Categories.", tags: ["Organization Inventory Categories"], responses: { "200": { description: "Successful response.", schema: dtoRef("InventoryCategoryResponseDto") }, "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    batchActivate: {
      method: "POST",
      path: "/organization/inventory/categories/batch-activate",
      handler: (request: any) => handleInventoryCategoriesBatchActivate(request),
      apiDoc: {
        summary: "Batch Activate",
        description: "Batch Activate Organization Inventory Categories.",
        tags: ["Organization Inventory Categories"],
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("InventoryCategoryResponseDto"))
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    batchDeactivate: {
      method: "POST",
      path: "/organization/inventory/categories/batch-deactivate",
      handler: (request: any) => handleInventoryCategoriesBatchDeactivate(request),
      apiDoc: {
        summary: "Batch Deactivate",
        description: "Batch Deactivate Organization Inventory Categories.",
        tags: ["Organization Inventory Categories"],
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("InventoryCategoryResponseDto"))
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
