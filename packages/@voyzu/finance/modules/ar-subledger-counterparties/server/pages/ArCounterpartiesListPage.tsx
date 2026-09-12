import "server-only";

import { ArCounterpartiesListContent } from "../../client/index";
import { getSelectedCompany } from "../../../journals/server/index";
import { listArCounterparties } from "../lib/ar-subledger-counterparty.service";

export async function ArCounterpartiesListPage() {
  const company = await getSelectedCompany();
  const counterparties = company ? await listArCounterparties(company.id) : [];
  return <ArCounterpartiesListContent counterparties={counterparties} />;
}

