import "server-only";

import { command } from "@voyzu/capability/commands";
import { getSelectedCompany } from "@voyzu/finance/journals/server";
import { notFound } from "next/navigation";

import { IntegrationUnavailablePage } from "../../../common/server/IntegrationUnavailablePage";
import { InventoryTransactionDetail } from "../../client";
import { InventoryTransactionReportTemplate } from "../../client/InventoryTransactionReportTemplate";
import type { InventoryTransactionProjection } from "../../client/inventory-transaction-projection.types";
import { getFinanceInventoryActivity } from "../lib/inventory-processing.service";

export async function InventoryTransactionDetailPage({ id, surface }: { id?: string; surface?: { unframed?: boolean } }) {
  if (!command.has("@voyzu/inventory.getInventoryStockActivityDetail")) {
    return <IntegrationUnavailablePage pageTitle="Inventory Transaction" packageName="Inventory" message="Install the Inventory package to view the source stock document." icon="inventory_2" />;
  }
  const company = await getSelectedCompany();
  if (!company || !id) notFound();
  const activity = await getFinanceInventoryActivity(company.id, Number(id));
  if (!activity) notFound();
  const record = await command.callOptional(
    "@voyzu/inventory.getInventoryStockActivityDetail",
    company.organizationId,
    activity.inventoryDocumentCode,
  ) as InventoryTransactionProjection | null | undefined;
  if (!record) notFound();
  if (surface?.unframed) {
    return <InventoryTransactionReportTemplate record={record} organization={company} generatedAt={new Date().toLocaleString(undefined, { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })} />;
  }
  return <InventoryTransactionDetail record={record} organization={company} financeActivityId={activity.id} />;
}
