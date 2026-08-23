import "server-only";

import { OrganizationInventoryCategoriesListContent } from "../../client";
import { listInventoryCategories } from "../../../common/inventory-categories/server";
import { listItemPostingProfiles } from "../../../common/inventory-item-posting-profiles/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

export async function OrganizationInventoryCategoriesListPage() {
  const scope = await resolveServerSettingsScope("template");
  const [categories, postingProfiles] = await Promise.all([
    listInventoryCategories(scope.companyId),
    listItemPostingProfiles(scope.companyId),
  ]);

  return (
    <OrganizationInventoryCategoriesListContent
      categories={categories}
      postingProfiles={postingProfiles}
      basePath="/finance/template/inventory/categories"
      apiPath="/api/finance/template/inventory/categories"
    />
  );
}
