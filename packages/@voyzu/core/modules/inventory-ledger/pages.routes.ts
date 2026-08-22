import { companyFinancePageAuth } from "@voyzu/core/common/server";
import { handleGetInventoryEntry, handleListInventoryEntries } from "@voyzu/core/inventory-ledger/server";
import { InventoryLedgerEntriesListPage, InventoryLedgerEntryDetailPage } from "@voyzu/core/inventory-ledger/server";

export const pageRoutes = {
  list: {
    id: "voyzu.inventory-ledger.page.list",
    pageTitle: "Inventory Ledger Entries",
    helpPath: "modules-help/company-ledger/inventory-ledger-entries",
    path: "/finance/inventory/ledger",
    Page: InventoryLedgerEntriesListPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Inventory" },
    ],
    auth: companyFinancePageAuth
  },
  detail: {
    id: "voyzu.inventory-ledger.page.detail",
    pageTitle: "Inventory Ledger Entry",
    helpPath: "modules-help/company-ledger/inventory-ledger-entries",
    path: "/finance/inventory/ledger/[code]",
    Page: InventoryLedgerEntryDetailPage,
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Inventory" },
      { label: "Inventory Ledger Entries", href: "/finance/inventory/ledger" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
