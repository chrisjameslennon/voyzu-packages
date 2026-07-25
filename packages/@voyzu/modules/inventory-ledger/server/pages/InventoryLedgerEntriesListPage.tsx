import "server-only";

import { InventoryLedgerEntriesListContent } from "../../client";
import { getSelectedCompany } from "@voyzu/modules/journals/server";
import { listInventoryLedgerEntries } from "../lib/inventory-ledger.service";

export async function InventoryLedgerEntriesListPage() {
  const company = await getSelectedCompany();
  const entries = company ? await listInventoryLedgerEntries(company.id) : [];
  return <InventoryLedgerEntriesListContent entries={entries} />;
}
