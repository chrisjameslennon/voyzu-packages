import "server-only";

import { IntegrationUnavailablePage } from "../../../common/server/IntegrationUnavailablePage";

export function ArIntegrationTransactionsPage() {
  return <IntegrationUnavailablePage pageTitle="Accounts Receivable Transactions" packageName="Commerce" message="Install the Commerce package to receive and view accounts receivable transactions." icon="request_quote" />;
}
