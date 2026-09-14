import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.company-gl-accounts.page.list": {

    httpApiDocumentationGroupId: "ledger.gl-accounts",
    pageTitle: "General Ledger Accounts",
    helpPath: "modules-help/company-ledger/gl-accounts",
    path: "/ledger/settings/gl-accounts",
    loadPage: () => import("./server/pages/GlAccountsListPage").then((module) => module.GlAccountsListPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "General Ledger" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.company-gl-accounts.page.detail": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.gl-accounts",
    pageTitle: "General Ledger Account",
    helpPath: "modules-help/company-ledger/gl-accounts",
    path: "/ledger/settings/gl-accounts/[code]",
    loadPage: () => import("./server/pages/GlAccountDetailPage").then((module) => module.GlAccountDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "General Ledger" },
      { label: "General Ledger Accounts", href: "/ledger/settings/gl-accounts" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
