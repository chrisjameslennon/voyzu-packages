import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.ap-subledger-statements.page.list": {

    httpApiDocumentationGroupId: "finance.ap-subledger-statements",
    pageTitle: "AP Statements",
    helpPath: "modules-help/company-ledger/ap-statements",
    path: "/finance/subledgers/ap/statements",
    loadPage: () => import("./server/pages/ApStatementsListPage").then((module) => module.ApStatementsListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "Accounts Payable" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.ap-subledger-statements.page.detail": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "finance.ap-subledger-statements",
    pageTitle: "AP Statement",
    helpPath: "modules-help/company-ledger/ap-statements",
    path: "/finance/subledgers/ap/statements/[code]",
    loadPage: () => import("./server/pages/ApStatementDetailPage").then((module) => module.ApStatementDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AP Statements", href: "/finance/subledgers/ap/statements" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.ap-subledger-statements.page.detail.printable": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "finance.ap-subledger-statements",
    pageTitle: "AP Statement",
    path: "/finance/subledgers/ap/statements/[code]/printable",
    loadPage: () => import("./server/pages/ApStatementDetailPage").then((module) => module.ApStatementDetailPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
