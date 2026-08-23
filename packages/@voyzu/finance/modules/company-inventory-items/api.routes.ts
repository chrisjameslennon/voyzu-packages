import Type from "typebox";
import { handleActivate as handleActivateInventoryItem, handleBatchActivate as handleBatchActivateInventoryItems, handleBatchCreate as handleBatchCreateInventoryItems, handleBatchDeactivate as handleBatchDeactivateInventoryItems, handleBatchDelete as handleBatchDeleteInventoryItems, handleBatchGet as handleBatchGetInventoryItems, handleBatchPatch as handleBatchPatchInventoryItems, handleBatchUpdate as handleBatchUpdateInventoryItems, handleCreate as handleCreateInventoryItem, handleDeactivate as handleDeactivateInventoryItem, handleDelete as handleDeleteInventoryItem, handleFilter as handleFilterInventoryItems, handleGet as handleGetInventoryItem, handleList as handleListInventoryItems, handlePatch as handlePatchInventoryItem, handleSearch as handleSearchInventoryItems, handleUpdate as handleUpdateInventoryItem } from "@voyzu/finance/common/inventory-items/server";
import { InventoryItemsListPage, InventoryItemDetailPage } from "@voyzu/finance/company-inventory-items/server";
import { InventoryItemResponseDto } from "../../types/modules/inventory-items/inventory-item.response.dto";
import { BusinessRuleErrorResponseDto, CodesRequestDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { InventoryItemPatchRequestDto } from "../../types/modules/inventory-items/inventory-item.patch.request.dto";
import { InventoryItemUpdateRequestDto } from "../../types/modules/inventory-items/inventory-item.update.request.dto";
import { InventoryItemCreateRequestDto } from "../../types/modules/inventory-items/inventory-item.create.request.dto";
import { InventoryItemBatchPatchRequestDto } from "../../types/modules/inventory-items/inventory-item.batch-patch.request.dto";
import { InventoryItemBatchUpdateRequestDto } from "../../types/modules/inventory-items/inventory-item.batch-update.request.dto";



export const apiDefinitions = {
  filter: {
    method: "POST", path: "/finance/[companyCode]/inventory/items/filter", handler: (request: any) => handleFilterInventoryItems(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryItemResponseDto) } }
  },
  search: {
    method: "GET", path: "/finance/[companyCode]/inventory/items/search", handler: (request: any) => handleSearchInventoryItems(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, query: { parameters: { q: { description: "Search text used to match inventory item records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryItemResponseDto) } }
  },
  batchGet: {
    method: "POST", path: "/finance/[companyCode]/inventory/items/batch/get", handler: (request: any) => handleBatchGetInventoryItems(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryItemResponseDto) } }
  },
  batchCreate: {
    method: "POST", path: "/finance/[companyCode]/inventory/items/batch/create", handler: (request: any) => handleBatchCreateInventoryItems(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(InventoryItemCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryItemResponseDto) } }
  },
  batchUpdate: {
    method: "PUT", path: "/finance/[companyCode]/inventory/items/batch", handler: (request: any) => handleBatchUpdateInventoryItems(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(InventoryItemBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryItemResponseDto) } }
  },
  batchPatch: {
    method: "PATCH", path: "/finance/[companyCode]/inventory/items/batch", handler: (request: any) => handleBatchPatchInventoryItems(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(InventoryItemBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryItemResponseDto) } }
  },
  batchDelete: {
    method: "DELETE", path: "/finance/[companyCode]/inventory/items/batch", handler: (request: any) => handleBatchDeleteInventoryItems(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: { "204": { description: "Successful response." } }
  },
  list: {
    method: "GET",
    path: "/finance/[companyCode]/inventory/items",
    handler: (request: any) => handleListInventoryItems(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(InventoryItemResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  create: {
    method: "POST",
    path: "/finance/[companyCode]/inventory/items",
    handler: (request: any) => handleCreateInventoryItem(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryItemCreateRequestDto },
    summary: "Create",
    description: "Create Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: {
      "200": {
        description: "Successful response.",
        body: InventoryItemResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET", path: "/finance/[companyCode]/inventory/items/[code]", handler: (request: any, context: any) => handleGetInventoryItem(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: { "200": { description: "Successful response.", body: InventoryItemResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/finance/[companyCode]/inventory/items/[code]",
    handler: (request: any, context: any) => handleUpdateInventoryItem(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryItemUpdateRequestDto },
    summary: "Update",
    description: "Update Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: {
      "200": {
        description: "Successful response.",
        body: InventoryItemResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  patch: {
    method: "PATCH",
    path: "/finance/[companyCode]/inventory/items/[code]",
    handler: (request: any, context: any) => handlePatchInventoryItem(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryItemPatchRequestDto },
    summary: "Patch",
    description: "Patch Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: {
      "200": {
        description: "Successful response.",
        body: InventoryItemResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  delete: {
    method: "DELETE",
    path: "/finance/[companyCode]/inventory/items/[code]",
    handler: (request: any, context: any) => handleDeleteInventoryItem(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: {
      "204": { description: "Successful response." },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  activate: {
    method: "POST", path: "/finance/[companyCode]/inventory/items/[code]/activate", handler: (request: any, context: any) => handleActivateInventoryItem(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: { "200": { description: "Successful response.", body: InventoryItemResponseDto } }
  },
  deactivate: {
    method: "POST", path: "/finance/[companyCode]/inventory/items/[code]/deactivate", handler: (request: any, context: any) => handleDeactivateInventoryItem(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: { "200": { description: "Successful response.", body: InventoryItemResponseDto } }
  },
  batchActivate: {
    method: "POST", path: "/finance/[companyCode]/inventory/items/batch-activate", handler: (request: any) => handleBatchActivateInventoryItems(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    description: "Batch Activate Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryItemResponseDto) } }
  },
  batchDeactivate: {
    method: "POST", path: "/finance/[companyCode]/inventory/items/batch-deactivate", handler: (request: any) => handleBatchDeactivateInventoryItems(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    description: "Batch Deactivate Company Inventory Items.",
    tags: ["Company Inventory Items"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryItemResponseDto) } }
  },
} as const;
