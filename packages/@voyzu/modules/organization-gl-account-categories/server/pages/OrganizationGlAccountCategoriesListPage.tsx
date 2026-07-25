import "server-only";

import { OrganizationGlAccountCategoriesListContent } from "../../client";
import { listGlAccountCategories } from "../../../common/gl-account-categories/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

export async function OrganizationGlAccountCategoriesListPage() {
  const scope = await resolveServerSettingsScope("template");
  const categories = await listGlAccountCategories(scope.companyId);

  return <OrganizationGlAccountCategoriesListContent categories={categories} />;
}
