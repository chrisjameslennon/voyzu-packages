import "server-only";

import { Breadcrumbs } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { CompanySettingsTitleBadges } from "@voyzu-modules/all-modules/common/client";

import { CompanyGlAccountCategoriesListContent } from "../../client";
import { listGlAccountCategories } from "../../../common/gl-account-categories/server";
import { getCompanySettingsUiState } from "../../../common/server/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../common/server/settings-scope";

export async function CompanyGlAccountCategoriesListPage() {
  const scope = await resolveServerSettingsScope("selected");
  const companyApiContext = await resolveServerCompanyApiContext();
  const [categories, settingsUiState] = await Promise.all([
    listGlAccountCategories(scope.companyId),
    getCompanySettingsUiState(scope.companyId),
  ]);

  return (
    <div className={layoutStyles.listView}>
      <header className={layoutStyles.listHeader}>
        <div className={layoutStyles.slotBreadcrumb}>
          <Breadcrumbs />
        </div>
        <div className={layoutStyles.slotTitleMeta}>
          <CompanySettingsTitleBadges
            showOrganizationBaseSettings={settingsUiState.usesOrganizationStandardSettings}
            showArchived={settingsUiState.isArchived}
            showReadOnly={settingsUiState.readOnly}
          />
        </div>
        <div className={layoutStyles.slotTitle}>
          <div className={listStyles.titleIcon}>
            <span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>account_balance</span>
          </div>
          <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>Reporting Categories</h1>
          <div className={layoutStyles.slotTitleByline}>
            <p className={typography.headingByline}>
              Reporting categories are system defined and cannot be added or deleted.
            </p>
          </div>
        </div>
      </header>
      <CompanyGlAccountCategoriesListContent
        categories={categories}
        basePath="/finance/settings/reporting-categories"
        apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/gl-account-categories`}
        readOnly={settingsUiState.readOnly}
      />
    </div>
  );
}
