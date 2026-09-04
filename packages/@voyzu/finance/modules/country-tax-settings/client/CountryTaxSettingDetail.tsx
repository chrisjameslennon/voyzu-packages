"use client";

import type { CountryTaxSetting } from "@voyzu/finance/types/modules/country-tax-settings";
import { Badge, Breadcrumbs, Input } from "@voyzu/ui-components";
import { DetailBackButton } from "@voyzu/ui-surface/client";
import layout from "@voyzu/ui-layout/css-modules/detail.layout.module.css";
import detail from "@voyzu/ui-style/css-modules/detail.module.css";
import typography from "@voyzu/ui-style/css-modules/typography.module.css";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function interval(months: number) {
  return ({ 1: "Monthly", 2: "Every 2 months", 3: "Quarterly", 6: "Half yearly", 12: "Annually" } as Record<number, string>)[months] ?? `Every ${months} months`;
}
function rate(value: number) { return (value * 100).toFixed(3).replace(/\.?0+$/, ""); }

export function CountryTaxSettingDetail({ country }: { country: CountryTaxSetting }) {
  return (
    <div className={`${layout.detailView} ${layout.detailViewWithStatusRail}`}>
      <header className={layout.detailHeader}>
        <div className={layout.slotBreadcrumb}><Breadcrumbs /></div>
        <div className={layout.slotTitle}><div className={detail.title}>
          <div className={detail.titleIcon}><span className="material-symbols-outlined">public</span></div>
          <h1 className={`${typography.pageTitle} ${layout.pageTitleResponsive}`}>{country.name}</h1>
        </div></div>
        <div className={layout.slotActions}><div className={detail.headerActions}><DetailBackButton fallbackHref="/settings/integration/country-tax-settings" /></div></div>
      </header>
      <aside className={layout.statusSection}><div className={detail.card}><div className={detail.fieldGroup}>
        <span className={typography.fieldLabel}>Status</span><Badge variant="soft" size="x-large" color="success">{country.status}</Badge>
      </div></div></aside>
      <main className={layout.mainSection}>
        <section className={detail.card}><h2 className={typography.sectionHeading}>Country Details</h2><div className={detail.formGrid}>
          <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Code</span><Input value={country.code} disabled /></label>
          <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Name</span><Input value={country.name} disabled /></label>
          <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Currency</span><Input value={`${country.currencyName} (${country.currencyCode})`} disabled /></label>
          <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Financial Year Start</span><Input value={country.financialPeriodStartMonth ?? "-"} disabled /></label>
        </div></section>
        <section className={detail.card}><h2 className={`${typography.subsectionHeading} ${detail.sectionHeading}`}><span className="material-symbols-outlined">event_repeat</span>Tax Filing - Tax on Sales</h2><div className={detail.formGrid}>
          <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Anchor Month</span><Input value={MONTHS[country.taxFilingAnchorMonth - 1] ?? String(country.taxFilingAnchorMonth)} disabled /></label>
          <label className={detail.fieldGroup}><span className={typography.fieldLabel}>Interval</span><Input value={interval(country.taxFilingIntervalMonths)} disabled /></label>
        </div></section>
        <section className={detail.card}><h2 className={`${typography.subsectionHeading} ${detail.sectionHeading}`}><span className="material-symbols-outlined">account_balance</span>Tax Authorities</h2>
          <div className={detail.tableWrap}><table className={detail.table}><thead><tr><th>Code</th><th>Name</th><th>Region</th><th>Jurisdiction</th><th>Status</th></tr></thead><tbody>{country.taxAuthorities.map((item) => <tr key={item.id}><td className={detail.strongCell}>{item.code}</td><td>{item.name}</td><td>{item.regionCode ?? "-"}</td><td>{item.jurisdictionLevel}</td><td>{item.status}</td></tr>)}</tbody></table></div>
        </section>
        <section className={detail.card}><h2 className={`${typography.subsectionHeading} ${detail.sectionHeading}`}><span className="material-symbols-outlined">rule</span>Tax Rules</h2>
          <div className={detail.tableWrap}><table className={detail.table}><thead><tr><th>Code</th><th>Region</th><th>Name</th><th>Invoice Label</th><th>Calculation</th><th>Lines</th><th>Status</th></tr></thead><tbody>{country.taxRules.map((item) => <tr key={item.id}><td className={detail.strongCell}>{item.code}</td><td>{item.regionCode ?? "-"}</td><td>{item.name}</td><td>{item.invoiceLabel}</td><td>{item.calculationMethod === "CONFIGURED_COMPONENTS" ? "SEE TAX RULE LINES" : item.calculationMethod}</td><td className={detail.numericCell}>{item.componentCount}</td><td>{item.status}</td></tr>)}</tbody></table></div>
        </section>
        <section className={detail.card}><h2 className={`${typography.subsectionHeading} ${detail.sectionHeading}`}><span className="material-symbols-outlined">receipt_long</span>Tax Rule Lines</h2>
          <div className={detail.tableWrap}><table className={detail.table}><thead><tr><th>Code</th><th>Tax Rule</th><th>Authority</th><th>Scheme</th><th>Invoice Label</th><th>Rate</th><th>Status</th></tr></thead><tbody>{country.taxComponents.map((item) => <tr key={item.id}><td className={detail.strongCell}>{item.code}</td><td>{item.taxRuleCode}</td><td>{item.taxAuthorityCode}</td><td>{item.schemeCode}</td><td>{item.invoiceLabel}</td><td className={detail.numericCell}>{rate(item.rate)}%</td><td>{item.status}</td></tr>)}</tbody></table></div>
        </section>
      </main>
    </div>
  );
}
