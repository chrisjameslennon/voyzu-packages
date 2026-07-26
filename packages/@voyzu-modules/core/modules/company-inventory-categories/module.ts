import { handleActivate as handleActivateInventoryCategory, handleBatchActivate as handleBatchActivateInventoryCategories, handleBatchCreate as handleBatchCreateInventoryCategories, handleBatchDeactivate as handleBatchDeactivateInventoryCategories, handleBatchDelete as handleBatchDeleteInventoryCategories, handleBatchGet as handleBatchGetInventoryCategories, handleBatchPatch as handleBatchPatchInventoryCategories, handleBatchUpdate as handleBatchUpdateInventoryCategories, handleCreate as handleCreateInventoryCategory, handleDeactivate as handleDeactivateInventoryCategory, handleDelete as handleDeleteInventoryCategory, handleFilter as handleFilterInventoryCategories, handleGet as handleGetInventoryCategory, handleList as handleListInventoryCategories, handlePatch as handlePatchInventoryCategory, handleSearch as handleSearchInventoryCategories, handleUpdate as handleUpdateInventoryCategory } from "@voyzu-modules/core/common/inventory-categories/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const companyInventoryCategoriesModule = {
  id: "voyzu.company-inventory-categories",
  name: "Inventory Categories",
  pageRoutes: {
    list: {
      id: "voyzu.company-inventory-categories.page.list",
      pageTitle: "Inventory Categories",
      helpUrl: "modules-help/company-ledger/inventory-categories",
    },
    detail: {
      id: "voyzu.company-inventory-categories.page.detail",
      pageTitle: "Inventory Category",
      helpUrl: "modules-help/company-ledger/inventory-categories",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/inventory/categories",
      handler: (request: any) => handleListInventoryCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Company Inventory Categories.",
        tags: ["Company Inventory Categories"],
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
      path: "/finance/[companyCode]/inventory/categories/filter",
      handler: (request: any) => handleFilterInventoryCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Filter", description: "Filter Company Inventory Categories.", tags: ["Company Inventory Categories"], requestBody: { required: true, schema: dtoRef("FilterRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryCategoryResponseDto")) }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    search: {
      method: "GET",
      path: "/finance/[companyCode]/inventory/categories/search",
      handler: (request: any) => handleSearchInventoryCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Search", description: "Search Company Inventory Categories.", tags: ["Company Inventory Categories"], requestQuerystringParams: { q: { description: "Search text used to match company inventory category records.", schema: { type: "string" } } }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryCategoryResponseDto")) }, "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    batchGet: {
      method: "POST",
      path: "/finance/[companyCode]/inventory/categories/batch/get",
      handler: (request: any) => handleBatchGetInventoryCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Get", description: "Batch Get Company Inventory Categories.", tags: ["Company Inventory Categories"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryCategoryResponseDto")) }, "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    batchCreate: {
      method: "POST",
      path: "/finance/[companyCode]/inventory/categories/batch/create",
      handler: (request: any) => handleBatchCreateInventoryCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Create", description: "Batch Create Company Inventory Categories.", tags: ["Company Inventory Categories"], requestBody: { required: true, schema: arrayOf(dtoRef("InventoryCategoryCreateRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryCategoryResponseDto")) }, "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") }, "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    batchUpdate: {
      method: "PUT",
      path: "/finance/[companyCode]/inventory/categories/batch",
      handler: (request: any) => handleBatchUpdateInventoryCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Update", description: "Batch Update Company Inventory Categories.", tags: ["Company Inventory Categories"], requestBody: { required: true, schema: arrayOf(dtoRef("InventoryCategoryBatchUpdateRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryCategoryResponseDto")) }, "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") }, "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    batchPatch: {
      method: "PATCH",
      path: "/finance/[companyCode]/inventory/categories/batch",
      handler: (request: any) => handleBatchPatchInventoryCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Patch", description: "Batch Patch Company Inventory Categories.", tags: ["Company Inventory Categories"], requestBody: { required: true, schema: arrayOf(dtoRef("InventoryCategoryBatchPatchRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryCategoryResponseDto")) }, "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") }, "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    batchDelete: {
      method: "DELETE",
      path: "/finance/[companyCode]/inventory/categories/batch",
      handler: (request: any) => handleBatchDeleteInventoryCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Delete", description: "Batch Delete Company Inventory Categories.", tags: ["Company Inventory Categories"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "204": { description: "Successful response." }, "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") }, "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    create: {
      method: "POST",
      path: "/finance/[companyCode]/inventory/categories",
      handler: (request: any) => handleCreateInventoryCategory(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Create",
        description: "Create Company Inventory Categories.",
        tags: ["Company Inventory Categories"],
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
      path: "/finance/[companyCode]/inventory/categories/[code]",
      handler: (request: any, context: any) => handleGetInventoryCategory(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Get", description: "Get Company Inventory Categories.", tags: ["Company Inventory Categories"], responses: { "200": { description: "Successful response.", schema: dtoRef("InventoryCategoryResponseDto") }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    update: {
      method: "PUT",
      path: "/finance/[companyCode]/inventory/categories/[code]",
      handler: (request: any, context: any) => handleUpdateInventoryCategory(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Update",
        description: "Update Company Inventory Categories.",
        tags: ["Company Inventory Categories"],
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
      path: "/finance/[companyCode]/inventory/categories/[code]",
      handler: (request: any, context: any) => handlePatchInventoryCategory(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Company Inventory Categories.",
        tags: ["Company Inventory Categories"],
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
      path: "/finance/[companyCode]/inventory/categories/[code]",
      handler: (request: any, context: any) => handleDeleteInventoryCategory(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Company Inventory Categories.",
        tags: ["Company Inventory Categories"],
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
      path: "/finance/[companyCode]/inventory/categories/[code]/activate",
      handler: (request: any, context: any) => handleActivateInventoryCategory(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Activate", description: "Activate Company Inventory Categories.", tags: ["Company Inventory Categories"], responses: { "200": { description: "Successful response.", schema: dtoRef("InventoryCategoryResponseDto") }, "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    deactivate: {
      method: "POST",
      path: "/finance/[companyCode]/inventory/categories/[code]/deactivate",
      handler: (request: any, context: any) => handleDeactivateInventoryCategory(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Deactivate", description: "Deactivate Company Inventory Categories.", tags: ["Company Inventory Categories"], responses: { "200": { description: "Successful response.", schema: dtoRef("InventoryCategoryResponseDto") }, "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") }, "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } } },
    },
    batchActivate: {
      method: "POST",
      path: "/finance/[companyCode]/inventory/categories/batch-activate",
      handler: (request: any) => handleBatchActivateInventoryCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Activate",
        description: "Batch Activate Company Inventory Categories.",
        tags: ["Company Inventory Categories"],
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
      path: "/finance/[companyCode]/inventory/categories/batch-deactivate",
      handler: (request: any) => handleBatchDeactivateInventoryCategories(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Deactivate",
        description: "Batch Deactivate Company Inventory Categories.",
        tags: ["Company Inventory Categories"],
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
