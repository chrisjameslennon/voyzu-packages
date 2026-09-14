import Type from "typebox";
import { BusinessRuleErrorResponseDto, ConflictErrorResponseDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { FinancialDocumentDefaultResponseDto } from "./types/financial-document-default.response.dto";
import { FinancialDocumentDefaultPatchRequestDto } from "./types/financial-document-default.patch.request.dto";
import { FinancialDocumentDefaultUpdateRequestDto } from "./types/financial-document-default.update.request.dto";
import { FinancialDocumentDefaultKeysRequestDto } from "./types/financial-document-default-keys.request.dto";
import { FinancialDocumentDefaultBatchPatchRequestDto } from "./types/financial-document-default.batch-patch.request.dto";
import { FinancialDocumentDefaultBatchUpdateRequestDto } from "./types/financial-document-default.batch-update.request.dto";
import { FinancialDocumentDefaultCreateRequestDto } from "./types/financial-document-default.create.request.dto";



export const httpApiRoutes = {
  "finance.financial-document-defaults.list": {
    method: "GET",
    path: "/finance/[companyCode]/financial-document-defaults",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handleList),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "List",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(FinancialDocumentDefaultResponseDto) } }
  },
  "finance.financial-document-defaults.filter": {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults/filter",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handleFilter),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(FinancialDocumentDefaultResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-defaults.search": {
    method: "GET",
    path: "/finance/[companyCode]/financial-document-defaults/search",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handleSearch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, query: { parameters: { q: { description: "Search text used to match company financial document default records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(FinancialDocumentDefaultResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-defaults.create": {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handleCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialDocumentDefaultCreateRequestDto },
    summary: "Create",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: FinancialDocumentDefaultResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-defaults.batchCreate": {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults/batch",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handleBatchCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(FinancialDocumentDefaultCreateRequestDto) },
    summary: "Batch Create",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(FinancialDocumentDefaultResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-defaults.batchGet": {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults/batch/get",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handleBatchGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialDocumentDefaultKeysRequestDto },
    summary: "Batch Get",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(FinancialDocumentDefaultResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-defaults.batchUpdate": {
    method: "PUT",
    path: "/finance/[companyCode]/financial-document-defaults/batch",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handleBatchUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(FinancialDocumentDefaultBatchUpdateRequestDto) },
    summary: "Batch Update",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(FinancialDocumentDefaultResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-defaults.batchPatch": {
    method: "PATCH",
    path: "/finance/[companyCode]/financial-document-defaults/batch",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handleBatchPatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(FinancialDocumentDefaultBatchPatchRequestDto) },
    summary: "Batch Patch",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(FinancialDocumentDefaultResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-defaults.batchDelete": {
    method: "DELETE",
    path: "/finance/[companyCode]/financial-document-defaults/batch",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handleBatchDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialDocumentDefaultKeysRequestDto },
    summary: "Batch Delete",
    
    
    responses: {
      "204": { description: "Successful response." },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-defaults.batchActivate": {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults/batch/activate",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handleBatchActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialDocumentDefaultKeysRequestDto },
    summary: "Batch Activate",
    
    
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentDefaultResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-defaults.batchDeactivate": {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults/batch/deactivate",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handleBatchDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialDocumentDefaultKeysRequestDto },
    summary: "Batch Deactivate",
    
    
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentDefaultResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-defaults.get": {
    method: "GET",
    path: "/finance/[companyCode]/financial-document-defaults/[code]",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handleGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    
    
    responses: { "200": { description: "Successful response.", body: FinancialDocumentDefaultResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  "finance.financial-document-defaults.update": {
    method: "PUT",
    path: "/finance/[companyCode]/financial-document-defaults/[code]",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handleUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialDocumentDefaultUpdateRequestDto },
    summary: "Update",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: FinancialDocumentDefaultResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-defaults.patch": {
    method: "PATCH",
    path: "/finance/[companyCode]/financial-document-defaults/[code]",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handlePatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialDocumentDefaultPatchRequestDto },
    summary: "Patch",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: FinancialDocumentDefaultResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-defaults.delete": {
    method: "DELETE",
    path: "/finance/[companyCode]/financial-document-defaults/[code]",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handleDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    
    
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  "finance.financial-document-defaults.activate": {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults/[code]/activate",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handleActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    
    
    responses: {
      "200": { description: "Successful response.", body: FinancialDocumentDefaultResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-document-defaults.deactivate": {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-defaults/[code]/deactivate",
    loadHandler: () => import("./server/http-api/financial-document-default.http.handlers").then((module) => module.handleDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    
    
    responses: {
      "200": { description: "Successful response.", body: FinancialDocumentDefaultResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
