import "server-only";

import { notFound } from "next/navigation";

import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { listGlAccountCategories } from "../../../gl-account-categories/server/index";
import { resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";
import { getGlAccount } from "../index";
import { GlAccountDetail } from "../../client/GlAccountDetail";

interface CompanyGlAccountDetailPageProps {
  code?: string;
}

export async function GlAccountDetailPage({ code }: CompanyGlAccountDetailPageProps) {
  if (!code) notFound();

  const scope = await resolveServerSettingsScope();
  const [account, categories, settingsState] = await Promise.all([
    getGlAccount(decodeURIComponent(code), scope.companyId),
    listGlAccountCategories(scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);
  if (!account) notFound();

  return <GlAccountDetail account={account} categories={categories} readOnly={settingsState.readOnly} isArchived={settingsState.isArchived} />;
}
