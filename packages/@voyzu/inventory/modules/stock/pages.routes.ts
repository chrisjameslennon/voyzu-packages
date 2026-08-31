const load =
  (
    name:
      | "StockPage"
      | "StockActivityPage"
      | "StockTransactionDetailPage"
      | "StockCountsPage"
      | "StockCountNewPage"
      | "StockCountDetailPage"
      | "ReceiveStockPage"
      | "IssueStockPage"
      | "TransferStockPage"
      | "ReserveStockPage"
      | "AdjustStockPage",
  ) =>
  () =>
    import("./server/pages/StockPages").then((m) => m[name]);
const auth = { required: true, minRole: "STANDARD" } as const;
const stockCrumbs = [
  { label: "Inventory" },
  { label: "Stock", href: "/inventory/stock" },
] as const;
export const pageRoutes = {
  stock: {
    id: "voyzu.inventory.stock.page.list",
    path: "/inventory/stock",
    loadPage: load("StockPage"),
    pageTitle: "Stock",
    breadcrumbBase: [{ label: "Inventory" }],
    auth,
  },
  activity: {
    id: "voyzu.inventory.stock-activity.page.list",
    path: "/inventory/stock-activity",
    loadPage: load("StockActivityPage"),
    pageTitle: "Stock Activity",
    breadcrumbBase: [{ label: "Inventory" }],
    auth,
  },
  activityDetail: {
    id: "voyzu.inventory.stock-activity.page.detail",
    path: "/inventory/stock-activity/[code]",
    loadPage: load("StockTransactionDetailPage"),
    pageTitle: "Stock Activity",
    breadcrumbBase: [
      { label: "Inventory" },
      { label: "Stock Activity", href: "/inventory/stock-activity" },
    ],
    auth,
  },
  counts: {
    id: "voyzu.inventory.stock-counts.page.list",
    path: "/inventory/stock-counts",
    loadPage: load("StockCountsPage"),
    pageTitle: "Stock Counts",
    breadcrumbBase: [{ label: "Inventory" }],
    auth,
  },
  countNew: {
    id: "voyzu.inventory.stock-counts.page.new",
    path: "/inventory/stock-counts/new",
    loadPage: load("StockCountNewPage"),
    pageTitle: "New Stocktake",
    breadcrumbBase: [
      { label: "Inventory" },
      { label: "Stock Counts", href: "/inventory/stock-counts" },
    ],
    auth,
  },
  count: {
    id: "voyzu.inventory.stock-counts.page.detail",
    path: "/inventory/stock-counts/[id]",
    loadPage: load("StockCountDetailPage"),
    pageTitle: "Stocktake",
    breadcrumbBase: [
      { label: "Inventory" },
      { label: "Stock Counts", href: "/inventory/stock-counts" },
    ],
    auth,
  },
  receive: {
    id: "voyzu.inventory.stock.page.receive",
    path: "/inventory/stock/receive",
    loadPage: load("ReceiveStockPage"),
    pageTitle: "Receive Stock",
    breadcrumbBase: stockCrumbs,
    auth,
  },
  issue: {
    id: "voyzu.inventory.stock.page.issue",
    path: "/inventory/stock/issue",
    loadPage: load("IssueStockPage"),
    pageTitle: "Issue Stock",
    breadcrumbBase: stockCrumbs,
    auth,
  },
  transfer: {
    id: "voyzu.inventory.stock.page.transfer",
    path: "/inventory/stock/transfer",
    loadPage: load("TransferStockPage"),
    pageTitle: "Transfer Stock",
    breadcrumbBase: stockCrumbs,
    auth,
  },
  reserve: {
    id: "voyzu.inventory.stock.page.reserve",
    path: "/inventory/stock/reserve",
    loadPage: load("ReserveStockPage"),
    pageTitle: "Reserve Stock",
    breadcrumbBase: stockCrumbs,
    auth,
  },
  adjust: {
    id: "voyzu.inventory.stock.page.adjust",
    path: "/inventory/stock/adjust",
    loadPage: load("AdjustStockPage"),
    pageTitle: "Adjust Quantity",
    breadcrumbBase: stockCrumbs,
    auth,
  },
} as const;
