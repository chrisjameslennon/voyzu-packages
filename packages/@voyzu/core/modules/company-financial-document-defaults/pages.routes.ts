import { companyFinancePageAuth } from "@voyzu/core/common/server";
import { handleActivate as handleActivateFinancialDocumentDefault, handleBatchActivate as handleBatchActivateFinancialDocumentDefaults, handleBatchCreate as handleBatchCreateFinancialDocumentDefaults, handleBatchDeactivate as handleBatchDeactivateFinancialDocumentDefaults, handleBatchDelete as handleBatchDeleteFinancialDocumentDefaults, handleBatchGet as handleBatchGetFinancialDocumentDefaults, handleBatchPatch as handleBatchPatchFinancialDocumentDefaults, handleBatchUpdate as handleBatchUpdateFinancialDocumentDefaults, handleCreate as handleCreateFinancialDocumentDefault, handleDeactivate as handleDeactivateFinancialDocumentDefault, handleDelete as handleDeleteFinancialDocumentDefault, handleFilter as handleFilterFinancialDocumentDefaults, handleGet as handleGetFinancialDocumentDefault, handleList as handleListFinancialDocumentDefaults, handlePatch as handlePatchFinancialDocumentDefault, handleSearch as handleSearchFinancialDocumentDefaults, handleUpdate as handleUpdateFinancialDocumentDefault } from "@voyzu/core/common/financial-document-defaults/server";
import { CompanyFinancialDocumentDefaultsListPage, CompanyFinancialDocumentDefaultDetailPage } from "@voyzu/core/company-financial-document-defaults/server";

export const pageRoutes = {
  list: {
    id: "voyzu.company-financial-document-defaults.page.list",
    pageTitle: "Financial Document Defaults",
    helpPath: "modules-help/company-ledger/financial-document-defaults",
    path: "/finance/integration/financial-document-defaults",
    Page: () => CompanyFinancialDocumentDefaultsListPage(),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-financial-document-defaults.page.detail",
    pageTitle: "Financial Document Default",
    helpPath: "modules-help/company-ledger/financial-document-defaults",
    path: "/finance/integration/financial-document-defaults/[code]",
    Page: CompanyFinancialDocumentDefaultDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Integration" },
      { label: "Financial Document Defaults", href: "/finance/integration/financial-document-defaults" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
