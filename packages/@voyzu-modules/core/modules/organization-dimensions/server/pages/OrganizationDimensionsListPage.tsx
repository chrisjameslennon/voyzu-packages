import "server-only";

import { Breadcrumbs } from "@voyzu/ui-components";
import layoutStyles from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import { OrganizationDimensionsListContent } from "../../client";
import { listDimensions } from "../../../common/dimensions/server";
import { resolveServerSettingsScope } from "../../../common/server/settings-scope";

export async function OrganizationDimensionsListPage() {
  const scope = await resolveServerSettingsScope("template");
  const dimensions = await listDimensions(scope.companyId);

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
          <div className={layoutStyles.slotTitleByline}>
            <p className={typography.headingByline}>
              Dimensions classify template financial activity for analysis and reporting.
            </p>
          </div>
        </div>
      </header>
      <OrganizationDimensionsListContent
        dimensions={dimensions}
        basePath="/organization/dimensions"
        apiPath="/api/organization/dimensions"
      />
    </div>
  );
}
