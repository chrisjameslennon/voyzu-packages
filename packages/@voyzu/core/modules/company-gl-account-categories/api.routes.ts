import Type from "typebox";
import { handleActivate as handleActivateGlAccountCategory, handleBatchActivate as handleBatchActivateGlAccountCategories, handleBatchCreate as handleBatchCreateGlAccountCategories, handleBatchDeactivate as handleBatchDeactivateGlAccountCategories, handleBatchDelete as handleBatchDeleteGlAccountCategories, handleBatchGet as handleBatchGetGlAccountCategories, handleBatchPatch as handleBatchPatchGlAccountCategories, handleBatchUpdate as handleBatchUpdateGlAccountCategories, handleCreate as handleCreateGlAccountCategory, handleDeactivate as handleDeactivateGlAccountCategory, handleDelete as handleDeleteGlAccountCategory, handleFilter as handleFilterGlAccountCategories, handleGet as handleGetGlAccountCategory, handleList as handleListGlAccountCategories, handlePatch as handlePatchGlAccountCategory, handleSearch as handleSearchGlAccountCategories, handleUpdate as handleUpdateGlAccountCategory } from "@voyzu/core/common/gl-account-categories/server";
import { CompanyGlAccountCategoriesListPage, CompanyGlAccountCategoryDetailPage } from "@voyzu/core/company-gl-account-categories/server";
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
    path: "/finance/[companyCode]/gl-account-categories",
    handler: (request: any) => handleListGlAccountCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
    responses: { "200": { description: "Successful response.", body: Type.Array(GlAccountCategoryResponseDto) } }
  },
  filter: {
    method: "POST",
    path: "/finance/[companyCode]/gl-account-categories/filter",
    handler: (request: any) => handleFilterGlAccountCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
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
    path: "/finance/[companyCode]/gl-account-categories/search",
    handler: (request: any) => handleSearchGlAccountCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, query: { parameters: { q: { description: "Search text used to match company GL account category records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountCategoryResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  create: {
    method: "POST",
    path: "/finance/[companyCode]/gl-account-categories",
    handler: (request: any) => handleCreateGlAccountCategory(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: GlAccountCategoryCreateRequestDto },
    summary: "Create",
    description: "Create Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
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
  batchCreate: {
    method: "POST",
    path: "/finance/[companyCode]/gl-account-categories/batch",
    handler: (request: any) => handleBatchCreateGlAccountCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(GlAccountCategoryCreateRequestDto) },
    summary: "Batch Create",
    description: "Batch Create Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
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
    path: "/finance/[companyCode]/gl-account-categories/batch/get",
    handler: (request: any) => handleBatchGetGlAccountCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
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
    path: "/finance/[companyCode]/gl-account-categories/batch",
    handler: (request: any) => handleBatchUpdateGlAccountCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(GlAccountCategoryBatchUpdateRequestDto) },
    summary: "Batch Update",
    description: "Batch Update Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
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
    path: "/finance/[companyCode]/gl-account-categories/batch",
    handler: (request: any) => handleBatchPatchGlAccountCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(GlAccountCategoryBatchPatchRequestDto) },
    summary: "Batch Patch",
    description: "Batch Patch Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountCategoryResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  batchDelete: {
    method: "DELETE",
    path: "/finance/[companyCode]/gl-account-categories/batch",
    handler: (request: any) => handleBatchDeleteGlAccountCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    description: "Batch Delete Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
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
    path: "/finance/[companyCode]/gl-account-categories/batch-activate",
    handler: (request: any) => handleBatchActivateGlAccountCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    description: "Batch Activate Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
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
    path: "/finance/[companyCode]/gl-account-categories/batch-deactivate",
    handler: (request: any) => handleBatchDeactivateGlAccountCategories(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    description: "Batch Deactivate Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
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
    path: "/finance/[companyCode]/gl-account-categories/[code]/activate",
    handler: (request: any, context: any) => handleActivateGlAccountCategory(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    description: "Activate Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
    responses: {
      "200": { description: "Successful response.", body: GlAccountCategoryResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  deactivate: {
    method: "POST",
    path: "/finance/[companyCode]/gl-account-categories/[code]/deactivate",
    handler: (request: any, context: any) => handleDeactivateGlAccountCategory(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    description: "Deactivate Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
    responses: {
      "200": { description: "Successful response.", body: GlAccountCategoryResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  get: {
    method: "GET",
    path: "/finance/[companyCode]/gl-account-categories/[code]",
    handler: (request: any, context: any) => handleGetGlAccountCategory(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
    responses: { "200": { description: "Successful response.", body: GlAccountCategoryResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/finance/[companyCode]/gl-account-categories/[code]",
    handler: (request: any, context: any) => handleUpdateGlAccountCategory(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: GlAccountCategoryUpdateRequestDto },
    summary: "Update",
    description: "Update Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
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
    path: "/finance/[companyCode]/gl-account-categories/[code]",
    handler: (request: any, context: any) => handlePatchGlAccountCategory(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: GlAccountCategoryPatchRequestDto },
    summary: "Patch",
    description: "Patch Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
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
    path: "/finance/[companyCode]/gl-account-categories/[code]",
    handler: (request: any, context: any) => handleDeleteGlAccountCategory(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Company GL Account Categories.",
    tags: ["Company GL Account Categories"],
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
} as const;
