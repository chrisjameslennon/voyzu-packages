import "server-only";
import { notFound } from "next/navigation";
import { getSelectedOrganization } from "../../../common/server/organization-context";
import {
  getFinancialActivity,
  listFinancialActivity,
} from "../lib/financial-activity.service";
import {
  FinancialActivityDetailView,
  FinancialActivityListView,
} from "../../client";
import { StockTransactionReportTemplate } from "../../../stock/client";
import { getStockActivityDetail } from "../../../stock/server/lib/stock.service";

export async function FinancialActivityListPage() {
  const organization = await getSelectedOrganization();
  return (
    <FinancialActivityListView
      rows={organization ? await listFinancialActivity(organization.id) : []}
    />
  );
}

export async function FinancialActivityDetailPage({
  id,
  surface,
}: {
  id?: string;
  surface?: { unframed?: boolean };
}) {
  const organization = await getSelectedOrganization();
  if (!organization || !id) notFound();
  const financialActivity = await getFinancialActivity(organization.id, Number(id));
  if (!financialActivity) notFound();
  const record = await getStockActivityDetail(
    organization.id,
    financialActivity.transactionCode,
  );
  if (!record) notFound();
  if (surface?.unframed) {
    return (
      <StockTransactionReportTemplate
        record={record}
        organization={organization}
        generatedAt={new Date().toLocaleString(undefined, {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      />
    );
  }
  return (
    <FinancialActivityDetailView
      record={record}
      organization={organization}
      financialActivityId={financialActivity.id}
    />
  );
}
