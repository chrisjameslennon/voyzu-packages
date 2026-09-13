import "server-only";

import { Breadcrumbs } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { CompanySettingsTitleBadges } from "../../../common/client/index";

import { DimensionsListContent } from "../../client/index";
import { listDimensions } from "../index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";

export async function DimensionsListPage() {
  const scope = await resolveServerSettingsScope();
  const companyApiContext = await resolveServerCompanyApiContext();
  const [dimensions, settingsUiState] = await Promise.all([
    listDimensions(scope.companyId),
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
            <span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>category</span>
          </div>
          <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>Dimensions</h1>
          <div className={layoutStyles.slotTitleMeta}>
            <CompanySettingsTitleBadges
              showArchived={settingsUiState.isArchived}
              showReadOnly={settingsUiState.readOnly}
            />
          </div>
          <div className={layoutStyles.slotTitleByline}>
            <p className={typography.headingByline}>
              Dimensions classify financial activity for analysis and reporting.
            </p>
          </div>
        </div>
      </header>
      <DimensionsListContent
        dimensions={dimensions}
        basePath="/finance/settings/dimensions"
        apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/dimensions`}
        readOnly={settingsUiState.readOnly}
      />
    </div>
  );
}
