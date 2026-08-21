import type { ArCounterpartyResponseDto } from "@voyzu/core/types/modules/ar-subledger";
import type { CompanyResponseDto } from "@voyzu/organization/types/modules/companies";

import { arCounterpartyReportCss, arCounterpartyReportStyles as styles } from "./ar-counterparty-report.css";

export function ArCounterpartyReportTemplate({
  company,
  counterparty,
  generatedAt,
}: {
  company: CompanyResponseDto;
  counterparty: ArCounterpartyResponseDto;
  generatedAt: string;
}) {
  return (
    <article className={styles.counterpartyReport}>
      <style>{`${arCounterpartyReportCss}\n@media print { @page { size: A4 portrait; } }`}</style>
      <header className={styles.reportHeader}>
        <h1 className={styles.companyName}>{company.name}</h1>
        <h2 className={styles.reportTitle}>Customer Account</h2>
      </header>

      <section className={styles.parties}>
        <div className={styles.party}>
          <p className={styles.label}>Company</p>
          <p className={styles.name}>{company.name}</p>
          <p className={styles.line}>{company.code}</p>
          <p className={styles.line}>{company.country?.name ?? company.countryCode}</p>
          <p className={styles.line}>Base currency {company.baseCurrencyCode}</p>
        </div>
        <div className={styles.party}>
          <p className={styles.label}>Customer</p>
          <p className={styles.name}>{counterparty.name}</p>
          <p className={styles.line}>{counterparty.code}</p>
          <p className={styles.line}>{counterparty.countryName ?? counterparty.countryCode ?? "-"}</p>
        </div>
      </section>

      <table className={styles.details}>
        <tbody>
          <tr><th>Customer code</th><td>{counterparty.code}</td></tr>
          <tr><th>Customer name</th><td>{counterparty.name}</td></tr>
          <tr><th>Status</th><td>{counterparty.status}</td></tr>
          <tr><th>Country</th><td>{counterparty.countryName ?? counterparty.countryCode ?? "-"}</td></tr>
          <tr><th>Tax region / province</th><td>{counterparty.taxRegionOrProvince ?? "-"}</td></tr>
        </tbody>
      </table>

      <footer className={styles.reportFooter}>Generated {generatedAt}</footer>
    </article>
  );
}
