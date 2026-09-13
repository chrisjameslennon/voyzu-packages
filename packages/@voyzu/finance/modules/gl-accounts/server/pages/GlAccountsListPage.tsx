import "server-only";

import { GlAccountsListContent } from "../../client/index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { listGlAccountCategories } from "../../../gl-account-categories/server/index";
import { resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";
import { listGlAccounts } from "../index";

export async function GlAccountsListPage() {
  const scope = await resolveServerSettingsScope();
  const [accounts, categories, settingsState] = await Promise.all([
    listGlAccounts(scope.companyId),
    listGlAccountCategories(scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);

  return (
    <GlAccountsListContent
      accounts={accounts}
      categories={categories}
      readOnly={settingsState.readOnly}
      isArchived={settingsState.isArchived}
    />
  );
}
