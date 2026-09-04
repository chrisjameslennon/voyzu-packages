"use client";

import type { StockActivityDetail } from "../types/stock.types";
import type { StockCountOrganization } from "./StockCountReportTemplate";
import {
  stockCountReportCss,
  stockCountReportStyles as styles,
} from "./stock-count-report-template.css";
import {
  STOCK_ADJUSTMENT_REASONS,
  STOCK_ISSUE_REASONS,
  STOCK_RECEIPT_REASONS,
} from "../../core/types";

const reasonLabels = new Map<string, string>(
  [...STOCK_ADJUSTMENT_REASONS, ...STOCK_ISSUE_REASONS, ...STOCK_RECEIPT_REASONS]
    .map(({ code, label }) => [code, label]),
);

export function stockTransactionTypeLabel(type: string): string {
  return `Stock ${type.toLowerCase().replace(/(^|_)([a-z])/g, (_, prefix: string, letter: string) =>
    `${prefix ? " " : ""}${letter.toUpperCase()}`,
  )}`;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function StockTransactionReportTemplate({
  record,
  organization,
  generatedAt,
}: {
  record: StockActivityDetail;
  organization: StockCountOrganization;
  generatedAt: string;
}) {
  const documentType = stockTransactionTypeLabel(record.type);
  return (
    <div className={styles.reportPage}>
      <style>{`${stockCountReportCss}\n@media print { @page { size: A4 portrait; } }`}</style>
      <header className={styles.reportHeader}>
        <div className={`${styles.reportHeaderLine} ${styles.reportHeaderLineStrong} ${styles.documentTypeLine}`}>
          {documentType}
        </div>
        <div className={styles.reportCompanyName}>{record.code}</div>
        <div className={`${styles.reportHeaderLine} ${styles.documentDateLine}`} suppressHydrationWarning>
          {formatDate(record.date)}
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
            <p className={styles.label}>Activity Type</p>
            <p className={styles.name}>{documentType}</p>
          </div>
        </div>

        <div className={`${styles.grid12} ${styles.metaRow}`}>
          <div className={styles.metaSlot}>
            <p className={styles.label}>Document</p>
            <p className={styles.metaValue}>{record.code}</p>
          </div>
          <div className={styles.metaSlot}>
            <p className={styles.label}>Reference</p>
            <p className={styles.metaValue}>{record.reference || <span className={styles.muted}>-</span>}</p>
          </div>
          <div className={styles.metaSlot}>
            <p className={styles.label}>Date</p>
            <p className={styles.metaValue} suppressHydrationWarning>{formatDate(record.date)}</p>
          </div>
          <div className={styles.metaSlot}>
            <p className={styles.label}>Lines</p>
            <p className={styles.metaValue}>{record.lines.length}</p>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>{documentType} Lines</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Line</th>
                <th>SKU</th>
                <th>Item</th>
                <th>Warehouse</th>
                <th className={styles.number}>Quantity</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {record.lines.map((line, index) => (
                <tr key={line.id}>
                  <td className={styles.code}>{index + 1}</td>
                  <td className={styles.code}>{line.sku}</td>
                  <td>{line.itemName}</td>
                  <td>{line.warehouse}</td>
                  <td className={styles.number}>{line.quantityChange > 0 ? `+${line.quantityChange}` : line.quantityChange}</td>
                  <td>{line.reasonCode == null ? "-" : (reasonLabels.get(line.reasonCode) ?? line.reasonCode)}</td>
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

        {record.linkedDocuments.length ? (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Linked Documents</h2>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Document Type</th>
                  <th>Code</th>
                  <th>Date Linked</th>
                </tr>
              </thead>
              <tbody>
                {record.linkedDocuments.map((document) => (
                  <tr key={`${document.documentType}-${document.documentId}`}>
                    <td>{document.documentType.replaceAll("_", " ")}</td>
                    <td>
                      {document.href ? (
                        <a className={styles.documentLink} href={document.href}>
                          {document.documentCode}
                        </a>
                      ) : (
                        <span className={styles.code}>{document.documentCode}</span>
                      )}
                    </td>
                    <td suppressHydrationWarning>{formatDate(document.creationDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ) : null}
      </section>
      <footer className={styles.reportFooter} suppressHydrationWarning>Generated {generatedAt}</footer>
    </div>
  );
}
