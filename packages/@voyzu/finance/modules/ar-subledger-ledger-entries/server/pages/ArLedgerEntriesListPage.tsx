import "server-only";

import { ArLedgerEntriesListContent } from "../../client/index";
import { getSelectedCompany } from "../../../journals/server/index";
import { listArSubledgerEntries } from "../lib/ar-subledger-ledger-entries.service";

export async function ArLedgerEntriesListPage() {
  const company = await getSelectedCompany();
  const entries = company ? await listArSubledgerEntries(company.id) : [];
  return <ArLedgerEntriesListContent entries={entries} />;
}

