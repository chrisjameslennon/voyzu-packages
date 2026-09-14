import Type from "typebox";
import { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { TaxSubledgerEntryResponseDto } from "./types/index";



export const httpApiRoutes = {
  "finance.tax-ledger.list": {
    description: "List Tax Ledger.",
    method: "GET",
    path: "/finance/[companyCode]/tax-ledger/entries",
    loadHandler: () => import("./server/http-api/tax-ledger.http.handlers").then((module) => module.handleListTaxEntries),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "List",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(TaxSubledgerEntryResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.tax-ledger.get": {
    description: "Get Tax Ledger.",
    method: "GET",
    path: "/finance/[companyCode]/tax-ledger/entries/[code]",
    loadHandler: () => import("./server/http-api/tax-ledger.http.handlers").then((module) => module.handleGetTaxEntry),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: TaxSubledgerEntryResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
