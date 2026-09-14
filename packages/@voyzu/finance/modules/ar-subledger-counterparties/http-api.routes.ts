import Type from "typebox";
import { EntityNotFoundErrorResponseDto, InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ArCounterpartyResponseDto } from "./types/ar-counterparty.response.dto";



export const httpApiRoutes = {
  "finance.ar-subledger-counterparties.list": {
    description: "List AR Subledger Counterparties.",
    method: "GET",
    path: "/finance/[companyCode]/ar-subledger/counterparties",
    loadHandler: () => import("./server/http-api/ar-subledger-counterparty.http.handlers").then((module) => module.handleListArCounterparties),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "List",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(ArCounterpartyResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
  "finance.ar-subledger-counterparties.get": {
    description: "Get AR Subledger Counterparties.",
    method: "GET",
    path: "/finance/[companyCode]/ar-subledger/counterparties/[code]",
    loadHandler: () => import("./server/http-api/ar-subledger-counterparty.http.handlers").then((module) => module.handleGetArCounterparty),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } }, code: { description: "Business code of the requested record.", schema: { type: "string" } } } },
    summary: "Get",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: ArCounterpartyResponseDto
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "404": { description: "Entity not found.", body: EntityNotFoundErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
