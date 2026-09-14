import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.ar-subledger-statements.page.list": {

    httpApiDocumentationGroupId: "finance.ar-subledger-statements",
    pageTitle: "AR Statements",
    helpPath: "modules-help/company-ledger/ar-statements",
    path: "/finance/subledgers/ar/statements",
    loadPage: () => import("./server/pages/ArStatementsListPage").then((module) => module.ArStatementsListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "Accounts Receivable" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.ar-subledger-statements.page.detail": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "finance.ar-subledger-statements",
    pageTitle: "AR Statement",
    helpPath: "modules-help/company-ledger/ar-statements",
    path: "/finance/subledgers/ar/statements/[code]",
    loadPage: () => import("./server/pages/ArStatementDetailPage").then((module) => module.ArStatementDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AR Statements", href: "/finance/subledgers/ar/statements" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.ar-subledger-statements.page.detail.printable": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "finance.ar-subledger-statements",
    pageTitle: "AR Statement",
    path: "/finance/subledgers/ar/statements/[code]/printable",
    loadPage: () => import("./server/pages/ArStatementDetailPage").then((module) => module.ArStatementDetailPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
