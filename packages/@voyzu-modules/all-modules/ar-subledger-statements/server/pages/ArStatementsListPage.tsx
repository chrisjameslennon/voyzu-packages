import "server-only";

import { getSelectedCompany } from "@voyzu-modules/all-modules/journals/server";

import { ArStatementsListContent } from "../../client";
import { listArCounterpartySummaries } from "../lib/ar-subledger-statement.service";

export async function ArStatementsListPage() {
  const company = await getSelectedCompany();
  const summaries = company ? await listArCounterpartySummaries(company.id) : [];
  return <ArStatementsListContent summaries={summaries} />;
}
