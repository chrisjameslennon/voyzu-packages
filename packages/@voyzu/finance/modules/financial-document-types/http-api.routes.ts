import Type from "typebox";
import { CodesRequestDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { FinancialDocumentTypeResponseDto } from "./types/financial-document-type.response.dto";



export const httpApiRoutes = {
  "finance.financial-document-types.list": {
    method: "GET",
    path: "/finance/[companyCode]/financial-document-types",
    loadHandler: () => import("./server/http-api/financial-document-type.http.handlers").then((module) => module.handleList),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "List",
    
    
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentTypeResponseDto) },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    }
  },
  "finance.financial-document-types.filter": {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-types/filter",
    loadHandler: () => import("./server/http-api/financial-document-type.http.handlers").then((module) => module.handleFilter),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    
    
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentTypeResponseDto) },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    }
  },
  "finance.financial-document-types.search": {
    method: "GET",
    path: "/finance/[companyCode]/financial-document-types/search",
    loadHandler: () => import("./server/http-api/financial-document-type.http.handlers").then((module) => module.handleSearch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, query: { parameters: { q: { description: "Search text used to match company financial document type records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    
    
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentTypeResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    }
  },
  "finance.financial-document-types.batchGet": {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-types/batch/get",
    loadHandler: () => import("./server/http-api/financial-document-type.http.handlers").then((module) => module.handleBatchGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    
    
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentTypeResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    }
  },
  "finance.financial-document-types.get": {
    method: "GET",
    path: "/finance/[companyCode]/financial-document-types/[code]",
    loadHandler: () => import("./server/http-api/financial-document-type.http.handlers").then((module) => module.handleGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    
    
    responses: {
      "200": { description: "Successful response.", body: FinancialDocumentTypeResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    }
  },
} as const;
