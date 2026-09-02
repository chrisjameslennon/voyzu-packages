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

export async function FinancialActivityListPage() {
  const organization = await getSelectedOrganization();
  return (
    <FinancialActivityListView
      rows={organization ? await listFinancialActivity(organization.id) : []}
    />
  );
}

export async function FinancialActivityDetailPage({ id }: { id?: string }) {
  const organization = await getSelectedOrganization();
  if (!organization || !id) notFound();
  const record = await getFinancialActivity(organization.id, Number(id));
  if (!record) notFound();
  return <FinancialActivityDetailView record={record} />;
}
