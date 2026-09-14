import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";
import { InventoryControlAccountDetail } from "../../client/index";
import { getInventoryControlAccountSetting } from "../index";
import { listGlAccounts } from "../../../gl-accounts/server/index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { resolveServerCompanyHttpApiContext, resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";

export async function InventoryControlAccountDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  if (!code) notFound();
  const scope = await resolveServerSettingsScope(); const httpApiContext = await resolveServerCompanyHttpApiContext();
  const [account, allGlAccounts, settingsState] = await Promise.all([getInventoryControlAccountSetting((code), scope.companyId), listGlAccounts(scope.companyId), getCompanySettingsUiState(scope.companyId)]);
  if (!account) notFound();
  const glAccounts = allGlAccounts.filter((item) => item.accountType === "ASSET" && (item.status === "ACTIVE" || item.id === account.glAccountId));
  return <InventoryControlAccountDetail account={account} glAccounts={glAccounts} httpApiPath={`/api/ledger/${encodeURIComponent(httpApiContext.companyCode)}/inventory-control-accounts`} listPath="/ledger/settings/control-accounts/inventory" auditPath="/settings/audit" readOnly={settingsState.readOnly} isArchived={settingsState.isArchived} />;
}
