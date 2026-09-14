import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";

import { ApControlAccountDetail } from "../../client/index";
import { getControlAccountByLedger } from "../index";
import { listGlAccounts } from "../../../gl-accounts/server/index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { resolveServerCompanyHttpApiContext, resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";

export async function ApControlAccountDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  if (!code) notFound();
  const scope = await resolveServerSettingsScope();
  const companyHttpApiContext = await resolveServerCompanyHttpApiContext();
  const [account, settingsState, allGlAccounts] = await Promise.all([
    getControlAccountByLedger((code), "ACCOUNTS_PAYABLE", scope.companyId),
    getCompanySettingsUiState(scope.companyId),
    listGlAccounts(scope.companyId),
  ]);
  if (!account) notFound();

  return (
    <ApControlAccountDetail
      account={account}
      glAccounts={allGlAccounts}
      httpApiPath={`/api/ledger/${encodeURIComponent(companyHttpApiContext.companyCode)}/ap-control-accounts`}
      listPath="/ledger/settings/control-accounts/ap"
      auditPath="/settings/audit"
      readOnly={settingsState.readOnly}
      isArchived={settingsState.isArchived}
    />
  );
}
