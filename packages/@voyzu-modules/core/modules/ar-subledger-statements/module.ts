import { handleListArCounterpartySummaries } from "@voyzu-modules/core/ar-subledger-statements/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";

export const arSubledgerStatementsModule = {
  pageRoutes: {
    list: {
      id: "voyzu.ar-subledger-statements.page.list",
      pageTitle: "AR Statements",
      helpPath: "modules-help/company-ledger/ar-statements",
    },
    detail: {
      id: "voyzu.ar-subledger-statements.page.detail",
      pageTitle: "AR Statement",
      helpPath: "modules-help/company-ledger/ar-statements",
    },
  },
  apiDefinitions: {
    summariesList: {
      method: "GET",
      path: "/finance/[companyCode]/ar-subledger/counterparty-summaries",
      handler: (request: any) => handleListArCounterpartySummaries(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Summaries List",
        description: "Summaries List AR Subledger Statements.",
        tags: ["AR Subledger Statements"],
        responses: {
          "200": {
            description: "Successful response.",
            schema: arrayOf(dtoRef("ArCounterpartySummaryResponseDto"))
          },
          "400": { description: "Validation failed.", schema: dtoRef("InputValidationErrorResponseDto") },
          "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") }
        },
      },
    },
  }
} as const;
