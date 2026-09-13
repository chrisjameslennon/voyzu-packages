import "server-only";

import { notFound } from "next/navigation";

import { BankCashAccountDetail } from "../../client/index";
import { getBankCashAccount } from "../index";
import { listGlAccounts } from "../../../gl-accounts/server/index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";
import { normalizeDetailBackSource } from "../../../common/server/index";

interface CompanyBankCashAccountDetailPageProps {
  code?: string;
  surface?: { searchParams?: Record<string, string> };
}

export async function BankCashAccountDetailPage({ code, surface }: CompanyBankCashAccountDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope();
  const companyApiContext = await resolveServerCompanyApiContext();
  const [account, glAccounts, settingsState] = await Promise.all([
    getBankCashAccount(decodeURIComponent(code), scope.companyId),
    listGlAccounts(scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);
  if (!account) notFound();
  const searchParams = surface?.searchParams ?? {};

  return (
    <BankCashAccountDetail
      account={account}
      glAccounts={glAccounts}
      listPath="/finance/settings/bank-cash-accounts"
      auditPath="/settings/audit"
      apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/bank-cash-accounts`}
      readOnly={settingsState.readOnly}
      isArchived={settingsState.isArchived}
      from={normalizeDetailBackSource(searchParams.from)}
      fromCode={searchParams.fromCode}
    />
  );
}
