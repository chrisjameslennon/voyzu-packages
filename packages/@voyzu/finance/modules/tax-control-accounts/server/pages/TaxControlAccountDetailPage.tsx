import "server-only";

import { notFound } from "next/navigation";
import { TaxControlAccountDetail } from "../../client/index";
import { getTaxControlAccount } from "../index";
import { listGlAccounts } from "../../../gl-accounts/server/index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";

export async function TaxControlAccountDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope(); const apiContext = await resolveServerCompanyApiContext();
  const [account, allGlAccounts, settingsState] = await Promise.all([getTaxControlAccount(decodeURIComponent(code), scope.companyId), listGlAccounts(scope.companyId), getCompanySettingsUiState(scope.companyId)]);
  if (!account || !account.requiredAccountType) notFound();
  const glAccounts = allGlAccounts.filter((item) => item.accountType === account.requiredAccountType && (item.status === "ACTIVE" || item.id === account.glAccountId));
  return <TaxControlAccountDetail account={account} glAccounts={glAccounts} apiPath={`/api/finance/${encodeURIComponent(apiContext.companyCode)}/tax-control-accounts`} listPath="/finance/settings/control-accounts/tax" auditPath="/settings/audit" readOnly={settingsState.readOnly} isArchived={settingsState.isArchived} />;
}
