import "server-only";

import { listApSubledgerEntries } from "@voyzu/core/ap-subledger-ledger-entries/server";
import { getSelectedCompany } from "@voyzu/core/journals/server";

import { ApBillsListContent } from "../../client";

export async function ApBillsListPage() {
  const company = await getSelectedCompany();
  const entries = company ? await listApSubledgerEntries(company.id) : [];
  return <ApBillsListContent entries={entries} />;
}
