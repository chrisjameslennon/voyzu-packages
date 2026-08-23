import Type from "typebox";
import { handleActivate as handleInventoryItemsActivate, handleBatchActivate as handleInventoryItemsBatchActivate, handleBatchCreate as handleInventoryItemsBatchCreate, handleBatchDeactivate as handleInventoryItemsBatchDeactivate, handleBatchDelete as handleInventoryItemsBatchDelete, handleBatchGet as handleInventoryItemsBatchGet, handleBatchPatch as handleInventoryItemsBatchPatch, handleBatchUpdate as handleInventoryItemsBatchUpdate, handleCreate as handleInventoryItemsCreate, handleDeactivate as handleInventoryItemsDeactivate, handleDelete as handleInventoryItemsDelete, handleFilter as handleInventoryItemsFilter, handleGet as handleInventoryItemsGet, handleList as handleInventoryItemsList, handlePatch as handleInventoryItemsPatch, handleSearch as handleInventoryItemsSearch, handleUpdate as handleInventoryItemsUpdate } from "@voyzu/finance/common/inventory-items/server";
import { OrganizationInventoryItemsListPage, OrganizationInventoryItemDetailPage } from "@voyzu/finance/organization-inventory-items/server";
import { InventoryItemResponseDto } from "../../types/modules/inventory-items/inventory-item.response.dto";
import { BusinessRuleErrorResponseDto, CodesRequestDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { InventoryItemPatchRequestDto } from "../../types/modules/inventory-items/inventory-item.patch.request.dto";
import { InventoryItemUpdateRequestDto } from "../../types/modules/inventory-items/inventory-item.update.request.dto";
import { InventoryItemCreateRequestDto } from "../../types/modules/inventory-items/inventory-item.create.request.dto";
import { InventoryItemBatchPatchRequestDto } from "../../types/modules/inventory-items/inventory-item.batch-patch.request.dto";
import { InventoryItemBatchUpdateRequestDto } from "../../types/modules/inventory-items/inventory-item.batch-update.request.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/template/inventory/items",
    handler: (request: any) => handleInventoryItemsList(request),
    summary: "List",
    description: "List Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(InventoryItemResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  filter: {
    method: "POST", path: "/finance/template/inventory/items/filter", handler: (request: any) => handleInventoryItemsFilter(request),
    request: { contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryItemResponseDto) } }
  },
  search: {
    method: "GET", path: "/finance/template/inventory/items/search", handler: (request: any) => handleInventoryItemsSearch(request),
    request: { query: { parameters: { q: { description: "Search text used to match inventory item records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryItemResponseDto) } }
  },
  batchGet: {
    method: "POST", path: "/finance/template/inventory/items/batch/get", handler: (request: any) => handleInventoryItemsBatchGet(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryItemResponseDto) } }
  },
  batchCreate: {
    method: "POST", path: "/finance/template/inventory/items/batch/create", handler: (request: any) => handleInventoryItemsBatchCreate(request),
    request: { contentType: "application/json", body: Type.Array(InventoryItemCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryItemResponseDto) } }
  },
  batchUpdate: {
    method: "PUT", path: "/finance/template/inventory/items/batch", handler: (request: any) => handleInventoryItemsBatchUpdate(request),
    request: { contentType: "application/json", body: Type.Array(InventoryItemBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryItemResponseDto) } }
  },
  batchPatch: {
    method: "PATCH", path: "/finance/template/inventory/items/batch", handler: (request: any) => handleInventoryItemsBatchPatch(request),
    request: { contentType: "application/json", body: Type.Array(InventoryItemBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryItemResponseDto) } }
  },
  batchDelete: {
    method: "DELETE", path: "/finance/template/inventory/items/batch", handler: (request: any) => handleInventoryItemsBatchDelete(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
    responses: { "204": { description: "Successful response." } }
  },
  create: {
    method: "POST",
    path: "/finance/template/inventory/items",
    handler: (request: any) => handleInventoryItemsCreate(request),
    request: { contentType: "application/json", body: InventoryItemCreateRequestDto },
    summary: "Create",
    description: "Create Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
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
    method: "GET", path: "/finance/template/inventory/items/[code]", handler: (request: any, context: any) => handleInventoryItemsGet(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
    responses: { "200": { description: "Successful response.", body: InventoryItemResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/finance/template/inventory/items/[code]",
    handler: (request: any, context: any) => handleInventoryItemsUpdate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryItemUpdateRequestDto },
    summary: "Update",
    description: "Update Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
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
    path: "/finance/template/inventory/items/[code]",
    handler: (request: any, context: any) => handleInventoryItemsPatch(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryItemPatchRequestDto },
    summary: "Patch",
    description: "Patch Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
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
    path: "/finance/template/inventory/items/[code]",
    handler: (request: any, context: any) => handleInventoryItemsDelete(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
    responses: {
      "204": { description: "Successful response." },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  activate: {
    method: "POST", path: "/finance/template/inventory/items/[code]/activate", handler: (request: any, context: any) => handleInventoryItemsActivate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
    responses: { "200": { description: "Successful response.", body: InventoryItemResponseDto } }
  },
  deactivate: {
    method: "POST", path: "/finance/template/inventory/items/[code]/deactivate", handler: (request: any, context: any) => handleInventoryItemsDeactivate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
    responses: { "200": { description: "Successful response.", body: InventoryItemResponseDto } }
  },
  batchActivate: {
    method: "POST", path: "/finance/template/inventory/items/batch-activate", handler: (request: any) => handleInventoryItemsBatchActivate(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    description: "Batch Activate Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryItemResponseDto) } }
  },
  batchDeactivate: {
    method: "POST", path: "/finance/template/inventory/items/batch-deactivate", handler: (request: any) => handleInventoryItemsBatchDeactivate(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    description: "Batch Deactivate Organization Inventory Items.",
    tags: ["Organization Inventory Items"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryItemResponseDto) } }
  },
} as const;
