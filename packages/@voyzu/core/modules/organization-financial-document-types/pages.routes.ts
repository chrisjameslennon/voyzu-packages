import { handleBatchGet as handleFinancialDocumentTypeBatchGet, handleFilter as handleFinancialDocumentTypeFilter, handleGet as handleFinancialDocumentTypeGet, handleList as handleFinancialDocumentTypeList, handleSearch as handleFinancialDocumentTypeSearch } from "@voyzu/core/common/financial-document-types/server";
import { OrganizationFinancialDocumentTypesListPage, OrganizationFinancialDocumentTypeDetailPage } from "@voyzu/core/organization-financial-document-types/server";

export const pageRoutes = {
  list: {
    id: "voyzu.organization-financial-document-types.page.list",
    pageTitle: "Financial Document Types",
    helpPath: "modules-help/organization-financial-settings/financial-document-types",
    path: "/finance/financial-document-types",
    Page: OrganizationFinancialDocumentTypesListPage,
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
    Page: OrganizationFinancialDocumentTypeDetailPage,
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
