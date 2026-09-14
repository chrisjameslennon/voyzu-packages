const queryParams = { rangePreset: { type: "string" }, fromDate: { type: "string" }, toDate: { type: "string" }, showInactive: { type: "boolean" }, showCustomFields: { type: "boolean" } } as const;
const auth = { required: true, minRole: "STANDARD" } as const;
type PageName =
  | "ItemsReportPage"
  | "ItemCategoriesReportPage"
  | "StockOnHandReportPage"
  | "StockAvailabilityReportPage"
  | "StockActivityReportPage"
  | "StockReservationActivityReportPage"
  | "StockIssuancesReportPage"
  | "StockReceiptsReportPage"
  | "StockTransfersReportPage"
  | "StocktakeVarianceReportPage"
  | "QuantityAdjustmentsReportPage"
  | "FinancialActivityReportPage";
const load = (name: PageName) => () =>
  import("./server/pages/InventoryReportPages").then((m) => m[name]);
const report = (
  path: string,
  title: string,
  name: PageName,
  group: "Items" | "Stock",
) => ({
  queryParams,
  httpApiDocumentationGroupId: "inventory.reports",
  path: `/inventory/reports/${path}`,
  loadPage: load(name),
  pageTitle: title,
  breadcrumbBase: [{ label: "Reports" }, { label: group }],
  auth,
});
const printable = (
  path: string,
  title: string,
  name: PageName,
) => ({
  queryParams,
  httpApiDocumentationGroupId: "inventory.reports",
  path: `/inventory/reports/${path}/printable`,
  loadPage: load(name),
  pageTitle: title,
  unframed: true,
  auth,
});
export const pageRoutes = {
  "voyzu.inventory.reports.items": report("items", "Items", "ItemsReportPage", "Items"),
  "voyzu.inventory.reports.items.printable": printable("items", "Items", "ItemsReportPage"),
  "voyzu.inventory.reports.item-categories": report(
    "item-categories",
    "Item Categories",
    "ItemCategoriesReportPage",
    "Items",
  ),
  "voyzu.inventory.reports.item-categories.printable": printable(
    "item-categories",
    "Item Categories",
    "ItemCategoriesReportPage",
  ),
  "voyzu.inventory.reports.stock-on-hand": report(
    "stock-on-hand",
    "Stock on Hand",
    "StockOnHandReportPage",
    "Stock",
  ),
  "voyzu.inventory.reports.stock-on-hand.printable": printable(
    "stock-on-hand",
    "Stock on Hand",
    "StockOnHandReportPage",
  ),
  "voyzu.inventory.reports.stock-availability": report(
    "stock-availability",
    "Stock Availability",
    "StockAvailabilityReportPage",
    "Stock",
  ),
  "voyzu.inventory.reports.stock-availability.printable": printable(
    "stock-availability",
    "Stock Availability",
    "StockAvailabilityReportPage",
  ),
  "voyzu.inventory.reports.stock-activity": report(
    "stock-activity",
    "Stock Activity",
    "StockActivityReportPage",
    "Stock",
  ),
  "voyzu.inventory.reports.stock-activity.printable": printable(
    "stock-activity",
    "Stock Activity",
    "StockActivityReportPage",
  ),
  "voyzu.inventory.reports.stock-issuances": report(
    "stock-issuances",
    "Stock Issuances",
    "StockIssuancesReportPage",
    "Stock",
  ),
  "voyzu.inventory.reports.stock-issuances.printable": printable(
    "stock-issuances",
    "Stock Issuances",
    "StockIssuancesReportPage",
  ),
  "voyzu.inventory.reports.stock-receipts": report(
    "stock-receipts",
    "Stock Receipts",
    "StockReceiptsReportPage",
    "Stock",
  ),
  "voyzu.inventory.reports.stock-receipts.printable": printable(
    "stock-receipts",
    "Stock Receipts",
    "StockReceiptsReportPage",
  ),
  "voyzu.inventory.reports.stock-transfers": report(
    "stock-transfers",
    "Stock Transfers",
    "StockTransfersReportPage",
    "Stock",
  ),
  "voyzu.inventory.reports.stock-transfers.printable": printable(
    "stock-transfers",
    "Stock Transfers",
    "StockTransfersReportPage",
  ),
  "voyzu.inventory.reports.stock-reservation-activity": report(
    "stock-reservation-activity",
    "Stock Reservation Activity",
    "StockReservationActivityReportPage",
    "Stock",
  ),
  "voyzu.inventory.reports.stock-reservation-activity.printable": printable(
    "stock-reservation-activity",
    "Stock Reservation Activity",
    "StockReservationActivityReportPage",
  ),
  "voyzu.inventory.reports.stocktake-variance": report(
    "stocktake-variance",
    "Stocktake Variance",
    "StocktakeVarianceReportPage",
    "Stock",
  ),
  "voyzu.inventory.reports.stocktake-variance.printable": printable(
    "stocktake-variance",
    "Stocktake Variance",
    "StocktakeVarianceReportPage",
  ),
  "voyzu.inventory.reports.quantity-adjustments": report(
    "quantity-adjustments",
    "Quantity Adjustments",
    "QuantityAdjustmentsReportPage",
    "Stock",
  ),
  "voyzu.inventory.reports.quantity-adjustments.printable": printable(
    "quantity-adjustments",
    "Quantity Adjustments",
    "QuantityAdjustmentsReportPage",
  ),
  "voyzu.inventory.reports.financial-activity": report(
    "financial-activity",
    "Financial Activity",
    "FinancialActivityReportPage",
    "Stock",
  ),
  "voyzu.inventory.reports.financial-activity.printable": printable(
    "financial-activity",
    "Financial Activity",
    "FinancialActivityReportPage",
  ),
} as const;
