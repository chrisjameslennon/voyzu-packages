import { handleListApCounterpartySummaries } from "@voyzu-modules/core/ap-subledger-statements/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const apSubledgerStatementsModule = {
  id: "voyzu.ap-subledger-statements",
  name: "AP Statements",
  pageRoutes: {
    list: {
      id: "voyzu.ap-subledger-statements.page.list",
      pageTitle: "AP Statements",
      helpUrl: "modules-help/company-ledger/ap-statements",
    },
    detail: {
      id: "voyzu.ap-subledger-statements.page.detail",
      pageTitle: "AP Statement",
      helpUrl: "modules-help/company-ledger/ap-statements",
    },
  },
  apiDefinitions: {
    summariesList: {
      method: "GET",
      path: "/finance/[companyCode]/ap-subledger/counterparty-summaries",
      handler: (request: any) => handleListApCounterpartySummaries(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Summaries List",
        description: "Summaries List AP Subledger Statements.",
        tags: ["AP Subledger Statements"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("ApCounterpartySummaryResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
  }
} as const;
