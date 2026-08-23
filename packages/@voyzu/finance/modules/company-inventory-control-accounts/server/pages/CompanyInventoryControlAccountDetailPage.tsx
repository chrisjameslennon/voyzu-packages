import "server-only";

import { notFound } from "next/navigation";
import { CompanyInventoryControlAccountDetail } from "../../client";
import { getInventoryControlAccountSetting } from "../../../common/inventory-control-accounts/server";
import { listGlAccounts } from "../../../common/gl-accounts/server";
import { getCompanySettingsUiState } from "../../../common/server/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../common/server/settings-scope";

export async function CompanyInventoryControlAccountDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("selected"); const apiContext = await resolveServerCompanyApiContext();
  const [account, allGlAccounts, settingsState] = await Promise.all([getInventoryControlAccountSetting(decodeURIComponent(code), scope.companyId), listGlAccounts(scope.companyId), getCompanySettingsUiState(scope.companyId)]);
  if (!account) notFound();
  const glAccounts = allGlAccounts.filter((item) => item.accountType === "ASSET" && (item.status === "ACTIVE" || item.id === account.glAccountId));
  return <CompanyInventoryControlAccountDetail account={account} glAccounts={glAccounts} apiPath={`/api/finance/${encodeURIComponent(apiContext.companyCode)}/inventory-control-accounts`} listPath="/finance/settings/control-accounts/inventory" auditPath="/settings/audit" readOnly={settingsState.readOnly} usesFinanceTemplateSettings={settingsState.usesFinanceTemplateSettings} isArchived={settingsState.isArchived} />;
}
