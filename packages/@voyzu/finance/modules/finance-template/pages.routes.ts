import { OrganizationGlAccountsListPage } from "@voyzu/finance/organization-gl-accounts/server";

export const pageRoutes = {
  landing: {
    id: "voyzu.financeTemplate.page.landing",
    pageTitle: "Finance Admin",
    path: "/finance",
    Page: OrganizationGlAccountsListPage,
    breadcrumbBase: [{ label: "Finance Admin" }],
    auth: { required: true, minRole: "STANDARD" },
  },
} as const;
