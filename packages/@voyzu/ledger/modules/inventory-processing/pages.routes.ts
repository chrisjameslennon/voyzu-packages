import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";

export const pageRoutes = {
  "voyzu.inventory-processing.page.rules": {
    httpApiDocumentationGroupId: "ledger.inventory-processing",
    pageTitle: "Movement Processing Rules",
    path: "/ledger/integration/inventory-processing/rules",
    loadPage: () => import("./server/pages/InventoryProcessingRulesPage").then((module) => module.InventoryProcessingRulesPage),
    breadcrumbBase: [{ label: "Ledger" }, { label: "Integration" }, { label: "Inventory" }],
    auth: companyFinancePageAuth,
  },
  "voyzu.inventory-processing.page.rule-detail": {
    pathParams: { id: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.inventory-processing",
    pageTitle: "Inventory Processing Rule",
    path: "/ledger/integration/inventory-processing/rules/[id]",
    loadPage: () => import("./server/pages/InventoryProcessingRuleDetailPage").then((module) => module.InventoryProcessingRuleDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Integration" },
      { label: "Inventory" },
      { label: "Movement Processing Rules", href: "/ledger/integration/inventory-processing/rules" },
    ],
    auth: companyFinancePageAuth,
  },
  "voyzu.inventory-processing.page.inventory-transactions": {
    httpApiDocumentationGroupId: "ledger.inventory-processing",
    pageTitle: "Inventory Transactions",
    path: "/ledger/integration/inventory-processing/inventory-transactions",
    loadPage: () => import("./server/pages/InventoryTransactionsListPage").then((module) => module.InventoryTransactionsListPage),
    breadcrumbBase: [{ label: "Ledger" }, { label: "Integration" }, { label: "Inventory" }],
    auth: companyFinancePageAuth,
  },
  "voyzu.inventory-processing.page.inventory-transaction-detail": {
    pathParams: { id: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.inventory-processing",
    pageTitle: "Inventory Transaction",
    path: "/ledger/integration/inventory-processing/inventory-transactions/[id]",
    loadPage: () => import("./server/pages/InventoryTransactionDetailPage").then((module) => module.InventoryTransactionDetailPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Integration" },
      { label: "Inventory" },
      { label: "Inventory Transactions", href: "/ledger/integration/inventory-processing/inventory-transactions" },
    ],
    auth: companyFinancePageAuth,
  },
  "voyzu.inventory-processing.page.inventory-transaction-detail.printable": {
    pathParams: { id: { type: "string" } },
    httpApiDocumentationGroupId: "ledger.inventory-processing",
    pageTitle: "Inventory Transaction",
    path: "/ledger/integration/inventory-processing/inventory-transactions/[id]/printable",
    loadPage: () => import("./server/pages/InventoryTransactionDetailPage").then((module) => module.InventoryTransactionDetailPage),
    unframed: true,
    auth: companyFinancePageAuth,
  },
} as const;
