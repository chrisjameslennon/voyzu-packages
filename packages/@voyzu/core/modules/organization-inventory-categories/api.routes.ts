import Type from "typebox";
import { handleActivate as handleInventoryCategoriesActivate, handleBatchActivate as handleInventoryCategoriesBatchActivate, handleBatchCreate as handleInventoryCategoriesBatchCreate, handleBatchDeactivate as handleInventoryCategoriesBatchDeactivate, handleBatchDelete as handleInventoryCategoriesBatchDelete, handleBatchGet as handleInventoryCategoriesBatchGet, handleBatchPatch as handleInventoryCategoriesBatchPatch, handleBatchUpdate as handleInventoryCategoriesBatchUpdate, handleCreate as handleInventoryCategoriesCreate, handleDeactivate as handleInventoryCategoriesDeactivate, handleDelete as handleInventoryCategoriesDelete, handleFilter as handleInventoryCategoriesFilter, handleGet as handleInventoryCategoriesGet, handleList as handleInventoryCategoriesList, handlePatch as handleInventoryCategoriesPatch, handleSearch as handleInventoryCategoriesSearch, handleUpdate as handleInventoryCategoriesUpdate } from "@voyzu/core/common/inventory-categories/server";
import { OrganizationInventoryCategoriesListPage, OrganizationInventoryCategoryDetailPage } from "@voyzu/core/organization-inventory-categories/server";
import { BusinessRuleErrorResponseDto, CodesRequestDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { InventoryCategoryResponseDto } from "../../types/modules/inventory-categories/inventory-category.response.dto";
import { InventoryCategoryPatchRequestDto } from "../../types/modules/inventory-categories/inventory-category.patch.request.dto";
import { InventoryCategoryUpdateRequestDto } from "../../types/modules/inventory-categories/inventory-category.update.request.dto";
import { InventoryCategoryCreateRequestDto } from "../../types/modules/inventory-categories/inventory-category.create.request.dto";
import { InventoryCategoryBatchPatchRequestDto } from "../../types/modules/inventory-categories/inventory-category.batch-patch.request.dto";
import { InventoryCategoryBatchUpdateRequestDto } from "../../types/modules/inventory-categories/inventory-category.batch-update.request.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/inventory/categories",
    handler: (request: any) => handleInventoryCategoriesList(request),
    summary: "List",
    description: "List Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(InventoryCategoryResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  filter: {
    method: "POST",
    path: "/finance/inventory/categories/filter",
    handler: (request: any) => handleInventoryCategoriesFilter(request),
    request: { contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryCategoryResponseDto) }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  search: {
    method: "GET",
    path: "/finance/inventory/categories/search",
    handler: (request: any) => handleInventoryCategoriesSearch(request),
    request: { query: { parameters: { q: { description: "Search text used to match organization inventory category records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryCategoryResponseDto) }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  batchGet: {
    method: "POST",
    path: "/finance/inventory/categories/batch/get",
    handler: (request: any) => handleInventoryCategoriesBatchGet(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryCategoryResponseDto) }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  batchCreate: {
    method: "POST",
    path: "/finance/inventory/categories/batch/create",
    handler: (request: any) => handleInventoryCategoriesBatchCreate(request),
    request: { contentType: "application/json", body: Type.Array(InventoryCategoryCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryCategoryResponseDto) }, "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  batchUpdate: {
    method: "PUT",
    path: "/finance/inventory/categories/batch",
    handler: (request: any) => handleInventoryCategoriesBatchUpdate(request),
    request: { contentType: "application/json", body: Type.Array(InventoryCategoryBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryCategoryResponseDto) }, "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  batchPatch: {
    method: "PATCH",
    path: "/finance/inventory/categories/batch",
    handler: (request: any) => handleInventoryCategoriesBatchPatch(request),
    request: { contentType: "application/json", body: Type.Array(InventoryCategoryBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryCategoryResponseDto) }, "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  batchDelete: {
    method: "DELETE",
    path: "/finance/inventory/categories/batch",
    handler: (request: any) => handleInventoryCategoriesBatchDelete(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: { "204": { description: "Successful response." }, "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  create: {
    method: "POST",
    path: "/finance/inventory/categories",
    handler: (request: any) => handleInventoryCategoriesCreate(request),
    request: { contentType: "application/json", body: InventoryCategoryCreateRequestDto },
    summary: "Create",
    description: "Create Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: InventoryCategoryResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET",
    path: "/finance/inventory/categories/[code]",
    handler: (request: any, context: any) => handleInventoryCategoriesGet(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: InventoryCategoryResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/finance/inventory/categories/[code]",
    handler: (request: any, context: any) => handleInventoryCategoriesUpdate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryCategoryUpdateRequestDto },
    summary: "Update",
    description: "Update Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: InventoryCategoryResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  patch: {
    method: "PATCH",
    path: "/finance/inventory/categories/[code]",
    handler: (request: any, context: any) => handleInventoryCategoriesPatch(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryCategoryPatchRequestDto },
    summary: "Patch",
    description: "Patch Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: InventoryCategoryResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  delete: {
    method: "DELETE",
    path: "/finance/inventory/categories/[code]",
    handler: (request: any, context: any) => handleInventoryCategoriesDelete(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: {
      "204": { description: "Successful response." },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  activate: {
    method: "POST",
    path: "/finance/inventory/categories/[code]/activate",
    handler: (request: any, context: any) => handleInventoryCategoriesActivate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: InventoryCategoryResponseDto }, "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  deactivate: {
    method: "POST",
    path: "/finance/inventory/categories/[code]/deactivate",
    handler: (request: any, context: any) => handleInventoryCategoriesDeactivate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: InventoryCategoryResponseDto }, "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  batchActivate: {
    method: "POST",
    path: "/finance/inventory/categories/batch-activate",
    handler: (request: any) => handleInventoryCategoriesBatchActivate(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    description: "Batch Activate Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(InventoryCategoryResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchDeactivate: {
    method: "POST",
    path: "/finance/inventory/categories/batch-deactivate",
    handler: (request: any) => handleInventoryCategoriesBatchDeactivate(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    description: "Batch Deactivate Organization Inventory Categories.",
    tags: ["Organization Inventory Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(InventoryCategoryResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
