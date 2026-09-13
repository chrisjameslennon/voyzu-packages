import "server-only";

import { notFound } from "next/navigation";

import { ApControlAccountDetail } from "../../client/index";
import { getControlAccountByLedger } from "../index";
import { listGlAccounts } from "../../../gl-accounts/server/index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";

interface CompanyApControlAccountDetailPageProps {
  code?: string;
}

export async function ApControlAccountDetailPage({ code }: CompanyApControlAccountDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope();
  const companyApiContext = await resolveServerCompanyApiContext();
  const [account, settingsState, allGlAccounts] = await Promise.all([
    getControlAccountByLedger(decodeURIComponent(code), "ACCOUNTS_PAYABLE", scope.companyId),
    getCompanySettingsUiState(scope.companyId),
    listGlAccounts(scope.companyId),
  ]);
  if (!account) notFound();

  return (
    <ApControlAccountDetail
      account={account}
      glAccounts={allGlAccounts}
      apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/ap-control-accounts`}
      listPath="/finance/settings/control-accounts/ap"
      auditPath="/settings/audit"
      readOnly={settingsState.readOnly}
      isArchived={settingsState.isArchived}
    />
  );
}
