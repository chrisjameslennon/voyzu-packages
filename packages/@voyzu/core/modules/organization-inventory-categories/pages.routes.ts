import { handleActivate as handleInventoryCategoriesActivate, handleBatchActivate as handleInventoryCategoriesBatchActivate, handleBatchCreate as handleInventoryCategoriesBatchCreate, handleBatchDeactivate as handleInventoryCategoriesBatchDeactivate, handleBatchDelete as handleInventoryCategoriesBatchDelete, handleBatchGet as handleInventoryCategoriesBatchGet, handleBatchPatch as handleInventoryCategoriesBatchPatch, handleBatchUpdate as handleInventoryCategoriesBatchUpdate, handleCreate as handleInventoryCategoriesCreate, handleDeactivate as handleInventoryCategoriesDeactivate, handleDelete as handleInventoryCategoriesDelete, handleFilter as handleInventoryCategoriesFilter, handleGet as handleInventoryCategoriesGet, handleList as handleInventoryCategoriesList, handlePatch as handleInventoryCategoriesPatch, handleSearch as handleInventoryCategoriesSearch, handleUpdate as handleInventoryCategoriesUpdate } from "@voyzu/core/common/inventory-categories/server";
import { OrganizationInventoryCategoriesListPage, OrganizationInventoryCategoryDetailPage } from "@voyzu/core/organization-inventory-categories/server";

export const pageRoutes = {
  list: {
    id: "voyzu.organization-inventory-categories.page.list",
    pageTitle: "Inventory Categories",
    helpPath: "modules-help/organization-financial-settings/inventory-categories",
    path: "/organization/inventory/categories",
    Page: OrganizationInventoryCategoriesListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "New Company Defaults",
      },
      {
        label: "Inventory",
      },
    ],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  detail: {
    id: "voyzu.organization-inventory-categories.page.detail",
    pageTitle: "Inventory Category",
    helpPath: "modules-help/organization-financial-settings/inventory-categories",
    path: "/organization/inventory/categories/[code]",
    Page: OrganizationInventoryCategoryDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "New Company Defaults",
      },
      {
        label: "Inventory",
      },
      {
        label: "Categories",
        href: "/organization/inventory/categories",
      },
    ],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  }
} as const;
