import { internalApi } from "@voyzu/capability/internal-api";
import { IntegrationUnavailablePage } from "../../../common/server/IntegrationUnavailablePage";
import "server-only";

import { getSelectedCompany } from "../../../journals/server/index";

import { ApStatementsListContent } from "../../client/index";
import { listApCounterpartySummaries } from "../lib/ap-subledger-statement.service";

export async function ApStatementsListPage() {
  if (!internalApi.has("@erp/ledger-documents")) return <IntegrationUnavailablePage pageTitle="Accounting document" packageName="Ledger" message="Install the Ledger package to view the accounting records for this document." icon="account_balance" />;
  const company = await getSelectedCompany();
  const summaries = company ? await listApCounterpartySummaries(company.id) : [];
  return <ApStatementsListContent summaries={summaries} />;
}
