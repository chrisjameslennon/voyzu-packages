import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.ar-subledger-counterparties.page.list",
    pageTitle: "AR Counterparties",
    helpPath: "modules-help/company-ledger/ar-counterparties",
    path: "/finance/subledgers/ar/counterparties",
    loadPage: () => import("./server/pages/ArCounterpartiesListPage").then((module) => module.ArCounterpartiesListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AR Subledger" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.ar-subledger-counterparties.page.detail",
    pageTitle: "AR Counterparty",
    helpPath: "modules-help/company-ledger/ar-counterparties",
    path: "/finance/subledgers/ar/counterparties/[code]",
    loadPage: () => import("./server/pages/ArCounterpartyDetailPage").then((module) => module.ArCounterpartyDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AR Counterparties", href: "/finance/subledgers/ar/counterparties" },
    ],
    auth: companyFinancePageAuth
  },
  detailPrintable: {
    id: "voyzu.ar-subledger-counterparties.page.detail.printable",
    pageTitle: "AR Counterparty",
    path: "/finance/subledgers/ar/counterparties/[code]/printable",
    loadPage: () => import("./server/pages/ArCounterpartyDetailPage").then((module) => module.ArCounterpartyDetailPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
