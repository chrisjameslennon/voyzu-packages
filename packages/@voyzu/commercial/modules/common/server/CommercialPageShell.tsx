import "server-only";
import { Breadcrumbs } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

export function CommercialPageShell({ title, icon }: { title: string; icon: string }) {
  return (
    <div className={`${layout.listView} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>{icon}</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{title}</h1>
        </div>
      </header>
    </div>
  );
}
