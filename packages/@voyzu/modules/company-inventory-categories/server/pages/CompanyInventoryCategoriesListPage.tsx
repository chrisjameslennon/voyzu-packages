import "server-only";

import { CompanyInventoryCategoriesListContent } from "../../client";
import { listInventoryCategories } from "../../../common/inventory-categories/server";
import { listItemPostingProfiles } from "../../../common/inventory-item-posting-profiles/server";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../common/server/settings-scope";

export async function CompanyInventoryCategoriesListPage() {
  const scope = await resolveServerSettingsScope("selected");
  const companyApiContext = await resolveServerCompanyApiContext();
  const [categories, postingProfiles] = await Promise.all([
    listInventoryCategories(scope.companyId),
    listItemPostingProfiles(scope.companyId),
  ]);

  return (
    <CompanyInventoryCategoriesListContent
      categories={categories}
      postingProfiles={postingProfiles}
      basePath="/finance/inventory/categories"
      apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/inventory/categories`}
    />
  );
}
