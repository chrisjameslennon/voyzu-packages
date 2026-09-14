import Type from "typebox";
import { InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ArCounterpartySummaryResponseDto } from "../ar-subledger-counterparties/types/ar-counterparty-summary.response.dto";



export const httpApiRoutes = {
  "finance.ar-subledger-statements.summariesList": {
    description: "Summaries List AR Subledger Statements.",
    method: "GET",
    path: "/finance/[companyCode]/ar-subledger/counterparty-summaries",
    loadHandler: () => import("./server/http-api/ar-subledger-statement.http.handlers").then((module) => module.handleListArCounterpartySummaries),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "Summaries List",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(ArCounterpartySummaryResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
