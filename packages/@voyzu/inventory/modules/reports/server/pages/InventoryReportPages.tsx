import "server-only";
import { InventoryReportView } from "../../client";
import type { InventoryReportKey } from "../../types/report.types";
import { getSelectedOrganization } from "../../../common/server/organization-context";
import { getInventoryReport } from "../lib/report.service";
async function page(
  key: InventoryReportKey,
  { surface }: { surface?: { unframed?: boolean } } = {},
) {
  const organization = await getSelectedOrganization();
  const generatedAt = new Date().toISOString();
  const report = organization
    ? await getInventoryReport(organization.id, key)
    : { title: key, headers: [], rows: [] };
  return (
    <InventoryReportView
      report={report}
      reportKey={key}
      generatedAt={generatedAt}
      printable={surface?.unframed === true}
    />
  );
}
export const ItemsReportPage = (p?: { surface?: { unframed?: boolean } }) =>
  page("items", p);
export const ItemCategoriesReportPage = (p?: {
  surface?: { unframed?: boolean };
}) => page("item-categories", p);
export const StockOnHandReportPage = (p?: {
  surface?: { unframed?: boolean };
}) => page("stock-on-hand", p);
export const StockAvailabilityReportPage = (p?: {
  surface?: { unframed?: boolean };
}) => page("stock-availability", p);
export const StockActivityReportPage = (p?: {
  surface?: { unframed?: boolean };
}) => page("stock-activity", p);
export const StockTransfersReportPage = (p?: {
  surface?: { unframed?: boolean };
}) => page("stock-transfers", p);
export const StockReservationsReportPage = (p?: {
  surface?: { unframed?: boolean };
}) => page("stock-reservations", p);
export const StocktakeVarianceReportPage = (p?: {
  surface?: { unframed?: boolean };
}) => page("stocktake-variance", p);
export const QuantityAdjustmentsReportPage = (p?: {
  surface?: { unframed?: boolean };
}) => page("quantity-adjustments", p);
