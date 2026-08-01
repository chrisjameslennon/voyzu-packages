import "server-only";

import { listArSubledgerEntries } from "@voyzu/core/ar-subledger-ledger-entries/server";
import { getSelectedCompany } from "@voyzu/core/journals/server";

import { ArInvoicesListContent } from "../../client";

export async function ArInvoicesListPage() {
  const company = await getSelectedCompany();
  const entries = company ? await listArSubledgerEntries(company.id) : [];
  return <ArInvoicesListContent entries={entries} />;
}
