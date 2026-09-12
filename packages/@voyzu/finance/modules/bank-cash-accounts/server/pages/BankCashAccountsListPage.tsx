import "server-only";

import { Breadcrumbs } from "@voyzu/ui-components";
import { CompanySettingsTitleBadges } from "../../../common/client/index";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { BankCashAccountsListContent } from "../../client/index";
import { listBankCashAccounts } from "../index";
import { listGlAccounts } from "../../../gl-accounts/server/index";
import { getCompanySettingsUiState } from "../../../finance-companies/server/lib/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../finance-companies/server/lib/settings-scope";

export async function BankCashAccountsListPage() {
  const scope = await resolveServerSettingsScope();
  const companyApiContext = await resolveServerCompanyApiContext();
  const [accounts, glAccounts, settingsState] = await Promise.all([
    listBankCashAccounts(scope.companyId),
    listGlAccounts(scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);

  return (
    <div className={layoutStyles.listView}>
      <header className={layoutStyles.listHeader}>
        <div className={layoutStyles.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layoutStyles.slotTitle}>
          <div className={listStyles.titleIcon}>
            <span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>account_tree</span>
          </div>
          <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>Bank / Cash Accounts</h1>
          <div className={layoutStyles.slotTitleMeta}>
            <CompanySettingsTitleBadges showArchived={settingsState.isArchived} showReadOnly={settingsState.readOnly} />
          </div>
          <div className={layoutStyles.slotTitleByline}>
            <p className={typography.headingByline}>
              Bank and cash accounts define payment accounts and their linked general ledger accounts.
            </p>
          </div>
        </div>
      </header>
      <BankCashAccountsListContent
        accounts={accounts}
        glAccounts={glAccounts}
        basePath="/finance/settings/bank-cash-accounts"
        apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/bank-cash-accounts`}
        readOnly={settingsState.readOnly}
      />
    </div>
  );
}
