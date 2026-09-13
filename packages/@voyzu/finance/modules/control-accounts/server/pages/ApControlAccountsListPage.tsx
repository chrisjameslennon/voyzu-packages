import "server-only";

import { Breadcrumbs } from "@voyzu/ui-components";
import { CompanySettingsTitleBadges } from "../../../common/client/index";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { ApControlAccountSummaryPanels } from "../../client/ApControlAccountSummaryPanels";
import { listControlAccountSettingsByLedger } from "../index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";

export async function ApControlAccountsListPage() {
  const scope = await resolveServerSettingsScope();
  const [accounts, settingsState] = await Promise.all([
    listControlAccountSettingsByLedger("ACCOUNTS_PAYABLE", scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);

  return (
    <div className={`${layoutStyles.listView} ${layoutStyles.compactMobilePadding}`}>
      <header className={layoutStyles.listHeader}>
        <div className={layoutStyles.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layoutStyles.slotTitle}>
          <div className={listStyles.titleIcon}>
            <span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>account_tree</span>
          </div>
          <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>Accounts Payable Control Accounts</h1>
          <div className={layoutStyles.slotTitleMeta}>
            <CompanySettingsTitleBadges showArchived={settingsState.isArchived} showReadOnly={settingsState.readOnly} />
          </div>
          <div className={layoutStyles.slotTitleByline}>
            <p className={typography.headingByline}>
              Accounts payable control accounts define the general ledger accounts used by supplier workflows.
            </p>
          </div>
        </div>
      </header>
      <div className={layoutStyles.slotBody}>
        <ApControlAccountSummaryPanels accounts={accounts} basePath="/finance/settings/control-accounts/ap" />
      </div>
    </div>
  );
}
