import "server-only";

import { notFound } from "next/navigation";

import { OrganizationInventoryCategoryDetail } from "../../client";
import { listInventoryCategories } from "../../../common/inventory-categories/server";
import { listItemPostingProfiles } from "../../../common/inventory-item-posting-profiles/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

interface OrganizationInventoryCategoryDetailPageProps {
  code?: string;
}

export async function OrganizationInventoryCategoryDetailPage({ code }: OrganizationInventoryCategoryDetailPageProps) {
  if (!code) notFound();
  const scope = await resolveServerSettingsScope("template");
  const [categories, postingProfiles] = await Promise.all([
    listInventoryCategories(scope.companyId),
    listItemPostingProfiles(scope.companyId),
  ]);
  const category = categories.find((item) => item.code === decodeURIComponent(code));
  if (!category) notFound();

  return (
    <OrganizationInventoryCategoryDetail
      category={category}
      postingProfiles={postingProfiles}
      listPath="/finance/inventory/categories"
      apiPath="/api/finance/inventory/categories"
    />
  );
}
