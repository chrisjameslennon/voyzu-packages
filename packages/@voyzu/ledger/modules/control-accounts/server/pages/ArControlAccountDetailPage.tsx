import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";

import { ArControlAccountDetail } from "../../client/index";
import { getControlAccountByLedger } from "../index";
import { listGlAccounts } from "../../../gl-accounts/server/index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { resolveServerCompanyHttpApiContext, resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";

export async function ArControlAccountDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  if (!code) notFound();
  const scope = await resolveServerSettingsScope();
  const companyHttpApiContext = await resolveServerCompanyHttpApiContext();
  const [account, settingsState, allGlAccounts] = await Promise.all([
    getControlAccountByLedger((code), "ACCOUNTS_RECEIVABLE", scope.companyId),
    getCompanySettingsUiState(scope.companyId),
    listGlAccounts(scope.companyId),
  ]);
  if (!account) notFound();
  const glAccounts = allGlAccounts.filter((glAccount) => glAccount.accountType === "ASSET" && (glAccount.status === "ACTIVE" || glAccount.id === account.glAccountId));

  return (
    <ArControlAccountDetail
      account={account}
      glAccounts={glAccounts}
      httpApiPath={`/api/ledger/${encodeURIComponent(companyHttpApiContext.companyCode)}/ar-control-accounts`}
      listPath="/ledger/settings/control-accounts/ar"
      auditPath="/settings/audit"
      readOnly={settingsState.readOnly}
      isArchived={settingsState.isArchived}
    />
  );
}
