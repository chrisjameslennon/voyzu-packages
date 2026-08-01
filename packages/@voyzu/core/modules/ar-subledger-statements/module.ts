import { handleListArCounterpartySummaries } from "@voyzu/core/ar-subledger-statements/server";
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
import { ArStatementsListPage, ArStatementDetailPage } from "@voyzu/core/ar-subledger-statements/server";

export const arSubledgerStatementsModule = {
  pageRoutes: {
    list: {
          id: "voyzu.ar-subledger-statements.page.list",
          pageTitle: "AR Statements",
          helpPath: "modules-help/company-ledger/ar-statements",
          path: "/finance/subledgers/ar/statements",
          Page: ArStatementsListPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Subledgers", href: "/finance/subledgers/ar/statements" },
                { label: "Accounts Receivable", href: "/finance/subledgers/ar/ledger-entries" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detail: {
          id: "voyzu.ar-subledger-statements.page.detail",
          pageTitle: "AR Statement",
          helpPath: "modules-help/company-ledger/ar-statements",
          path: "/finance/subledgers/ar/statements/[code]",
          Page: ArStatementDetailPage,
          breadcrumbBase: [
                { label: "Finance", href: "/finance/journals" },
                { label: "Subledgers", href: "/finance/subledgers/ar/statements" },
                { label: "AR Statements", href: "/finance/subledgers/ar/statements" },
              ],
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    detailPrintable: {
          id: "voyzu.ar-subledger-statements.page.detail.printable",
          pageTitle: "AR Statement",
          path: "/finance/subledgers/ar/statements/[code]/printable",
          Page: ArStatementDetailPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        }
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
} as const satisfies VoyzuPackageModuleDefinition;
