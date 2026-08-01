import "server-only";

import { JournalsList } from "../../client";
import { getSelectedCompany } from "../lib/company-context";
import { listJournals } from "../lib/journal.service";

export async function JournalsListPage() {
  const company = await getSelectedCompany();
  const journals = company ? await listJournals(company.id) : [];

  return (
    <JournalsList
      company={company ? { id: company.id, code: company.code, name: company.name, baseCurrencyCode: company.baseCurrencyCode } : null}
      journals={journals}
    />
  );
}
