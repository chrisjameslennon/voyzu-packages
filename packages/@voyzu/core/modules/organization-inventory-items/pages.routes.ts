import { handleActivate as handleInventoryItemsActivate, handleBatchActivate as handleInventoryItemsBatchActivate, handleBatchCreate as handleInventoryItemsBatchCreate, handleBatchDeactivate as handleInventoryItemsBatchDeactivate, handleBatchDelete as handleInventoryItemsBatchDelete, handleBatchGet as handleInventoryItemsBatchGet, handleBatchPatch as handleInventoryItemsBatchPatch, handleBatchUpdate as handleInventoryItemsBatchUpdate, handleCreate as handleInventoryItemsCreate, handleDeactivate as handleInventoryItemsDeactivate, handleDelete as handleInventoryItemsDelete, handleFilter as handleInventoryItemsFilter, handleGet as handleInventoryItemsGet, handleList as handleInventoryItemsList, handlePatch as handleInventoryItemsPatch, handleSearch as handleInventoryItemsSearch, handleUpdate as handleInventoryItemsUpdate } from "@voyzu/core/common/inventory-items/server";
import { OrganizationInventoryItemsListPage, OrganizationInventoryItemDetailPage } from "@voyzu/core/organization-inventory-items/server";

export const pageRoutes = {
  list: {
    id: "voyzu.organization-inventory-items.page.list",
    pageTitle: "Inventory Items",
    helpPath: "modules-help/organization-financial-settings/inventory-items",
    path: "/organization/inventory/items",
    Page: OrganizationInventoryItemsListPage,
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
    id: "voyzu.organization-inventory-items.page.detail",
    pageTitle: "Inventory Item",
    helpPath: "modules-help/organization-financial-settings/inventory-items",
    path: "/organization/inventory/items/[code]",
    Page: OrganizationInventoryItemDetailPage,
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
        label: "Items",
      },
    ],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  }
} as const;
