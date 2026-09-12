import "server-only";

import { notFound } from "next/navigation";

import { DimensionDetail } from "../../client/index";
import { getDimension } from "../index";
import { getCompanySettingsUiState } from "../../../finance-companies/server/lib/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../finance-companies/server/lib/settings-scope";

interface CompanyDimensionDetailPageProps {
  code?: string;
}

export async function DimensionDetailPage({ code }: CompanyDimensionDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope();
  const companyApiContext = await resolveServerCompanyApiContext();
  const [dimension, settingsUiState] = await Promise.all([
    getDimension(decodeURIComponent(code), scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);
  if (!dimension) notFound();

  return (
    <DimensionDetail
      dimension={dimension}
      listPath="/finance/settings/dimensions"
      auditPath="/settings/audit"
      apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/dimensions`}
      readOnly={settingsUiState.readOnly}
      showArchived={settingsUiState.isArchived}
    />
  );
}
