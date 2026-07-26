import "server-only";

import { TaxLedgerEntriesListContent } from "../../client";
import { getSelectedCompany } from "@voyzu-modules/core/journals/server";
import { listTaxSubledgerEntries } from "../lib/tax-ledger.service";

export async function TaxLedgerEntriesListPage() {
  const company = await getSelectedCompany();
  const entries = company ? await listTaxSubledgerEntries(company.id) : [];
  return <TaxLedgerEntriesListContent entries={entries} />;
}
