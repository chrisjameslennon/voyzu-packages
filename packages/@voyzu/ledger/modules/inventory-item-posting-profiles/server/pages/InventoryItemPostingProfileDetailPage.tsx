import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";

import { listGlAccounts } from "../../../gl-accounts/server/index";
import { InventoryItemPostingProfileDetail } from "../../client/index";
import { getItemPostingProfile } from "../index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { resolveServerCompanyHttpApiContext, resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";

export async function InventoryItemPostingProfileDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  if (!code) notFound();
  const scope = await resolveServerSettingsScope();
  const companyHttpApiContext = await resolveServerCompanyHttpApiContext();
  const [profile, glAccounts, settingsUiState] = await Promise.all([
    getItemPostingProfile((code), scope.companyId),
    listGlAccounts(scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);
  if (!profile) notFound();

  return (
    <InventoryItemPostingProfileDetail
      profile={profile}
      glAccounts={glAccounts}
      listPath="/ledger/inventory/item-posting-profiles"
      httpApiPath={`/api/ledger/${encodeURIComponent(companyHttpApiContext.companyCode)}/inventory/item-posting-profiles`}
      readOnly={settingsUiState.readOnly}
      showArchived={settingsUiState.isArchived}
    />
  );
}
