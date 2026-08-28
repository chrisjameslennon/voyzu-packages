
export const pageRoutes = {
  landing: {
    id: "voyzu.financeTemplate.page.landing",
    pageTitle: "Finance Admin",
    path: "/finance",
    loadPage: () => import("../organization-gl-accounts/server/pages/OrganizationGlAccountsListPage").then((module) => module.OrganizationGlAccountsListPage),
    breadcrumbBase: [{ label: "Finance Admin" }],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
