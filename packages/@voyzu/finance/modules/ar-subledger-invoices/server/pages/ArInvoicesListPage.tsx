import { internalApi } from "@voyzu/capability/internal-api";
import { IntegrationUnavailablePage } from "../../../common/server/IntegrationUnavailablePage";
import "server-only";

import { listArSubledgerEntries } from "../../../ar-subledger-ledger-entries/server/index";
import { getSelectedCompany } from "../../../journals/server/index";

import { ArInvoicesListContent } from "../../client/index";

export async function ArInvoicesListPage() {
  if (!internalApi.has("@erp/ledger-documents")) return <IntegrationUnavailablePage pageTitle="Accounting document" packageName="Ledger" message="Install the Ledger package to view the accounting records for this document." icon="account_balance" />;
  const company = await getSelectedCompany();
  const entries = company ? await listArSubledgerEntries(company.id) : [];
  return <ArInvoicesListContent entries={entries} />;
}
