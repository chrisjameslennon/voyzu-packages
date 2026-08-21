import Type from "typebox";
import { handleBatchGet as handleFinancialDocumentTypeBatchGet, handleFilter as handleFinancialDocumentTypeFilter, handleGet as handleFinancialDocumentTypeGet, handleList as handleFinancialDocumentTypeList, handleSearch as handleFinancialDocumentTypeSearch } from "@voyzu/core/common/financial-document-types/server";
import { OrganizationFinancialDocumentTypesListPage, OrganizationFinancialDocumentTypeDetailPage } from "@voyzu/core/organization-financial-document-types/server";
import { CodesRequestDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { FinancialDocumentTypeResponseDto } from "../../types/modules/financial-document-types/financial-document-type.response.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/financial-document-types",
    handler: (request: any) => handleFinancialDocumentTypeList(request),
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
    handler: (request: any) => handleFinancialDocumentTypeFilter(request),
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
    handler: (request: any) => handleFinancialDocumentTypeSearch(request),
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
    handler: (request: any) => handleFinancialDocumentTypeBatchGet(request),
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
    handler: (request: any, context: any) => handleFinancialDocumentTypeGet(request, context),
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
