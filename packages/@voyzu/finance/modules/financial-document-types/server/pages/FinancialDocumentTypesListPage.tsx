import "server-only";

import { Breadcrumbs } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { CompanySettingsTitleBadges } from "../../../common/client/index";
import { getCompanySettingsUiState } from "../../../finance-companies/server/lib/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../finance-companies/server/lib/settings-scope";
import { listFinancialDocumentTypes } from "../index";
import { FinancialDocumentTypesListContent } from "../../client/index";

export async function FinancialDocumentTypesListPage() {
  const scope = await resolveServerSettingsScope();
  const companyApiContext = await resolveServerCompanyApiContext();
  const [processors, settingsUiState] = await Promise.all([
    listFinancialDocumentTypes(scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);

  return (
    <div className={layoutStyles.listView}>
      <header className={layoutStyles.listHeader}>
        <div className={layoutStyles.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layoutStyles.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>webhook</span></div>
          <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>Financial Document Types</h1>
          <div className={layoutStyles.slotTitleMeta}>
            <CompanySettingsTitleBadges
              showArchived={settingsUiState.isArchived}
              showReadOnly={settingsUiState.readOnly}
            />
          </div>
          <div className={layoutStyles.slotTitleByline}><p className={typography.headingByline}>Financial document types define processor behavior for generated accounting documents.</p></div>
        </div>
      </header>
      <FinancialDocumentTypesListContent
        processors={processors}
        routePrefix="/finance/integration"
        apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/financial-document-types`}
        readOnly={settingsUiState.readOnly}
      />
    </div>
  );
}
