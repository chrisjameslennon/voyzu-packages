import "server-only";

import { Breadcrumbs } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { listFinancialDocumentDefaults } from "@voyzu/modules/common/financial-document-defaults/server";
import { CompanySettingsTitleBadges } from "@voyzu/modules/common/client";
import { getCompanySettingsUiState } from "@voyzu/modules/common/server";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "@voyzu/modules/common/server";
import { CompanyFinancialDocumentDefaultsListContent } from "../../client";

export async function CompanyFinancialDocumentDefaultsListPage() {
  const scope = await resolveServerSettingsScope("selected");
  const companyApiContext = await resolveServerCompanyApiContext();
  const [financialDocumentDefaults, settingsUiState] = await Promise.all([
    listFinancialDocumentDefaults(scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);

  return (
    <div className={layoutStyles.listView}>
      <header className={layoutStyles.listHeader}>
        <div className={layoutStyles.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layoutStyles.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>webhook</span></div>
          <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>Financial Document Defaults</h1>
          <div className={layoutStyles.slotTitleByline}><p className={typography.headingByline}>Financial document defaults map posting slots to general ledger or bank and cash accounts.</p></div>
        </div>
        <div className={layoutStyles.slotTitleMeta}>
          <CompanySettingsTitleBadges
            showOrganizationBaseSettings={settingsUiState.usesOrganizationStandardSettings}
            showArchived={settingsUiState.isArchived}
            showReadOnly={settingsUiState.readOnly}
          />
        </div>
      </header>
      <CompanyFinancialDocumentDefaultsListContent
        financialDocumentDefaults={financialDocumentDefaults}
        routePrefix="/finance/integration"
        apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/financial-document-defaults`}
        readOnly={settingsUiState.readOnly}
      />
    </div>
  );
}
