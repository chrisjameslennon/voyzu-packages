import "server-only";

import { Breadcrumbs } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { OrganizationArControlAccountSummaryPanels } from "../../client/OrganizationArControlAccountSummaryPanels";
import { listControlAccountSettingsByLedger } from "../../../common/control-accounts/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

export async function OrganizationArControlAccountsListPage() {
  const scope = await resolveServerSettingsScope("template");
  const accounts = await listControlAccountSettingsByLedger("ACCOUNTS_RECEIVABLE", scope.companyId);

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
          <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>Accounts Receivable Control Accounts</h1>
          <div className={layoutStyles.slotTitleByline}>
            <p className={typography.headingByline}>
              Accounts receivable control accounts define the template general ledger accounts used by customer workflows.
            </p>
          </div>
        </div>
      </header>
      <div className={layoutStyles.slotBody}>
        <OrganizationArControlAccountSummaryPanels accounts={accounts} basePath="/finance/control-accounts/ar" />
      </div>
    </div>
  );
}
