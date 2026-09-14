import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";

export const pageRoutes = {
  "voyzu.inventory-ledger.page.valuation": {

    httpApiDocumentationGroupId: "ledger.inventory-ledger",
    pageTitle: "Stock Valuation",
    helpPath: "modules-help/company-ledger/inventory-ledger-entries",
    path: "/ledger/inventory/valuation",
    loadPage: () => import("./server/pages/InventoryValuationPage").then((module) => module.InventoryValuationPage),
    breadcrumbBase: [{ label: "Ledger" }, { label: "Inventory" }],
    auth: companyFinancePageAuth,
  },
  "voyzu.inventory-ledger.page.list": {

    httpApiDocumentationGroupId: "ledger.inventory-ledger",
    pageTitle: "Inventory Ledger Entries",
    helpPath: "modules-help/company-ledger/inventory-ledger-entries",
    path: "/ledger/inventory/ledger",
    loadPage: () => import("./server/pages/InventoryLedgerEntriesListPage").then((module) => module.InventoryLedgerEntriesListPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Inventory" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.inventory-ledger.page.detail": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.inventory-ledger",
    pageTitle: "Inventory Ledger Entry",
    helpPath: "modules-help/company-ledger/inventory-ledger-entries",
    path: "/ledger/inventory/ledger/[code]",
    loadPage: () => import("./server/pages/InventoryLedgerEntryDetailPage").then((module) => module.InventoryLedgerEntryDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Inventory" },
      { label: "Inventory Ledger Entries", href: "/ledger/inventory/ledger" },
    ],
    auth: companyFinancePageAuth
  }
} as const;
