import "server-only";

import { notFound } from "next/navigation";

import { OrganizationApControlAccountDetail } from "../../client";
import { getControlAccountByLedger } from "../../../common/control-accounts/server";
import { listGlAccounts } from "../../../common/gl-accounts/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

interface OrganizationApControlAccountDetailPageProps {
  code?: string;
}

export async function OrganizationApControlAccountDetailPage({ code }: OrganizationApControlAccountDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("template");
  const [account, allGlAccounts] = await Promise.all([
    getControlAccountByLedger(decodeURIComponent(code), "ACCOUNTS_PAYABLE", scope.companyId),
    listGlAccounts(scope.companyId),
  ]);
  if (!account) notFound();

  return (
    <OrganizationApControlAccountDetail
      account={account}
      glAccounts={allGlAccounts}
      apiPath="/api/finance/ap-control-accounts"
      listPath="/finance/control-accounts/ap"
      auditPath="/settings/audit"
    />
  );
}
