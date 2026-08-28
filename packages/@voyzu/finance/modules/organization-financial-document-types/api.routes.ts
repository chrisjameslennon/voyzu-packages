import Type from "typebox";
import { CodesRequestDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { FinancialDocumentTypeResponseDto } from "../../types/modules/financial-document-types/financial-document-type.response.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/financial-document-types",
    loadHandler: () => import("../common/financial-document-types/server/api/financial-document-type.http.handlers").then((module) => module.handleList),
    summary: "List",
    description: "List Organization Financial Document Types.",
    tags: ["Organization Financial Document Types"],
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentTypeResponseDto) },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    }
  },
  filter: {
    method: "POST",
    path: "/finance/financial-document-types/filter",
    loadHandler: () => import("../common/financial-document-types/server/api/financial-document-type.http.handlers").then((module) => module.handleFilter),
    request: { contentType: "application/json", body: FilterRequestDto },
    summary: "Filter",
    description: "Filter Organization Financial Document Types.",
    tags: ["Organization Financial Document Types"],
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentTypeResponseDto) },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    }
  },
  search: {
    method: "GET",
    path: "/finance/financial-document-types/search",
    loadHandler: () => import("../common/financial-document-types/server/api/financial-document-type.http.handlers").then((module) => module.handleSearch),
    request: { query: { parameters: { q: { description: "Search text used to match organization financial document type records.", required: true } }, schema: Type.Object({ q: { type: "string" } }) } },
    summary: "Search",
    description: "Search Organization Financial Document Types.",
    tags: ["Organization Financial Document Types"],
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentTypeResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    }
  },
  batchGet: {
    method: "POST",
    path: "/finance/financial-document-types/batch/get",
    loadHandler: () => import("../common/financial-document-types/server/api/financial-document-type.http.handlers").then((module) => module.handleBatchGet),
    request: { contentType: "application/json", body: CodesRequestDto },
    summary: "Batch Get",
    description: "Batch Get Organization Financial Document Types.",
    tags: ["Organization Financial Document Types"],
    responses: {
      "200": { description: "Successful response.", body: Type.Array(FinancialDocumentTypeResponseDto) },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    }
  },
  get: {
    method: "GET",
    path: "/finance/financial-document-types/[code]",
    loadHandler: () => import("../common/financial-document-types/server/api/financial-document-type.http.handlers").then((module) => module.handleGet),
    request: { path: { code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Organization Financial Document Types.",
    tags: ["Organization Financial Document Types"],
    responses: {
      "200": { description: "Successful response.", body: FinancialDocumentTypeResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto },
    }
  },
} as const;
