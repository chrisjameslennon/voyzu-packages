import "server-only";

import { notFound } from "next/navigation";

import { listGlAccounts } from "../../../common/gl-accounts/server";
import { CompanyInventoryItemPostingProfileDetail } from "../../client";
import { getItemPostingProfile } from "../../../common/inventory-item-posting-profiles/server";
import { getCompanySettingsUiState } from "../../../common/server/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../common/server/settings-scope";

interface CompanyInventoryItemPostingProfileDetailPageProps {
  code?: string;
}

export async function CompanyInventoryItemPostingProfileDetailPage({ code }: CompanyInventoryItemPostingProfileDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope();
  const companyApiContext = await resolveServerCompanyApiContext();
  const [profile, glAccounts, settingsUiState] = await Promise.all([
    getItemPostingProfile(decodeURIComponent(code), scope.companyId),
    listGlAccounts(scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);
  if (!profile) notFound();

  return (
    <CompanyInventoryItemPostingProfileDetail
      profile={profile}
      glAccounts={glAccounts}
      listPath="/finance/inventory/item-posting-profiles"
      apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/inventory/item-posting-profiles`}
      readOnly={settingsUiState.readOnly}
      showArchived={settingsUiState.isArchived}
    />
  );
}
