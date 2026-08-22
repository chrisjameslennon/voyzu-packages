import { handleActivate as handleGlAccountCategoriesActivate, handleBatchActivate as handleGlAccountCategoriesBatchActivate, handleBatchCreate as handleGlAccountCategoriesBatchCreate, handleBatchDeactivate as handleGlAccountCategoriesBatchDeactivate, handleBatchDelete as handleGlAccountCategoriesBatchDelete, handleBatchGet as handleGlAccountCategoriesBatchGet, handleBatchPatch as handleGlAccountCategoriesBatchPatch, handleBatchUpdate as handleGlAccountCategoriesBatchUpdate, handleCreate as handleGlAccountCategoriesCreate, handleDeactivate as handleGlAccountCategoriesDeactivate, handleDelete as handleGlAccountCategoriesDelete, handleFilter as handleGlAccountCategoriesFilter, handleGet as handleGlAccountCategoriesGet, handleList as handleGlAccountCategoriesList, handlePatch as handleGlAccountCategoriesPatch, handleSearch as handleGlAccountCategoriesSearch, handleUpdate as handleGlAccountCategoriesUpdate } from "@voyzu/core/common/gl-account-categories/server";
import { OrganizationGlAccountCategoriesListPage, OrganizationGlAccountCategoryDetailPage } from "@voyzu/core/organization-gl-account-categories/server";

export const pageRoutes = {
  list: {
    id: "voyzu.organization-gl-account-categories.page.list",
    pageTitle: "Reporting Categories",
    helpPath: "modules-help/organization-financial-settings/reporting-categories",
    path: "/finance/chart-of-accounts/reporting-categories",
    Page: OrganizationGlAccountCategoriesListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "General Ledger",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  },
  detail: {
    id: "voyzu.organization-gl-account-categories.page.detail",
    pageTitle: "Reporting Category",
    helpPath: "modules-help/organization-financial-settings/reporting-categories",
    path: "/finance/chart-of-accounts/reporting-categories/[code]",
    Page: OrganizationGlAccountCategoryDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "General Ledger",
      },
      {
        label: "Reporting Categories",
        href: "/finance/chart-of-accounts/reporting-categories",
      },
    ],
    auth: { required: true, minRole: "STANDARD" }
  }
} as const;
