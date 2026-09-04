import "server-only";

import { notFound } from "next/navigation";

import { CompanyArControlAccountDetail } from "../../client";
import { getControlAccountByLedger } from "../../../common/control-accounts/server";
import { listGlAccounts } from "../../../common/gl-accounts/server";
import { getCompanySettingsUiState } from "../../../common/server/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../common/server/settings-scope";

interface CompanyArControlAccountDetailPageProps {
  code?: string;
}

export async function CompanyArControlAccountDetailPage({ code }: CompanyArControlAccountDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope();
  const companyApiContext = await resolveServerCompanyApiContext();
  const [account, settingsState, allGlAccounts] = await Promise.all([
    getControlAccountByLedger(decodeURIComponent(code), "ACCOUNTS_RECEIVABLE", scope.companyId),
    getCompanySettingsUiState(scope.companyId),
    listGlAccounts(scope.companyId),
  ]);
  if (!account) notFound();
  const glAccounts = allGlAccounts.filter((glAccount) => glAccount.accountType === "ASSET" && (glAccount.status === "ACTIVE" || glAccount.id === account.glAccountId));

  return (
    <CompanyArControlAccountDetail
      account={account}
      glAccounts={glAccounts}
      apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/ar-control-accounts`}
      listPath="/finance/settings/control-accounts/ar"
      auditPath="/settings/audit"
      readOnly={settingsState.readOnly}
      isArchived={settingsState.isArchived}
    />
  );
}
