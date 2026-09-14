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
  "voyzu.inventory.stock.page.list": {

    httpApiDocumentationGroupId: "inventory.stock",
    path: "/inventory/stock",
    loadPage: load("StockPage"),
    pageTitle: "Stock",
    breadcrumbBase: [{ label: "Inventory" }],
    auth,
  },
  "voyzu.inventory.stock-activity.page.list": {

    httpApiDocumentationGroupId: "inventory.stock",
    path: "/inventory/stock-activity",
    loadPage: load("StockActivityPage"),
    pageTitle: "Stock Activity",
    breadcrumbBase: [{ label: "Inventory" }],
    auth,
  },
  "voyzu.inventory.stock-activity.page.detail": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "inventory.stock",
    path: "/inventory/stock-activity/[code]",
    loadPage: load("StockTransactionDetailPage"),
    pageTitle: "Stock Activity",
    breadcrumbBase: [
      { label: "Inventory" },
      { label: "Stock Activity", href: "/inventory/stock-activity" },
    ],
    auth,
  },
  "voyzu.inventory.stock-activity.page.detail.printable": {
    pathParams: { code: { type: "string" } },
    httpApiDocumentationGroupId: "inventory.stock",
    path: "/inventory/stock-activity/[code]/printable",
    loadPage: load("StockTransactionDetailPage"),
    pageTitle: "Stock Activity",
    unframed: true,
    auth,
  },
  "voyzu.inventory.stock-counts.page.list": {

    httpApiDocumentationGroupId: "inventory.stock",
    path: "/inventory/stock-counts",
    loadPage: load("StockCountsPage"),
    pageTitle: "Stock Counts",
    breadcrumbBase: [{ label: "Inventory" }],
    auth,
  },
  "voyzu.inventory.stock-counts.page.new": {

    httpApiDocumentationGroupId: "inventory.stock",
    path: "/inventory/stock-counts/new",
    loadPage: load("StockCountNewPage"),
    pageTitle: "New Stocktake",
    breadcrumbBase: [
      { label: "Inventory" },
      { label: "Stock Counts", href: "/inventory/stock-counts" },
    ],
    auth,
  },
  "voyzu.inventory.stock-counts.page.detail": {
    pathParams: { id: { type: "string" } },
    httpApiDocumentationGroupId: "inventory.stock",
    path: "/inventory/stock-counts/[id]",
    loadPage: load("StockCountDetailPage"),
    pageTitle: "Stocktake",
    breadcrumbBase: [
      { label: "Inventory" },
      { label: "Stock Counts", href: "/inventory/stock-counts" },
    ],
    auth,
  },
  "voyzu.inventory.stock-counts.page.detail.printable": {
    pathParams: { id: { type: "string" } },
    httpApiDocumentationGroupId: "inventory.stock",
    path: "/inventory/stock-counts/[id]/printable",
    loadPage: load("StockCountDetailPage"),
    pageTitle: "Stocktake",
    unframed: true,
    auth,
  },
  "voyzu.inventory.stock.page.receive": {

    httpApiDocumentationGroupId: "inventory.stock",
    path: "/inventory/stock/receive",
    loadPage: load("ReceiveStockPage"),
    pageTitle: "Receive Stock",
    breadcrumbBase: stockCrumbs,
    auth,
  },
  "voyzu.inventory.stock.page.issue": {

    httpApiDocumentationGroupId: "inventory.stock",
    path: "/inventory/stock/issue",
    loadPage: load("IssueStockPage"),
    pageTitle: "Issue Stock",
    breadcrumbBase: stockCrumbs,
    auth,
  },
  "voyzu.inventory.stock.page.transfer": {

    httpApiDocumentationGroupId: "inventory.stock",
    path: "/inventory/stock/transfer",
    loadPage: load("TransferStockPage"),
    pageTitle: "Transfer Stock",
    breadcrumbBase: stockCrumbs,
    auth,
  },
  "voyzu.inventory.stock.page.reserve": {

    httpApiDocumentationGroupId: "inventory.stock",
    path: "/inventory/stock/reserve",
    loadPage: load("ReserveStockPage"),
    pageTitle: "Reserve Stock",
    breadcrumbBase: stockCrumbs,
    auth,
  },
  "voyzu.inventory.stock.page.adjust": {

    httpApiDocumentationGroupId: "inventory.stock",
    path: "/inventory/stock/adjust",
    loadPage: load("AdjustStockPage"),
    pageTitle: "Adjust Quantity",
    breadcrumbBase: stockCrumbs,
    auth,
  },
} as const;
