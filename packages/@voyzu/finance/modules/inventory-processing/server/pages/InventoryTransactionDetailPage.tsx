import "server-only";

import { getSelectedCompany } from "@voyzu/finance/journals/server";
import { notFound } from "next/navigation";

import { InventoryTransactionDetail } from "../../client";
import { getFinanceInventoryActivity } from "../lib/inventory-processing.service";

export async function InventoryTransactionDetailPage({ id }: { id?: string }) {
  const company = await getSelectedCompany();
  if (!company || !id) notFound();
  const activity = await getFinanceInventoryActivity(company.id, Number(id));
  if (!activity) notFound();
  return <InventoryTransactionDetail activity={activity} />;
}
