
export const pageRoutes = {
  list: {
    id: "voyzu.organization-financial-document-defaults.page.list",
    pageTitle: "Financial Document Defaults",
    helpPath: "modules-help/organization-financial-settings/financial-document-defaults",
    path: "/finance/financial-document-defaults",
    loadPage: () => import("./server/pages/OrganizationFinancialDocumentDefaultsListPage").then((module) => module.OrganizationFinancialDocumentDefaultsListPage),
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Integration",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  },
  detail: {
    id: "voyzu.organization-financial-document-defaults.page.detail",
    pageTitle: "Financial Document Default",
    helpPath: "modules-help/organization-financial-settings/financial-document-defaults",
    path: "/finance/financial-document-defaults/[code]",
    loadPage: () => import("./server/pages/OrganizationFinancialDocumentDefaultDetailPage").then((module) => module.OrganizationFinancialDocumentDefaultDetailPage),
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Integration",
      },
      {
        label: "Financial Document Defaults",
        href: "/finance/financial-document-defaults",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  }
} as const;
