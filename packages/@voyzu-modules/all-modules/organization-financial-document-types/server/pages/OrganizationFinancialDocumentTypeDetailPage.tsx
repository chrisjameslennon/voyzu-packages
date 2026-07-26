import "server-only";

import { notFound } from "next/navigation";

import { buildFinancialDocumentTypePostingTemplate, getFinancialDocumentType } from "@voyzu-modules/all-modules/common/financial-document-types/server";
import { resolveServerSettingsScope } from "@voyzu-modules/all-modules/common/server";
import { OrganizationFinancialDocumentTypeDetail } from "../../client";

export async function OrganizationFinancialDocumentTypeDetailPage({ code }: { code?: string }) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("template");
  const processor = await getFinancialDocumentType(decodeURIComponent(code), scope.companyId);
  if (!processor) notFound();
  const postingTemplate = await buildFinancialDocumentTypePostingTemplate(processor.code, scope.companyId, "/organization");
  return <OrganizationFinancialDocumentTypeDetail processor={processor} postingTemplate={postingTemplate} />;
}
