"use client";

import type { StockActivityDetail } from "../types/stock.types";
import type { StockCountOrganization } from "./StockCountReportTemplate";
import { printableDocumentCss, printableDocumentStyles as documentStyles } from "@voyzu/ui-style";
import { stockCountReportCss, stockCountReportStyles as localStyles } from "./stock-count-report-template.css";
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
    <div className={documentStyles.reportPage}>
      <style>{`${printableDocumentCss}
${stockCountReportCss}\n@media print { @page { size: A4 portrait; } }`}</style>
      <header className={documentStyles.reportHeader}>
        <div className={`${documentStyles.reportHeaderLine} ${documentStyles.reportHeaderLineStrong} ${documentStyles.documentTypeLine}`}>
          {documentType}
        </div>
        <div className={documentStyles.reportCompanyName}>{record.code}</div>
        <div className={`${documentStyles.reportHeaderLine} ${documentStyles.documentDateLine}`} suppressHydrationWarning>
          {formatDate(record.date)}
        </div>
      </header>

      <section className={documentStyles.reportSection}>
        <div className={`${documentStyles.grid12} ${documentStyles.rowBordered}`}>
          <div className={`${localStyles.topCompany} ${documentStyles.addressBlock}`}>
            <p className={documentStyles.label}>Company</p>
            <p className={documentStyles.name}>{organization.name}</p>
            <p className={documentStyles.line}>{organization.code}</p>
            <p className={documentStyles.line}>{organization.country?.name ?? organization.countryCode}</p>
            <p className={documentStyles.line}>Base currency {organization.baseCurrencyCode}</p>
          </div>
          <div className={`${localStyles.topWarehouse} ${documentStyles.addressBlock}`}>
            <p className={documentStyles.label}>Activity Type</p>
            <p className={documentStyles.name}>{documentType}</p>
          </div>
        </div>

        <div className={`${documentStyles.grid12} ${documentStyles.metaRow}`}>
          <div className={documentStyles.metaSlot}>
            <p className={documentStyles.label}>Document</p>
            <p className={documentStyles.metaValue}>{record.code}</p>
          </div>
          <div className={documentStyles.metaSlot}>
            <p className={documentStyles.label}>Reference</p>
            <p className={documentStyles.metaValue}>{record.reference || <span className={documentStyles.muted}>-</span>}</p>
          </div>
          <div className={documentStyles.metaSlot}>
            <p className={documentStyles.label}>Date</p>
            <p className={documentStyles.metaValue} suppressHydrationWarning>{formatDate(record.date)}</p>
          </div>
          <div className={documentStyles.metaSlot}>
            <p className={documentStyles.label}>Lines</p>
            <p className={documentStyles.metaValue}>{record.lines.length}</p>
          </div>
        </div>

        <section className={documentStyles.section}>
          <h2 className={documentStyles.sectionTitle}>{documentType} Lines</h2>
          <table className={documentStyles.table}>
            <thead>
              <tr>
                <th>Line</th>
                <th>SKU</th>
                <th>Item</th>
                <th>Warehouse</th>
                <th className={documentStyles.number}>Quantity</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {record.lines.map((line, index) => (
                <tr key={line.id}>
                  <td className={documentStyles.code}>{index + 1}</td>
                  <td className={documentStyles.code}>{line.sku}</td>
                  <td>{line.itemName}</td>
                  <td>{line.warehouse}</td>
                  <td className={documentStyles.number}>{line.quantityChange > 0 ? `+${line.quantityChange}` : line.quantityChange}</td>
                  <td>{line.reasonCode == null ? "-" : (reasonLabels.get(line.reasonCode) ?? line.reasonCode)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {record.notes ? (
          <section className={documentStyles.section}>
            <h2 className={documentStyles.sectionTitle}>Notes</h2>
            <p className={documentStyles.notes}>{record.notes}</p>
          </section>
        ) : null}

        {record.linkedDocuments.length ? (
          <section className={documentStyles.section}>
            <h2 className={documentStyles.sectionTitle}>Linked Documents</h2>
            <table className={documentStyles.table}>
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
                        <a className={documentStyles.documentLink} href={document.href}>
                          {document.documentCode}
                        </a>
                      ) : (
                        <span className={documentStyles.code}>{document.documentCode}</span>
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
      <footer className={documentStyles.reportFooter} suppressHydrationWarning>Generated {generatedAt}</footer>
    </div>
  );
}
