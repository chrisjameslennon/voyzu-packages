import Type from "typebox";
import { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ArSubledgerEntryResponseDto } from "./types/ar-subledger-entry.response.dto";



export const httpApiRoutes = {
  "finance.ar-subledger-ledger-entries.list": {
    method: "GET",
    path: "/finance/[companyCode]/ar-subledger/entries",
    loadHandler: () => import("./server/http-api/ar-subledger-ledger-entries.http.handlers").then((module) => module.handleListArEntries),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "List",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(ArSubledgerEntryResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.ar-subledger-ledger-entries.get": {
    method: "GET",
    path: "/finance/[companyCode]/ar-subledger/entries/[code]",
    loadHandler: () => import("./server/http-api/ar-subledger-ledger-entries.http.handlers").then((module) => module.handleGetArEntry),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: ArSubledgerEntryResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
