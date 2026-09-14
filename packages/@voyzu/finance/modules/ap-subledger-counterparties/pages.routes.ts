import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.ap-subledger-counterparties.page.list": {
    httpApiDocumentationGroupId: "finance.ap-subledger-counterparties",
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
  "voyzu.ap-subledger-counterparties.page.detail": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "finance.ap-subledger-counterparties",
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
  "voyzu.ap-subledger-counterparties.page.detail.printable": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "finance.ap-subledger-counterparties",
    pageTitle: "AP Counterparty",
    path: "/finance/subledgers/ap/counterparties/[code]/printable",
    loadPage: () => import("./server/pages/ApCounterpartyDetailPage").then((module) => module.ApCounterpartyDetailPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
