import "server-only";

import { InventoryItemPostingProfilesListContent } from "../../client/index";
import { listItemPostingProfiles } from "../index";
import { listGlAccounts } from "../../../gl-accounts/server/index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";

export async function InventoryItemPostingProfilesListPage() {
  const scope = await resolveServerSettingsScope();
  const companyApiContext = await resolveServerCompanyApiContext();
  const [profiles, glAccounts, settingsUiState] = await Promise.all([
    listItemPostingProfiles(scope.companyId),
    listGlAccounts(scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);

  return (
    <InventoryItemPostingProfilesListContent
      profiles={profiles}
      glAccounts={glAccounts}
      basePath="/finance/inventory/item-posting-profiles"
      apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/inventory/item-posting-profiles`}
      readOnly={settingsUiState.readOnly}
      showArchived={settingsUiState.isArchived}
    />
  );
}
