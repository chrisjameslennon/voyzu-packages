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
  id: string,
  path: string,
  title: string,
  name: PageName,
  group: "Items" | "Stock",
) => ({
  id: `voyzu.inventory.reports.${id}`,
  path: `/inventory/reports/${path}`,
  loadPage: load(name),
  pageTitle: title,
  breadcrumbBase: [{ label: "Reports" }, { label: group }],
  auth,
});
const printable = (
  id: string,
  path: string,
  title: string,
  name: PageName,
) => ({
  id: `voyzu.inventory.reports.${id}.printable`,
  path: `/inventory/reports/${path}/printable`,
  loadPage: load(name),
  pageTitle: title,
  unframed: true,
  auth,
});
export const pageRoutes = {
  items: report("items", "items", "Items", "ItemsReportPage", "Items"),
  itemsPrintable: printable("items", "items", "Items", "ItemsReportPage"),
  categories: report(
    "item-categories",
    "item-categories",
    "Item Categories",
    "ItemCategoriesReportPage",
    "Items",
  ),
  categoriesPrintable: printable(
    "item-categories",
    "item-categories",
    "Item Categories",
    "ItemCategoriesReportPage",
  ),
  onHand: report(
    "stock-on-hand",
    "stock-on-hand",
    "Stock on Hand",
    "StockOnHandReportPage",
    "Stock",
  ),
  onHandPrintable: printable(
    "stock-on-hand",
    "stock-on-hand",
    "Stock on Hand",
    "StockOnHandReportPage",
  ),
  availability: report(
    "stock-availability",
    "stock-availability",
    "Stock Availability",
    "StockAvailabilityReportPage",
    "Stock",
  ),
  availabilityPrintable: printable(
    "stock-availability",
    "stock-availability",
    "Stock Availability",
    "StockAvailabilityReportPage",
  ),
  activity: report(
    "stock-activity",
    "stock-activity",
    "Stock Activity",
    "StockActivityReportPage",
    "Stock",
  ),
  activityPrintable: printable(
    "stock-activity",
    "stock-activity",
    "Stock Activity",
    "StockActivityReportPage",
  ),
  issuances: report(
    "stock-issuances",
    "stock-issuances",
    "Stock Issuances",
    "StockIssuancesReportPage",
    "Stock",
  ),
  issuancesPrintable: printable(
    "stock-issuances",
    "stock-issuances",
    "Stock Issuances",
    "StockIssuancesReportPage",
  ),
  receipts: report(
    "stock-receipts",
    "stock-receipts",
    "Stock Receipts",
    "StockReceiptsReportPage",
    "Stock",
  ),
  receiptsPrintable: printable(
    "stock-receipts",
    "stock-receipts",
    "Stock Receipts",
    "StockReceiptsReportPage",
  ),
  transfers: report(
    "stock-transfers",
    "stock-transfers",
    "Stock Transfers",
    "StockTransfersReportPage",
    "Stock",
  ),
  transfersPrintable: printable(
    "stock-transfers",
    "stock-transfers",
    "Stock Transfers",
    "StockTransfersReportPage",
  ),
  reservationActivity: report(
    "stock-reservation-activity",
    "stock-reservation-activity",
    "Stock Reservation Activity",
    "StockReservationActivityReportPage",
    "Stock",
  ),
  reservationActivityPrintable: printable(
    "stock-reservation-activity",
    "stock-reservation-activity",
    "Stock Reservation Activity",
    "StockReservationActivityReportPage",
  ),
  variance: report(
    "stocktake-variance",
    "stocktake-variance",
    "Stocktake Variance",
    "StocktakeVarianceReportPage",
    "Stock",
  ),
  variancePrintable: printable(
    "stocktake-variance",
    "stocktake-variance",
    "Stocktake Variance",
    "StocktakeVarianceReportPage",
  ),
  adjustments: report(
    "quantity-adjustments",
    "quantity-adjustments",
    "Quantity Adjustments",
    "QuantityAdjustmentsReportPage",
    "Stock",
  ),
  adjustmentsPrintable: printable(
    "quantity-adjustments",
    "quantity-adjustments",
    "Quantity Adjustments",
    "QuantityAdjustmentsReportPage",
  ),
  financialActivity: report(
    "financial-activity",
    "financial-activity",
    "Financial Activity",
    "FinancialActivityReportPage",
    "Stock",
  ),
  financialActivityPrintable: printable(
    "financial-activity",
    "financial-activity",
    "Financial Activity",
    "FinancialActivityReportPage",
  ),
} as const;
