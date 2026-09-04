"use client";

import type { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import type { StockCountDetail } from "../types/stock.types";
import { stockCountReportCss, stockCountReportStyles as styles } from "./stock-count-report-template.css";

export type StockCountOrganization = Pick<
  OrganizationResponseDto,
  "code" | "name" | "countryCode" | "country" | "baseCurrencyCode"
>;

function formatDate(value: string): string {
  if (!value) return "";
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function StockCountReportTemplate({
  record,
  organization,
  generatedAt,
}: {
  record: StockCountDetail;
  organization: StockCountOrganization;
  generatedAt: string;
}) {
  return (
    <div className={styles.reportPage}>
      <style>{`${stockCountReportCss}\n@media print { @page { size: A4 portrait; } }`}</style>
      <header className={styles.reportHeader}>
        <div className={`${styles.reportHeaderLine} ${styles.reportHeaderLineStrong} ${styles.documentTypeLine}`}>Stock Count</div>
        <div className={styles.reportCompanyName}>{record.code}</div>
        <div className={`${styles.reportHeaderLine} ${styles.documentDateLine}`}>
          {formatDate(record.countDate)}
        </div>
      </header>

      <section className={styles.reportSection}>
        <div className={`${styles.grid12} ${styles.rowBordered}`}>
          <div className={`${styles.topCompany} ${styles.addressBlock}`}>
            <p className={styles.label}>Company</p>
            <p className={styles.name}>{organization.name}</p>
            <p className={styles.line}>{organization.code}</p>
            <p className={styles.line}>{organization.country?.name ?? organization.countryCode}</p>
            <p className={styles.line}>Base currency {organization.baseCurrencyCode}</p>
          </div>
          <div className={`${styles.topWarehouse} ${styles.addressBlock}`}>
            <p className={styles.label}>Warehouse</p>
            <p className={styles.name}>{record.warehouse}</p>
          </div>
        </div>

        <div className={`${styles.grid12} ${styles.metaRow}`}>
          <div className={styles.metaSlot}>
            <p className={styles.label}>Stock Count</p>
            <p className={styles.metaValue}>{record.code}</p>
          </div>
          <div className={styles.metaSlot}>
            <p className={styles.label}>Reference</p>
            <p className={styles.metaValue}>{record.reference || <span className={styles.muted}>-</span>}</p>
          </div>
          <div className={styles.metaSlot}>
            <p className={styles.label}>Count Date</p>
            <p className={styles.metaValue}>{formatDate(record.countDate)}</p>
          </div>
          <div className={styles.metaSlot}>
            <p className={styles.label}>Status</p>
            <p className={styles.metaValue}>{record.status.replaceAll("_", " ")}</p>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Stock Count Lines</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Line</th>
                <th>SKU</th>
                <th>Item</th>
                <th className={styles.number}>On Hand</th>
                <th className={styles.number}>Actual</th>
                <th className={styles.number}>Variance</th>
              </tr>
            </thead>
            <tbody>
              {record.lines.map((line, index) => (
                <tr key={line.id}>
                  <td className={styles.code}>{index + 1}</td>
                  <td className={styles.code}>{line.sku}</td>
                  <td>{line.itemName}</td>
                  <td className={styles.number}>{line.expectedQuantity}</td>
                  <td className={styles.number}>{line.countedQuantity ?? line.expectedQuantity}</td>
                  <td className={`${styles.number} ${styles.variance}`}>{line.variance ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {record.notes ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Notes</h2>
            <p className={styles.notes}>{record.notes}</p>
          </section>
        ) : null}
      </section>

      <footer className={styles.reportFooter}>Generated {generatedAt}</footer>
    </div>
  );
}
