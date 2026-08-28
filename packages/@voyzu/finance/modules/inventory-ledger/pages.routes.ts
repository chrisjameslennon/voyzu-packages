import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  list: {
    id: "voyzu.inventory-ledger.page.list",
    pageTitle: "Inventory Ledger Entries",
    helpPath: "modules-help/company-ledger/inventory-ledger-entries",
    path: "/finance/inventory/ledger",
    loadPage: () => import("./server/pages/InventoryLedgerEntriesListPage").then((module) => module.InventoryLedgerEntriesListPage),
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
    loadPage: () => import("./server/pages/InventoryLedgerEntryDetailPage").then((module) => module.InventoryLedgerEntryDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Inventory" },
      { label: "Inventory Ledger Entries", href: "/finance/inventory/ledger" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
