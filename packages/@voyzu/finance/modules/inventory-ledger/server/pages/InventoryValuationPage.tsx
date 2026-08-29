import "server-only";
import { getSelectedCompany } from "@voyzu/finance/journals/server";
import { InventoryValuationContent } from "../../client/pages/InventoryValuationContent";
import { listInventoryValuations } from "../lib/inventory-ledger.service";

export async function InventoryValuationPage() {
  const company = await getSelectedCompany();
  return <InventoryValuationContent valuations={company ? await listInventoryValuations(company.id) : []} />;
}
