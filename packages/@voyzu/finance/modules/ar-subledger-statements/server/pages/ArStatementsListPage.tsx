import "server-only";

import { getSelectedCompany } from "../../../journals/server/index";

import { ArStatementsListContent } from "../../client/index";
import { listArCounterpartySummaries } from "../lib/ar-subledger-statement.service";

export async function ArStatementsListPage() {
  const company = await getSelectedCompany();
  const summaries = company ? await listArCounterpartySummaries(company.id) : [];
  return <ArStatementsListContent summaries={summaries} />;
}
