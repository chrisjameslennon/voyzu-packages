import "server-only";

import { ApCounterpartiesListContent } from "../../client/index";
import { getSelectedCompany } from "../../../journals/server/index";
import { listApCounterparties } from "../lib/ap-subledger-counterparty.service";

export async function ApCounterpartiesListPage() {
  const company = await getSelectedCompany();
  const counterparties = company ? await listApCounterparties(company.id) : [];
  return <ApCounterpartiesListContent counterparties={counterparties} />;
}
