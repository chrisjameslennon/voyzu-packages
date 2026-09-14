import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";

export const pageRoutes = {
  "voyzu.inventory-ledger.page.valuation": {

    httpApiDocumentationGroupId: "finance.inventory-ledger",
    pageTitle: "Stock Valuation",
    helpPath: "modules-help/company-ledger/inventory-ledger-entries",
    path: "/finance/inventory/valuation",
    loadPage: () => import("./server/pages/InventoryValuationPage").then((module) => module.InventoryValuationPage),
    breadcrumbBase: [{ label: "Finance" }, { label: "Inventory" }],
    auth: companyFinancePageAuth,
  },
  "voyzu.inventory-ledger.page.list": {

    httpApiDocumentationGroupId: "finance.inventory-ledger",
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
  "voyzu.inventory-ledger.page.detail": {
    queryParams: {
      from: { type: "string" },
      fromCode: { type: "string" },
    },
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "finance.inventory-ledger",
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
