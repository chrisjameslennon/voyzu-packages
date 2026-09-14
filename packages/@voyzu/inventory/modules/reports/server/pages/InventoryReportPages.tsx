import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";
import { InventoryReportView } from "../../client";
import type { InventoryReportKey } from "../../types/report.types";
import { getSelectedOrganization } from "../../../common/server/organization-context";
import { getInventoryReport } from "../lib/report.service";

const toIso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

async function page(
  key: InventoryReportKey,
  { context }: PageProps,
) {
  const query = pageStringParameters(context.queryParams);
  const organization = await getSelectedOrganization();
  const generatedAt = new Date().toISOString();
  const today = new Date();
  const defaultToDate = toIso(today);
  const defaultFromDate = toIso(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 90),
  );
  const initialRangePreset =
    query.rangePreset ??
    (query.fromDate || query.toDate
      ? "custom"
      : "previous-90-days");
  const report = organization
    ? await getInventoryReport(organization.id, key)
    : { title: key, headers: [], rows: [] };
  return (
    <InventoryReportView
      report={report}
      reportKey={key}
      generatedAt={generatedAt}
      printable={context.routeDefinition.unframed === true}
      initialShowInactive={context.queryParams.showInactive === true}
      initialShowCustomFields={
        context.queryParams.showCustomFields === undefined
          ? true
          : context.queryParams.showCustomFields === true
      }
      initialRangePreset={initialRangePreset}
      initialFromDate={
        query.fromDate ??
        (initialRangePreset === "all-dates" ? "" : defaultFromDate)
      }
      initialToDate={
        query.toDate ??
        (initialRangePreset === "all-dates" ? "" : defaultToDate)
      }
    />
  );
}
type ReportPageProps = PageProps;
export const ItemsReportPage = (p: ReportPageProps) =>
  page("items", p);
export const ItemCategoriesReportPage = (p: ReportPageProps) => page("item-categories", p);
export const StockOnHandReportPage = (p: ReportPageProps) => page("stock-on-hand", p);
export const StockAvailabilityReportPage = (p: ReportPageProps) => page("stock-availability", p);
export const StockActivityReportPage = (p: ReportPageProps) => page("stock-activity", p);
export const StockReservationActivityReportPage = (p: ReportPageProps) => page("stock-reservation-activity", p);
export const StockIssuancesReportPage = (p: ReportPageProps) => page("stock-issuances", p);
export const StockReceiptsReportPage = (p: ReportPageProps) => page("stock-receipts", p);
export const StockTransfersReportPage = (p: ReportPageProps) => page("stock-transfers", p);
export const StocktakeVarianceReportPage = (p: ReportPageProps) => page("stocktake-variance", p);
export const QuantityAdjustmentsReportPage = (p: ReportPageProps) => page("quantity-adjustments", p);
export const FinancialActivityReportPage = (p: ReportPageProps) => page("financial-activity", p);
