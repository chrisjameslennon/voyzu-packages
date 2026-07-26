import "server-only";

import { Breadcrumbs } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { listFinancialDocumentDefaults } from "@voyzu-modules/all-modules/common/financial-document-defaults/server";
import { resolveServerSettingsScope } from "@voyzu-modules/all-modules/common/server";
import { OrganizationFinancialDocumentDefaultsListContent } from "../../client";

export async function OrganizationFinancialDocumentDefaultsListPage() {
  const scope = await resolveServerSettingsScope("template");
  const financialDocumentDefaults = await listFinancialDocumentDefaults(scope.companyId);

  return (
    <div className={layoutStyles.listView}>
      <header className={layoutStyles.listHeader}>
        <div className={layoutStyles.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layoutStyles.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>webhook</span></div>
          <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>Financial Document Defaults</h1>
          <div className={layoutStyles.slotTitleByline}><p className={typography.headingByline}>Financial document defaults map posting slots to general ledger or bank and cash accounts.</p></div>
        </div>
      </header>
      <OrganizationFinancialDocumentDefaultsListContent financialDocumentDefaults={financialDocumentDefaults} routePrefix="/organization" apiScope="template" />
    </div>
  );
}
