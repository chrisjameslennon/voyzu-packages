import "server-only";
import { InventoryReportView } from "../../client";
import type { InventoryReportKey } from "../../types/report.types";
import { getSelectedOrganization } from "../../../common/server/organization-context";
import { getInventoryReport } from "../lib/report.service";
async function page(
  key: InventoryReportKey,
  {
    surface,
  }: {
    surface?: {
      unframed?: boolean;
      searchParams?: Record<string, string>;
    };
  } = {},
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
      initialShowInactive={surface?.searchParams?.showInactive === "true"}
      initialShowCustomFields={
        surface?.searchParams?.showCustomFields === undefined
          ? true
          : surface.searchParams.showCustomFields === "true"
      }
    />
  );
}
type ReportPageProps = {
  surface?: {
    unframed?: boolean;
    searchParams?: Record<string, string>;
  };
};
export const ItemsReportPage = (p?: ReportPageProps) =>
  page("items", p);
export const ItemCategoriesReportPage = (p?: ReportPageProps) => page("item-categories", p);
export const StockOnHandReportPage = (p?: ReportPageProps) => page("stock-on-hand", p);
export const StockAvailabilityReportPage = (p?: ReportPageProps) => page("stock-availability", p);
export const StockActivityReportPage = (p?: ReportPageProps) => page("stock-activity", p);
export const StockReservationActivityReportPage = (p?: ReportPageProps) => page("stock-reservation-activity", p);
export const StockTransfersReportPage = (p?: ReportPageProps) => page("stock-transfers", p);
export const StocktakeVarianceReportPage = (p?: ReportPageProps) => page("stocktake-variance", p);
export const QuantityAdjustmentsReportPage = (p?: ReportPageProps) => page("quantity-adjustments", p);
