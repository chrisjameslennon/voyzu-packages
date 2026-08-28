
export const pageRoutes = {
  list: {
    id: "voyzu.organization-financial-document-types.page.list",
    pageTitle: "Financial Document Types",
    helpPath: "modules-help/organization-financial-settings/financial-document-types",
    path: "/finance/financial-document-types",
    loadPage: () => import("./server/pages/OrganizationFinancialDocumentTypesListPage").then((module) => module.OrganizationFinancialDocumentTypesListPage),
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
    id: "voyzu.organization-financial-document-types.page.detail",
    pageTitle: "Financial Document Type",
    helpPathResolver: ({ params }: { params: Readonly<Record<string, string>> }) =>
      `help-core/financial-documents/${params.code.toLowerCase()}`,
    path: "/finance/financial-document-types/[code]",
    loadPage: () => import("./server/pages/OrganizationFinancialDocumentTypeDetailPage").then((module) => module.OrganizationFinancialDocumentTypeDetailPage),
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
        label: "Financial Document Types",
        href: "/finance/financial-document-types",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  }
} as const;
