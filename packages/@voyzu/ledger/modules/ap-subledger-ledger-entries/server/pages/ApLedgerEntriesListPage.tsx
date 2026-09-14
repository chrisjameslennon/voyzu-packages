import "server-only";

import { ApLedgerEntriesListContent } from "../../client/index";
import { getSelectedCompany } from "../../../journals/server/index";
import { listApSubledgerEntries } from "../lib/ap-subledger-ledger-entries.service";

export async function ApLedgerEntriesListPage() {
  const company = await getSelectedCompany();
  const entries = company ? await listApSubledgerEntries(company.id) : [];
  return <ApLedgerEntriesListContent entries={entries} />;
}
