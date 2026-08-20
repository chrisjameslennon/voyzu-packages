import { handleActivate as handleActivateInventoryCategory, handleBatchActivate as handleBatchActivateInventoryCategories, handleBatchCreate as handleBatchCreateInventoryCategories, handleBatchDeactivate as handleBatchDeactivateInventoryCategories, handleBatchDelete as handleBatchDeleteInventoryCategories, handleBatchGet as handleBatchGetInventoryCategories, handleBatchPatch as handleBatchPatchInventoryCategories, handleBatchUpdate as handleBatchUpdateInventoryCategories, handleCreate as handleCreateInventoryCategory, handleDeactivate as handleDeactivateInventoryCategory, handleDelete as handleDeleteInventoryCategory, handleFilter as handleFilterInventoryCategories, handleGet as handleGetInventoryCategory, handleList as handleListInventoryCategories, handlePatch as handlePatchInventoryCategory, handleSearch as handleSearchInventoryCategories, handleUpdate as handleUpdateInventoryCategory } from "@voyzu/core/common/inventory-categories/server";
import { CompanyInventoryCategoriesListPage, CompanyInventoryCategoryDetailPage } from "@voyzu/core/company-inventory-categories/server";

export const pageRoutes = {
  list: {
    id: "voyzu.company-inventory-categories.page.list",
    pageTitle: "Inventory Categories",
    helpPath: "modules-help/company-ledger/inventory-categories",
    path: "/finance/inventory/categories",
    Page: CompanyInventoryCategoriesListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Inventory" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  },
  detail: {
    id: "voyzu.company-inventory-categories.page.detail",
    pageTitle: "Inventory Category",
    helpPath: "modules-help/company-ledger/inventory-categories",
    path: "/finance/inventory/categories/[code]",
    Page: CompanyInventoryCategoryDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Inventory" },
      { label: "Categories", href: "/finance/inventory/categories" },
    ],
    auth: { required: true, minRole: "COMPANY_USER" }
  }
} as const;
