import "server-only";

import { notFound } from "next/navigation";

import { OrganizationDimensionDetail } from "../../client";
import { getDimension } from "../../../common/dimensions/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

interface OrganizationDimensionDetailPageProps {
  code?: string;
}

export async function OrganizationDimensionDetailPage({ code }: OrganizationDimensionDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("template");
  const dimension = await getDimension(decodeURIComponent(code), scope.companyId);
  if (!dimension) notFound();

  return (
    <OrganizationDimensionDetail
      dimension={dimension}
      listPath="/finance/dimensions"
      auditPath="/settings/audit"
      apiPath="/api/finance/dimensions"
    />
  );
}
