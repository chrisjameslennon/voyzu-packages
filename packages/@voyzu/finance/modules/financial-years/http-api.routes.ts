import Type from "typebox";
import { BusinessRuleErrorResponseDto, ConflictErrorResponseDto, EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { FinancialPeriodResponseDto } from "./types/financial-period.response.dto";
import { FinancialYearResponseDto } from "./types/financial-year.response.dto";
import { FinancialYearPatchRequestDto } from "./types/financial-year.patch.request.dto";
import { FinancialYearsExportRequestDto } from "./types/financial-years-export.request.dto";
import { FinancialYearCreateRequestDto } from "./types/financial-year.create.request.dto";



export const httpApiRoutes = {
  "finance.financial-years.list": {
    description: "List Financial Years.",
    method: "GET",
    path: "/finance/[companyCode]/financial-years",
    loadHandler: () => import("./server/http-api/financial-year.http.handlers").then((module) => module.handleList),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "List",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(FinancialYearResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-years.create": {
    description: "Create Financial Years.",
    method: "POST",
    path: "/finance/[companyCode]/financial-years",
    loadHandler: () => import("./server/http-api/financial-year.http.handlers").then((module) => module.handleCreate),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialYearCreateRequestDto },
    summary: "Create",
    
    
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
  "finance.financial-years.exportZip": {
    description: "Export Zip Financial Years.",
    method: "POST",
    path: "/finance/[companyCode]/financial-years/export",
    loadHandler: () => import("./server/http-api/financial-year.http.handlers").then((module) => module.handleExportZip),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialYearsExportRequestDto },
    summary: "Export Zip",
    
    
    responses: { "200": { description: "Generated financial years export archive.", contentType: "application/zip" }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  "finance.financial-years.get": {
    description: "Get Financial Years.",
    method: "GET",
    path: "/finance/[companyCode]/financial-years/[code]",
    loadHandler: () => import("./server/http-api/financial-year.http.handlers").then((module) => module.handleGet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    
    
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
  "finance.financial-years.patch": {
    description: "Patch Financial Years.",
    method: "PATCH",
    path: "/finance/[companyCode]/financial-years/[code]",
    loadHandler: () => import("./server/http-api/financial-year.http.handlers").then((module) => module.handlePatch),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } }, contentType: "application/json", body: FinancialYearPatchRequestDto },
    summary: "Patch",
    
    
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
  "finance.financial-years.delete": {
    description: "Delete Financial Years.",
    method: "DELETE",
    path: "/finance/[companyCode]/financial-years/[code]",
    loadHandler: () => import("./server/http-api/financial-year.http.handlers").then((module) => module.handleDelete),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Delete",
    
    
    responses: {
      "204": { description: "Successful response." },
      "422": { description: "Business rule failed.", body: BusinessRuleErrorResponseDto },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "409": { description: "Conflict.", body: ConflictErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.financial-years.open": {
    description: "Open Financial Years.",
    method: "POST",
    path: "/finance/[companyCode]/financial-years/[code]/open",
    loadHandler: () => import("./server/http-api/financial-year.http.handlers").then((module) => module.handleOpen),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Open",
    
    
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
  "finance.financial-years.close": {
    description: "Close Financial Years.",
    method: "POST",
    path: "/finance/[companyCode]/financial-years/[code]/close",
    loadHandler: () => import("./server/http-api/financial-year.http.handlers").then((module) => module.handleClose),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Close",
    
    
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
  "finance.financial-years.reopen": {
    description: "Reopen Financial Years.",
    method: "POST",
    path: "/finance/[companyCode]/financial-years/[code]/reopen",
    loadHandler: () => import("./server/http-api/financial-year.http.handlers").then((module) => module.handleReopen),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Reopen",
    
    
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
  "finance.financial-years.periodsList": {
    description: "Periods List Financial Years.",
    method: "GET",
    path: "/finance/[companyCode]/financial-years/[code]/periods",
    loadHandler: () => import("./server/periods/api/financial-period.http.handlers").then((module) => module.handleList),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Periods List",
    
    
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
  "finance.financial-years.periodsClose": {
    description: "Periods Close Financial Years.",
    method: "POST",
    path: "/finance/[companyCode]/financial-years/[code]/periods/[periodCode]/close",
    loadHandler: () => import("./server/periods/api/financial-period.http.handlers").then((module) => module.handleClose),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } }, periodCode: { description: "Financial period code.", schema: { type: "string" } } } },
    summary: "Periods Close",
    
    
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
  "finance.financial-years.periodsReopen": {
    description: "Periods Reopen Financial Years.",
    method: "POST",
    path: "/finance/[companyCode]/financial-years/[code]/periods/[periodCode]/reopen",
    loadHandler: () => import("./server/periods/api/financial-period.http.handlers").then((module) => module.handleReopen),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } }, periodCode: { description: "Financial period code.", schema: { type: "string" } } } },
    summary: "Periods Reopen",
    
    
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
