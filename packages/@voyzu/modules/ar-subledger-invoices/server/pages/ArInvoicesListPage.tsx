import "server-only";

import { listArSubledgerEntries } from "@voyzu/modules/ar-subledger-ledger-entries/server";
import { getSelectedCompany } from "@voyzu/modules/journals/server";

import { ArInvoicesListContent } from "../../client";

export async function ArInvoicesListPage() {
  const company = await getSelectedCompany();
  const entries = company ? await listArSubledgerEntries(company.id) : [];
  return <ArInvoicesListContent entries={entries} />;
}
