import Type from "typebox";
import { InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ApCounterpartySummaryResponseDto } from "../../types/modules/ap-subledger/ap-counterparty-summary.response.dto";



export const apiDefinitions = {
  summariesList: {
    method: "GET",
    path: "/finance/[companyCode]/ap-subledger/counterparty-summaries",
    loadHandler: () => import("./server/api/ap-subledger-statement.http.handlers").then((module) => module.handleListApCounterpartySummaries),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Summaries List",
    description: "Summaries List AP Subledger Statements.",
    tags: ["AP Subledger Statements"],
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
