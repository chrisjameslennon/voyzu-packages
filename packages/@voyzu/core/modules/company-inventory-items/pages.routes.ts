import { companyFinancePageAuth } from "@voyzu/core/common/server";
import { handleActivate as handleActivateInventoryItem, handleBatchActivate as handleBatchActivateInventoryItems, handleBatchCreate as handleBatchCreateInventoryItems, handleBatchDeactivate as handleBatchDeactivateInventoryItems, handleBatchDelete as handleBatchDeleteInventoryItems, handleBatchGet as handleBatchGetInventoryItems, handleBatchPatch as handleBatchPatchInventoryItems, handleBatchUpdate as handleBatchUpdateInventoryItems, handleCreate as handleCreateInventoryItem, handleDeactivate as handleDeactivateInventoryItem, handleDelete as handleDeleteInventoryItem, handleFilter as handleFilterInventoryItems, handleGet as handleGetInventoryItem, handleList as handleListInventoryItems, handlePatch as handlePatchInventoryItem, handleSearch as handleSearchInventoryItems, handleUpdate as handleUpdateInventoryItem } from "@voyzu/core/common/inventory-items/server";
import { InventoryItemsListPage, InventoryItemDetailPage } from "@voyzu/core/company-inventory-items/server";

export const pageRoutes = {
  list: {
    id: "voyzu.company-inventory-items.page.list",
    pageTitle: "Items",
    helpPath: "modules-help/company-ledger/inventory-items",
    path: "/finance/inventory/items",
    Page: InventoryItemsListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Inventory" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.company-inventory-items.page.detail",
    pageTitle: "Item",
    helpPath: "modules-help/company-ledger/inventory-items",
    path: "/finance/inventory/items/[code]",
    Page: InventoryItemDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Inventory" },
      { label: "Items", href: "/finance/inventory/items" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
