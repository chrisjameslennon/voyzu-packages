import "server-only";

import { notFound } from "next/navigation";

import { GlAccountCategoryDetail } from "../../client/index";
import { getGlAccountCategory } from "../index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { resolveServerCompanyHttpApiContext, resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";

interface CompanyGlAccountCategoryDetailPageProps {
  code?: string;
}

export async function GlAccountCategoryDetailPage({ code }: CompanyGlAccountCategoryDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope();
  const companyHttpApiContext = await resolveServerCompanyHttpApiContext();
  const [category, settingsUiState] = await Promise.all([
    getGlAccountCategory(decodeURIComponent(code), scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);
  if (!category) notFound();

  return (
    <GlAccountCategoryDetail
      category={category}
      listPath="/finance/settings/reporting-categories"
      auditPath="/settings/audit"
      httpApiPath={`/api/finance/${encodeURIComponent(companyHttpApiContext.companyCode)}/gl-account-categories`}
      readOnly={settingsUiState.readOnly}
      showArchived={settingsUiState.isArchived}
    />
  );
}
