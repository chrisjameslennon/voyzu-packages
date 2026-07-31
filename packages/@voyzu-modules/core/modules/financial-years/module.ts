import { handleClose as handleCloseFinancialYear, handleCloseFinancialPeriod, handleCreate as handleCreateFinancialYear, handleDelete as handleDeleteFinancialYear, handleExportZip as handleExportFinancialYearsZip, handleGet as handleGetFinancialYear, handleList as handleListCompanyFinancialYears, handleListFinancialPeriods, handleOpen as handleOpenFinancialYear, handlePatch as handlePatchFinancialYear, handleReopen as handleReopenFinancialYear, handleReopenFinancialPeriod } from "@voyzu-modules/core/financial-years/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const financialYearsModule = {
  pageRoutes: {
    list: {
      id: "voyzu.financial-years.page.list",
      pageTitle: "Financial Periods",
      helpPath: "modules-help/company-ledger/financial-periods",
    },
    detail: {
      id: "voyzu.financial-years.page.detail",
      pageTitle: "Financial Year",
      helpPath: "modules-help/company-ledger/financial-periods",
    },
  },
  apiDefinitions: {
    list: {
      method: "GET",
      path: "/finance/[companyCode]/financial-years",
      handler: (request: any) => handleListCompanyFinancialYears(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "List",
        description: "List Financial Years.",
        tags: ["Financial Years"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("FinancialYearResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    create: {
      method: "POST",
      path: "/finance/[companyCode]/financial-years",
      handler: (request: any) => handleCreateFinancialYear(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Create",
        description: "Create Financial Years.",
        tags: ["Financial Years"],
        requestBody: { required: true, schema: dtoRef("FinancialYearCreateRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("FinancialYearResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    exportZip: {
      method: "POST",
      path: "/finance/[companyCode]/financial-years/export",
      handler: (request: any) => handleExportFinancialYearsZip(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Export Zip",
        description: "Export Zip Financial Years.",
        tags: ["Financial Years"],
        requestBody: { required: true, schema: dtoRef("FinancialYearsExportRequestDto") },
        responses: { "200": { description: "Generated financial years export archive.", contentType: "application/zip" }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    get: {
      method: "GET",
      path: "/finance/[companyCode]/financial-years/[code]",
      handler: (request: any, context: any) => handleGetFinancialYear(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Get",
        description: "Get Financial Years.",
        tags: ["Financial Years"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("FinancialYearResponseDto")
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    patch: {
      method: "PATCH",
      path: "/finance/[companyCode]/financial-years/[code]",
      handler: (request: any, context: any) => handlePatchFinancialYear(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Patch",
        description: "Patch Financial Years.",
        tags: ["Financial Years"],
        requestBody: { required: true, schema: dtoRef("FinancialYearPatchRequestDto") },
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("FinancialYearResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    delete: {
      method: "DELETE",
      path: "/finance/[companyCode]/financial-years/[code]",
      handler: (request: any, context: any) => handleDeleteFinancialYear(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Delete",
        description: "Delete Financial Years.",
        tags: ["Financial Years"],
        responses: {
          "204": { description: "Successful response." },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    open: {
      method: "POST",
      path: "/finance/[companyCode]/financial-years/[code]/open",
      handler: (request: any, context: any) => handleOpenFinancialYear(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Open",
        description: "Open Financial Years.",
        tags: ["Financial Years"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("FinancialYearResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    close: {
      method: "POST",
      path: "/finance/[companyCode]/financial-years/[code]/close",
      handler: (request: any, context: any) => handleCloseFinancialYear(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Close",
        description: "Close Financial Years.",
        tags: ["Financial Years"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("FinancialYearResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    reopen: {
      method: "POST",
      path: "/finance/[companyCode]/financial-years/[code]/reopen",
      handler: (request: any, context: any) => handleReopenFinancialYear(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Reopen",
        description: "Reopen Financial Years.",
        tags: ["Financial Years"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("FinancialYearResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "409": { description: "Conflict.", schema: dtoRef("ConflictErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    periodsList: {
      method: "GET",
      path: "/finance/[companyCode]/financial-years/[code]/periods",
      handler: (request: any, context: any) => handleListFinancialPeriods(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } },
        summary: "Periods List",
        description: "Periods List Financial Years.",
        tags: ["Financial Years"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("FinancialPeriodResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    periodsClose: {
      method: "POST",
      path: "/finance/[companyCode]/financial-years/[code]/periods/[periodCode]/close",
      handler: (request: any, context: any) => handleCloseFinancialPeriod(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } }, periodCode: { description: "Financial period code.", schema: { type: "string" } } },
        summary: "Periods Close",
        description: "Periods Close Financial Years.",
        tags: ["Financial Years"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("FinancialPeriodResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
    periodsReopen: {
      method: "POST",
      path: "/finance/[companyCode]/financial-years/[code]/periods/[periodCode]/reopen",
      handler: (request: any, context: any) => handleReopenFinancialPeriod(request, context),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } }, periodCode: { description: "Financial period code.", schema: { type: "string" } } },
        summary: "Periods Reopen",
        description: "Periods Reopen Financial Years.",
        tags: ["Financial Years"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: dtoRef("FinancialPeriodResponseDto")
          },
          "422": { description: "Business rule failed.", schema: dtoRef("BusinessRuleErrorResponseDto") },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "404": { description: "Entity not found.", schema: dtoRef("EntityNotFoundErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
  }
} as const;
