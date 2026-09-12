import { companyFinancePageAuth } from "../finance-companies/server/lib/company-finance-page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.company-gl-accounts.page.list",
    pageTitle: "General Ledger Accounts",
    helpPath: "modules-help/company-ledger/gl-accounts",
    path: "/finance/settings/gl-accounts",
    loadPage: () => import("./server/pages/GlAccountsListPage").then((module) => module.GlAccountsListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "General Ledger" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-gl-accounts.page.detail",
    pageTitle: "General Ledger Account",
    helpPath: "modules-help/company-ledger/gl-accounts",
    path: "/finance/settings/gl-accounts/[code]",
    loadPage: () => import("./server/pages/GlAccountDetailPage").then((module) => module.GlAccountDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "General Ledger" },
      { label: "General Ledger Accounts", href: "/finance/settings/gl-accounts" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
