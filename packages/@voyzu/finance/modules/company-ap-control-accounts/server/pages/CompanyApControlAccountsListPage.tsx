import "server-only";

import { Breadcrumbs } from "@voyzu/ui-components";
import { CompanySettingsTitleBadges } from "@voyzu/finance/common/client";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { CompanyApControlAccountSummaryPanels } from "../../client/CompanyApControlAccountSummaryPanels";
import { listControlAccountSettingsByLedger } from "../../../common/control-accounts/server";
import { getCompanySettingsUiState } from "../../../common/server/company-standard-settings";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

export async function CompanyApControlAccountsListPage() {
  const scope = await resolveServerSettingsScope("selected");
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
            <CompanySettingsTitleBadges showFinanceTemplateSettings={settingsState.usesFinanceTemplateSettings} showArchived={settingsState.isArchived} showReadOnly={settingsState.readOnly} />
          </div>
          <div className={layoutStyles.slotTitleByline}>
            <p className={typography.headingByline}>
              Accounts payable control accounts define the general ledger accounts used by supplier workflows.
            </p>
          </div>
        </div>
      </header>
      <div className={layoutStyles.slotBody}>
        <CompanyApControlAccountSummaryPanels accounts={accounts} basePath="/finance/settings/control-accounts/ap" />
      </div>
    </div>
  );
}
