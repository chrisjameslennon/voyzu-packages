import "server-only";

import { CompanyGlAccountsListContent } from "../../client";
import { getCompanySettingsUiState } from "../../../common/server/company-standard-settings";
import { listGlAccountCategories } from "../../../common/gl-account-categories/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";
import { listGlAccounts } from "../../../common/gl-accounts/server";

export async function CompanyGlAccountsListPage() {
  const scope = await resolveServerSettingsScope();
  const [accounts, categories, settingsState] = await Promise.all([
    listGlAccounts(scope.companyId),
    listGlAccountCategories(scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);

  return (
    <CompanyGlAccountsListContent
      accounts={accounts}
      categories={categories}
      readOnly={settingsState.readOnly}
      isArchived={settingsState.isArchived}
    />
  );
}
