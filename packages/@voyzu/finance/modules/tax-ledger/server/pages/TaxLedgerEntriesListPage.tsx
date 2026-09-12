import "server-only";

import { TaxLedgerEntriesListContent } from "../../client/index";
import { getSelectedCompany } from "../../../journals/server/index";
import { listTaxSubledgerEntries } from "../lib/tax-ledger.service";

export async function TaxLedgerEntriesListPage() {
  const company = await getSelectedCompany();
  const entries = company ? await listTaxSubledgerEntries(company.id) : [];
  return <TaxLedgerEntriesListContent entries={entries} />;
}
