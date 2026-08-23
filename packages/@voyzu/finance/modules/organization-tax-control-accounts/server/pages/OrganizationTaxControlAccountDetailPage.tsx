import "server-only";

import { notFound } from "next/navigation";
import { OrganizationTaxControlAccountDetail } from "../../client";
import { getTaxControlAccount } from "../../../common/tax-control-accounts/server";
import { listGlAccounts } from "../../../common/gl-accounts/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

export async function OrganizationTaxControlAccountDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("template");
  const [account, allGlAccounts] = await Promise.all([getTaxControlAccount(decodeURIComponent(code), scope.companyId), listGlAccounts(scope.companyId)]);
  if (!account || !account.requiredAccountType) notFound();
  const glAccounts = allGlAccounts.filter((item) => item.accountType === account.requiredAccountType && (item.status === "ACTIVE" || item.id === account.glAccountId));
  return <OrganizationTaxControlAccountDetail account={account} glAccounts={glAccounts} apiPath="/api/finance/tax-control-accounts" listPath="/finance/control-accounts/tax" auditPath="/settings/audit" />;
}
