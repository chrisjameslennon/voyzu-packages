import "server-only";

import { ApCounterpartiesListContent } from "../../client";
import { getSelectedCompany } from "@voyzu/finance/journals/server";
import { listApCounterparties } from "../lib/ap-subledger-counterparty.service";

export async function ApCounterpartiesListPage() {
  const company = await getSelectedCompany();
  const counterparties = company ? await listApCounterparties(company.id) : [];
  return <ApCounterpartiesListContent counterparties={counterparties} />;
}
