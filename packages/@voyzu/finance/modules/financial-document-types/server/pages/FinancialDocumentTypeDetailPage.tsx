import { pageStringParameters, type PageProps } from "@voyzu/types/page-routing";
import "server-only";

import { notFound } from "next/navigation";

import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";
import { buildFinancialDocumentTypePostingTemplate, getFinancialDocumentType } from "../index";
import { FinancialDocumentTypeDetail } from "../../client/index";

export async function FinancialDocumentTypeDetailPage({ context }: PageProps) {
  const { code } = pageStringParameters(context.pathParams);
  if (!code) notFound();
  const scope = await resolveServerSettingsScope();
  const [processor, settingsUiState] = await Promise.all([
    getFinancialDocumentType((code), scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);
  if (!processor) notFound();
  const postingTemplate = await buildFinancialDocumentTypePostingTemplate(processor.code, scope.companyId, "/finance/integration");
  return (
    <FinancialDocumentTypeDetail
      processor={processor}
      postingTemplate={postingTemplate}
      readOnly={settingsUiState.readOnly}
      showArchived={settingsUiState.isArchived}
    />
  );
}
