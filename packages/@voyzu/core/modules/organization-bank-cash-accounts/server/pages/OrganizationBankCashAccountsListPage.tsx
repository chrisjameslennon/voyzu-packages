import "server-only";

import { Breadcrumbs } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { OrganizationBankCashAccountsListContent } from "../../client";
import { listBankCashAccounts } from "../../../common/bank-cash-accounts/server";
import { listGlAccounts } from "../../../common/gl-accounts/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

export async function OrganizationBankCashAccountsListPage() {
  const scope = await resolveServerSettingsScope("template");
  const [accounts, glAccounts] = await Promise.all([listBankCashAccounts(scope.companyId), listGlAccounts(scope.companyId)]);

  return (
    <div className={layoutStyles.listView}>
      <header className={layoutStyles.listHeader}>
        <div className={layoutStyles.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layoutStyles.slotTitle}>
          <div className={listStyles.titleIcon}>
            <span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>account_balance</span>
          </div>
          <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>Bank / Cash Accounts</h1>
          <div className={layoutStyles.slotTitleByline}>
            <p className={typography.headingByline}>
              Bank and cash accounts define template payment accounts and their linked general ledger accounts.
            </p>
          </div>
        </div>
      </header>
      <OrganizationBankCashAccountsListContent
        accounts={accounts}
        glAccounts={glAccounts}
        basePath="/finance/bank-cash-accounts"
        apiPath="/api/finance/bank-cash-accounts"
      />
    </div>
  );
}
