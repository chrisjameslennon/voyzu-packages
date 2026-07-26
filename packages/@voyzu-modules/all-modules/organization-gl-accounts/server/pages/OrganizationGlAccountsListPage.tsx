import "server-only";

import { OrganizationGlAccountsListContent } from "../../client";
import { listGlAccountCategories } from "../../../common/gl-account-categories/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";
import { listGlAccounts } from "../../../common/gl-accounts/server";

export async function OrganizationGlAccountsListPage() {
  const scope = await resolveServerSettingsScope("template");
  const [accounts, categories] = await Promise.all([
    listGlAccounts(scope.companyId),
    listGlAccountCategories(scope.companyId),
  ]);

  return (
    <OrganizationGlAccountsListContent
      accounts={accounts}
      categories={categories}
    />
  );
}
