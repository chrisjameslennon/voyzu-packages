import "server-only";
import { IntegrationUnavailablePage } from "../../../common/server/IntegrationUnavailablePage";
// TODO(contracts, retrieval): restore Finance -> Inventory getInventoryStockActivityDetail.
export async function InventoryTransactionDetailPage(_props: { id?: string; surface?: { unframed?: boolean } }) {
  return <IntegrationUnavailablePage pageTitle="Inventory Transaction" packageName="Inventory" message="Inventory integration is awaiting migration to contracts." icon="inventory_2" />;
}
