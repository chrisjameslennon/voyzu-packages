import "server-only";

import { notFound } from "next/navigation";

import { CompanyBankCashAccountDetail } from "../../client";
import { getBankCashAccount } from "../../../common/bank-cash-accounts/server";
import { listGlAccounts } from "../../../common/gl-accounts/server";
import { getCompanySettingsUiState } from "../../../common/server/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../common/server/settings-scope";

interface CompanyBankCashAccountDetailPageProps {
  code?: string;
}

export async function CompanyBankCashAccountDetailPage({ code }: CompanyBankCashAccountDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("selected");
  const companyApiContext = await resolveServerCompanyApiContext();
  const [account, glAccounts, settingsState] = await Promise.all([
    getBankCashAccount(decodeURIComponent(code), scope.companyId),
    listGlAccounts(scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);
  if (!account) notFound();

  return (
    <CompanyBankCashAccountDetail
      account={account}
      glAccounts={glAccounts}
      listPath="/finance/settings/bank-cash-accounts"
      auditPath="/finance/audit"
      apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/bank-cash-accounts`}
      readOnly={settingsState.readOnly}
      usesOrganizationStandardSettings={settingsState.usesOrganizationStandardSettings}
      isArchived={settingsState.isArchived}
    />
  );
}
