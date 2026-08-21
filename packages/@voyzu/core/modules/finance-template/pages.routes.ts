import { OrganizationGlAccountsListPage } from "@voyzu/core/organization-gl-accounts/server";

export const pageRoutes = {
  landing: {
    id: "voyzu.financeTemplate.page.landing",
    pageTitle: "Finance Template",
    path: "/finance",
    Page: OrganizationGlAccountsListPage,
    breadcrumbBase: [{ label: "Finance Template" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" },
  },
} as const;
