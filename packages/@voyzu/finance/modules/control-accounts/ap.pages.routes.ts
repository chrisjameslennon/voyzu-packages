import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.company-ap-control-accounts.page.list",
    pageTitle: "Accounts Payable Control Accounts",
    helpPath: "modules-help/company-ledger/ap-control-accounts",
    path: "/finance/settings/control-accounts/ap",
    loadPage: () => import("./server/pages/ApControlAccountsListPage").then((module) => module.ApControlAccountsListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Accounts Payable Control Accounts", href: "/finance/settings/control-accounts/ap" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-ap-control-accounts.page.detail",
    pageTitle: "Accounts Payable Control Accounts",
    helpPath: "modules-help/company-ledger/ap-control-accounts",
    path: "/finance/settings/control-accounts/ap/[code]",
    loadPage: () => import("./server/pages/ApControlAccountDetailPage").then((module) => module.ApControlAccountDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Accounts Payable Control Accounts", href: "/finance/settings/control-accounts/ap" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
