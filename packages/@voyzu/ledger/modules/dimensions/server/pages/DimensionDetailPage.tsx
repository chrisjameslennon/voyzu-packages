import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";

import { DimensionDetail } from "../../client/index";
import { getDimension } from "../index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { resolveServerCompanyHttpApiContext, resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";

export async function DimensionDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  if (!code) notFound();
  const scope = await resolveServerSettingsScope();
  const companyHttpApiContext = await resolveServerCompanyHttpApiContext();
  const [dimension, settingsUiState] = await Promise.all([
    getDimension((code), scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);
  if (!dimension) notFound();

  return (
    <DimensionDetail
      dimension={dimension}
      listPath="/ledger/settings/dimensions"
      auditPath="/settings/audit"
      httpApiPath={`/api/ledger/${encodeURIComponent(companyHttpApiContext.companyCode)}/dimensions`}
      readOnly={settingsUiState.readOnly}
      showArchived={settingsUiState.isArchived}
    />
  );
}
