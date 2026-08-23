import { OrganizationAccessPage } from "./server/pages/OrganizationAccessPage";

export const pageRoutes = {
  list: {
    id: "voyzu.organization-access.page.list",
    path: "/organization/organization-access",
    Page: OrganizationAccessPage,
    pageTitle: "Organization Access",
    apiDocsUrl: "organization-access",
    breadcrumbBase: [{ label: "Organization" }],
    auth: { required: true, minRole: "ADMIN" },
  },
} as const;
