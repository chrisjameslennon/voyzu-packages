import "server-only";

import { notFound } from "next/navigation";

import { listGlAccounts } from "../../../gl-accounts/server/index";
import { InventoryItemPostingProfileDetail } from "../../client/index";
import { getItemPostingProfile } from "../index";
import { getCompanySettingsUiState } from "../../../finance-companies/server/lib/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../finance-companies/server/lib/settings-scope";

interface CompanyInventoryItemPostingProfileDetailPageProps {
  code?: string;
}

export async function InventoryItemPostingProfileDetailPage({ code }: CompanyInventoryItemPostingProfileDetailPageProps) {
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
    <InventoryItemPostingProfileDetail
      profile={profile}
      glAccounts={glAccounts}
      listPath="/finance/inventory/item-posting-profiles"
      apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/inventory/item-posting-profiles`}
      readOnly={settingsUiState.readOnly}
      showArchived={settingsUiState.isArchived}
    />
  );
}
