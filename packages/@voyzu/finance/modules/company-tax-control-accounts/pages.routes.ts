import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.company-tax-control-accounts.page.list",
    pageTitle: "Tax Control Accounts",
    helpPath: "modules-help/company-ledger/tax-accounts",
    path: "/finance/settings/control-accounts/tax",
    loadPage: () => import("./server/pages/CompanyTaxControlAccountsPage").then((module) => module.CompanyTaxControlAccountsPage),
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
    loadPage: () => import("./server/pages/CompanyTaxControlAccountDetailPage").then((module) => module.CompanyTaxControlAccountDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Tax Control Accounts", href: "/finance/settings/control-accounts/tax" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
