import type { ProfitLossAnalysisLineDto, ProfitLossAnalysisResponseDto } from "@voyzu/finance/types/modules/company-reports";
import { Fragment } from "react";

import { profitLossReportTemplateCss, profitLossReportTemplateStyles as styles } from "./profit-loss-report-template.css";

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

function formatExpenseAmount(n: number, showDecimals: boolean): string {
  if (n === 0) return "-";
  const absValue = Math.abs(n);
  const amount = showDecimals ? absValue : Math.trunc(absValue);
  const abs = amount.toLocaleString("en-NZ", {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });
  return `(${abs})`;
}

function formatReportDate(iso: string): string {
  if (!iso) return "";
  const [yr, mo, dy] = iso.split("-").map(Number);
  const monthName = new Intl.DateTimeFormat(undefined, { month: "long" }).format(new Date(yr, mo - 1, dy));
  return `${dy} ${monthName} ${yr}`;
}

interface CategoryGroup {
  categoryCode: string | null;
  categoryName: string | null;
  categorySequence: number | null;
  lines: ProfitLossAnalysisLineDto[];
  subtotalByColumn: Record<string, number>;
}

function groupByCategory(lines: ProfitLossAnalysisLineDto[], columns: string[]): CategoryGroup[] {
  const map = new Map<string, CategoryGroup>();
  for (const line of lines) {
    const key = line.categoryCode ?? "__none__";
    if (!map.has(key)) {
      map.set(key, {
        categoryCode: line.categoryCode ?? null,
        categoryName: line.categoryName ?? null,
        categorySequence: line.categorySequence ?? null,
        lines: [],
        subtotalByColumn: {},
      });
    }
    const group = map.get(key)!;
    group.lines.push(line);
    for (const column of columns) {
      group.subtotalByColumn[column] = (group.subtotalByColumn[column] ?? 0) + (line.amountsByColumn[column] ?? 0);
    }
  }
  return [...map.values()].sort((a, b) => {
    if (a.categoryCode === null) return 1;
    if (b.categoryCode === null) return -1;
    return (a.categorySequence ?? 9999) - (b.categorySequence ?? 9999);
  });
}

function formatLineAmount(line: ProfitLossAnalysisLineDto, column: string, expense: boolean | undefined, showDecimals: boolean): string {
  const value = line.amountsByColumn[column] ?? 0;
  return expense ? formatExpenseAmount(value, showDecimals) : formatAmount(value, showDecimals);
}

function formatSubtotal(value: number, expense: boolean | undefined, showDecimals: boolean): string {
  return expense ? formatExpenseAmount(value, showDecimals) : formatAmount(value, showDecimals);
}

function CategorizedSection({
  lines,
  columns,
  showAccountCode,
  expense,
  sectionLabel,
  showDecimals,
}: {
  lines: ProfitLossAnalysisLineDto[];
  columns: string[];
  showAccountCode: boolean;
  expense?: boolean;
  sectionLabel: string;
  showDecimals: boolean;
}) {
  const groups = groupByCategory(lines, columns);
  const fixedCols = showAccountCode ? 3 : 2;
  const totalCols = fixedCols + columns.length;

  return (
    <>
      <tr className={styles.sectionRow}>
        <td colSpan={totalCols}>{sectionLabel}</td>
      </tr>
      {groups.map((group, idx) => {
        const isLast = idx === groups.length - 1;
        const hasCategory = group.categoryCode !== null;
        return (
          <Fragment key={group.categoryCode ?? "__none__"}>
            {hasCategory && (
              <tr className={styles.categoryRow}>
                <td className={styles.indentCell} style={{ border: "none" }} />
                <td colSpan={totalCols - 1}>{group.categoryName}</td>
              </tr>
            )}
            {group.lines.map((line) => (
              <tr key={`${line.section}-${line.glAccountId}`}>
                <td className={styles.indentCell} style={{ border: "none" }} />
                {showAccountCode && <td className={styles.colCode}>{line.glAccountCode}</td>}
                <td className={`${styles.colName} ${styles.nowrapCell}`}>{line.glAccountName}</td>
                {columns.map((column) => (
                  <td key={column} className={styles.colAmount}>{formatLineAmount(line, column, expense, showDecimals)}</td>
                ))}
              </tr>
            ))}
            {hasCategory && (
              <tr className={styles.categoryTotalsRow}>
                <td className={styles.indentCell} style={{ border: "none" }} />
                <td colSpan={showAccountCode ? 2 : 1}>Total {group.categoryName}</td>
                {columns.map((column) => (
                  <td key={column} className={styles.colAmount}>{formatSubtotal(group.subtotalByColumn[column] ?? 0, expense, showDecimals)}</td>
                ))}
              </tr>
            )}
            {!isLast && <tr className={styles.spacerRow}><td colSpan={totalCols} /></tr>}
          </Fragment>
        );
      })}
    </>
  );
}

interface ProfitLossAnalysisReportTemplateProps {
  data: ProfitLossAnalysisResponseDto;
  generatedAt: string;
  showAccountCode?: boolean;
  showCompanyHeader?: boolean;
  showCompanyFooter?: boolean;
  showDecimals?: boolean;
}

export function ProfitLossAnalysisReportTemplate({
  data,
  generatedAt,
  showAccountCode = false,
  showCompanyHeader = false,
  showCompanyFooter = false,
  showDecimals = false,
}: ProfitLossAnalysisReportTemplateProps) {
  const hasCompanyHeader = showCompanyHeader && Boolean(data.companyReportLine1 || data.companyReportLine2);
  const hasCompanyFooter = showCompanyFooter && Boolean(data.companyReportFooter);
  const columns = data.breakdown ? data.breakdownColumns : ["Amount"];
  const fixedCols = showAccountCode ? 3 : 2;
  const totalCols = fixedCols + columns.length;
  const labelColSpan = showAccountCode ? 3 : 2;
  const filterSummary = data.dimensionFilters.length
    ? data.dimensionFilters.map((dimension) => `${dimension.dimensionName} = ${dimension.valueNames.join(", ")}`).join("; ")
    : "None";
  const breakdownSummary = data.breakdown ? data.breakdown.dimensionName : "None";

  return (
    <div className={styles.reportPage}>
      <style>{profitLossReportTemplateCss}</style>
      <style>{"@media print { @page { size: A4 landscape; } }"}</style>

      <header className={styles.reportHeader}>
        {hasCompanyHeader && (
          <div className="reportCompanyHeaderLines">
            {data.companyReportLine1 && <div>{data.companyReportLine1}</div>}
            {data.companyReportLine2 && <div>{data.companyReportLine2}</div>}
          </div>
        )}
        <div className={styles.reportCompanyName}>{data.companyName}</div>
        <div className={`${styles.reportHeaderLine} ${styles.reportHeaderLineStrong}`}>Profit &amp; Loss Analysis</div>
        <div className={styles.reportHeaderLine}>For the period {formatReportDate(data.fromDate)} - {formatReportDate(data.toDate)}</div>
        <div className={styles.reportHeaderLine}>Filtered by: {filterSummary}</div>
        <div className={styles.reportHeaderLine}>Breakdown: {breakdownSummary}</div>
      </header>

      <section className={styles.reportSection}>
        <table className="reportTable">
          <colgroup>
            <col style={{ width: "1rem" }} />
            {showAccountCode && <col style={{ width: "90px" }} />}
            <col style={{ width: "260px" }} />
            {columns.map((column) => (
              <col key={column} style={{ width: "120px" }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th />
              {showAccountCode && <th className={styles.colCode}>Code</th>}
              <th className={`${styles.colName} ${styles.nowrapCell}`}>Account</th>
              {columns.map((column) => (
                <th key={column} className={styles.colAmount}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <CategorizedSection lines={data.incomeLines} columns={columns} showAccountCode={showAccountCode} sectionLabel="Income" showDecimals={showDecimals} />
            <tr className={styles.totalsRow}>
              <td colSpan={labelColSpan}>Total Income</td>
              {columns.map((column) => (
                <td key={column} className={styles.colAmount}>{formatAmount(sumColumn(data.incomeLines, column), showDecimals)}</td>
              ))}
            </tr>
            <tr className={styles.spacerRow}><td colSpan={totalCols} /></tr>

            <CategorizedSection lines={data.expenseLines} columns={columns} showAccountCode={showAccountCode} expense sectionLabel="Expenses" showDecimals={showDecimals} />
            <tr className={styles.totalsRow}>
              <td colSpan={labelColSpan}>Total Expenses</td>
              {columns.map((column) => (
                <td key={column} className={styles.colAmount}>{formatExpenseAmount(sumColumn(data.expenseLines, column), showDecimals)}</td>
              ))}
            </tr>
            <tr className={styles.spacerRow}><td colSpan={totalCols} /></tr>

            <tr className={styles.netProfitRow}>
              <td colSpan={labelColSpan}>Net Profit</td>
              {columns.map((column) => (
                <td key={column} className={styles.colAmount}>{formatAmount(sumColumn(data.incomeLines, column) - sumColumn(data.expenseLines, column), showDecimals)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </section>

      {hasCompanyFooter && (
        <div className="reportCompanyFooterLine">{data.companyReportFooter}</div>
      )}

      <footer className={styles.reportFooter}>
        <span>Generated {generatedAt}</span>
      </footer>
    </div>
  );
}

function sumColumn(lines: ProfitLossAnalysisLineDto[], column: string): number {
  return lines.reduce((sum, line) => sum + (line.amountsByColumn[column] ?? 0), 0);
}
