import { companyFinancePageAuth } from "@voyzu/core/common/server";
import { handleActivate as handleActivateDimension, handleBatchActivate as handleBatchActivateDimensions, handleBatchCreate as handleBatchCreateDimensions, handleBatchDeactivate as handleBatchDeactivateDimensions, handleBatchDelete as handleBatchDeleteDimensions, handleBatchGet as handleBatchGetDimensions, handleBatchPatch as handleBatchPatchDimensions, handleBatchUpdate as handleBatchUpdateDimensions, handleCreate as handleCreateDimension, handleCreateValue as handleCreateDimensionValue, handleDeactivate as handleDeactivateDimension, handleDelete as handleDeleteDimension, handleDeleteValue as handleDeleteDimensionValue, handleFilter as handleFilterDimensions, handleGet as handleGetDimension, handleList as handleListDimensions, handleListValues as handleListDimensionValues, handlePatch as handlePatchDimension, handlePatchValue as handlePatchDimensionValue, handleSearch as handleSearchDimensions, handleUpdate as handleUpdateDimension } from "@voyzu/core/common/dimensions/server";
import { CompanyDimensionsListPage, CompanyDimensionDetailPage } from "@voyzu/core/company-dimensions/server";

export const pageRoutes = {
  list: {
    id: "voyzu.company-dimensions.page.list",
    pageTitle: "Dimensions",
    helpPath: "modules-help/company-ledger/dimensions",
    path: "/finance/settings/dimensions",
    Page: CompanyDimensionsListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-dimensions.page.detail",
    pageTitle: "Dimension",
    helpPath: "modules-help/company-ledger/dimensions",
    path: "/finance/settings/dimensions/[code]",
    Page: CompanyDimensionDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Settings" },
      { label: "Dimensions", href: "/finance/settings/dimensions" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
