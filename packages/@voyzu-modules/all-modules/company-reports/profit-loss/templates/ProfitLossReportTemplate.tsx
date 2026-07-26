import type { ProfitLossLineDto, ProfitLossResponseDto } from "@voyzu-modules/types/modules/company-reports";
import { Fragment } from "react";

import { profitLossReportCss } from "./profit-loss-report.css";

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

function LineRows({ lines, showAccountCode, expense, showDecimals }: { lines: ProfitLossLineDto[]; showAccountCode: boolean; expense?: boolean; showDecimals: boolean }) {
  return (
    <>
      {lines.map((line) => (
        <tr key={line.glAccountId}>
          {showAccountCode && <td className="colCode">{line.glAccountCode}</td>}
          <td className="colName lineName">{line.glAccountName}</td>
          <td className="colAmount">{expense ? formatExpenseAmount(line.amount, showDecimals) : formatAmount(line.amount, showDecimals)}</td>
        </tr>
      ))}
    </>
  );
}

interface CategoryGroup {
  categoryCode: string | null;
  categoryName: string | null;
  categorySequence: number | null;
  lines: ProfitLossLineDto[];
  subtotal: number;
}

function groupByCategory(lines: ProfitLossLineDto[]): CategoryGroup[] {
  const map = new Map<string, CategoryGroup>();
  for (const line of lines) {
    const key = line.categoryCode ?? "__none__";
    if (!map.has(key)) {
      map.set(key, {
        categoryCode: line.categoryCode ?? null,
        categoryName: line.categoryName ?? null,
        categorySequence: line.categorySequence ?? null,
        lines: [],
        subtotal: 0,
      });
    }
    const group = map.get(key)!;
    group.lines.push(line);
    group.subtotal += line.amount;
  }
  return [...map.values()].sort((a, b) => {
    if (a.categoryCode === null) return 1;
    if (b.categoryCode === null) return -1;
    return (a.categorySequence ?? 9999) - (b.categorySequence ?? 9999);
  });
}

function CategorizedSection({
  lines,
  showAccountCode,
  expense,
  sectionLabel,
  showDecimals,
}: {
  lines: ProfitLossLineDto[];
  showAccountCode: boolean;
  expense?: boolean;
  sectionLabel: string;
  showDecimals: boolean;
}) {
  const groups = groupByCategory(lines);
  const baseCols = showAccountCode ? 3 : 2;
  const catCols = baseCols + 1;
  const labelCols = showAccountCode ? 2 : 1;
  const fmt = expense ? formatExpenseAmount : formatAmount;

  return (
    <>
      <tr className="sectionRow">
        <td colSpan={catCols}>{sectionLabel}</td>
      </tr>
      {groups.map((group, idx) => {
        const isLast = idx === groups.length - 1;
        const hasCategory = group.categoryCode !== null;
        return (
          <Fragment key={group.categoryCode ?? "__none__"}>
            {hasCategory && (
              <tr className="categoryRow">
                <td className="indentCell" style={{ border: "none" }} />
                <td colSpan={baseCols}>{group.categoryName}</td>
              </tr>
            )}
            {group.lines.map((line) => (
              <tr key={`${line.section}-${line.glAccountId}`}>
                <td className="indentCell" style={{ border: "none" }} />
                {showAccountCode && <td className="colCode">{line.glAccountCode}</td>}
                <td className="colName">{line.glAccountName}</td>
                <td className="colAmount">{fmt(line.amount, showDecimals)}</td>
              </tr>
            ))}
            {hasCategory && (
              <tr className="categoryTotalsRow">
                <td className="indentCell" style={{ border: "none" }} />
                <td colSpan={labelCols}>Total {group.categoryName}</td>
                <td className="colAmount">{fmt(group.subtotal, showDecimals)}</td>
              </tr>
            )}
            {!isLast && <tr className="spacerRow"><td colSpan={catCols} /></tr>}
          </Fragment>
        );
      })}
    </>
  );
}

interface ProfitLossReportTemplateProps {
  data: ProfitLossResponseDto;
  generatedAt: string;
  showAccountCode?: boolean;
  showOrganization?: boolean;
  showCompanyHeader?: boolean;
  showCompanyFooter?: boolean;
  showReportingCategories?: boolean;
  showDecimals?: boolean;
  organizationName?: string;
  includeCss?: boolean;
}

export function ProfitLossReportTemplate({
  data,
  generatedAt,
  showAccountCode = false,
  showOrganization = false,
  showCompanyHeader = false,
  showCompanyFooter = false,
  showReportingCategories = false,
  showDecimals = false,
  organizationName = "",
  includeCss = true,
}: ProfitLossReportTemplateProps) {
  const hasCompanyHeader = showCompanyHeader && Boolean(data.companyReportLine1 || data.companyReportLine2);
  const hasCompanyFooter = showCompanyFooter && Boolean(data.companyReportFooter);
  const cols = showAccountCode ? 3 : 2;
  const labelCols = showAccountCode ? 2 : 1;
  const catCols = cols + 1;
  const catLabelCols = labelCols + 1;

  return (
    <div className="reportPage">
      {includeCss && <style>{profitLossReportCss}</style>}

      <header className="reportHeader">
        {showOrganization && organizationName && (
          <div className="reportOrgNameCentered">{organizationName}</div>
        )}
        {hasCompanyHeader && (
          <div className="reportCompanyHeaderLines">
            {data.companyReportLine1 && <div>{data.companyReportLine1}</div>}
            {data.companyReportLine2 && <div>{data.companyReportLine2}</div>}
          </div>
        )}
        <div className="reportCompanyName">{data.companyName}</div>
        <div className="reportHeaderLine reportHeaderLineStrong">Profit &amp; Loss</div>
        <div className="reportHeaderLine">For the period {formatReportDate(data.fromDate)} through {formatReportDate(data.toDate)}</div>
      </header>

      <section className="reportSection">
        <table className="reportTable">
          <colgroup>
            {showReportingCategories && <col style={{ width: "1rem" }} />}
            {showAccountCode && <col style={{ width: "90px" }} />}
            <col />
            <col style={{ width: "130px" }} />
          </colgroup>
          <tbody>
            {showReportingCategories ? (
              <>
                <CategorizedSection lines={data.incomeLines} showAccountCode={showAccountCode} sectionLabel="Income" showDecimals={showDecimals} />
                <tr className="totalsRow">
                  <td colSpan={catLabelCols}>Total Income</td>
                  <td className="colAmount">{formatAmount(data.totalIncome, showDecimals)}</td>
                </tr>
                <tr className="spacerRow"><td colSpan={catCols} /></tr>

                <CategorizedSection lines={data.expenseLines} showAccountCode={showAccountCode} expense sectionLabel="Expenses" showDecimals={showDecimals} />
                <tr className="totalsRow">
                  <td colSpan={catLabelCols}>Total Expenses</td>
                  <td className="colAmount">{formatExpenseAmount(data.totalExpenses, showDecimals)}</td>
                </tr>
                <tr className="spacerRow"><td colSpan={catCols} /></tr>

                <tr className="netProfitRow">
                  <td colSpan={catLabelCols}>Net Profit</td>
                  <td className="colAmount">{formatAmount(data.netProfit, showDecimals)}</td>
                </tr>
              </>
            ) : (
              <>
                <tr className="sectionRow">
                  <td colSpan={cols}>Income</td>
                </tr>
                <LineRows lines={data.incomeLines} showAccountCode={showAccountCode} showDecimals={showDecimals} />
                <tr className="totalsRow">
                  <td colSpan={labelCols}>Total Income</td>
                  <td className="colAmount">{formatAmount(data.totalIncome, showDecimals)}</td>
                </tr>
                <tr className="spacerRow"><td colSpan={cols} /></tr>

                <tr className="sectionRow">
                  <td colSpan={cols}>Expenses</td>
                </tr>
                <LineRows lines={data.expenseLines} showAccountCode={showAccountCode} expense showDecimals={showDecimals} />
                <tr className="totalsRow">
                  <td colSpan={labelCols}>Total Expenses</td>
                  <td className="colAmount">{formatExpenseAmount(data.totalExpenses, showDecimals)}</td>
                </tr>
                <tr className="spacerRow"><td colSpan={cols} /></tr>

                <tr className="netProfitRow">
                  <td colSpan={labelCols}>Net Profit</td>
                  <td className="colAmount">{formatAmount(data.netProfit, showDecimals)}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </section>

      {hasCompanyFooter && (
        <div className="reportCompanyFooterLine">{data.companyReportFooter}</div>
      )}

      <footer className="reportFooter">
        <span>Generated {generatedAt}</span>
      </footer>
    </div>
  );
}
