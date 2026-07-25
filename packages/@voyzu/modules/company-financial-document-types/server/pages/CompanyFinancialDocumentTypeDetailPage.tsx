import "server-only";

import { notFound } from "next/navigation";

import { getCompanySettingsUiState } from "@voyzu/modules/common/server";
import { resolveServerSettingsScope } from "@voyzu/modules/common/server";
import { buildFinancialDocumentTypePostingTemplate, getFinancialDocumentType } from "@voyzu/modules/common/financial-document-types/server";
import { CompanyFinancialDocumentTypeDetail } from "../../client";

export async function CompanyFinancialDocumentTypeDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("selected");
  const [processor, settingsUiState] = await Promise.all([
    getFinancialDocumentType(decodeURIComponent(code), scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);
  if (!processor) notFound();
  const postingTemplate = await buildFinancialDocumentTypePostingTemplate(processor.code, scope.companyId, "/finance/integration");
  return (
    <CompanyFinancialDocumentTypeDetail
      processor={processor}
      postingTemplate={postingTemplate}
      readOnly={settingsUiState.readOnly}
      showOrganizationBaseSettings={settingsUiState.usesOrganizationStandardSettings}
      showArchived={settingsUiState.isArchived}
    />
  );
}
