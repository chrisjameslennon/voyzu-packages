import Type from "typebox";
import { handleActivate as handleActivateInventoryCategory, handleBatchActivate as handleBatchActivateInventoryCategories, handleBatchCreate as handleBatchCreateInventoryCategories, handleBatchDeactivate as handleBatchDeactivateInventoryCategories, handleBatchDelete as handleBatchDeleteInventoryCategories, handleBatchGet as handleBatchGetInventoryCategories, handleBatchPatch as handleBatchPatchInventoryCategories, handleBatchUpdate as handleBatchUpdateInventoryCategories, handleCreate as handleCreateInventoryCategory, handleDeactivate as handleDeactivateInventoryCategory, handleDelete as handleDeleteInventoryCategory, handleFilter as handleFilterInventoryCategories, handleGet as handleGetInventoryCategory, handleList as handleListInventoryCategories, handlePatch as handlePatchInventoryCategory, handleSearch as handleSearchInventoryCategories, handleUpdate as handleUpdateInventoryCategory } from "@voyzu/finance/common/inventory-categories/server";
import { CompanyInventoryCategoriesListPage, CompanyInventoryCategoryDetailPage } from "@voyzu/finance/company-inventory-categories/server";
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
    path: "/finance/[companyCode]/inventory/categories",
    handler: (request: any) => handleListInventoryCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
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
    path: "/finance/[companyCode]/inventory/categories/filter",
    handler: (request: any) => handleFilterInventoryCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryCategoryResponseDto) }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  search: {
    method: "GET",
    path: "/finance/[companyCode]/inventory/categories/search",
    handler: (request: any) => handleSearchInventoryCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, query: { parameters: { q: { description: "Search text used to match company inventory category records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryCategoryResponseDto) }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  batchGet: {
    method: "POST",
    path: "/finance/[companyCode]/inventory/categories/batch/get",
    handler: (request: any) => handleBatchGetInventoryCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryCategoryResponseDto) }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  batchCreate: {
    method: "POST",
    path: "/finance/[companyCode]/inventory/categories/batch/create",
    handler: (request: any) => handleBatchCreateInventoryCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(InventoryCategoryCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryCategoryResponseDto) }, "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  batchUpdate: {
    method: "PUT",
    path: "/finance/[companyCode]/inventory/categories/batch",
    handler: (request: any) => handleBatchUpdateInventoryCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(InventoryCategoryBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryCategoryResponseDto) }, "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  batchPatch: {
    method: "PATCH",
    path: "/finance/[companyCode]/inventory/categories/batch",
    handler: (request: any) => handleBatchPatchInventoryCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(InventoryCategoryBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: Type.Array(InventoryCategoryResponseDto) }, "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  batchDelete: {
    method: "DELETE",
    path: "/finance/[companyCode]/inventory/categories/batch",
    handler: (request: any) => handleBatchDeleteInventoryCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
    responses: { "204": { description: "Successful response." }, "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto }, "400": { description: "Validation failed.", body: InputValidationErrorResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  create: {
    method: "POST",
    path: "/finance/[companyCode]/inventory/categories",
    handler: (request: any) => handleCreateInventoryCategory(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryCategoryCreateRequestDto },
    summary: "Create",
    description: "Create Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
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
    path: "/finance/[companyCode]/inventory/categories/[code]",
    handler: (request: any, context: any) => handleGetInventoryCategory(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: InventoryCategoryResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/finance/[companyCode]/inventory/categories/[code]",
    handler: (request: any, context: any) => handleUpdateInventoryCategory(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryCategoryUpdateRequestDto },
    summary: "Update",
    description: "Update Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
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
    path: "/finance/[companyCode]/inventory/categories/[code]",
    handler: (request: any, context: any) => handlePatchInventoryCategory(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: InventoryCategoryPatchRequestDto },
    summary: "Patch",
    description: "Patch Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
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
    path: "/finance/[companyCode]/inventory/categories/[code]",
    handler: (request: any, context: any) => handleDeleteInventoryCategory(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
    responses: {
      "204": { description: "Successful response." },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  activate: {
    method: "POST",
    path: "/finance/[companyCode]/inventory/categories/[code]/activate",
    handler: (request: any, context: any) => handleActivateInventoryCategory(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: InventoryCategoryResponseDto }, "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  deactivate: {
    method: "POST",
    path: "/finance/[companyCode]/inventory/categories/[code]/deactivate",
    handler: (request: any, context: any) => handleDeactivateInventoryCategory(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
    responses: { "200": { description: "Successful response.", body: InventoryCategoryResponseDto }, "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  batchActivate: {
    method: "POST",
    path: "/finance/[companyCode]/inventory/categories/batch-activate",
    handler: (request: any) => handleBatchActivateInventoryCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    description: "Batch Activate Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
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
    path: "/finance/[companyCode]/inventory/categories/batch-deactivate",
    handler: (request: any) => handleBatchDeactivateInventoryCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    description: "Batch Deactivate Company Inventory Categories.",
    tags: ["Company Inventory Categories"],
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
