import { handleActivate as handleDimensionsActivate, handleBatchActivate as handleDimensionsBatchActivate, handleBatchCreate as handleDimensionsBatchCreate, handleBatchDeactivate as handleDimensionsBatchDeactivate, handleBatchDelete as handleDimensionsBatchDelete, handleBatchGet as handleDimensionsBatchGet, handleBatchPatch as handleDimensionsBatchPatch, handleBatchUpdate as handleDimensionsBatchUpdate, handleCreate as handleDimensionsCreate, handleCreateValue as handleDimensionsCreateValue, handleDeactivate as handleDimensionsDeactivate, handleDelete as handleDimensionsDelete, handleDeleteValue as handleDimensionsDeleteValue, handleFilter as handleDimensionsFilter, handleGet as handleDimensionsGet, handleList as handleDimensionsList, handleListValues as handleDimensionsListValues, handlePatch as handleDimensionsPatch, handlePatchValue as handleDimensionsPatchValue, handleSearch as handleDimensionsSearch, handleUpdate as handleDimensionsUpdate } from "@voyzu/core/common/dimensions/server";
import { OrganizationDimensionsListPage, OrganizationDimensionDetailPage } from "@voyzu/core/organization-dimensions/server";

export const pageRoutes = {
  list: {
    id: "voyzu.organization-dimensions.page.list",
    pageTitle: "Dimensions",
    helpPath: "modules-help/organization-financial-settings/dimensions",
    path: "/organization/dimensions",
    Page: OrganizationDimensionsListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
    ],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  detail: {
    id: "voyzu.organization-dimensions.page.detail",
    pageTitle: "Dimension",
    helpPath: "modules-help/organization-financial-settings/dimensions",
    path: "/organization/dimensions/[code]",
    Page: OrganizationDimensionDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Dimensions",
        href: "/organization/dimensions",
      },
    ],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  }
} as const;
