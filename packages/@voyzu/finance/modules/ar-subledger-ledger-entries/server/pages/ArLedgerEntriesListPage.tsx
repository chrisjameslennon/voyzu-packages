import "server-only";

import { ArLedgerEntriesListContent } from "../../client";
import { getSelectedCompany } from "@voyzu/finance/journals/server";
import { listArSubledgerEntries } from "../lib/ar-subledger-ledger-entries.service";

export async function ArLedgerEntriesListPage() {
  const company = await getSelectedCompany();
  const entries = company ? await listArSubledgerEntries(company.id) : [];
  return <ArLedgerEntriesListContent entries={entries} />;
}

