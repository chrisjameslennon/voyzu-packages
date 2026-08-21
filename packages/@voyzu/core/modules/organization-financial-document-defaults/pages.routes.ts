import { handleActivate as handleFinancialDocumentDefaultsActivate, handleBatchActivate as handleFinancialDocumentDefaultsBatchActivate, handleBatchCreate as handleFinancialDocumentDefaultsBatchCreate, handleBatchDeactivate as handleFinancialDocumentDefaultsBatchDeactivate, handleBatchDelete as handleFinancialDocumentDefaultsBatchDelete, handleBatchGet as handleFinancialDocumentDefaultsBatchGet, handleBatchPatch as handleFinancialDocumentDefaultsBatchPatch, handleBatchUpdate as handleFinancialDocumentDefaultsBatchUpdate, handleCreate as handleFinancialDocumentDefaultsCreate, handleDeactivate as handleFinancialDocumentDefaultsDeactivate, handleDelete as handleFinancialDocumentDefaultsDelete, handleFilter as handleFinancialDocumentDefaultsFilter, handleGet as handleFinancialDocumentDefaultsGet, handleList as handleFinancialDocumentDefaultsList, handlePatch as handleFinancialDocumentDefaultsPatch, handleSearch as handleFinancialDocumentDefaultsSearch, handleUpdate as handleFinancialDocumentDefaultsUpdate } from "@voyzu/core/common/financial-document-defaults/server";
import { OrganizationFinancialDocumentDefaultsListPage, OrganizationFinancialDocumentDefaultDetailPage } from "@voyzu/core/organization-financial-document-defaults/server";

export const pageRoutes = {
  list: {
    id: "voyzu.organization-financial-document-defaults.page.list",
    pageTitle: "Financial Document Defaults",
    helpPath: "modules-help/organization-financial-settings/financial-document-defaults",
    path: "/finance/financial-document-defaults",
    Page: OrganizationFinancialDocumentDefaultsListPage,
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
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  detail: {
    id: "voyzu.organization-financial-document-defaults.page.detail",
    pageTitle: "Financial Document Default",
    helpPath: "modules-help/organization-financial-settings/financial-document-defaults",
    path: "/finance/financial-document-defaults/[code]",
    Page: OrganizationFinancialDocumentDefaultDetailPage,
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
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  }
} as const;
