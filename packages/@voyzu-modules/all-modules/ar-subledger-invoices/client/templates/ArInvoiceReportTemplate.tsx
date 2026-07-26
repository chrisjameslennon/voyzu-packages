"use client";

import type { ArInvoiceStatementResponseDto } from "@voyzu-modules/types/modules/ar-subledger";

import localStyles from "./ar-document-report-template.module.css";

function formatAmount(value: number): string {
  const formatted = Math.abs(value).toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return value < 0 ? `(${formatted})` : formatted;
}

function formatDate(value: string): string {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return value;
  }
}

export interface ArInvoiceReportTemplateProps {
  statement: ArInvoiceStatementResponseDto;
  generatedAt: string;
  organizationName?: string;
  showOrganization?: boolean;
}

export function ArInvoiceReportTemplate({
  statement,
  generatedAt,
  organizationName = "",
  showOrganization = false,
}: ArInvoiceReportTemplateProps) {
  const { company, invoice } = statement;
  const totalApplied = statement.transactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <div className={localStyles.reportPage}>
      <style>{"@media print { @page { size: A4 portrait; } }"}</style>

      <header className={localStyles.reportHeader}>
        {showOrganization && organizationName && (
          <div className={localStyles.reportOrgNameCentered}>{organizationName}</div>
        )}
        <div className={localStyles.reportCompanyName}>{company.name}</div>
        <div className={`${localStyles.reportHeaderLine} ${localStyles.reportHeaderLineStrong}`}>
          Invoice {invoice.document_id}
        </div>
        <div className={localStyles.reportHeaderLine}>{formatDate(invoice.invoice_date)}</div>
      </header>

      <section className={localStyles.reportSection}>
        <div className={`${localStyles.grid12} ${localStyles.rowBordered}`}>
          <div className={`${localStyles.topCompany} ${localStyles.addressBlock}`}>
            <p className={localStyles.label}>Company</p>
            <p className={localStyles.name}>{company.name}</p>
            <p className={localStyles.line}>{company.code}</p>
            <p className={localStyles.line}>{company.country?.name ?? company.countryCode}</p>
            <p className={localStyles.line}>Base currency {company.baseCurrencyCode}</p>
          </div>
          <div className={`${localStyles.topCounterparty} ${localStyles.addressBlock}`}>
            <p className={localStyles.label}>Counterparty</p>
            <p className={localStyles.name}>{statement.counterpartyName}</p>
            <p className={localStyles.line}>{statement.counterpartyCode}</p>
            <p className={localStyles.line}>{invoice.ar_counterparty.country_code}</p>
          </div>
        </div>

        <div className={`${localStyles.grid12} ${localStyles.metaRow}`}>
          <div className={localStyles.metaSlot}>
            <p className={localStyles.label}>Invoice</p>
            <p className={localStyles.metaValue}>{invoice.document_id}</p>
          </div>
          <div className={localStyles.metaSlot}>
            <p className={localStyles.label}>Memo</p>
            <p className={localStyles.metaValue}>{invoice.document_memo || <span className={localStyles.muted}>-</span>}</p>
          </div>
          <div className={localStyles.metaSlot}>
            <p className={localStyles.label}>Invoice Date</p>
            <p className={localStyles.metaValue}>{formatDate(invoice.invoice_date)}</p>
          </div>
          <div className={localStyles.metaSlot}>
            <p className={localStyles.label}>Posting Date</p>
            <p className={localStyles.metaValue}>{formatDate(invoice.posting_date)}</p>
          </div>
        </div>

        <section className={localStyles.section}>
          <h2 className={localStyles.sectionTitle}>Invoice Lines</h2>
          <table className={localStyles.table}>
            <thead>
              <tr>
                <th>Line</th>
                <th>Description</th>
                <th className={localStyles.number}>Qty</th>
                <th className={localStyles.number}>Unit</th>
                <th className={localStyles.number}>Net</th>
                <th className={localStyles.number}>Tax</th>
                <th className={localStyles.number}>Gross</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lines.map((line) => (
                <tr key={line.line_id}>
                  <td className={localStyles.code}>{line.line_id}</td>
                  <td>{line.line_description}</td>
                  <td className={localStyles.number}>{line.quantity ?? "-"}</td>
                  <td className={localStyles.number}>{line.net_unit_price == null ? "-" : formatAmount(line.net_unit_price)}</td>
                  <td className={localStyles.number}>{formatAmount(line.net_line_total)}</td>
                  <td className={localStyles.number}>{formatAmount(line.tax_amount)}</td>
                  <td className={localStyles.number}>{formatAmount(line.gross_line_total)}</td>
                </tr>
              ))}
              <tr className={localStyles.totalLine}>
                <td />
                <td>Total</td>
                <td />
                <td />
                <td className={localStyles.number}>{formatAmount(invoice.net_amount)}</td>
                <td className={localStyles.number}>{formatAmount(invoice.tax_amount)}</td>
                <td className={localStyles.number}>{formatAmount(invoice.gross_amount)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className={localStyles.section}>
          <h2 className={localStyles.sectionTitle}>Applied Transactions</h2>
          <table className={localStyles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Document ID</th>
                <th>Document</th>
                <th>Code</th>
                <th className={localStyles.number}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {statement.transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className={localStyles.muted}>No transactions have been applied to this invoice.</td>
                </tr>
              ) : (
                <>
                  {statement.transactions.map((transaction) => (
                    <tr key={transaction.code}>
                      <td>{formatDate(transaction.postingDate)}</td>
                      <td className={localStyles.code}>{transaction.documentId}</td>
                      <td>{transaction.documentTypeLabel}</td>
                      <td className={localStyles.code}>{transaction.code}</td>
                      <td className={localStyles.number}>{formatAmount(transaction.amount)}</td>
                    </tr>
                  ))}
                  <tr className={localStyles.totalLine}>
                    <td />
                    <td>Total</td>
                    <td />
                    <td />
                    <td className={localStyles.number}>{formatAmount(totalApplied)}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </section>

        <div className={localStyles.payableLine}>
          <span className={localStyles.payableLabel}>Total amount payable</span>
          <span className={localStyles.payableValue}>{formatAmount(statement.openBalance)}</span>
        </div>
      </section>

      <footer className={localStyles.reportFooter}>
        <span>Generated {generatedAt}</span>
      </footer>
    </div>
  );
}
