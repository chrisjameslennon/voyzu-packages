import "server-only";

import { notFound } from "next/navigation";

import { ArControlAccountDetail } from "../../client/index";
import { getControlAccountByLedger } from "../index";
import { listGlAccounts } from "../../../gl-accounts/server/index";
import { getCompanySettingsUiState } from "../../../finance-companies/server/lib/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../finance-companies/server/lib/settings-scope";

interface CompanyArControlAccountDetailPageProps {
  code?: string;
}

export async function ArControlAccountDetailPage({ code }: CompanyArControlAccountDetailPageProps) {
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
    <ArControlAccountDetail
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
