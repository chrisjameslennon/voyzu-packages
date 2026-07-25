import "server-only";

import { notFound } from "next/navigation";

import { OrganizationBankCashAccountDetail } from "../../client";
import { getBankCashAccount } from "../../../common/bank-cash-accounts/server";
import { listGlAccounts } from "../../../common/gl-accounts/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

interface OrganizationBankCashAccountDetailPageProps {
  code?: string;
}

export async function OrganizationBankCashAccountDetailPage({ code }: OrganizationBankCashAccountDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("template");
  const [account, glAccounts] = await Promise.all([
    getBankCashAccount(decodeURIComponent(code), scope.companyId),
    listGlAccounts(scope.companyId),
  ]);
  if (!account) notFound();

  return (
    <OrganizationBankCashAccountDetail
      account={account}
      glAccounts={glAccounts}
      listPath="/organization/bank-cash-accounts"
      auditPath="/organization/audit"
      apiPath="/api/organization/bank-cash-accounts"
    />
  );
}
