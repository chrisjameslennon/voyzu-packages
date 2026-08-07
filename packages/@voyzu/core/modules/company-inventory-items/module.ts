import { handleActivate as handleActivateInventoryItem, handleBatchActivate as handleBatchActivateInventoryItems, handleBatchCreate as handleBatchCreateInventoryItems, handleBatchDeactivate as handleBatchDeactivateInventoryItems, handleBatchDelete as handleBatchDeleteInventoryItems, handleBatchGet as handleBatchGetInventoryItems, handleBatchPatch as handleBatchPatchInventoryItems, handleBatchUpdate as handleBatchUpdateInventoryItems, handleCreate as handleCreateInventoryItem, handleDeactivate as handleDeactivateInventoryItem, handleDelete as handleDeleteInventoryItem, handleFilter as handleFilterInventoryItems, handleGet as handleGetInventoryItem, handleList as handleListInventoryItems, handlePatch as handlePatchInventoryItem, handleSearch as handleSearchInventoryItems, handleUpdate as handleUpdateInventoryItem } from "@voyzu/core/common/inventory-items/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { InventoryItemsListPage, InventoryItemDetailPage } from "@voyzu/core/company-inventory-items/server";

export const companyInventoryItemsModule = {
  pageRoutes: {
    list: {
          id: "voyzu.company-inventory-items.page.list",
          pageTitle: "Items",
          helpPath: "modules-help/company-ledger/inventory-items",
          path: "/finance/inventory/items",
          Page: InventoryItemsListPage,
          breadcrumbBase: [
                { label: "Finance" },
                { label: "Inventory" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.company-inventory-items.page.detail",
          pageTitle: "Item",
          helpPath: "modules-help/company-ledger/inventory-items",
          path: "/finance/inventory/items/[code]",
          Page: InventoryItemDetailPage,
          breadcrumbBase: [
                { label: "Finance" },
                { label: "Inventory" },
                { label: "Items", href: "/finance/inventory/items" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        }
  },
  apiDefinitions: {
    filter: { method: "POST", path: "/finance/[companyCode]/inventory/items/filter", handler: (request: any) => handleFilterInventoryItems(request), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Filter", description: "Filter Company Inventory Items.", tags: ["Company Inventory Items"], requestBody: { required: true, schema: dtoRef("FilterRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryItemResponseDto")) } } } },
    search: { method: "GET", path: "/finance/[companyCode]/inventory/items/search", handler: (request: any) => handleSearchInventoryItems(request), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Search", description: "Search Company Inventory Items.", tags: ["Company Inventory Items"], requestQuerystringParams: { q: { description: "Search text used to match inventory item records.", schema: { type: "string" } } }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryItemResponseDto")) } } } },
    batchGet: { method: "POST", path: "/finance/[companyCode]/inventory/items/batch/get", handler: (request: any) => handleBatchGetInventoryItems(request), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Get", description: "Batch Get Company Inventory Items.", tags: ["Company Inventory Items"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryItemResponseDto")) } } } },
    batchCreate: { method: "POST", path: "/finance/[companyCode]/inventory/items/batch/create", handler: (request: any) => handleBatchCreateInventoryItems(request), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Create", description: "Batch Create Company Inventory Items.", tags: ["Company Inventory Items"], requestBody: { required: true, schema: arrayOf(dtoRef("InventoryItemCreateRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryItemResponseDto")) } } } },
    batchUpdate: { method: "PUT", path: "/finance/[companyCode]/inventory/items/batch", handler: (request: any) => handleBatchUpdateInventoryItems(request), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Update", description: "Batch Update Company Inventory Items.", tags: ["Company Inventory Items"], requestBody: { required: true, schema: arrayOf(dtoRef("InventoryItemBatchUpdateRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryItemResponseDto")) } } } },
    batchPatch: { method: "PATCH", path: "/finance/[companyCode]/inventory/items/batch", handler: (request: any) => handleBatchPatchInventoryItems(request), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Patch", description: "Batch Patch Company Inventory Items.", tags: ["Company Inventory Items"], requestBody: { required: true, schema: arrayOf(dtoRef("InventoryItemBatchPatchRequestDto")) }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryItemResponseDto")) } } } },
    batchDelete: { method: "DELETE", path: "/finance/[companyCode]/inventory/items/batch", handler: (request: any) => handleBatchDeleteInventoryItems(request), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Delete", description: "Batch Delete Company Inventory Items.", tags: ["Company Inventory Items"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "204": { description: "Successful response." } } } },
    list: {
      method: "GET",
      path: "/finance/[companyCode]/inventory/items",
      handler: (request: any) => handleListInventoryItems(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Company Inventory Items.",
        tags: ["Company Inventory Items"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("InventoryItemResponseDto"))
          },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    create: {
      method: "POST",
      path: "/finance/[companyCode]/inventory/items",
      handler: (request: any) => handleCreateInventoryItem(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Create",
        description: "Create Company Inventory Items.",
        tags: ["Company Inventory Items"],
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
    get: { method: "GET", path: "/finance/[companyCode]/inventory/items/[code]", handler: (request: any, context: any) => handleGetInventoryItem(request, context), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Get", description: "Get Company Inventory Items.", tags: ["Company Inventory Items"], responses: { "200": { description: "Successful response.", schema: dtoRef("InventoryItemResponseDto") } } } },
    update: {
      method: "PUT",
      path: "/finance/[companyCode]/inventory/items/[code]",
      handler: (request: any, context: any) => handleUpdateInventoryItem(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Update",
        description: "Update Company Inventory Items.",
        tags: ["Company Inventory Items"],
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
      path: "/finance/[companyCode]/inventory/items/[code]",
      handler: (request: any, context: any) => handlePatchInventoryItem(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Company Inventory Items.",
        tags: ["Company Inventory Items"],
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
      path: "/finance/[companyCode]/inventory/items/[code]",
      handler: (request: any, context: any) => handleDeleteInventoryItem(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Company Inventory Items.",
        tags: ["Company Inventory Items"],
        responses: {
          "204": { description: "Successful response." },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    activate: { method: "POST", path: "/finance/[companyCode]/inventory/items/[code]/activate", handler: (request: any, context: any) => handleActivateInventoryItem(request, context), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Activate", description: "Activate Company Inventory Items.", tags: ["Company Inventory Items"], responses: { "200": { description: "Successful response.", schema: dtoRef("InventoryItemResponseDto") } } } },
    deactivate: { method: "POST", path: "/finance/[companyCode]/inventory/items/[code]/deactivate", handler: (request: any, context: any) => handleDeactivateInventoryItem(request, context), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, summary: "Deactivate", description: "Deactivate Company Inventory Items.", tags: ["Company Inventory Items"], responses: { "200": { description: "Successful response.", schema: dtoRef("InventoryItemResponseDto") } } } },
    batchActivate: { method: "POST", path: "/finance/[companyCode]/inventory/items/batch-activate", handler: (request: any) => handleBatchActivateInventoryItems(request), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Activate", description: "Batch Activate Company Inventory Items.", tags: ["Company Inventory Items"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryItemResponseDto")) } } } },
    batchDeactivate: { method: "POST", path: "/finance/[companyCode]/inventory/items/batch-deactivate", handler: (request: any) => handleBatchDeactivateInventoryItems(request), apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, summary: "Batch Deactivate", description: "Batch Deactivate Company Inventory Items.", tags: ["Company Inventory Items"], requestBody: { required: true, schema: dtoRef("CodesRequestDto") }, responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("InventoryItemResponseDto")) } } } },
  }
} as const satisfies VoyzuPackageModuleDefinition;
