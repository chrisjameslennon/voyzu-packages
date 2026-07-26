import "server-only";

import { listArSubledgerEntries } from "@voyzu-modules/core/ar-subledger-ledger-entries/server";
import { getSelectedCompany } from "@voyzu-modules/core/journals/server";

import { ArInvoicesListContent } from "../../client";

export async function ArInvoicesListPage() {
  const company = await getSelectedCompany();
  const entries = company ? await listArSubledgerEntries(company.id) : [];
  return <ArInvoicesListContent entries={entries} />;
}
