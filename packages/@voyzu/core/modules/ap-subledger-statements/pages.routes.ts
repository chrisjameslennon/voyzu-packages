import { handleListApCounterpartySummaries } from "@voyzu/core/ap-subledger-statements/server";
import { ApStatementsListPage, ApStatementDetailPage } from "@voyzu/core/ap-subledger-statements/server";

export const pageRoutes = {
  list: {
    id: "voyzu.ap-subledger-statements.page.list",
    pageTitle: "AP Statements",
    helpPath: "modules-help/company-ledger/ap-statements",
    path: "/finance/subledgers/ap/statements",
    Page: ApStatementsListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "Accounts Payable" },
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
      { label: "Finance" },
      { label: "Subledgers" },
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
} as const;
