import Type from "typebox";
import { BusinessRuleErrorResponseDto, CodesRequestDto, ConflictErrorResponseDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { DimensionValueResponseDto } from "./types/dimension-value.response.dto";
import { DimensionValuePatchRequestDto } from "./types/dimension-value.patch.request.dto";
import { DimensionValueCreateRequestDto } from "./types/dimension-value.create.request.dto";
import { DimensionResponseDto } from "./types/dimension.response.dto";
import { DimensionPatchRequestDto } from "./types/dimension.patch.request.dto";
import { DimensionUpdateRequestDto } from "./types/dimension.update.request.dto";
import { DimensionBatchPatchRequestDto } from "./types/dimension.batch-patch.request.dto";
import { DimensionBatchUpdateRequestDto } from "./types/dimension.batch-update.request.dto";
import { DimensionCreateRequestDto } from "./types/dimension.create.request.dto";



export const httpApiRoutes = {
  "finance.dimensions.list": {
    method: "GET",
    path: "/finance/[companyCode]/dimensions",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleList),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "List",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(DimensionResponseDto) } }
  },
  "finance.dimensions.filter": {
    method: "POST",
    path: "/finance/[companyCode]/dimensions/filter",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleFilter),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.dimensions.search": {
    method: "GET",
    path: "/finance/[companyCode]/dimensions/search",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleSearch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, query: { parameters: { q: { description: "Search text used to match company dimension records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.dimensions.create": {
    method: "POST",
    path: "/finance/[companyCode]/dimensions",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: DimensionCreateRequestDto },
    summary: "Create",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: DimensionResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.dimensions.batchCreate": {
    method: "POST",
    path: "/finance/[companyCode]/dimensions/batch/create",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleBatchCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(DimensionCreateRequestDto) },
    summary: "Batch Create",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.dimensions.batchGet": {
    method: "POST",
    path: "/finance/[companyCode]/dimensions/batch/get",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleBatchGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.dimensions.batchUpdate": {
    method: "PUT",
    path: "/finance/[companyCode]/dimensions/batch/update",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleBatchUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(DimensionBatchUpdateRequestDto) },
    summary: "Batch Update",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.dimensions.batchPatch": {
    method: "PATCH",
    path: "/finance/[companyCode]/dimensions/batch/patch",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleBatchPatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: Type.Array(DimensionBatchPatchRequestDto) },
    summary: "Batch Patch",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.dimensions.batchDelete": {
    method: "POST",
    path: "/finance/[companyCode]/dimensions/batch/delete",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleBatchDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Delete",
    
    
    responses: {
      "204": { description: "Successful response." },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.dimensions.batchActivate": {
    method: "POST",
    path: "/finance/[companyCode]/dimensions/batch-activate",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleBatchActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Activate",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.dimensions.batchDeactivate": {
    method: "POST",
    path: "/finance/[companyCode]/dimensions/batch-deactivate",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleBatchDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Deactivate",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(DimensionResponseDto)
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.dimensions.activate": {
    method: "POST",
    path: "/finance/[companyCode]/dimensions/[code]/activate",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleActivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Activate",
    
    
    responses: {
      "200": { description: "Successful response.", body: DimensionResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.dimensions.deactivate": {
    method: "POST",
    path: "/finance/[companyCode]/dimensions/[code]/deactivate",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleDeactivate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Deactivate",
    
    
    responses: {
      "200": { description: "Successful response.", body: DimensionResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.dimensions.get": {
    method: "GET",
    path: "/finance/[companyCode]/dimensions/[code]",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    
    
    responses: { "200": { description: "Successful response.", body: DimensionResponseDto }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  "finance.dimensions.update": {
    method: "PUT",
    path: "/finance/[companyCode]/dimensions/[code]",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleUpdate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: DimensionUpdateRequestDto },
    summary: "Update",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: DimensionResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.dimensions.patch": {
    method: "PATCH",
    path: "/finance/[companyCode]/dimensions/[code]",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handlePatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: DimensionPatchRequestDto },
    summary: "Patch",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: DimensionResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.dimensions.delete": {
    method: "DELETE",
    path: "/finance/[companyCode]/dimensions/[code]",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    
    
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
  "finance.dimensions.listValues": {
    method: "GET",
    path: "/finance/[companyCode]/dimensions/[code]/values",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleListValues),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "List Values",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(DimensionValueResponseDto) } }
  },
  "finance.dimensions.createValue": {
    method: "POST",
    path: "/finance/[companyCode]/dimensions/[code]/values",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleCreateValue),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: DimensionValueCreateRequestDto },
    summary: "Create Value",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: DimensionValueResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "A dimension value with this name already exists.", body: ConflictErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.dimensions.patchValue": {
    method: "PATCH",
    path: "/finance/[companyCode]/dimensions/values/[id]",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handlePatchValue),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, id: { description: "Unique identifier of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: DimensionValuePatchRequestDto },
    summary: "Patch Value",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: DimensionValueResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "A dimension value with this name already exists.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.dimensions.deleteValue": {
    method: "DELETE",
    path: "/finance/[companyCode]/dimensions/values/[id]",
    loadHandler: () => import("./server/http-api/dimension.http.handlers").then((module) => module.handleDeleteValue),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, id: { description: "Unique identifier of the requested record.", schema: { type: "string" } } } },
    summary: "Delete Value",
    
    
    responses: { "204": { description: "Successful response." }, "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto } }
  },
} as const;
