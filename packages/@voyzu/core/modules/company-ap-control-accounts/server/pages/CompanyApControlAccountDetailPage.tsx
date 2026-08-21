import "server-only";

import { notFound } from "next/navigation";

import { CompanyApControlAccountDetail } from "../../client";
import { getControlAccountByLedger } from "../../../common/control-accounts/server";
import { listGlAccounts } from "../../../common/gl-accounts/server";
import { getCompanySettingsUiState } from "../../../common/server/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../common/server/settings-scope";

interface CompanyApControlAccountDetailPageProps {
  code?: string;
}

export async function CompanyApControlAccountDetailPage({ code }: CompanyApControlAccountDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("selected");
  const companyApiContext = await resolveServerCompanyApiContext();
  const [account, settingsState, allGlAccounts] = await Promise.all([
    getControlAccountByLedger(decodeURIComponent(code), "ACCOUNTS_PAYABLE", scope.companyId),
    getCompanySettingsUiState(scope.companyId),
    listGlAccounts(scope.companyId),
  ]);
  if (!account) notFound();

  return (
    <CompanyApControlAccountDetail
      account={account}
      glAccounts={allGlAccounts}
      apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/ap-control-accounts`}
      listPath="/finance/settings/control-accounts/ap"
      auditPath="/settings/audit"
      readOnly={settingsState.readOnly}
      usesOrganizationStandardSettings={settingsState.usesOrganizationStandardSettings}
      isArchived={settingsState.isArchived}
    />
  );
}
