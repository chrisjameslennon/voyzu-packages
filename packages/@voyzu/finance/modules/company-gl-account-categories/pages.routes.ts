import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.company-gl-account-categories.page.list",
    pageTitle: "Reporting Categories",
    helpPath: "modules-help/company-ledger/reporting-categories",
    path: "/finance/settings/reporting-categories",
    loadPage: () => import("./server/pages/CompanyGlAccountCategoriesListPage").then((module) => module.CompanyGlAccountCategoriesListPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "General Ledger" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-gl-account-categories.page.detail",
    pageTitle: "Reporting Category",
    helpPath: "modules-help/company-ledger/reporting-categories",
    path: "/finance/settings/reporting-categories/[code]",
    loadPage: () => import("./server/pages/CompanyGlAccountCategoryDetailPage").then((module) => module.CompanyGlAccountCategoryDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "General Ledger" },
      { label: "Reporting Categories", href: "/finance/settings/reporting-categories" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
