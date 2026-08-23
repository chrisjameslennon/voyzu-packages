import "server-only";

import { ApLedgerEntriesListContent } from "../../client";
import { getSelectedCompany } from "@voyzu/finance/journals/server";
import { listApSubledgerEntries } from "../lib/ap-subledger-ledger-entries.service";

export async function ApLedgerEntriesListPage() {
  const company = await getSelectedCompany();
  const entries = company ? await listApSubledgerEntries(company.id) : [];
  return <ApLedgerEntriesListContent entries={entries} />;
}
