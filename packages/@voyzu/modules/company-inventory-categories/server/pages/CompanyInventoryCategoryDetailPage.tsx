import "server-only";

import { notFound } from "next/navigation";

import { CompanyInventoryCategoryDetail } from "../../client";
import { listInventoryCategories } from "../../../common/inventory-categories/server";
import { listItemPostingProfiles } from "../../../common/inventory-item-posting-profiles/server";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../common/server/settings-scope";

interface CompanyInventoryCategoryDetailPageProps {
  code?: string;
}

export async function CompanyInventoryCategoryDetailPage({ code }: CompanyInventoryCategoryDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("selected");
  const companyApiContext = await resolveServerCompanyApiContext();
  const [categories, postingProfiles] = await Promise.all([
    listInventoryCategories(scope.companyId),
    listItemPostingProfiles(scope.companyId),
  ]);
  const category = categories.find((item) => item.code === decodeURIComponent(code));
  if (!category) notFound();

  return (
    <CompanyInventoryCategoryDetail
      category={category}
      postingProfiles={postingProfiles}
      listPath="/finance/inventory/categories"
      apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/inventory/categories`}
    />
  );
}
