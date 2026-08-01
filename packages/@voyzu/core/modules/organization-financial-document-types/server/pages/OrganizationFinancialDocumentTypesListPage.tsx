import "server-only";

import { Breadcrumbs } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { listFinancialDocumentTypes } from "@voyzu/core/common/financial-document-types/server";
import { resolveServerSettingsScope } from "@voyzu/core/common/server";
import { OrganizationFinancialDocumentTypesListContent } from "../../client";

export async function OrganizationFinancialDocumentTypesListPage() {
  const scope = await resolveServerSettingsScope("template");
  const processors = await listFinancialDocumentTypes(scope.companyId);

  return (
    <div className={layoutStyles.listView}>
      <header className={layoutStyles.listHeader}>
        <div className={layoutStyles.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layoutStyles.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>webhook</span></div>
          <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>Financial Document Types</h1>
          <div className={layoutStyles.slotTitleByline}><p className={typography.headingByline}>Financial document types define processor behavior for generated accounting documents.</p></div>
        </div>
      </header>
      <OrganizationFinancialDocumentTypesListContent processors={processors} routePrefix="/organization" apiScope="template" />
    </div>
  );
}
