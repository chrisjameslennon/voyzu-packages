import "server-only";

import { listApSubledgerEntries } from "../../../ap-subledger-ledger-entries/server/index";
import { getSelectedCompany } from "../../../journals/server/index";

import { ApBillsListContent } from "../../client/index";

export async function ApBillsListPage() {
  const company = await getSelectedCompany();
  const entries = company ? await listApSubledgerEntries(company.id) : [];
  return <ApBillsListContent entries={entries} />;
}
