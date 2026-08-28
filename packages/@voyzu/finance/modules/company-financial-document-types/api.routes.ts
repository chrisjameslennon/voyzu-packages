import Type from "typebox";
import { CodesRequestDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { FinancialDocumentTypeResponseDto } from "../../types/modules/financial-document-types/financial-document-type.response.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/financial-document-types",
    loadHandler: () => import("../common/financial-document-types/server/api/financial-document-type.http.handlers").then((module) => module.handleList),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List Company Financial Document Types.",
    tags: ["Company Financial Document Types"],
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentTypeResponseDto) },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    }
  },
  filter: {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-types/filter",
    loadHandler: () => import("../common/financial-document-types/server/api/financial-document-type.http.handlers").then((module) => module.handleFilter),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Company Financial Document Types.",
    tags: ["Company Financial Document Types"],
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentTypeResponseDto) },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    }
  },
  search: {
    method: "GET",
    path: "/finance/[companyCode]/financial-document-types/search",
    loadHandler: () => import("../common/financial-document-types/server/api/financial-document-type.http.handlers").then((module) => module.handleSearch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, query: { parameters: { q: { description: "Search text used to match company financial document type records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Company Financial Document Types.",
    tags: ["Company Financial Document Types"],
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentTypeResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    }
  },
  batchGet: {
    method: "POST",
    path: "/finance/[companyCode]/financial-document-types/batch/get",
    loadHandler: () => import("../common/financial-document-types/server/api/financial-document-type.http.handlers").then((module) => module.handleBatchGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Company Financial Document Types.",
    tags: ["Company Financial Document Types"],
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentTypeResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    }
  },
  get: {
    method: "GET",
    path: "/finance/[companyCode]/financial-document-types/[code]",
    loadHandler: () => import("../common/financial-document-types/server/api/financial-document-type.http.handlers").then((module) => module.handleGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Company Financial Document Types.",
    tags: ["Company Financial Document Types"],
    responses: {
      "200": { description: "Successful response.", body: FinancialDocumentTypeResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    }
  },
} as const;
