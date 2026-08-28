
export const pageRoutes = {
  list: {
    id: "voyzu.organization-gl-account-categories.page.list",
    pageTitle: "Reporting Categories",
    helpPath: "modules-help/organization-financial-settings/reporting-categories",
    path: "/finance/chart-of-accounts/reporting-categories",
    loadPage: () => import("./server/pages/OrganizationGlAccountCategoriesListPage").then((module) => module.OrganizationGlAccountCategoriesListPage),
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "General Ledger",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  },
  detail: {
    id: "voyzu.organization-gl-account-categories.page.detail",
    pageTitle: "Reporting Category",
    helpPath: "modules-help/organization-financial-settings/reporting-categories",
    path: "/finance/chart-of-accounts/reporting-categories/[code]",
    loadPage: () => import("./server/pages/OrganizationGlAccountCategoryDetailPage").then((module) => module.OrganizationGlAccountCategoryDetailPage),
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "General Ledger",
      },
      {
        label: "Reporting Categories",
        href: "/finance/chart-of-accounts/reporting-categories",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  }
} as const;
