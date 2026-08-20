import Type from "typebox";
import { handleClose as handleCloseFinancialYear, handleCloseFinancialPeriod, handleCreate as handleCreateFinancialYear, handleDelete as handleDeleteFinancialYear, handleExportZip as handleExportFinancialYearsZip, handleGet as handleGetFinancialYear, handleList as handleListCompanyFinancialYears, handleListFinancialPeriods, handleOpen as handleOpenFinancialYear, handlePatch as handlePatchFinancialYear, handleReopen as handleReopenFinancialYear, handleReopenFinancialPeriod } from "@voyzu/core/financial-years/server";
import { FinancialYearsListPage, FinancialYearDetailPage } from "@voyzu/core/financial-years/server";
import { BusinessRuleErrorResponseDto, ConflictErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { FinancialPeriodResponseDto } from "../../types/modules/financial-periods/financial-period.response.dto";
import { FinancialYearResponseDto } from "../../types/modules/financial-years/financial-year.response.dto";
import { FinancialYearPatchRequestDto } from "../../types/modules/financial-years/financial-year.patch.request.dto";
import { FinancialYearsExportRequestDto } from "./types/financial-years-export.request.dto";
import { FinancialYearCreateRequestDto } from "../../types/modules/financial-years/financial-year.create.request.dto";



export const apiDefinitions = {
  list: {
    method: "GET",
    path: "/finance/[companyCode]/financial-years",
    handler: (request: any) => handleListCompanyFinancialYears(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "List",
    description: "List Financial Years.",
    tags: ["Financial Years"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(FinancialYearResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  create: {
    method: "POST",
    path: "/finance/[companyCode]/financial-years",
    handler: (request: any) => handleCreateFinancialYear(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialYearCreateRequestDto },
    summary: "Create",
    description: "Create Financial Years.",
    tags: ["Financial Years"],
    responses: {
      "200": {
        description: "Successful response.",
        body: FinancialYearResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  exportZip: {
    method: "POST",
    path: "/finance/[companyCode]/financial-years/export",
    handler: (request: any) => handleExportFinancialYearsZip(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialYearsExportRequestDto },
    summary: "Export Zip",
    description: "Export Zip Financial Years.",
    tags: ["Financial Years"],
    responses: { "200": { description: "Generated financial years export archive.", contentType: "application/zip" }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  get: {
    method: "GET",
    path: "/finance/[companyCode]/financial-years/[code]",
    handler: (request: any, context: any) => handleGetFinancialYear(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    description: "Get Financial Years.",
    tags: ["Financial Years"],
    responses: {
      "200": {
        description: "Successful response.",
        body: FinancialYearResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  patch: {
    method: "PATCH",
    path: "/finance/[companyCode]/financial-years/[code]",
    handler: (request: any, context: any) => handlePatchFinancialYear(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialYearPatchRequestDto },
    summary: "Patch",
    description: "Patch Financial Years.",
    tags: ["Financial Years"],
    responses: {
      "200": {
        description: "Successful response.",
        body: FinancialYearResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  delete: {
    method: "DELETE",
    path: "/finance/[companyCode]/financial-years/[code]",
    handler: (request: any, context: any) => handleDeleteFinancialYear(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    description: "Delete Financial Years.",
    tags: ["Financial Years"],
    responses: {
      "204": { description: "Successful response." },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  open: {
    method: "POST",
    path: "/finance/[companyCode]/financial-years/[code]/open",
    handler: (request: any, context: any) => handleOpenFinancialYear(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Open",
    description: "Open Financial Years.",
    tags: ["Financial Years"],
    responses: {
      "200": {
        description: "Successful response.",
        body: FinancialYearResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  close: {
    method: "POST",
    path: "/finance/[companyCode]/financial-years/[code]/close",
    handler: (request: any, context: any) => handleCloseFinancialYear(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Close",
    description: "Close Financial Years.",
    tags: ["Financial Years"],
    responses: {
      "200": {
        description: "Successful response.",
        body: FinancialYearResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  reopen: {
    method: "POST",
    path: "/finance/[companyCode]/financial-years/[code]/reopen",
    handler: (request: any, context: any) => handleReopenFinancialYear(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Reopen",
    description: "Reopen Financial Years.",
    tags: ["Financial Years"],
    responses: {
      "200": {
        description: "Successful response.",
        body: FinancialYearResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  periodsList: {
    method: "GET",
    path: "/finance/[companyCode]/financial-years/[code]/periods",
    handler: (request: any, context: any) => handleListFinancialPeriods(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Periods List",
    description: "Periods List Financial Years.",
    tags: ["Financial Years"],
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(FinancialPeriodResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  periodsClose: {
    method: "POST",
    path: "/finance/[companyCode]/financial-years/[code]/periods/[periodCode]/close",
    handler: (request: any, context: any) => handleCloseFinancialPeriod(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } }, periodCode: { description: "Financial period code.", schema: { type: "string" } } } },
    summary: "Periods Close",
    description: "Periods Close Financial Years.",
    tags: ["Financial Years"],
    responses: {
      "200": {
        description: "Successful response.",
        body: FinancialPeriodResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  periodsReopen: {
    method: "POST",
    path: "/finance/[companyCode]/financial-years/[code]/periods/[periodCode]/reopen",
    handler: (request: any, context: any) => handleReopenFinancialPeriod(request, context),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } }, periodCode: { description: "Financial period code.", schema: { type: "string" } } } },
    summary: "Periods Reopen",
    description: "Periods Reopen Financial Years.",
    tags: ["Financial Years"],
    responses: {
      "200": {
        description: "Successful response.",
        body: FinancialPeriodResponseDto
      },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
