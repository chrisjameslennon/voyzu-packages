"use client";

import type { ApCounterpartyStatementResponseDto } from "@voyzu/core/types/modules/ap-subledger";

import {
  arStatementReportCss as apStatementReportCss,
  arStatementReportStyles as localStyles,
} from "../../../ar-subledger-statements/client/templates/ar-document-report-template.css";

function formatAmount(value: number): string {
  if (value === 0) return "-";
  const formatted = Math.abs(value).toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return value < 0 ? `(${formatted})` : formatted;
}

function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function formatDate(value: string): string {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return value;
  }
}

function memoOrDescription(memo: string | null, description: string) {
  return memo || description || <span className={localStyles.muted}>-</span>;
}

export function ApCounterpartyStatementReportTemplate({
  statement,
  generatedAt,
}: {
  statement: ApCounterpartyStatementResponseDto;
  generatedAt: string;
}) {
  const { company } = statement;
  let runningBalance = 0;
  const statementRows = statement.groups
    .flatMap((group, groupIndex) => [
      { kind: "group" as const, key: `group-${groupIndex}-${group.code}-${group.documentId}`, row: group, appliedTo: group.appliedToDocumentId ?? "" },
      ...group.applications.map((application, index) => ({
        kind: "application" as const,
        key: `application-${groupIndex}-${group.code}-${application.code}-${application.documentId}-${index}`,
        row: application,
        appliedTo: application.appliedToDocumentId ?? group.documentId,
      })),
    ])
    .sort((a, b) => a.row.postingDate.localeCompare(b.row.postingDate) || a.row.code.localeCompare(b.row.code) || a.key.localeCompare(b.key))
    .map((entry) => {
      runningBalance = roundMoney(runningBalance + entry.row.credit - entry.row.debit);
      return { ...entry, runningBalance };
    });

  return (
    <div className={localStyles.reportPage}>
      <style>{`${apStatementReportCss}\n@media print { @page { size: A4 landscape; } }`}</style>
      <header className={localStyles.reportHeader}>
        <div className={localStyles.reportCompanyName}>{company.name}</div>
        <div className={`${localStyles.reportHeaderLine} ${localStyles.reportHeaderLineStrong}`}>Supplier Statement</div>
        <div className={localStyles.reportHeaderLine}>As at {formatDate(statement.asAtDate)}</div>
      </header>
      <section className={localStyles.reportSection}>
        <div className={`${localStyles.grid12} ${localStyles.rowBordered}`}>
          <div className={`${localStyles.topCompany} ${localStyles.addressBlock}`}>
            <p className={localStyles.label}>Company</p><p className={localStyles.name}>{company.name}</p>
            <p className={localStyles.line}>{company.code}</p><p className={localStyles.line}>{company.country?.name ?? company.countryCode}</p>
            <p className={localStyles.line}>Base currency {company.baseCurrencyCode}</p>
          </div>
          <div className={`${localStyles.topCounterparty} ${localStyles.addressBlock}`}>
            <p className={localStyles.label}>Supplier</p><p className={localStyles.name}>{statement.counterpartyName}</p><p className={localStyles.line}>{statement.counterpartyCode}</p>
          </div>
        </div>
        <div className={`${localStyles.grid12} ${localStyles.metaRow}`}>
          <div className={localStyles.statementMetaSlot}><p className={localStyles.label}>Statement Date</p><p className={localStyles.metaValue}>{formatDate(statement.asAtDate)}</p></div>
          <div className={localStyles.statementMetaSlot}><p className={localStyles.label}>Currency</p><p className={localStyles.metaValue}>{statement.baseCurrencyCode}</p></div>
          <div className={localStyles.statementMetaSlot}><p className={localStyles.label}>Total Owing</p><p className={localStyles.metaValue}>{formatAmount(statement.totalOwing)}</p></div>
        </div>
        <section className={localStyles.section}>
          <h2 className={localStyles.sectionTitle}>Statement</h2>
          {statementRows.length === 0 ? <p className={localStyles.muted}>No transactions on this account.</p> : (
            <table className={localStyles.table}>
              <thead><tr><th>Date</th><th>Document</th><th>Code</th><th>Doc ID</th><th>Applied To</th><th>Memo / Description</th><th className={localStyles.number}>Debit</th><th className={localStyles.number}>Credit</th><th className={localStyles.number}>Balance</th></tr></thead>
              <tbody>{statementRows.map(({ kind, key, row, appliedTo, runningBalance: balance }) => (
                <tr key={key} className={kind === "group" ? localStyles.rootRow : localStyles.applicationRow}>
                  <td className={kind === "application" ? localStyles.firstAppCell : undefined}>{formatDate(row.postingDate)}</td>
                  <td>{kind === "application" ? <span className={localStyles.appLabel}>{row.documentTypeLabel}</span> : row.documentTypeLabel}</td>
                  <td className={localStyles.code}>{row.code}</td><td className={localStyles.code}>{row.documentId}</td>
                  <td>{appliedTo || <span className={localStyles.muted}>-</span>}</td><td>{memoOrDescription(row.memo, row.description)}</td>
                  <td className={localStyles.number}>{formatAmount(row.debit)}</td><td className={localStyles.number}>{formatAmount(row.credit)}</td><td className={localStyles.number}>{formatAmount(balance)}</td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </section>
        <div className={localStyles.totalsRow}>
          <div className={localStyles.totalsItem}><span className={localStyles.totalsLabel}>Total Debit</span><span className={localStyles.totalsValue}>{formatAmount(statement.totalDebit)}</span></div>
          <div className={localStyles.totalsItem}><span className={localStyles.totalsLabel}>Total Credit</span><span className={localStyles.totalsValue}>{formatAmount(statement.totalCredit)}</span></div>
          <div className={`${localStyles.totalsItem} ${localStyles.totalsOwing}`}><span className={localStyles.totalsLabel}>Total Owing</span><span className={localStyles.totalsValue}>{formatAmount(statement.totalOwing)}</span></div>
        </div>
      </section>
      <footer className={localStyles.reportFooter}><span>Generated {generatedAt}</span></footer>
    </div>
  );
}
