"use client";

import type { ApLedgerEntryDocumentReportResponseDto } from "@voyzu-modules/core/types/modules/ap-subledger";

import localStyles from "./ap-document-report-template.module.css";

function formatAmount(value: number): string {
  const formatted = Math.abs(value).toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return value < 0 ? `(${formatted})` : formatted;
}

function formatDate(value: string | null): string {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return value;
  }
}

export interface ApLedgerEntryDocumentReportTemplateProps {
  report: ApLedgerEntryDocumentReportResponseDto;
  generatedAt: string;
  organizationName?: string;
  showOrganization?: boolean;
}

export function ApLedgerEntryDocumentReportTemplate({
  report,
  generatedAt,
  organizationName = "",
  showOrganization = false,
}: ApLedgerEntryDocumentReportTemplateProps) {
  const {
    company,
    documentTypeLabel,
    documentId,
    documentDate,
    postingDate,
    lines,
    taxSummary,
    totals,
    appliedTransactions,
    applications,
  } = report;
  const showQuantity = lines.some((line) => line.quantity !== null);
  const showUnit = lines.some((line) => line.unitAmount !== null);
  const showNet = lines.some((line) => line.netAmount !== null);
  const showTax = lines.some((line) => line.taxAmount !== null);
  const totalApplied = appliedTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalApplications = applications.reduce((sum, application) => sum + application.amount, 0);

  return (
    <div className={localStyles.reportPage}>
      <style>{"@media print { @page { size: A4 portrait; } }"}</style>

      <header className={localStyles.reportHeader}>
        {showOrganization && organizationName && (
          <div className={localStyles.reportOrgNameCentered}>{organizationName}</div>
        )}
        <div className={localStyles.reportCompanyName}>{company.name}</div>
        <div className={`${localStyles.reportHeaderLine} ${localStyles.reportHeaderLineStrong}`}>
          {documentTypeLabel} {documentId}
        </div>
        {documentDate && <div className={localStyles.reportHeaderLine}>{formatDate(documentDate)}</div>}
      </header>

      <section className={localStyles.reportSection}>
        <div className={`${localStyles.grid12} ${localStyles.rowBordered}`}>
          <div className={`${report.counterpartyName ? localStyles.topCompany : localStyles.fullWidth} ${localStyles.addressBlock}`}>
            <p className={localStyles.label}>Company</p>
            <p className={localStyles.name}>{company.name}</p>
            <p className={localStyles.line}>{company.code}</p>
            <p className={localStyles.line}>{company.country?.name ?? company.countryCode}</p>
            <p className={localStyles.line}>Base currency {company.baseCurrencyCode}</p>
          </div>
          {report.counterpartyName && (
            <div className={`${localStyles.topCounterparty} ${localStyles.addressBlock}`}>
              <p className={localStyles.label}>Counterparty</p>
              <p className={localStyles.name}>{report.counterpartyName}</p>
              {report.counterpartyCode && <p className={localStyles.line}>{report.counterpartyCode}</p>}
              {report.counterpartyCountryCode && <p className={localStyles.line}>{report.counterpartyCountryCode}</p>}
            </div>
          )}
        </div>

        <div className={`${localStyles.grid12} ${localStyles.metaRow}`}>
          <div className={localStyles.metaSlot}>
            <p className={localStyles.label}>{documentTypeLabel}</p>
            <p className={localStyles.metaValue}>{documentId}</p>
          </div>
          {documentDate && (
            <div className={localStyles.metaSlot}>
              <p className={localStyles.label}>Document Date</p>
              <p className={localStyles.metaValue}>{formatDate(documentDate)}</p>
            </div>
          )}
          {postingDate && (
            <div className={localStyles.metaSlot}>
              <p className={localStyles.label}>Posting Date</p>
              <p className={localStyles.metaValue}>{formatDate(postingDate)}</p>
            </div>
          )}
          <div className={localStyles.metaWideSlot}>
            <p className={localStyles.label}>Description</p>
            <p className={localStyles.metaValue}>{report.description || <span className={localStyles.muted}>-</span>}</p>
          </div>
          <div className={localStyles.metaWideSlot}>
            <p className={localStyles.label}>Memo</p>
            <p className={localStyles.metaValue}>{report.memo || <span className={localStyles.muted}>-</span>}</p>
          </div>
        </div>

        {lines.length > 0 && (
          <section className={localStyles.section}>
            <h2 className={localStyles.sectionTitle}>Document Lines</h2>
            <table className={localStyles.table}>
              <thead>
                <tr>
                  <th>Line</th>
                  <th>Description</th>
                  {showQuantity && <th className={localStyles.number}>Qty</th>}
                  {showUnit && <th className={localStyles.number}>Unit</th>}
                  {showNet && <th className={localStyles.number}>Net</th>}
                  {showTax && <th className={localStyles.number}>Tax</th>}
                  <th className={localStyles.number}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.line}>
                    <td className={localStyles.code}>{line.line}</td>
                    <td>{line.description}</td>
                    {showQuantity && <td className={localStyles.number}>{line.quantity ?? "-"}</td>}
                    {showUnit && <td className={localStyles.number}>{line.unitAmount == null ? "-" : formatAmount(line.unitAmount)}</td>}
                    {showNet && <td className={localStyles.number}>{line.netAmount == null ? "-" : formatAmount(line.netAmount)}</td>}
                    {showTax && <td className={localStyles.number}>{line.taxAmount == null ? "-" : formatAmount(line.taxAmount)}</td>}
                    <td className={localStyles.number}>{formatAmount(line.grossAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {taxSummary.length > 0 && (
          <section className={localStyles.section}>
            <h2 className={localStyles.sectionTitle}>Tax Summary</h2>
            <table className={localStyles.table}>
              <thead>
                <tr>
                  <th>Tax Authority</th>
                  <th>Tax</th>
                  <th className={localStyles.number}>Taxable</th>
                  <th className={localStyles.number}>Tax Rate</th>
                  <th className={localStyles.number}>Tax Amount</th>
                </tr>
              </thead>
              <tbody>
                {taxSummary.map((tax) => (
                  <tr key={`${tax.taxAuthorityCode}-${tax.invoiceLabel ?? "tax"}-${tax.taxRate}`}>
                    <td>
                      {tax.taxAuthorityName} <span className={localStyles.muted}>{tax.taxAuthorityCode}</span>
                    </td>
                    <td>{tax.invoiceLabel ?? "-"}</td>
                    <td className={localStyles.number}>{formatAmount(tax.taxableAmount)}</td>
                    <td className={localStyles.number}>{(tax.taxRate * 100).toLocaleString("en-NZ", { maximumFractionDigits: 2 })}%</td>
                    <td className={localStyles.number}>{formatAmount(tax.taxAmount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {totals.length > 0 && (
          <div className={localStyles.totals}>
            {totals.map((total) => (
              <div key={total.label} className={localStyles.totalRow}>
                <span>{total.label}</span>
                <strong>{formatAmount(total.amount)}</strong>
              </div>
            ))}
          </div>
        )}

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
              {appliedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className={localStyles.muted}>No transactions have been applied to this document.</td>
                </tr>
              ) : (
                <>
                  {appliedTransactions.map((transaction) => (
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

        <section className={localStyles.section}>
          <h2 className={localStyles.sectionTitle}>Applications</h2>
          <table className={localStyles.table}>
            <thead>
              <tr>
                <th>Target Document Type</th>
                <th>Target Document ID</th>
                <th className={localStyles.number}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={3} className={localStyles.muted}>No applications have been made by this document.</td>
                </tr>
              ) : (
                <>
                  {applications.map((application, index) => (
                    <tr key={`${application.sourceDocumentId ?? "source"}-${application.targetDocumentId ?? "target"}-${index}`}>
                      <td>{application.targetDocumentType ?? "-"}</td>
                      <td className={localStyles.code}>{application.targetDocumentId ?? "-"}</td>
                      <td className={localStyles.number}>{formatAmount(application.amount)}</td>
                    </tr>
                  ))}
                  <tr className={localStyles.totalLine}>
                    <td />
                    <td />
                    <td className={`${localStyles.number} ${localStyles.totalAmountCell}`}>
                      <span>Total</span>
                      <strong>{formatAmount(totalApplications)}</strong>
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </section>
      </section>

      <footer className={localStyles.reportFooter}>
        <span>Generated {generatedAt}</span>
      </footer>
    </div>
  );
}
