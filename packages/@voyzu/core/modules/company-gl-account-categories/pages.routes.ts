import { companyFinancePageAuth } from "@voyzu/core/common/server";
import { handleActivate as handleActivateGlAccountCategory, handleBatchActivate as handleBatchActivateGlAccountCategories, handleBatchCreate as handleBatchCreateGlAccountCategories, handleBatchDeactivate as handleBatchDeactivateGlAccountCategories, handleBatchDelete as handleBatchDeleteGlAccountCategories, handleBatchGet as handleBatchGetGlAccountCategories, handleBatchPatch as handleBatchPatchGlAccountCategories, handleBatchUpdate as handleBatchUpdateGlAccountCategories, handleCreate as handleCreateGlAccountCategory, handleDeactivate as handleDeactivateGlAccountCategory, handleDelete as handleDeleteGlAccountCategory, handleFilter as handleFilterGlAccountCategories, handleGet as handleGetGlAccountCategory, handleList as handleListGlAccountCategories, handlePatch as handlePatchGlAccountCategory, handleSearch as handleSearchGlAccountCategories, handleUpdate as handleUpdateGlAccountCategory } from "@voyzu/core/common/gl-account-categories/server";
import { CompanyGlAccountCategoriesListPage, CompanyGlAccountCategoryDetailPage } from "@voyzu/core/company-gl-account-categories/server";

export const pageRoutes = {
  list: {
    id: "voyzu.company-gl-account-categories.page.list",
    pageTitle: "Reporting Categories",
    helpPath: "modules-help/company-ledger/reporting-categories",
    path: "/finance/settings/reporting-categories",
    Page: CompanyGlAccountCategoriesListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "General Ledger" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-gl-account-categories.page.detail",
    pageTitle: "Reporting Category",
    helpPath: "modules-help/company-ledger/reporting-categories",
    path: "/finance/settings/reporting-categories/[code]",
    Page: CompanyGlAccountCategoryDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "General Ledger" },
      { label: "Reporting Categories", href: "/finance/settings/reporting-categories" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
