import { handleListArCounterpartySummaries } from "@voyzu/core/ar-subledger-statements/server";
import { ArStatementsListPage, ArStatementDetailPage } from "@voyzu/core/ar-subledger-statements/server";

export const pageRoutes = {
  list: {
    id: "voyzu.ar-subledger-statements.page.list",
    pageTitle: "AR Statements",
    helpPath: "modules-help/company-ledger/ar-statements",
    path: "/finance/subledgers/ar/statements",
    Page: ArStatementsListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "Accounts Receivable" },
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
      { label: "Finance" },
      { label: "Subledgers" },
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
} as const;
