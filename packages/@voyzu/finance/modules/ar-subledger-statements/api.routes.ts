import Type from "typebox";
import { handleListArCounterpartySummaries } from "@voyzu/finance/ar-subledger-statements/server";
import { ArStatementsListPage, ArStatementDetailPage } from "@voyzu/finance/ar-subledger-statements/server";
import { InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { ArCounterpartySummaryResponseDto } from "../../types/modules/ar-subledger/ar-counterparty-summary.response.dto";



export const apiDefinitions = {
  summariesList: {
    method: "GET",
    path: "/finance/[companyCode]/ar-subledger/counterparty-summaries",
    handler: (request: any) => handleListArCounterpartySummaries(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Summaries List",
    description: "Summaries List AR Subledger Statements.",
    tags: ["AR Subledger Statements"],
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
