import "server-only";

import { command } from "@voyzu/capability/commands";
import { getSelectedCompany } from "@voyzu/finance/journals/server";
import { IntegrationUnavailablePage } from "../../../common/server/IntegrationUnavailablePage";
import { InventoryTransactionsList } from "../../client";
import { listFinanceInventoryActivities } from "../lib/inventory-processing.service";

export async function InventoryTransactionsListPage() {
  if (!command.has("@voyzu/inventory.listInventoryFinancialActivity")) {
    return <IntegrationUnavailablePage pageTitle="Inventory Transactions" packageName="Inventory" message="Install the Inventory package to receive and view financially relevant stock transactions." icon="inventory_2" />;
  }
  const company = await getSelectedCompany();
  return (
    <InventoryTransactionsList
      activities={company ? await listFinanceInventoryActivities(company.id) : []}
      apiPath={company
        ? `/api/finance/${encodeURIComponent(company.code)}/inventory-processing/inventory-transactions`
        : ""}
    />
  );
}
