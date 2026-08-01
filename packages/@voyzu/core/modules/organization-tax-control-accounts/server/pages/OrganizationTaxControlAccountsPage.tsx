import "server-only";

import { Breadcrumbs } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { OrganizationTaxControlAccountsContent } from "../../client";
import { listTaxControlAccounts } from "../../../common/tax-control-accounts/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

export async function OrganizationTaxControlAccountsPage() {
  const scope = await resolveServerSettingsScope("template");
  const controlAccounts = await listTaxControlAccounts(scope.companyId);
  return (
    <div className={`${layoutStyles.listView} ${layoutStyles.compactMobilePadding}`}>
      <header className={layoutStyles.listHeader}>
        <div className={layoutStyles.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layoutStyles.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>account_tree</span></div>
          <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>Tax Control Accounts</h1>
          <div className={layoutStyles.slotTitleByline}><p className={typography.headingByline}>Tax control accounts define the template general ledger accounts used by tax workflows.</p></div>
        </div>
      </header>
      <div className={layoutStyles.slotBody}><OrganizationTaxControlAccountsContent controlAccounts={controlAccounts} basePath="/organization/control-accounts/tax" /></div>
    </div>
  );
}
