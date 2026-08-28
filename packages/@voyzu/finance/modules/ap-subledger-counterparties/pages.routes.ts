import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.ap-subledger-counterparties.page.list",
    pageTitle: "AP Counterparties",
    helpPath: "modules-help/company-ledger/ap-counterparties",
    path: "/finance/subledgers/ap/counterparties",
    loadPage: () => import("./server/pages/ApCounterpartiesListPage").then((module) => module.ApCounterpartiesListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AP Subledger" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.ap-subledger-counterparties.page.detail",
    pageTitle: "AP Counterparty",
    helpPath: "modules-help/company-ledger/ap-counterparties",
    path: "/finance/subledgers/ap/counterparties/[code]",
    loadPage: () => import("./server/pages/ApCounterpartyDetailPage").then((module) => module.ApCounterpartyDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Subledgers" },
      { label: "AP Counterparties", href: "/finance/subledgers/ap/counterparties" },
    ],
    auth: companyFinancePageAuth
  },
  detailPrintable: {
    id: "voyzu.ap-subledger-counterparties.page.detail.printable",
    pageTitle: "AP Counterparty",
    path: "/finance/subledgers/ap/counterparties/[code]/printable",
    loadPage: () => import("./server/pages/ApCounterpartyDetailPage").then((module) => module.ApCounterpartyDetailPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
