import "server-only";

import { getSelectedCompany } from "@voyzu/finance/journals/server";

import { ApStatementsListContent } from "../../client";
import { listApCounterpartySummaries } from "../lib/ap-subledger-statement.service";

export async function ApStatementsListPage() {
  const company = await getSelectedCompany();
  const summaries = company ? await listApCounterpartySummaries(company.id) : [];
  return <ApStatementsListContent summaries={summaries} />;
}
