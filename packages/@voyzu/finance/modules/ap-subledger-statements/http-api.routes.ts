import Type from "typebox";
import { InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ApCounterpartySummaryResponseDto } from "../ap-subledger-counterparties/types/ap-counterparty-summary.response.dto";



export const httpApiRoutes = {
  "finance.ap-subledger-statements.summariesList": {
    description: "Summaries List AP Subledger Statements.",
    method: "GET",
    path: "/finance/[companyCode]/ap-subledger/counterparty-summaries",
    loadHandler: () => import("./server/http-api/ap-subledger-statement.http.handlers").then((module) => module.handleListApCounterpartySummaries),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "Summaries List",
    
    
    responses: {
      "200": {
        description: "Successful response.",
        body: Type.Array(ApCounterpartySummaryResponseDto)
      },
      "400": { description: "Validation failed.", body: InputValidationErrorResponseDto },
      "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto }
    }
  },
} as const;
