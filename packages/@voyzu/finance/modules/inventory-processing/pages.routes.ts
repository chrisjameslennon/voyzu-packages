import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  rules: {
    id: "voyzu.inventory-processing.page.rules",
    pageTitle: "Movement Processing Rules",
    path: "/finance/integration/inventory-processing/rules",
    loadPage: () => import("./server/pages/InventoryProcessingRulesPage").then((module) => module.InventoryProcessingRulesPage),
    breadcrumbBase: [{ label: "Finance" }, { label: "Integration" }, { label: "Inventory" }],
    auth: companyFinancePageAuth,
  },
  ruleDetail: {
    id: "voyzu.inventory-processing.page.rule-detail",
    pageTitle: "Inventory Processing Rule",
    path: "/finance/integration/inventory-processing/rules/[id]",
    loadPage: () => import("./server/pages/InventoryProcessingRuleDetailPage").then((module) => module.InventoryProcessingRuleDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Integration" },
      { label: "Inventory" },
      { label: "Movement Processing Rules", href: "/finance/integration/inventory-processing/rules" },
    ],
    auth: companyFinancePageAuth,
  },
  inventoryTransactions: {
    id: "voyzu.inventory-processing.page.inventory-transactions",
    pageTitle: "Inventory Transactions",
    path: "/finance/integration/inventory-processing/inventory-transactions",
    loadPage: () => import("./server/pages/InventoryTransactionsListPage").then((module) => module.InventoryTransactionsListPage),
    breadcrumbBase: [{ label: "Finance" }, { label: "Integration" }, { label: "Inventory" }],
    auth: companyFinancePageAuth,
  },
  inventoryTransactionDetail: {
    id: "voyzu.inventory-processing.page.inventory-transaction-detail",
    pageTitle: "Inventory Transaction",
    path: "/finance/integration/inventory-processing/inventory-transactions/[id]",
    loadPage: () => import("./server/pages/InventoryTransactionDetailPage").then((module) => module.InventoryTransactionDetailPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Integration" },
      { label: "Inventory" },
      { label: "Inventory Transactions", href: "/finance/integration/inventory-processing/inventory-transactions" },
    ],
    auth: companyFinancePageAuth,
  },
} as const;
