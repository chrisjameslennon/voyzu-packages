import "server-only";

import { notFound } from "next/navigation";
import { CompanyTaxControlAccountDetail } from "../../client";
import { getTaxControlAccount } from "../../../common/tax-control-accounts/server";
import { listGlAccounts } from "../../../common/gl-accounts/server";
import { getCompanySettingsUiState } from "../../../common/server/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../common/server/settings-scope";

export async function CompanyTaxControlAccountDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("selected"); const apiContext = await resolveServerCompanyApiContext();
  const [account, allGlAccounts, settingsState] = await Promise.all([getTaxControlAccount(decodeURIComponent(code), scope.companyId), listGlAccounts(scope.companyId), getCompanySettingsUiState(scope.companyId)]);
  if (!account || !account.requiredAccountType) notFound();
  const glAccounts = allGlAccounts.filter((item) => item.accountType === account.requiredAccountType && (item.status === "ACTIVE" || item.id === account.glAccountId));
  return <CompanyTaxControlAccountDetail account={account} glAccounts={glAccounts} apiPath={`/api/finance/${encodeURIComponent(apiContext.companyCode)}/tax-control-accounts`} listPath="/finance/settings/control-accounts/tax" auditPath="/settings/audit" readOnly={settingsState.readOnly} usesOrganizationStandardSettings={settingsState.usesOrganizationStandardSettings} isArchived={settingsState.isArchived} />;
}
