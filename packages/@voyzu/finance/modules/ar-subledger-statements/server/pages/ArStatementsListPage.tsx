import { internalApi } from "@voyzu/capability/internal-api";
import { IntegrationUnavailablePage } from "../../../common/server/IntegrationUnavailablePage";
import "server-only";

import { getSelectedCompany } from "../../../journals/server/index";

import { ArStatementsListContent } from "../../client/index";
import { listArCounterpartySummaries } from "../lib/ar-subledger-statement.service";

export async function ArStatementsListPage() {
  if (!internalApi.has("@erp/ledger-documents")) return <IntegrationUnavailablePage pageTitle="Accounting document" packageName="Ledger" message="Install the Ledger package to view the accounting records for this document." icon="account_balance" />;
  const company = await getSelectedCompany();
  const summaries = company ? await listArCounterpartySummaries(company.id) : [];
  return <ArStatementsListContent summaries={summaries} />;
}
