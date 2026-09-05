import { Breadcrumbs } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

import styles from "./integration-unavailable-page.module.css";

export function IntegrationUnavailablePage({ pageTitle, packageName, message, icon = "extension_off" }: { pageTitle: string; packageName: string; message: string; icon?: string }) {
  return <div className={layout.listView}>
    <header className={layout.listHeader}>
      <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
      <div className={layout.slotTitle}><div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>{icon}</span></div><h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{pageTitle}</h1></div>
    </header>
    <main className={layout.listBody}><div className={layout.slotBody}><div className={styles.frame}><section className={styles.card}><div className={styles.icon}><span className="material-symbols-outlined">deployed_code_alert</span></div><p className={typography.eyebrow}>INTEGRATION UNAVAILABLE</p><h2 className={typography.contentTitle}>{packageName} package not installed</h2><p className={`${typography.bodyText} ${styles.message}`}>{message}</p></section></div></div></main>
  </div>;
}
