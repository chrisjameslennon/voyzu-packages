import "server-only";

import { OrganizationInventoryItemPostingProfilesListContent } from "../../client";
import { listItemPostingProfiles } from "../../../common/inventory-item-posting-profiles/server";
import { listGlAccounts } from "../../../common/gl-accounts/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

export async function OrganizationInventoryItemPostingProfilesListPage() {
  const scope = await resolveServerSettingsScope("template");
  const [profiles, glAccounts] = await Promise.all([
    listItemPostingProfiles(scope.companyId),
    listGlAccounts(scope.companyId),
  ]);

  return (
    <OrganizationInventoryItemPostingProfilesListContent
      profiles={profiles}
      glAccounts={glAccounts}
      basePath="/finance/inventory/item-posting-profiles"
      apiPath="/api/finance/inventory/item-posting-profiles"
    />
  );
}
