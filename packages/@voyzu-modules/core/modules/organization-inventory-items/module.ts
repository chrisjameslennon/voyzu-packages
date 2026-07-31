import { handleActivate as handleInventoryItemsActivate, handleBatchActivate as handleInventoryItemsBatchActivate, handleBatchCreate as handleInventoryItemsBatchCreate, handleBatchDeactivate as handleInventoryItemsBatchDeactivate, handleBatchDelete as handleInventoryItemsBatchDelete, handleBatchGet as handleInventoryItemsBatchGet, handleBatchPatch as handleInventoryItemsBatchPatch, handleBatchUpdate as handleInventoryItemsBatchUpdate, handleCreate as handleInventoryItemsCreate, handleDeactivate as handleInventoryItemsDeactivate, handleDelete as handleInventoryItemsDelete, handleFilter as handleInventoryItemsFilter, handleGet as handleInventoryItemsGet, handleList as handleInventoryItemsList, handlePatch as handleInventoryItemsPatch, handleSearch as handleInventoryItemsSearch, handleUpdate as handleInventoryItemsUpdate } from "@voyzu-modules/core/common/inventory-items/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const organizationInventoryItemsModule = {
  pageRoutes: {
    list: {
      id: "voyzu.organization-inventory-items.page.list",
      pageTitle: "Inventory Items",
      helpPath: "modules-help/organization-financial-settings/inventory-items",
    },
    detail: {
      id: "voyzu.organization-inventory-items.page.detail",
      pageTitle: "Inventory Item",
      helpPath: "modules-help/organization-financial-settings/inventory-items",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/inventory/items",
      handler: (request: any) => handleInventoryItemsList(request),
      apiDoc: {
        summary: "List",
        description: "List Organization Inventory Items.",
        tags: ["Organization Inventory Items"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("InventoryItemResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    filter: { method: "POST", path: "/organization/inventory/items/filter", handler: (request: any) => handleInventoryItemsFilter(request), apiDoc: { summary: "Filter", description: "Filter Organization Inventory Items.", tags: ["Organization Inventory Items"], requestBody: { required: true, schema: dtoRef("FilterRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryItemResponseDto")) } } } },
    search: { method: "GET", path: "/organization/inventory/items/search", handler: (request: any) => handleInventoryItemsSearch(request), apiDoc: { summary: "Search", description: "Search Organization Inventory Items.", tags: ["Organization Inventory Items"], requestQuerystringParams: { q: { description: "Search text used to match inventory item records.", schema: { type: "string" } } }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryItemResponseDto")) } } } },
    batchGet: { method: "POST", path: "/organization/inventory/items/batch/get", handler: (request: any) => handleInventoryItemsBatchGet(request), apiDoc: { summary: "Batch Get", description: "Batch Get Organization Inventory Items.", tags: ["Organization Inventory Items"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryItemResponseDto")) } } } },
    batchCreate: { method: "POST", path: "/organization/inventory/items/batch/create", handler: (request: any) => handleInventoryItemsBatchCreate(request), apiDoc: { summary: "Batch Create", description: "Batch Create Organization Inventory Items.", tags: ["Organization Inventory Items"], requestBody: { required: true, schema: arrayOf(dtoRef("InventoryItemCreateRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryItemResponseDto")) } } } },
    batchUpdate: { method: "PUT", path: "/organization/inventory/items/batch", handler: (request: any) => handleInventoryItemsBatchUpdate(request), apiDoc: { summary: "Batch Update", description: "Batch Update Organization Inventory Items.", tags: ["Organization Inventory Items"], requestBody: { required: true, schema: arrayOf(dtoRef("InventoryItemBatchUpdateRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryItemResponseDto")) } } } },
    batchPatch: { method: "PATCH", path: "/organization/inventory/items/batch", handler: (request: any) => handleInventoryItemsBatchPatch(request), apiDoc: { summary: "Batch Patch", description: "Batch Patch Organization Inventory Items.", tags: ["Organization Inventory Items"], requestBody: { required: true, schema: arrayOf(dtoRef("InventoryItemBatchPatchRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryItemResponseDto")) } } } },
    batchDelete: { method: "DELETE", path: "/organization/inventory/items/batch", handler: (request: any) => handleInventoryItemsBatchDelete(request), apiDoc: { summary: "Batch Delete", description: "Batch Delete Organization Inventory Items.", tags: ["Organization Inventory Items"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "204": { description: "Successful response." } } } },
    create: {
      method: "POST",
      path: "/organization/inventory/items",
      handler: (request: any) => handleInventoryItemsCreate(request),
      apiDoc: {
        summary: "Create",
        description: "Create Organization Inventory Items.",
        tags: ["Organization Inventory Items"],
        requestBody: { required: true, schema: dtoRef("InventoryItemCreateRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("InventoryItemResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    get: { method: "GET", path: "/organization/inventory/items/[code]", handler: (request: any, context: any) => handleInventoryItemsGet(request, context), apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Get", description: "Get Organization Inventory Items.", tags: ["Organization Inventory Items"], responses: { "200": { description: "Successful response.", schema: dtoRef("InventoryItemResponseDto") } } } },
    update: {
      method: "PUT",
      path: "/organization/inventory/items/[code]",
      handler: (request: any, context: any) => handleInventoryItemsUpdate(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Update",
        description: "Update Organization Inventory Items.",
        tags: ["Organization Inventory Items"],
        requestBody: { required: true, schema: dtoRef("InventoryItemUpdateRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("InventoryItemResponseDto")
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
      path: "/organization/inventory/items/[code]",
      handler: (request: any, context: any) => handleInventoryItemsPatch(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Organization Inventory Items.",
        tags: ["Organization Inventory Items"],
        requestBody: { required: true, schema: dtoRef("InventoryItemPatchRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("InventoryItemResponseDto")
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
      path: "/organization/inventory/items/[code]",
      handler: (request: any, context: any) => handleInventoryItemsDelete(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Organization Inventory Items.",
        tags: ["Organization Inventory Items"],
        responses: {
          "204": { description: "Successful response." },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    activate: { method: "POST", path: "/organization/inventory/items/[code]/activate", handler: (request: any, context: any) => handleInventoryItemsActivate(request, context), apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Activate", description: "Activate Organization Inventory Items.", tags: ["Organization Inventory Items"], responses: { "200": { description: "Successful response.", schema: dtoRef("InventoryItemResponseDto") } } } },
    deactivate: { method: "POST", path: "/organization/inventory/items/[code]/deactivate", handler: (request: any, context: any) => handleInventoryItemsDeactivate(request, context), apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Deactivate", description: "Deactivate Organization Inventory Items.", tags: ["Organization Inventory Items"], responses: { "200": { description: "Successful response.", schema: dtoRef("InventoryItemResponseDto") } } } },
    batchActivate: { method: "POST", path: "/organization/inventory/items/batch-activate", handler: (request: any) => handleInventoryItemsBatchActivate(request), apiDoc: { summary: "Batch Activate", description: "Batch Activate Organization Inventory Items.", tags: ["Organization Inventory Items"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryItemResponseDto")) } } } },
    batchDeactivate: { method: "POST", path: "/organization/inventory/items/batch-deactivate", handler: (request: any) => handleInventoryItemsBatchDeactivate(request), apiDoc: { summary: "Batch Deactivate", description: "Batch Deactivate Organization Inventory Items.", tags: ["Organization Inventory Items"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryItemResponseDto")) } } } },
  }
} as const;
