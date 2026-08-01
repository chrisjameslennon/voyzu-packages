import "server-only";

import { notFound } from "next/navigation";

import { listGlAccounts } from "../../../common/gl-accounts/server";
import { OrganizationInventoryItemPostingProfileDetail } from "../../client";
import { getItemPostingProfile } from "../../../common/inventory-item-posting-profiles/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

interface OrganizationInventoryItemPostingProfileDetailPageProps {
  code?: string;
}

export async function OrganizationInventoryItemPostingProfileDetailPage({ code }: OrganizationInventoryItemPostingProfileDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("template");
  const [profile, glAccounts] = await Promise.all([
    getItemPostingProfile(decodeURIComponent(code), scope.companyId),
    listGlAccounts(scope.companyId),
  ]);
  if (!profile) notFound();

  return (
    <OrganizationInventoryItemPostingProfileDetail
      profile={profile}
      glAccounts={glAccounts}
      listPath="/organization/inventory/item-posting-profiles"
      apiPath="/api/organization/inventory/item-posting-profiles"
    />
  );
}
