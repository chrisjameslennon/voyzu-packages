import "server-only";

import { getSelectedCompany } from "../../../journals/server/index";

import { ApStatementsListContent } from "../../client/index";
import { listApCounterpartySummaries } from "../lib/ap-subledger-statement.service";

export async function ApStatementsListPage() {
  const company = await getSelectedCompany();
  const summaries = company ? await listApCounterpartySummaries(company.id) : [];
  return <ApStatementsListContent summaries={summaries} />;
}
