import "server-only";

import { listArSubledgerEntries } from "@voyzu-modules/all-modules/ar-subledger-ledger-entries/server";
import { getSelectedCompany } from "@voyzu-modules/all-modules/journals/server";

import { ArInvoicesListContent } from "../../client";

export async function ArInvoicesListPage() {
  const company = await getSelectedCompany();
  const entries = company ? await listArSubledgerEntries(company.id) : [];
  return <ArInvoicesListContent entries={entries} />;
}
