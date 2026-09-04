import "server-only";

import { CompanyInventoryItemPostingProfilesListContent } from "../../client";
import { listItemPostingProfiles } from "../../../common/inventory-item-posting-profiles/server";
import { listGlAccounts } from "../../../common/gl-accounts/server";
import { getCompanySettingsUiState } from "../../../common/server/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../common/server/settings-scope";

export async function CompanyInventoryItemPostingProfilesListPage() {
  const scope = await resolveServerSettingsScope();
  const companyApiContext = await resolveServerCompanyApiContext();
  const [profiles, glAccounts, settingsUiState] = await Promise.all([
    listItemPostingProfiles(scope.companyId),
    listGlAccounts(scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);

  return (
    <CompanyInventoryItemPostingProfilesListContent
      profiles={profiles}
      glAccounts={glAccounts}
      basePath="/finance/inventory/item-posting-profiles"
      apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/inventory/item-posting-profiles`}
      readOnly={settingsUiState.readOnly}
      showArchived={settingsUiState.isArchived}
    />
  );
}
