import Type from "typebox";
import { handleBatchGet as handleFinancialDocumentTypeBatchGet, handleFilter as handleFinancialDocumentTypeFilter, handleGet as handleFinancialDocumentTypeGet, handleList as handleFinancialDocumentTypeList, handleSearch as handleFinancialDocumentTypeSearch } from "@voyzu/finance/common/financial-document-types/server";
import { CompanyFinancialDocumentTypesListPage, CompanyFinancialDocumentTypeDetailPage } from "@voyzu/finance/company-financial-document-types/server";
import { CodesRequestDto, EntityNotFoundErrorResponseDto, FilterRequestDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { FinancialDocumentTypeResponseDto } from "../../types/modules/financial-document-types/financial-document-type.response.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/financial-document-types",
    handler: (request: any) => handleFinancialDocumentTypeList(request),
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
    handler: (request: any) => handleFinancialDocumentTypeFilter(request),
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
    handler: (request: any) => handleFinancialDocumentTypeSearch(request),
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
    handler: (request: any) => handleFinancialDocumentTypeBatchGet(request),
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
    handler: (request: any, context: any) => handleFinancialDocumentTypeGet(request, context),
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
