import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.company-tax-control-accounts.page.list": {
    httpApiDocumentationGroupId: "ledger.tax-control-accounts",
    pageTitle: "Tax Control Accounts",
    helpPath: "modules-help/company-ledger/tax-accounts",
    path: "/ledger/settings/control-accounts/tax",
    loadPage: () => import("./server/pages/TaxControlAccountsPage").then((module) => module.TaxControlAccountsPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "Control Accounts" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.company-tax-control-accounts.page.detail": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.tax-control-accounts",
    pageTitle: "Tax Control Accounts",
    helpPath: "modules-help/company-ledger/tax-accounts",
    path: "/ledger/settings/control-accounts/tax/[code]",
    loadPage: () => import("./server/pages/TaxControlAccountDetailPage").then((module) => module.TaxControlAccountDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "Tax Control Accounts", href: "/ledger/settings/control-accounts/tax" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
