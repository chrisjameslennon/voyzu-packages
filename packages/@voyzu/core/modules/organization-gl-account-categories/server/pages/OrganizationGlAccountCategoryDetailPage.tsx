import "server-only";

import { notFound } from "next/navigation";

import { OrganizationGlAccountCategoryDetail } from "../../client";
import { getGlAccountCategory } from "../../../common/gl-account-categories/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

interface OrganizationGlAccountCategoryDetailPageProps {
  code?: string;
}

export async function OrganizationGlAccountCategoryDetailPage({ code }: OrganizationGlAccountCategoryDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("template");
  const category = await getGlAccountCategory(decodeURIComponent(code), scope.companyId);
  if (!category) notFound();

  return (
    <OrganizationGlAccountCategoryDetail
      category={category}
      listPath="/finance/chart-of-accounts/reporting-categories"
      auditPath="/settings/audit"
      apiPath="/api/finance/gl-account-categories"
    />
  );
}
