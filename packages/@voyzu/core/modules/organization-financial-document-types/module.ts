import { handleBatchGet as handleFinancialDocumentTypeBatchGet, handleFilter as handleFinancialDocumentTypeFilter, handleGet as handleFinancialDocumentTypeGet, handleList as handleFinancialDocumentTypeList, handleSearch as handleFinancialDocumentTypeSearch } from "@voyzu/core/common/financial-document-types/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { OrganizationFinancialDocumentTypesListPage, OrganizationFinancialDocumentTypeDetailPage } from "@voyzu/core/organization-financial-document-types/server";

export const organizationFinancialDocumentTypesModule = {
  pageRoutes: {
    list: {
          id: "voyzu.organization-financial-document-types.page.list",
          pageTitle: "Financial Document Types",
          helpPath: "modules-help/organization-financial-settings/financial-document-types",
          path: "/organization/financial-document-types",
          Page: OrganizationFinancialDocumentTypesListPage,
          breadcrumbBase: [
                {
                  label: "Organization",
                },
                {
                  label: "Standard Settings",
                },
                {
                  label: "Integration",
                },
              ],
          auth: { required: true, minRole: "ORGANIZATION_USER" }
        },
    detail: {
          id: "voyzu.organization-financial-document-types.page.detail",
          pageTitle: "Financial Document Type",
          helpPathResolver: ({ params }: { params: Readonly<Record<string, string>> }) =>
            `help-core/financial-documents/${params.code.toLowerCase()}`,
          path: "/organization/financial-document-types/[code]",
          Page: OrganizationFinancialDocumentTypeDetailPage,
          breadcrumbBase: [
                {
                  label: "Organization",
                },
                {
                  label: "Standard Settings",
                },
                {
                  label: "Integration",
                },
                {
                  label: "Financial Document Types",
                  href: "/organization/financial-document-types",
                },
              ],
          auth: { required: true, minRole: "ORGANIZATION_USER" }
        }
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/organization/financial-document-types",
      handler: (request: any) => handleFinancialDocumentTypeList(request),
      apiDoc: {
        summary: "List",
        description: "List Organization Financial Document Types.",
        tags: ["Organization Financial Document Types"],
        responses: {
          "200": { description: "Successful response.", schema: arrayOf(dtoRef("FinancialDocumentTypeResponseDto")) },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    filter: {
      method: "POST",
      path: "/organization/financial-document-types/filter",
      handler: (request: any) => handleFinancialDocumentTypeFilter(request),
      apiDoc: {
        summary: "Filter",
        description: "Filter Organization Financial Document Types.",
        tags: ["Organization Financial Document Types"],
        requestBody: { required: true, schema: dtoRef("FilterRequestDto") },
        responses: {
          "200": { description: "Successful response.", schema: arrayOf(dtoRef("FinancialDocumentTypeResponseDto")) },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
    search: {
      method: "GET",
      path: "/organization/financial-document-types/search",
      handler: (request: any) => handleFinancialDocumentTypeSearch(request),
      apiDoc: {
        summary: "Search",
        description: "Search Organization Financial Document Types.",
        tags: ["Organization Financial Document Types"],
        requestQuerystringParams: {
          q: {
            description: "Search text used to match organization financial document type records.",
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
      path: "/organization/financial-document-types/batch/get",
      handler: (request: any) => handleFinancialDocumentTypeBatchGet(request),
      apiDoc: {
        summary: "Batch Get",
        description: "Batch Get Organization Financial Document Types.",
        tags: ["Organization Financial Document Types"],
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
      path: "/organization/financial-document-types/[code]",
      handler: (request: any, context: any) => handleFinancialDocumentTypeGet(request, context),
      apiDoc: { requestPathParams: { code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Organization Financial Document Types.",
        tags: ["Organization Financial Document Types"],
        responses: {
          "200": { description: "Successful response.", schema: dtoRef("FinancialDocumentTypeResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") },
        },
      },
    },
  }
} as const satisfies VoyzuPackageModuleDefinition;
