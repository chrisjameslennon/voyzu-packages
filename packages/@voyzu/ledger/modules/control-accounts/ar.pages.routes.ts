import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.company-ar-control-accounts.page.list": {
    pageTitle: "Accounts Receivable Control Accounts",
    helpPath: "modules-help/company-ledger/ar-control-accounts",
    path: "/ledger/settings/control-accounts/ar",
    loadPage: () => import("./server/pages/ArControlAccountsListPage").then((module) => module.ArControlAccountsListPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "Control Accounts" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.company-ar-control-accounts.page.detail": {
    pathParams: { code: { type: "string" } },
    pageTitle: "Accounts Receivable Control Accounts",
    helpPath: "modules-help/company-ledger/ar-control-accounts",
    path: "/ledger/settings/control-accounts/ar/[code]",
    loadPage: () => import("./server/pages/ArControlAccountDetailPage").then((module) => module.ArControlAccountDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "Accounts Receivable Control Accounts", href: "/ledger/settings/control-accounts/ar" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
