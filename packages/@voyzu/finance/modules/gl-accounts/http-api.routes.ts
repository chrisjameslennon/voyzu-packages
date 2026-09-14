import Type from "typebox";
import { BusinessRuleErrorResponseDto, CodesRequestDto, ConflictErrorResponseDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { GlAccountResponseDto } from "./types/gl-account.response.dto";
import { GlAccountPatchRequestDto } from "./types/gl-account.patch.request.dto";
import { GlAccountUpdateRequestDto } from "./types/gl-account.update.request.dto";
import { GlAccountBatchPatchRequestDto } from "./types/gl-account.batch-patch.request.dto";
import { GlAccountBatchUpdateRequestDto } from "./types/gl-account.batch-update.request.dto";
import { GlAccountCreateRequestDto } from "./types/gl-account.create.request.dto";



export const httpApiRoutes = {
  "finance.gl-accounts.list": {
    method: "GET",
    path: "/finance/[companyCode]/gl-accounts",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handleList),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "List",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(GlAccountResponseDto) } }
  },
  "finance.gl-accounts.filter": {
    method: "POST",
    path: "/finance/[companyCode]/gl-accounts/filter",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handleFilter),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-accounts.search": {
    method: "GET",
    path: "/finance/[companyCode]/gl-accounts/search",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handleSearch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, query: { parameters: { q: { description: "Search text used to match company GL account records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-accounts.create": {
    method: "POST",
    path: "/finance/[companyCode]/gl-accounts",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handleCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: GlAccountCreateRequestDto },
    summary: "Create",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: GlAccountResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-accounts.batchCreate": {
    method: "POST",
    path: "/finance/[companyCode]/gl-accounts/batch",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handleBatchCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(GlAccountCreateRequestDto) },
    summary: "Batch Create",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-accounts.batchGet": {
    method: "POST",
    path: "/finance/[companyCode]/gl-accounts/batch/get",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handleBatchGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-accounts.batchUpdate": {
    method: "PUT",
    path: "/finance/[companyCode]/gl-accounts/batch",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handleBatchUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(GlAccountBatchUpdateRequestDto) },
    summary: "Batch Update",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-accounts.batchPatch": {
    method: "PATCH",
    path: "/finance/[companyCode]/gl-accounts/batch",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handleBatchPatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(GlAccountBatchPatchRequestDto) },
    summary: "Batch Patch",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-accounts.batchDelete": {
    method: "DELETE",
    path: "/finance/[companyCode]/gl-accounts/batch",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handleBatchDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    
    
    responses: {
      "204": { description: "Successful response." },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-accounts.batchActivate": {
    method: "POST",
    path: "/finance/[companyCode]/gl-accounts/batch-activate",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handleBatchActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-accounts.batchDeactivate": {
    method: "POST",
    path: "/finance/[companyCode]/gl-accounts/batch-deactivate",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handleBatchDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(GlAccountResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-accounts.activate": {
    method: "POST",
    path: "/finance/[companyCode]/gl-accounts/[code]/activate",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handleActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    
    
    responses: {
      "200": { description: "Successful response.", body: GlAccountResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-accounts.deactivate": {
    method: "POST",
    path: "/finance/[companyCode]/gl-accounts/[code]/deactivate",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handleDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    
    
    responses: {
      "200": { description: "Successful response.", body: GlAccountResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-accounts.get": {
    method: "GET",
    path: "/finance/[companyCode]/gl-accounts/[code]",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handleGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    
    
    responses: { "200": { description: "Successful response.", body: GlAccountResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  "finance.gl-accounts.update": {
    method: "PUT",
    path: "/finance/[companyCode]/gl-accounts/[code]",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handleUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: GlAccountUpdateRequestDto },
    summary: "Update",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: GlAccountResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-accounts.patch": {
    method: "PATCH",
    path: "/finance/[companyCode]/gl-accounts/[code]",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handlePatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: GlAccountPatchRequestDto },
    summary: "Patch",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: GlAccountResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.gl-accounts.delete": {
    method: "DELETE",
    path: "/finance/[companyCode]/gl-accounts/[code]",
    loadHandler: () => import("./server/http-api/gl-account.http.handlers").then((module) => module.handleDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    
    
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
} as const;
