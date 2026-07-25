import "server-only";

import { notFound } from "next/navigation";

import { OrganizationArControlAccountDetail } from "../../client";
import { getControlAccountByLedger } from "../../../common/control-accounts/server";
import { listGlAccounts } from "../../../common/gl-accounts/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

interface OrganizationArControlAccountDetailPageProps {
  code?: string;
}

export async function OrganizationArControlAccountDetailPage({ code }: OrganizationArControlAccountDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("template");
  const [account, allGlAccounts] = await Promise.all([
    getControlAccountByLedger(decodeURIComponent(code), "ACCOUNTS_RECEIVABLE", scope.companyId),
    listGlAccounts(scope.companyId),
  ]);
  if (!account) notFound();
  const glAccounts = allGlAccounts.filter((glAccount) => glAccount.accountType === "ASSET" && (glAccount.status === "ACTIVE" || glAccount.id === account.glAccountId));

  return (
    <OrganizationArControlAccountDetail
      account={account}
      glAccounts={glAccounts}
      apiPath="/api/organization/ar-control-accounts"
      listPath="/organization/control-accounts/ar"
      auditPath="/organization/audit"
    />
  );
}
