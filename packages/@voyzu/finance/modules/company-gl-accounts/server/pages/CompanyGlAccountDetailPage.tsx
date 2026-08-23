import "server-only";

import { notFound } from "next/navigation";

import { getCompanySettingsUiState } from "../../../common/server/company-standard-settings";
import { listGlAccountCategories } from "../../../common/gl-account-categories/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";
import { getGlAccount } from "../../../common/gl-accounts/server";
import { CompanyGlAccountDetail } from "../../client/CompanyGlAccountDetail";

interface CompanyGlAccountDetailPageProps {
  code?: string;
}

export async function CompanyGlAccountDetailPage({ code }: CompanyGlAccountDetailPageProps) {
  if (!code) notFound();

  const scope = await resolveServerSettingsScope("selected");
  const [account, categories, settingsState] = await Promise.all([
    getGlAccount(decodeURIComponent(code), scope.companyId),
    listGlAccountCategories(scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);
  if (!account) notFound();

  return <CompanyGlAccountDetail account={account} categories={categories} readOnly={settingsState.readOnly} usesFinanceTemplateSettings={settingsState.usesFinanceTemplateSettings} isArchived={settingsState.isArchived} />;
}
