import { CompanyAccessPage } from "./server/pages/CompanyAccessPage";

export const pageRoutes = {
  list: {
    id: "voyzu.company-access.page.list",
    path: "/organization/company-access",
    Page: CompanyAccessPage,
    pageTitle: "Company Access",
    apiDocsUrl: "company-access",
    breadcrumbBase: [{ label: "Organization" }],
    auth: { required: true, minRole: "ADMIN" },
  },
} as const;
