import type { TaxActivityLineDto, TaxActivityResponseDto } from "@voyzu/core/types/modules/company-reports";

import { taxPositionReportTemplateCss, taxPositionReportTemplateStyles as styles } from "./tax-position-report-template.css";

function formatAmount(n: number, showDecimals: boolean): string {
  if (n === 0) return "-";
  const absValue = Math.abs(n);
  const amount = showDecimals ? absValue : Math.trunc(absValue);
  const abs = amount.toLocaleString("en-NZ", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });
  return n < 0 ? `(${abs})` : abs;
}

function formatReportDate(iso: string): string {
  if (!iso) return "";
  const [yr, mo, dy] = iso.split("-").map(Number);
  const monthName = new Intl.DateTimeFormat(undefined, { month: "long" }).format(new Date(yr, mo - 1, dy));
  return `${dy} ${monthName} ${yr}`;
}

function contribution(line: TaxActivityLineDto, authorityCode: string): number {
  const amount = line.amountsByAuthority[authorityCode] ?? 0;
  if (line.key === "INPUT_TAX_RECEIVABLE" || line.key === "TAX_PAYMENTS") return -amount;
  return amount;
}

function totalContribution(line: TaxActivityLineDto): number {
  if (line.key === "INPUT_TAX_RECEIVABLE" || line.key === "TAX_PAYMENTS") return -line.total;
  return line.total;
}

interface TaxActivityReportTemplateProps {
  data: TaxActivityResponseDto;
  generatedAt: string;
  showOrganization?: boolean;
  showCompanyHeader?: boolean;
  showCompanyFooter?: boolean;
  showDecimals?: boolean;
  organizationName?: string;
}

export function TaxActivityReportTemplate({
  data,
  generatedAt,
  showOrganization = false,
  showCompanyHeader = false,
  showCompanyFooter = false,
  showDecimals = false,
  organizationName = "",
}: TaxActivityReportTemplateProps) {
  const hasCompanyHeader = showCompanyHeader && Boolean(data.companyReportLine1 || data.companyReportLine2);
  const hasCompanyFooter = showCompanyFooter && Boolean(data.companyReportFooter);
  const totalCols = 2 + data.authorityColumns.length;
  const netReturnByAuthority = (authorityCode: string) =>
    data.returnLines.reduce((sum, line) => sum + contribution(line, authorityCode), 0);
  const closingImpactByAuthority = (authorityCode: string) =>
    netReturnByAuthority(authorityCode) + data.settlementLines.reduce((sum, line) => sum + contribution(line, authorityCode), 0);

  return (
    <div className={styles.reportPage}>
      <style>{taxPositionReportTemplateCss}</style>
      <style>{"@media print { @page { size: A4 landscape; } }"}</style>

      <header className={styles.reportHeader}>
        {showOrganization && organizationName && <div className={styles.reportOrgNameCentered}>{organizationName}</div>}
        {hasCompanyHeader && (
          <div className={styles.reportCompanyHeaderLines}>
            {data.companyReportLine1 && <div>{data.companyReportLine1}</div>}
            {data.companyReportLine2 && <div>{data.companyReportLine2}</div>}
          </div>
        )}
        <div className={styles.reportCompanyName}>{data.companyName}</div>
        <div className={`${styles.reportHeaderLine} ${styles.reportHeaderLineStrong}`}>Tax Return</div>
        <div className={styles.reportHeaderLine}>{data.periodLabel}</div>
        <div className={styles.reportHeaderLine}>
          {formatReportDate(data.periodStartDate)} to {formatReportDate(data.periodEndDate)}
        </div>
      </header>

      <section className={styles.reportSection}>
        <table className={styles.reportTable}>
          <colgroup>
            <col />
            {data.authorityColumns.map((column) => (
              <col key={column.taxAuthorityCode} style={{ width: "10rem" }} />
            ))}
            <col style={{ width: "10rem" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Tax authority</th>
              {data.authorityColumns.map((column) => (
                <th key={column.taxAuthorityCode} className={styles.colAmountHeader} title={column.taxAuthorityName}>
                  {column.taxAuthorityCode}
                </th>
              ))}
              <th className={styles.colAmountHeader}>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.sectionRow}>
              <td colSpan={totalCols}>Tax return calculation</td>
            </tr>
            {data.returnLines.map((line) => (
              <tr key={line.key}>
                <td className={styles.colLabel}>{line.label}</td>
                {data.authorityColumns.map((column) => (
                  <td key={column.taxAuthorityCode} className={`${styles.colAmount} ${styles.authorityAmount}`}>
                    {formatAmount(line.amountsByAuthority[column.taxAuthorityCode] ?? 0, showDecimals)}
                  </td>
                ))}
                <td className={`${styles.colAmount} ${styles.totalAmount}`}>{formatAmount(line.total, showDecimals)}</td>
              </tr>
            ))}
            {data.authorityColumns.length === 0 && (
              <tr>
                <td colSpan={totalCols}>No tax return activity in this filing period.</td>
              </tr>
            )}
            <tr className={styles.netTaxRow}>
              <td>Net tax payable / receivable for this return</td>
              {data.authorityColumns.map((column) => (
                <td key={column.taxAuthorityCode} className={`${styles.colAmount} ${styles.authorityAmount}`}>
                  {formatAmount(netReturnByAuthority(column.taxAuthorityCode), showDecimals)}
                </td>
              ))}
              <td className={`${styles.colAmount} ${styles.totalAmount}`}>
                {formatAmount(data.returnLines.reduce((sum, line) => sum + totalContribution(line), 0), showDecimals)}
              </td>
            </tr>
            <tr className={styles.sectionRow}>
              <td colSpan={totalCols}>Settlement / reconciliation</td>
            </tr>
            {data.settlementLines.map((line) => (
              <tr key={line.key}>
                <td className={styles.colLabel}>{line.label}</td>
                {data.authorityColumns.map((column) => (
                  <td key={column.taxAuthorityCode} className={`${styles.colAmount} ${styles.authorityAmount}`}>
                    {formatAmount(line.amountsByAuthority[column.taxAuthorityCode] ?? 0, showDecimals)}
                  </td>
                ))}
                <td className={`${styles.colAmount} ${styles.totalAmount}`}>{formatAmount(line.total, showDecimals)}</td>
              </tr>
            ))}
            <tr className={styles.netTaxRow}>
              <td>Return balance after settlements</td>
              {data.authorityColumns.map((column) => (
                <td key={column.taxAuthorityCode} className={`${styles.colAmount} ${styles.authorityAmount}`}>
                  {formatAmount(closingImpactByAuthority(column.taxAuthorityCode), showDecimals)}
                </td>
              ))}
              <td className={`${styles.colAmount} ${styles.totalAmount}`}>
                {formatAmount(data.closingTaxPositionImpact, showDecimals)}
              </td>
            </tr>
            {!data.trialBalanceReconciled && (
              <tr className={styles.netTaxRow}>
                <td colSpan={totalCols}>Not reconciled</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {hasCompanyFooter && <div className={styles.reportCompanyFooterLine}>{data.companyReportFooter}</div>}

      <footer className={styles.reportFooter}>
        <span>Generated {generatedAt}</span>
      </footer>
    </div>
  );
}
