import "server-only";
import { Breadcrumbs } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

export function CountryTaxSettingsListSlotPage() {
  return (
    <div className={layout.listView}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Country Tax Settings</h1>
        </div>
      </header>
    </div>
  );
}
