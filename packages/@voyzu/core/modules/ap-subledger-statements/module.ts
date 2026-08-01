import { handleListApCounterpartySummaries } from "@voyzu/core/ap-subledger-statements/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { ApStatementsListPage, ApStatementDetailPage } from "@voyzu/core/ap-subledger-statements/server";

export const apSubledgerStatementsModule = {
  pageRoutes: {
    list: {
          id: "voyzu.ap-subledger-statements.page.list",
          pageTitle: "AP Statements",
          helpPath: "modules-help/company-ledger/ap-statements",
          path: "/finance/subledgers/ap/statements",
          Page: ApStatementsListPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Subledgers", href: "/finance/subledgers/ap/statements" },
                { label: "Accounts Payable", href: "/finance/subledgers/ap/ledger-entries" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.ap-subledger-statements.page.detail",
          pageTitle: "AP Statement",
          helpPath: "modules-help/company-ledger/ap-statements",
          path: "/finance/subledgers/ap/statements/[code]",
          Page: ApStatementDetailPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Subledgers", href: "/finance/subledgers/ap/statements" },
                { label: "AP Statements", href: "/finance/subledgers/ap/statements" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detailPrintable: {
          id: "voyzu.ap-subledger-statements.page.detail.printable",
          pageTitle: "AP Statement",
          path: "/finance/subledgers/ap/statements/[code]/printable",
          Page: ApStatementDetailPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        }
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
} as const satisfies VoyzuPackageModuleDefinition;
