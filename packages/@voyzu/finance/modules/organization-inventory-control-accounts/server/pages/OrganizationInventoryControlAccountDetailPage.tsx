import "server-only";

import { notFound } from "next/navigation";
import { OrganizationInventoryControlAccountDetail } from "../../client";
import { getInventoryControlAccountSetting } from "../../../common/inventory-control-accounts/server";
import { listGlAccounts } from "../../../common/gl-accounts/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

export async function OrganizationInventoryControlAccountDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("template");
  const [account, allGlAccounts] = await Promise.all([getInventoryControlAccountSetting(decodeURIComponent(code), scope.companyId), listGlAccounts(scope.companyId)]);
  if (!account) notFound();
  const glAccounts = allGlAccounts.filter((item) => item.accountType === "ASSET" && (item.status === "ACTIVE" || item.id === account.glAccountId));
  return <OrganizationInventoryControlAccountDetail account={account} glAccounts={glAccounts} apiPath="/api/finance/inventory-control-accounts" listPath="/finance/control-accounts/inventory" auditPath="/settings/audit" />;
}
