import "server-only";
import { IntegrationUnavailablePage } from "../../../common/server/IntegrationUnavailablePage";
// TODO(contracts, retrieval): restore Finance -> Inventory listInventoryFinancialActivity.
export async function InventoryTransactionsListPage() {
  return <IntegrationUnavailablePage pageTitle="Inventory Transactions" packageName="Inventory" message="Inventory integration is awaiting migration to contracts." icon="inventory_2" />;
}
