import "server-only";

import { listApSubledgerEntries } from "@voyzu/modules/ap-subledger-ledger-entries/server";
import { getSelectedCompany } from "@voyzu/modules/journals/server";

import { ApBillsListContent } from "../../client";

export async function ApBillsListPage() {
  const company = await getSelectedCompany();
  const entries = company ? await listApSubledgerEntries(company.id) : [];
  return <ApBillsListContent entries={entries} />;
}
