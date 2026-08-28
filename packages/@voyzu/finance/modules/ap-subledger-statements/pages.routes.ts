import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.ap-subledger-statements.page.list",
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
  detail: {
    id: "voyzu.ap-subledger-statements.page.detail",
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
  detailPrintable: {
    id: "voyzu.ap-subledger-statements.page.detail.printable",
    pageTitle: "AP Statement",
    path: "/finance/subledgers/ap/statements/[code]/printable",
    loadPage: () => import("./server/pages/ApStatementDetailPage").then((module) => module.ApStatementDetailPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
