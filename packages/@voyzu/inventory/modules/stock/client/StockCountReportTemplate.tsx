"use client";

import type { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";
import type { StockCountDetail } from "../types/stock.types";
import { printableDocumentCss, printableDocumentStyles as documentStyles } from "@voyzu/ui-style";
import { stockCountReportCss, stockCountReportStyles as localStyles } from "./stock-count-report-template.css";

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
    <div className={documentStyles.reportPage}>
      <style>{`${printableDocumentCss}
${stockCountReportCss}\n@media print { @page { size: A4 portrait; } }`}</style>
      <header className={documentStyles.reportHeader}>
        <div className={`${documentStyles.reportHeaderLine} ${documentStyles.reportHeaderLineStrong} ${documentStyles.documentTypeLine}`}>Stock Count</div>
        <div className={documentStyles.reportCompanyName}>{record.code}</div>
        <div className={`${documentStyles.reportHeaderLine} ${documentStyles.documentDateLine}`} suppressHydrationWarning>
          {formatDate(record.countDate)}
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
            <p className={documentStyles.label}>Warehouse</p>
            <p className={documentStyles.name}>{record.warehouse}</p>
          </div>
        </div>

        <div className={`${documentStyles.grid12} ${documentStyles.metaRow}`}>
          <div className={documentStyles.metaSlot}>
            <p className={documentStyles.label}>Stock Count</p>
            <p className={documentStyles.metaValue}>{record.code}</p>
          </div>
          <div className={documentStyles.metaSlot}>
            <p className={documentStyles.label}>Reference</p>
            <p className={documentStyles.metaValue}>{record.reference || <span className={documentStyles.muted}>-</span>}</p>
          </div>
          <div className={documentStyles.metaSlot}>
            <p className={documentStyles.label}>Count Date</p>
            <p className={documentStyles.metaValue} suppressHydrationWarning>{formatDate(record.countDate)}</p>
          </div>
          <div className={documentStyles.metaSlot}>
            <p className={documentStyles.label}>Status</p>
            <p className={documentStyles.metaValue}>{record.status.replaceAll("_", " ")}</p>
          </div>
        </div>

        <section className={documentStyles.section}>
          <h2 className={documentStyles.sectionTitle}>Stock Count Lines</h2>
          <table className={documentStyles.table}>
            <thead>
              <tr>
                <th>Line</th>
                <th>SKU</th>
                <th>Item</th>
                <th className={documentStyles.number}>On Hand</th>
                <th className={documentStyles.number}>Actual</th>
                <th className={documentStyles.number}>Variance</th>
              </tr>
            </thead>
            <tbody>
              {record.lines.map((line, index) => (
                <tr key={line.id}>
                  <td className={documentStyles.code}>{index + 1}</td>
                  <td className={documentStyles.code}>{line.sku}</td>
                  <td>{line.itemName}</td>
                  <td className={documentStyles.number}>{line.expectedQuantity}</td>
                  <td className={documentStyles.number}>{line.countedQuantity ?? line.expectedQuantity}</td>
                  <td className={`${documentStyles.number} ${documentStyles.variance}`}>{line.variance ?? 0}</td>
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
      </section>

      <footer className={documentStyles.reportFooter} suppressHydrationWarning>Generated {generatedAt}</footer>
    </div>
  );
}
