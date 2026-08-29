const auth = { required: true, minRole: "STANDARD" } as const;
type PageName =
  | "ItemsReportPage"
  | "ItemCategoriesReportPage"
  | "StockOnHandReportPage"
  | "StockAvailabilityReportPage"
  | "StockActivityReportPage"
  | "StockTransfersReportPage"
  | "StockReservationsReportPage"
  | "StocktakeVarianceReportPage"
  | "QuantityAdjustmentsReportPage";
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
  reservations: report(
    "stock-reservations",
    "stock-reservations",
    "Stock Reservations",
    "StockReservationsReportPage",
    "Stock",
  ),
  reservationsPrintable: printable(
    "stock-reservations",
    "stock-reservations",
    "Stock Reservations",
    "StockReservationsReportPage",
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
} as const;
