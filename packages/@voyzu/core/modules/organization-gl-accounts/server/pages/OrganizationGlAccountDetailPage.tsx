import "server-only";

import { notFound } from "next/navigation";

import { listGlAccountCategories } from "../../../common/gl-account-categories/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";
import { getGlAccount } from "../../../common/gl-accounts/server";
import { OrganizationGlAccountDetail } from "../../client/OrganizationGlAccountDetail";

interface OrganizationGlAccountDetailPageProps {
  code?: string;
}

export async function OrganizationGlAccountDetailPage({ code }: OrganizationGlAccountDetailPageProps) {
  if (!code) notFound();

  const scope = await resolveServerSettingsScope("template");
  const [account, categories] = await Promise.all([
    getGlAccount(decodeURIComponent(code), scope.companyId),
    listGlAccountCategories(scope.companyId),
  ]);
  if (!account) notFound();

  return <OrganizationGlAccountDetail account={account} categories={categories} />;
}
