import "server-only";

import { notFound } from "next/navigation";

import { CompanyDimensionDetail } from "../../client";
import { getDimension } from "../../../common/dimensions/server";
import { getCompanySettingsUiState } from "../../../common/server/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../common/server/settings-scope";

interface CompanyDimensionDetailPageProps {
  code?: string;
}

export async function CompanyDimensionDetailPage({ code }: CompanyDimensionDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("selected");
  const companyApiContext = await resolveServerCompanyApiContext();
  const [dimension, settingsUiState] = await Promise.all([
    getDimension(decodeURIComponent(code), scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);
  if (!dimension) notFound();

  return (
    <CompanyDimensionDetail
      dimension={dimension}
      listPath="/finance/settings/dimensions"
      auditPath="/finance/audit"
      apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/dimensions`}
      readOnly={settingsUiState.readOnly}
      showOrganizationBaseSettings={settingsUiState.usesOrganizationStandardSettings}
      showArchived={settingsUiState.isArchived}
    />
  );
}
