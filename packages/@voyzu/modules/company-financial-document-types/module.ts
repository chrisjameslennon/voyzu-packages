import { handleBatchGet as handleFinancialDocumentTypeBatchGet, handleFilter as handleFinancialDocumentTypeFilter, handleGet as handleFinancialDocumentTypeGet, handleList as handleFinancialDocumentTypeList, handleSearch as handleFinancialDocumentTypeSearch } from "@voyzu/modules/common/financial-document-types/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const companyFinancialDocumentTypesModule = {
  id: "voyzu.company-financial-document-types",
  name: "Financial Document Types",
  pageRoutes: {
    list: {
      id: "voyzu.company-financial-document-types.page.list",
      pageTitle: "Financial Document Types",
      helpUrl: "modules-help/company-ledger/financial-document-types",
    },
    detail: {
      id: "voyzu.company-financial-document-types.page.detail",
      pageTitle: "Financial Document Type",
      helpUrl: "modules-help/company-ledger/financial-document-types",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/financial-document-types",
      handler: (request: any) => handleFinancialDocumentTypeList(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Company Financial Document Types.",
        tags: ["Company Financial Document Types"],
        responses: {
          "200": { description: "Successful response.", schema: arrayOf(dtoRef("FinancialDocumentTypeResponseDto")) },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    filter: {
      method: "POST",
      path: "/finance/[companyCode]/financial-document-types/filter",
      handler: (request: any) => handleFinancialDocumentTypeFilter(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Filter",
        description: "Filter Company Financial Document Types.",
        tags: ["Company Financial Document Types"],
        requestBody: { required: true, schema: dtoRef("FilterRequestDto") },
        responses: {
          "200": { description: "Successful response.", schema: arrayOf(dtoRef("FinancialDocumentTypeResponseDto")) },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    search: {
      method: "GET",
      path: "/finance/[companyCode]/financial-document-types/search",
      handler: (request: any) => handleFinancialDocumentTypeSearch(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Search",
        description: "Search Company Financial Document Types.",
        tags: ["Company Financial Document Types"],
        requestQuerystringParams: {
          q: {
            description: "Search text used to match company financial document type records.",
            schema: { type: "string" },
          },
        },
        responses: {
          "200": { description: "Successful response.", schema: arrayOf(dtoRef("FinancialDocumentTypeResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    batchGet: {
      method: "POST",
      path: "/finance/[companyCode]/financial-document-types/batch/get",
      handler: (request: any) => handleFinancialDocumentTypeBatchGet(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Batch Get",
        description: "Batch Get Company Financial Document Types.",
        tags: ["Company Financial Document Types"],
        requestBody: { required: true, schema: dtoRef("CodesRequestDto") },
        responses: {
          "200": { description: "Successful response.", schema: arrayOf(dtoRef("FinancialDocumentTypeResponseDto")) },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    get: {
      method: "GET",
      path: "/finance/[companyCode]/financial-document-types/[code]",
      handler: (request: any, context: any) => handleFinancialDocumentTypeGet(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Company Financial Document Types.",
        tags: ["Company Financial Document Types"],
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("FinancialDocumentTypeResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
  }
} as const;
