import Type from "typebox";
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
    path: "/finance/gl-account-categories",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handleList),
    summary: "List",
    description: "List Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: { "200": { description: "Successful response.", body: Type.Array(GlAccountCategoryResponseDto) } }
  },
  create: {
    method: "POST",
    path: "/finance/gl-account-categories",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handleCreate),
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
    path: "/finance/gl-account-categories/filter",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handleFilter),
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
    path: "/finance/gl-account-categories/search",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handleSearch),
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
    path: "/finance/gl-account-categories/batch/create",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handleBatchCreate),
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
    path: "/finance/gl-account-categories/batch/get",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handleBatchGet),
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
    path: "/finance/gl-account-categories/batch/update",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handleBatchUpdate),
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
    path: "/finance/gl-account-categories/batch/patch",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handleBatchPatch),
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
    path: "/finance/gl-account-categories/batch/delete",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handleBatchDelete),
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
    path: "/finance/gl-account-categories/batch-activate",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handleBatchActivate),
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
    path: "/finance/gl-account-categories/batch-deactivate",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handleBatchDeactivate),
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
    path: "/finance/gl-account-categories/[code]/activate",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handleActivate),
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
    path: "/finance/gl-account-categories/[code]/deactivate",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handleDeactivate),
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
    path: "/finance/gl-account-categories/[code]",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handleGet),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: { "200": { description: "Successful response.", body: GlAccountCategoryResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  update: {
    method: "PUT",
    path: "/finance/gl-account-categories/[code]",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handleUpdate),
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
    path: "/finance/gl-account-categories/[code]",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handlePatch),
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
    path: "/finance/gl-account-categories/[code]",
    loadHandler: () => import("../common/gl-account-categories/server/api/gl-account-category.http.handlers").then((module) => module.handleDelete),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Organization GL Account Categories.",
    tags: ["Organization GL Account Categories"],
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
} as const;
