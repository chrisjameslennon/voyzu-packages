"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Alert, Breadcrumbs, Button, DropdownMenu } from "@voyzu/ui-components";
import layout from "@voyzu/ui-layout/css-modules/list.layout.module.css";
import listStyles from "@voyzu/ui-style/css-modules/list.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";
import type { DashboardMetric, DashboardMetrics, DashboardPeriod } from "../types/dashboard.types";
import { dashboardPeriods } from "../types/dashboard.types";
import { loadSampleData } from "../server/actions/sample-data.actions";
import styles from "./dashboard.module.css";

const panels: { key: DashboardMetric; title: string; icon: string; style: string; caption: string }[] = [
  { key: "orders", title: "Orders", icon: "shopping_bag", style: "orders", caption: "Sales orders placed" },
  { key: "customers", title: "Customer change", icon: "group", style: "customers", caption: "Net new customers" },
  { key: "purchases", title: "Purchase orders", icon: "local_shipping", style: "purchases", caption: "Purchase orders raised" },
  { key: "products", title: "Active products", icon: "inventory_2", style: "products", caption: "Active in your catalogue" },
  { key: "quotes", title: "Quotes issued", icon: "request_quote", style: "quotes", caption: "Quotes sent to customers" },
];
const format = new Intl.NumberFormat("en-NZ");
const sections: { title: string; metrics: DashboardMetric[] }[] = [
  { title: "Sales", metrics: ["orders", "customers", "quotes"] },
  { title: "Products", metrics: ["products"] },
  { title: "Purchasing", metrics: ["purchases"] },
];
const signed = (value: number) => value > 0 ? `+${format.format(value)}` : format.format(value);

export function Dashboard({ metrics, hasOrganization }: { metrics: DashboardMetrics; hasOrganization: boolean }) {
  const router = useRouter();
  const [sellingPeriod, setSellingPeriod] = useState<DashboardPeriod>("month");
  const sellingItems = metrics[sellingPeriod].topSellingItems
    .filter((item) => item.unitsSold > 0)
    .toSorted((a, b) => b.unitsSold - a.unitsSold)
    .slice(0, 5);
  const maxUnits = sellingItems[0]?.unitsSold ?? 1;
  const [periods, setPeriods] = useState<Record<DashboardMetric, DashboardPeriod>>({
    orders: "month", customers: "month", purchases: "month", products: "month", quotes: "month",
  });
  const [pending, startTransition] = useTransition();
  const [notice, setNotice] = useState<{ error?: string; message?: string } | null>(null);
  const addSampleData = () => {
    setNotice(null);
    startTransition(async () => {
      try {
        setNotice(await loadSampleData());
        router.refresh();
      } catch {
        setNotice({ error: "Sample data could not be added. Please try again." });
      }
    });
  };
  return (
    <div className={`${layout.listView} ${styles.page} vz-grid-12`}>
      <header className={layout.listHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}>
          <div className={listStyles.titleIcon}><span className={`material-symbols-outlined ${listStyles.titleIconSymbol}`}>chart_data</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>Dashboard</h1>
          <div className={layout.slotTitleByline}><p className={typography.headingByline}>Your commercial activity at a glance.</p></div>
        </div>
        <div className={layout.slotActions}><Button variant="primary" icon="add" disabled={pending || !hasOrganization} onClick={addSampleData}>{pending ? "Adding sample data…" : "Add sample data"}</Button></div>
      </header>
      <div className={layout.listBody}>
        <div className={layout.slotBody}>
          <div className={styles.content}>
            {!hasOrganization && <Alert variant="soft" color="info" title="Select an organization" text="Choose an organization to view its commercial activity." />}
            {notice && <div role="status"><Alert variant="soft" color={notice.error ? "danger" : "success"} title={notice.error ? "Unable to add sample data" : "Sample data added"} text={notice.error ?? notice.message ?? ""} /></div>}
            {sections.map((section) => <section key={section.title} className={styles.dashboardSection} aria-labelledby={`section-${section.title}`}>
              <h2 id={`section-${section.title}`} className={styles.sectionTitle}>{section.title}</h2>
              <div className={styles.panels}>
              {section.metrics.map((key) => panels.find((panel) => panel.key === key)!).map((panel) => {
                const period = periods[panel.key];
                const value = metrics[period][panel.key];
                const periodLabel = dashboardPeriods.find((option) => option.value === period)!.label;
                return (
                  <section key={panel.key} className={`${styles.panel} ${styles[panel.style]}`} aria-labelledby={`metric-${panel.key}`}>
                    <div className={styles.panelTop}>
                      <h3 id={`metric-${panel.key}`} className={styles.title}>{panel.title}</h3>
                      <DropdownMenu
                        trigger={<button type="button" className={styles.timeframe} aria-label={`${panel.title} period: ${periodLabel}`}>{periodLabel}<span aria-hidden="true"> ▾</span></button>}
                        selectedValue={period}
                        alignment="right"
                        width={240}
                        items={dashboardPeriods.map((option) => ({
                          ...option,
                          onSelect: () => setPeriods((current) => ({ ...current, [panel.key]: option.value })),
                        }))}
                      />
                    </div>
                    <div className={styles.value} aria-live="polite">{hasOrganization ? (panel.key === "customers" ? signed(value.change) : format.format(value.total)) : "—"}</div>
                    <p className={styles.caption}>{panel.caption}</p>
                    <div className={styles.footer}>
                      {panel.key === "products"
                        ? <><span className={styles.change}>{signed(value.change)}</span><span>during {periodLabel.toLowerCase()}</span></>
                        : <span>{value.total === 0 ? "No activity recorded for this period" : periodLabel}</span>}
                    </div>
                  </section>
                );
              })}
              {section.title === "Products" && <section className={styles.sellingPanel} aria-labelledby="top-selling-title">
                <div className={styles.sellingHeader}>
                  <h3 id="top-selling-title" className={styles.title}>Top 5 Selling Items</h3>
                  <DropdownMenu
                    trigger={<button type="button" className={styles.timeframe} aria-label="Top selling items period">{dashboardPeriods.find((option) => option.value === sellingPeriod)!.label}<span aria-hidden="true"> ▾</span></button>}
                    selectedValue={sellingPeriod}
                    alignment="right"
                    width={240}
                    items={dashboardPeriods.map((option) => ({ ...option, onSelect: () => setSellingPeriod(option.value) }))}
                  />
                </div>
                <div className={styles.sellingBody}>
                  <p className={styles.sellingByline}>Ranked by units sold</p>
                  {hasOrganization && sellingItems.length > 0 ? <ol className={styles.sellingList}>
                    {sellingItems.map((item) => <li key={item.id} className={styles.sellingRow}>
                      <div className={styles.sellingLabel}><span>{item.name}</span><span>{format.format(item.unitsSold)} units</span></div>
                      <div className={styles.barTrack} aria-hidden="true"><div className={styles.barFill} style={{ width: `${item.unitsSold / maxUnits * 100}%` }} /></div>
                    </li>)}
                  </ol> : <p className={styles.sellingEmpty}>{hasOrganization ? "No sales recorded for this period." : "Select an organization to view its top selling items."}</p>}
                </div>
              </section>}
              </div>
            </section>)}
          </div>
        </div>
      </div>
    </div>
  );
}
