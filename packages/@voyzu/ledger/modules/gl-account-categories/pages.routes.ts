import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.company-gl-account-categories.page.list": {

    httpApiDocumentationGroupId: "ledger.gl-account-categories",
    pageTitle: "Reporting Categories",
    helpPath: "modules-help/company-ledger/reporting-categories",
    path: "/ledger/settings/reporting-categories",
    loadPage: () => import("./server/pages/GlAccountCategoriesListPage").then((module) => module.GlAccountCategoriesListPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "General Ledger" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.company-gl-account-categories.page.detail": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.gl-account-categories",
    pageTitle: "Reporting Category",
    helpPath: "modules-help/company-ledger/reporting-categories",
    path: "/ledger/settings/reporting-categories/[code]",
    loadPage: () => import("./server/pages/GlAccountCategoryDetailPage").then((module) => module.GlAccountCategoryDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Settings" },
      { label: "General Ledger" },
      { label: "Reporting Categories", href: "/ledger/settings/reporting-categories" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
