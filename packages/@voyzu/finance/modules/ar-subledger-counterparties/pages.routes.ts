import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.ar-subledger-counterparties.page.list": {
    httpApiDocumentationGroupId: "finance.ar-subledger-counterparties",
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
  "voyzu.ar-subledger-counterparties.page.detail": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "finance.ar-subledger-counterparties",
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
  "voyzu.ar-subledger-counterparties.page.detail.printable": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "finance.ar-subledger-counterparties",
    pageTitle: "AR Counterparty",
    path: "/finance/subledgers/ar/counterparties/[code]/printable",
    loadPage: () => import("./server/pages/ArCounterpartyDetailPage").then((module) => module.ArCounterpartyDetailPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
