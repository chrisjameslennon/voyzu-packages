import "server-only";

import { listArSubledgerEntries } from "../../../ar-subledger-ledger-entries/server/index";
import { getSelectedCompany } from "../../../journals/server/index";

import { ArInvoicesListContent } from "../../client/index";

export async function ArInvoicesListPage() {
  const company = await getSelectedCompany();
  const entries = company ? await listArSubledgerEntries(company.id) : [];
  return <ArInvoicesListContent entries={entries} />;
}
