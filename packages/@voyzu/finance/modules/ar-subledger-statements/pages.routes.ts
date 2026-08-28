import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.ar-subledger-statements.page.list",
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
  detail: {
    id: "voyzu.ar-subledger-statements.page.detail",
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
  detailPrintable: {
    id: "voyzu.ar-subledger-statements.page.detail.printable",
    pageTitle: "AR Statement",
    path: "/finance/subledgers/ar/statements/[code]/printable",
    loadPage: () => import("./server/pages/ArStatementDetailPage").then((module) => module.ArStatementDetailPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
