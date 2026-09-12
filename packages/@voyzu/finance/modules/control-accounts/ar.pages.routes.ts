import { companyFinancePageAuth } from "../finance-companies/server/lib/company-finance-page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.company-ar-control-accounts.page.list",
    pageTitle: "Accounts Receivable Control Accounts",
    helpPath: "modules-help/company-ledger/ar-control-accounts",
    path: "/finance/settings/control-accounts/ar",
    loadPage: () => import("./server/pages/ArControlAccountsListPage").then((module) => module.ArControlAccountsListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Control Accounts" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-ar-control-accounts.page.detail",
    pageTitle: "Accounts Receivable Control Accounts",
    helpPath: "modules-help/company-ledger/ar-control-accounts",
    path: "/finance/settings/control-accounts/ar/[code]",
    loadPage: () => import("./server/pages/ArControlAccountDetailPage").then((module) => module.ArControlAccountDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Accounts Receivable Control Accounts", href: "/finance/settings/control-accounts/ar" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
