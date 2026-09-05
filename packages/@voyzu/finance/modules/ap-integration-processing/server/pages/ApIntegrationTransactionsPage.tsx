import "server-only";

import { IntegrationUnavailablePage } from "../../../common/server/IntegrationUnavailablePage";

export function ApIntegrationTransactionsPage() {
  return <IntegrationUnavailablePage pageTitle="Accounts Payable Transactions" packageName="Commerce" message="Install the Commerce package to receive and view accounts payable transactions." icon="receipt_long" />;
}
