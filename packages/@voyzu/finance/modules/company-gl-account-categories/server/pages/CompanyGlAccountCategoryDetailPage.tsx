import "server-only";

import { notFound } from "next/navigation";

import { CompanyGlAccountCategoryDetail } from "../../client";
import { getGlAccountCategory } from "../../../common/gl-account-categories/server";
import { getCompanySettingsUiState } from "../../../common/server/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../common/server/settings-scope";

interface CompanyGlAccountCategoryDetailPageProps {
  code?: string;
}

export async function CompanyGlAccountCategoryDetailPage({ code }: CompanyGlAccountCategoryDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("selected");
  const companyApiContext = await resolveServerCompanyApiContext();
  const [category, settingsUiState] = await Promise.all([
    getGlAccountCategory(decodeURIComponent(code), scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);
  if (!category) notFound();

  return (
    <CompanyGlAccountCategoryDetail
      category={category}
      listPath="/finance/settings/reporting-categories"
      auditPath="/settings/audit"
      apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/gl-account-categories`}
      readOnly={settingsUiState.readOnly}
      showOrganizationBaseSettings={settingsUiState.usesOrganizationStandardSettings}
      showArchived={settingsUiState.isArchived}
    />
  );
}
