import "server-only";

import { internalApi } from "@voyzu/capability/internal-api";
import { getSelectedCompany } from "../../../journals/server/index";
import { IntegrationUnavailablePage } from "../../../common/server/IntegrationUnavailablePage";
import { InventoryTransactionsList } from "../../client/index";
import { listFinanceInventoryActivities } from "../lib/inventory-processing.service";

export async function InventoryTransactionsListPage() {
  if (!internalApi.has("@erp/stock-activity")) {
    return <IntegrationUnavailablePage pageTitle="Inventory Transactions" packageName="Inventory" message="Install the Inventory package to receive and view financially relevant stock transactions." icon="inventory_2" />;
  }
  const company = await getSelectedCompany();
  return (
    <InventoryTransactionsList
      activities={company ? await listFinanceInventoryActivities(company.id) : []}
      httpApiPath={company
        ? `/api/finance/${encodeURIComponent(company.code)}/inventory-processing/inventory-transactions`
        : ""}
    />
  );
}
