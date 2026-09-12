import "server-only";

import { notFound } from "next/navigation";
import { InventoryControlAccountDetail } from "../../client/index";
import { getInventoryControlAccountSetting } from "../index";
import { listGlAccounts } from "../../../gl-accounts/server/index";
import { getCompanySettingsUiState } from "../../../finance-companies/server/lib/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../finance-companies/server/lib/settings-scope";

export async function InventoryControlAccountDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope(); const apiContext = await resolveServerCompanyApiContext();
  const [account, allGlAccounts, settingsState] = await Promise.all([getInventoryControlAccountSetting(decodeURIComponent(code), scope.companyId), listGlAccounts(scope.companyId), getCompanySettingsUiState(scope.companyId)]);
  if (!account) notFound();
  const glAccounts = allGlAccounts.filter((item) => item.accountType === "ASSET" && (item.status === "ACTIVE" || item.id === account.glAccountId));
  return <InventoryControlAccountDetail account={account} glAccounts={glAccounts} apiPath={`/api/finance/${encodeURIComponent(apiContext.companyCode)}/inventory-control-accounts`} listPath="/finance/settings/control-accounts/inventory" auditPath="/settings/audit" readOnly={settingsState.readOnly} isArchived={settingsState.isArchived} />;
}
