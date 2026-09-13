import "server-only";

import { Breadcrumbs } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import { CompanySettingsTitleBadges } from "../../../common/client/index";

import { GlAccountCategoriesListContent } from "../../client/index";
import { listGlAccountCategories } from "../index";
import { getCompanySettingsUiState } from "../../../organization-finance/server/lib/company-standard-settings";
import { resolveServerCompanyApiContext, resolveServerSettingsScope } from "../../../organization-finance/server/lib/settings-scope";

export async function GlAccountCategoriesListPage() {
  const scope = await resolveServerSettingsScope();
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
        <div className={layoutStyles.slotTitle}>
          <div className={listStyles.titleIcon}>
            <span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>account_balance</span>
          </div>
          <h1 className={`${typography.pageTitle} ${layoutStyles.pageTitleResponsive}`}>Reporting Categories</h1>
          <div className={layoutStyles.slotTitleMeta}>
            <CompanySettingsTitleBadges
              showArchived={settingsUiState.isArchived}
              showReadOnly={settingsUiState.readOnly}
            />
          </div>
          <div className={layoutStyles.slotTitleByline}>
            <p className={typography.headingByline}>
              Reporting categories are system defined and cannot be added or deleted. Click on a reporting category to change the name.
            </p>
          </div>
        </div>
      </header>
      <GlAccountCategoriesListContent
        categories={categories}
        basePath="/finance/settings/reporting-categories"
        apiPath={`/api/finance/${encodeURIComponent(companyApiContext.companyCode)}/gl-account-categories`}
        readOnly={settingsUiState.readOnly}
      />
    </div>
  );
}
