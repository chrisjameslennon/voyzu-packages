import Type from "typebox";
import { BusinessRuleErrorResponseDto, CodesRequestDto, ConflictErrorResponseDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { GlAccountCategoryResponseDto } from "./types/gl-account-category.response.dto";
import { GlAccountCategoryPatchRequestDto } from "./types/gl-account-category.patch.request.dto";
import { GlAccountCategoryUpdateRequestDto } from "./types/gl-account-category.update.request.dto";
import { GlAccountCategoryBatchPatchRequestDto } from "./types/gl-account-category.batch-patch.request.dto";
import { GlAccountCategoryBatchUpdateRequestDto } from "./types/gl-account-category.batch-update.request.dto";
import { GlAccountCategoryCreateRequestDto } from "./types/gl-account-category.create.request.dto";



export const httpApiRoutes = {
  "finance.gl-account-categories.list": {
    description: "List Company GL Account Categories.",
    method: "GET",
    path: "/finance/[companyCode]/gl-account-categories",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handleList),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "List",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(GlAccountCategoryResponseDto) } }
  },
  "finance.gl-account-categories.filter": {
    description: "Filter Company GL Account Categories.",
    method: "POST",
    path: "/finance/[companyCode]/gl-account-categories/filter",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handleFilter),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountCategoryResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-account-categories.search": {
    description: "Search Company GL Account Categories.",
    method: "GET",
    path: "/finance/[companyCode]/gl-account-categories/search",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handleSearch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, query: { parameters: { q: { description: "Search text used to match company GL account category records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountCategoryResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-account-categories.create": {
    description: "Create Company GL Account Categories.",
    method: "POST",
    path: "/finance/[companyCode]/gl-account-categories",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handleCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: GlAccountCategoryCreateRequestDto },
    summary: "Create",
    
    
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
  "finance.gl-account-categories.batchCreate": {
    description: "Batch Create Company GL Account Categories.",
    method: "POST",
    path: "/finance/[companyCode]/gl-account-categories/batch",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handleBatchCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(GlAccountCategoryCreateRequestDto) },
    summary: "Batch Create",
    
    
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
  "finance.gl-account-categories.batchGet": {
    description: "Batch Get Company GL Account Categories.",
    method: "POST",
    path: "/finance/[companyCode]/gl-account-categories/batch/get",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handleBatchGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountCategoryResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-account-categories.batchUpdate": {
    description: "Batch Update Company GL Account Categories.",
    method: "PUT",
    path: "/finance/[companyCode]/gl-account-categories/batch",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handleBatchUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(GlAccountCategoryBatchUpdateRequestDto) },
    summary: "Batch Update",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountCategoryResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-account-categories.batchPatch": {
    description: "Batch Patch Company GL Account Categories.",
    method: "PATCH",
    path: "/finance/[companyCode]/gl-account-categories/batch",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handleBatchPatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(GlAccountCategoryBatchPatchRequestDto) },
    summary: "Batch Patch",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountCategoryResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-account-categories.batchDelete": {
    description: "Batch Delete Company GL Account Categories.",
    method: "DELETE",
    path: "/finance/[companyCode]/gl-account-categories/batch",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handleBatchDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    
    
    responses: {
      "204": { description: "Successful response." },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-account-categories.batchActivate": {
    description: "Batch Activate Company GL Account Categories.",
    method: "POST",
    path: "/finance/[companyCode]/gl-account-categories/batch-activate",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handleBatchActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    
    
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
  "finance.gl-account-categories.batchDeactivate": {
    description: "Batch Deactivate Company GL Account Categories.",
    method: "POST",
    path: "/finance/[companyCode]/gl-account-categories/batch-deactivate",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handleBatchDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    
    
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
  "finance.gl-account-categories.activate": {
    description: "Activate Company GL Account Categories.",
    method: "POST",
    path: "/finance/[companyCode]/gl-account-categories/[code]/activate",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handleActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    
    
    responses: {
      "200": { description: "Successful response.", body: GlAccountCategoryResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-account-categories.deactivate": {
    description: "Deactivate Company GL Account Categories.",
    method: "POST",
    path: "/finance/[companyCode]/gl-account-categories/[code]/deactivate",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handleDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    
    
    responses: {
      "200": { description: "Successful response.", body: GlAccountCategoryResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-account-categories.get": {
    description: "Get Company GL Account Categories.",
    method: "GET",
    path: "/finance/[companyCode]/gl-account-categories/[code]",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handleGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    
    
    responses: { "200": { description: "Successful response.", body: GlAccountCategoryResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  "finance.gl-account-categories.update": {
    description: "Update Company GL Account Categories.",
    method: "PUT",
    path: "/finance/[companyCode]/gl-account-categories/[code]",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handleUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: GlAccountCategoryUpdateRequestDto },
    summary: "Update",
    
    
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
  "finance.gl-account-categories.patch": {
    description: "Patch Company GL Account Categories.",
    method: "PATCH",
    path: "/finance/[companyCode]/gl-account-categories/[code]",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handlePatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: GlAccountCategoryPatchRequestDto },
    summary: "Patch",
    
    
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
  "finance.gl-account-categories.delete": {
    description: "Delete Company GL Account Categories.",
    method: "DELETE",
    path: "/finance/[companyCode]/gl-account-categories/[code]",
    loadHandler: () => import("./server/http-api/gl-account-category.http.handlers").then((module) => module.handleDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    
    
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
} as const;
