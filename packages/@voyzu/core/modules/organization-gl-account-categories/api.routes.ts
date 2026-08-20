import Type from "typebox";
import { handleActivate as handleGlAccountCategoriesActivate, handleBatchActivate as handleGlAccountCategoriesBatchActivate, handleBatchCreate as handleGlAccountCategoriesBatchCreate, handleBatchDeactivate as handleGlAccountCategoriesBatchDeactivate, handleBatchDelete as handleGlAccountCategoriesBatchDelete, handleBatchGet as handleGlAccountCategoriesBatchGet, handleBatchPatch as handleGlAccountCategoriesBatchPatch, handleBatchUpdate as handleGlAccountCategoriesBatchUpdate, handleCreate as handleGlAccountCategoriesCreate, handleDeactivate as handleGlAccountCategoriesDeactivate, handleDelete as handleGlAccountCategoriesDelete, handleFilter as handleGlAccountCategoriesFilter, handleGet as handleGlAccountCategoriesGet, handleList as handleGlAccountCategoriesList, handlePatch as handleGlAccountCategoriesPatch, handleSearch as handleGlAccountCategoriesSearch, handleUpdate as handleGlAccountCategoriesUpdate } from "@voyzu/core/common/gl-account-categories/server";
import { OrganizationGlAccountCategoriesListPage, OrganizationGlAccountCategoryDetailPage } from "@voyzu/core/organization-gl-account-categories/server";
import { BusinessRuleErrorResponseDto, CodesRequestDto, ConflictErrorResponseDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { GlAccountCategoryResponseDto } from "../../types/modules/gl-account-categories/gl-account-category.response.dto";
import { GlAccountCategoryPatchRequestDto } from "../../types/modules/gl-account-categories/gl-account-category.patch.request.dto";
import { GlAccountCategoryUpdateRequestDto } from "../../types/modules/gl-account-categories/gl-account-category.update.request.dto";
import { GlAccountCategoryBatchPatchRequestDto } from "../../types/modules/gl-account-categories/gl-account-category.batch-patch.request.dto";
import { GlAccountCategoryBatchUpdateRequestDto } from "../../types/modules/gl-account-categories/gl-account-category.batch-update.request.dto";
import { GlAccountCategoryCreateRequestDto } from "../../types/modules/gl-account-categories/gl-account-category.create.request.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/organization/gl-account-categories",
    handler: (request: any) => handleGlAccountCategoriesList(request),
    summary: "List",
    description: "List Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: { "200": { description: "Successful response.", body: Type.Array(GlAccountCategoryResponseDto) } }
  },
  create: {
    method: "POST",
    path: "/organization/gl-account-categories",
    handler: (request: any) => handleGlAccountCategoriesCreate(request),
    request: { contentType: "application/json", body: GlAccountCategoryCreateRequestDto },
    summary: "Create",
    description: "Create Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: GlAccountCategoryResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  filter: {
    method: "POST",
    path: "/organization/gl-account-categories/filter",
    handler: (request: any) => handleGlAccountCategoriesFilter(request),
    request: { contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountCategoryResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  search: {
    method: "GET",
    path: "/organization/gl-account-categories/search",
    handler: (request: any) => handleGlAccountCategoriesSearch(request),
    request: { query: { parameters: { q: { description: "Search text used to match organization GL account category records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountCategoryResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchCreate: {
    method: "POST",
    path: "/organization/gl-account-categories/batch/create",
    handler: (request: any) => handleGlAccountCategoriesBatchCreate(request),
    request: { contentType: "application/json", body: Type.Array(GlAccountCategoryCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountCategoryResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchGet: {
    method: "POST",
    path: "/organization/gl-account-categories/batch/get",
    handler: (request: any) => handleGlAccountCategoriesBatchGet(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountCategoryResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchUpdate: {
    method: "PUT",
    path: "/organization/gl-account-categories/batch/update",
    handler: (request: any) => handleGlAccountCategoriesBatchUpdate(request),
    request: { contentType: "application/json", body: Type.Array(GlAccountCategoryBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountCategoryResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchPatch: {
    method: "PATCH",
    path: "/organization/gl-account-categories/batch/patch",
    handler: (request: any) => handleGlAccountCategoriesBatchPatch(request),
    request: { contentType: "application/json", body: Type.Array(GlAccountCategoryBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountCategoryResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchDelete: {
    method: "POST",
    path: "/organization/gl-account-categories/batch/delete",
    handler: (request: any) => handleGlAccountCategoriesBatchDelete(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: {
      "204": { description: "Successful response." },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchActivate: {
    method: "POST",
    path: "/organization/gl-account-categories/batch-activate",
    handler: (request: any) => handleGlAccountCategoriesBatchActivate(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    description: "Batch Activate Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountCategoryResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchDeactivate: {
    method: "POST",
    path: "/organization/gl-account-categories/batch-deactivate",
    handler: (request: any) => handleGlAccountCategoriesBatchDeactivate(request),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    description: "Batch Deactivate Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountCategoryResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  activate: {
    method: "POST",
    path: "/organization/gl-account-categories/[code]/activate",
    handler: (request: any, context: any) => handleGlAccountCategoriesActivate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: {
      "200": { description: "Successful response.", body: GlAccountCategoryResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  deactivate: {
    method: "POST",
    path: "/organization/gl-account-categories/[code]/deactivate",
    handler: (request: any, context: any) => handleGlAccountCategoriesDeactivate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: {
      "200": { description: "Successful response.", body: GlAccountCategoryResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET",
    path: "/organization/gl-account-categories/[code]",
    handler: (request: any, context: any) => handleGlAccountCategoriesGet(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: { "200": { description: "Successful response.", body: GlAccountCategoryResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/organization/gl-account-categories/[code]",
    handler: (request: any, context: any) => handleGlAccountCategoriesUpdate(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: GlAccountCategoryUpdateRequestDto },
    summary: "Update",
    description: "Update Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: GlAccountCategoryResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  patch: {
    method: "PATCH",
    path: "/organization/gl-account-categories/[code]",
    handler: (request: any, context: any) => handleGlAccountCategoriesPatch(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: GlAccountCategoryPatchRequestDto },
    summary: "Patch",
    description: "Patch Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: GlAccountCategoryResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  delete: {
    method: "DELETE",
    path: "/organization/gl-account-categories/[code]",
    handler: (request: any, context: any) => handleGlAccountCategoriesDelete(request, context),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
} as const;
