import { companyFinancePageAuth } from "../finance-companies/server/lib/company-finance-page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.company-tax-control-accounts.page.list",
    pageTitle: "Tax Control Accounts",
    helpPath: "modules-help/company-ledger/tax-accounts",
    path: "/finance/settings/control-accounts/tax",
    loadPage: () => import("./server/pages/TaxControlAccountsPage").then((module) => module.TaxControlAccountsPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Control Accounts" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-tax-control-accounts.page.detail",
    pageTitle: "Tax Control Accounts",
    helpPath: "modules-help/company-ledger/tax-accounts",
    path: "/finance/settings/control-accounts/tax/[code]",
    loadPage: () => import("./server/pages/TaxControlAccountDetailPage").then((module) => module.TaxControlAccountDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Tax Control Accounts", href: "/finance/settings/control-accounts/tax" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
