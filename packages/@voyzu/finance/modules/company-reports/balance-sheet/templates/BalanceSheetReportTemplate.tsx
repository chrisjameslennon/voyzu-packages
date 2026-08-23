import { Fragment } from "react";
import type { BalanceSheetLineDto, BalanceSheetResponseDto } from "@voyzu/finance/types/modules/company-reports/balance-sheet";

import { balanceSheetReportCss } from "./balance-sheet-report.css";

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

function formatCreditPresentationAmount(n: number, showDecimals: boolean): string {
  return formatAmount(n, showDecimals);
}

interface CategoryGroup {
  categoryCode: string | null;
  categoryName: string | null;
  categorySequence: number | null;
  lines: BalanceSheetLineDto[];
  subtotal: number;
}

function groupByCategory(lines: BalanceSheetLineDto[]): CategoryGroup[] {
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

function LineRows({
  lines,
  showAccountCode,
  creditSection,
  showDecimals,
}: {
  lines: BalanceSheetLineDto[];
  showAccountCode: boolean;
  creditSection?: boolean;
  showDecimals: boolean;
}) {
  return (
    <>
      {lines.map((line) => (
        <tr key={`${line.section}-${line.glAccountId ?? line.glAccountName}`}>
          {showAccountCode && <td className="bsColCode">{line.glAccountCode ?? "-"}</td>}
          <td className="bsColName bsLineName">{line.glAccountName}</td>
          <td className="bsColAmount">{creditSection ? formatCreditPresentationAmount(line.amount, showDecimals) : formatAmount(line.amount, showDecimals)}</td>
        </tr>
      ))}
    </>
  );
}

function CategorizedSection({
  lines,
  showAccountCode,
  creditSection,
  sectionLabel,
  showDecimals,
}: {
  lines: BalanceSheetLineDto[];
  showAccountCode: boolean;
  creditSection?: boolean;
  sectionLabel: string;
  showDecimals: boolean;
}) {
  const groups = groupByCategory(lines);
  const baseCols = showAccountCode ? 3 : 2;
  const catCols = baseCols + 1;
  const labelCols = showAccountCode ? 2 : 1;
  const fmt = creditSection ? formatCreditPresentationAmount : formatAmount;

  return (
    <>
      <tr className="bsSectionRow">
        <td colSpan={catCols}>{sectionLabel}</td>
      </tr>
      {groups.map((group, idx) => {
        const isLast = idx === groups.length - 1;
        const hasCategory = group.categoryCode !== null;
        return (
          <Fragment key={group.categoryCode ?? "__none__"}>
            {hasCategory && (
              <tr className="bsCategoryRow">
                <td className="bsIndentCell" style={{ border: "none" }} />
                <td colSpan={baseCols}>{group.categoryName}</td>
              </tr>
            )}
            {group.lines.map((line) => (
              <tr key={`${line.section}-${line.glAccountId ?? line.glAccountName}`}>
                <td className="bsIndentCell" style={{ border: "none" }} />
                {showAccountCode && <td className="bsColCode">{line.glAccountCode ?? "-"}</td>}
                <td className="bsColName">{line.glAccountName}</td>
                <td className="bsColAmount">{creditSection ? formatCreditPresentationAmount(line.amount, showDecimals) : formatAmount(line.amount, showDecimals)}</td>
              </tr>
            ))}
            {hasCategory && (
              <tr className="bsCategoryTotalsRow">
                <td className="bsIndentCell" style={{ border: "none" }} />
                <td colSpan={labelCols}>Total {group.categoryName}</td>
                <td className="bsColAmount">{fmt(group.subtotal, showDecimals)}</td>
              </tr>
            )}
            {!isLast && <tr className="bsSpacerRow"><td colSpan={catCols} /></tr>}
          </Fragment>
        );
      })}
    </>
  );
}

export interface BalanceSheetReportTemplateProps {
  data: BalanceSheetResponseDto;
  generatedAt: string;
  showAccountCode?: boolean;
  showCompanyHeader?: boolean;
  showCompanyFooter?: boolean;
  showReportingCategories?: boolean;
  showDecimals?: boolean;
  includeCss?: boolean;
}

export function BalanceSheetReportTemplate({
  data,
  generatedAt,
  showAccountCode = false,
  showCompanyHeader = false,
  showCompanyFooter = false,
  showReportingCategories = false,
  showDecimals = false,
  includeCss = true,
}: BalanceSheetReportTemplateProps) {
  const hasCompanyHeader = showCompanyHeader && Boolean(data.companyReportLine1 || data.companyReportLine2);
  const hasCompanyFooter = showCompanyFooter && Boolean(data.companyReportFooter);
  const cols = showAccountCode ? 3 : 2;
  const labelCols = showAccountCode ? 2 : 1;
  const catCols = cols + 1;
  const catLabelCols = labelCols + 1;

  return (
    <div className="bsReportPage">
      {includeCss && <style>{balanceSheetReportCss}</style>}

      <header className="bsReportHeader">
        {hasCompanyHeader && (
          <div className="bsReportCompanyHeaderLines">
            {data.companyReportLine1 && <div>{data.companyReportLine1}</div>}
            {data.companyReportLine2 && <div>{data.companyReportLine2}</div>}
          </div>
        )}
        <div className="bsReportCompanyName">{data.companyName}</div>
        <div className="bsReportHeaderLine bsReportHeaderLineStrong">Balance Sheet</div>
        {data.asAtDate && <div className="bsReportHeaderLine">As at {formatReportDate(data.asAtDate)}</div>}
      </header>

      <section className="bsReportSection">
        <table className="bsReportTable">
          <colgroup>
            {showReportingCategories && <col style={{ width: "1rem" }} />}
            {showAccountCode && <col style={{ width: "90px" }} />}
            <col />
            <col style={{ width: "130px" }} />
          </colgroup>
          <tbody>
            {showReportingCategories ? (
              <>
                <CategorizedSection lines={data.assetLines} showAccountCode={showAccountCode} sectionLabel="Assets" showDecimals={showDecimals} />
                <tr className="bsAssetTotalsRow">
                  <td colSpan={catLabelCols}>Total Assets</td>
                  <td className="bsColAmount">{formatAmount(data.totalAssets, showDecimals)}</td>
                </tr>
                <tr className="bsSpacerRow"><td colSpan={catCols} /></tr>

                <CategorizedSection lines={data.liabilityLines} showAccountCode={showAccountCode} creditSection sectionLabel="Liabilities" showDecimals={showDecimals} />
                <tr className="bsTotalsRow">
                  <td colSpan={catLabelCols}>Total Liabilities</td>
                  <td className="bsColAmount">{formatCreditPresentationAmount(data.totalLiabilities, showDecimals)}</td>
                </tr>
                <tr className="bsSpacerRow"><td colSpan={catCols} /></tr>

                <CategorizedSection lines={data.equityLines} showAccountCode={showAccountCode} creditSection sectionLabel="Equity" showDecimals={showDecimals} />
                <tr className="bsTotalsRow">
                  <td colSpan={catLabelCols}>Total Equity</td>
                  <td className="bsColAmount">{formatCreditPresentationAmount(data.totalEquity, showDecimals)}</td>
                </tr>
                <tr className="bsSpacerRow"><td colSpan={catCols} /></tr>

                <tr className="bsStatementTotalRow">
                  <td colSpan={catLabelCols}>Total Liabilities + Equity</td>
                  <td className="bsColAmount">{formatCreditPresentationAmount(data.totalLiabilitiesAndEquity, showDecimals)}</td>
                </tr>
              </>
            ) : (
              <>
                <tr className="bsSectionRow">
                  <td colSpan={cols}>Assets</td>
                </tr>
                <LineRows lines={data.assetLines} showAccountCode={showAccountCode} showDecimals={showDecimals} />
                <tr className="bsAssetTotalsRow">
                  <td colSpan={labelCols}>Total Assets</td>
                  <td className="bsColAmount">{formatAmount(data.totalAssets, showDecimals)}</td>
                </tr>
                <tr className="bsSpacerRow"><td colSpan={cols} /></tr>

                <tr className="bsSectionRow">
                  <td colSpan={cols}>Liabilities</td>
                </tr>
                <LineRows lines={data.liabilityLines} showAccountCode={showAccountCode} creditSection showDecimals={showDecimals} />
                <tr className="bsTotalsRow">
                  <td colSpan={labelCols}>Total Liabilities</td>
                  <td className="bsColAmount">{formatCreditPresentationAmount(data.totalLiabilities, showDecimals)}</td>
                </tr>
                <tr className="bsSpacerRow"><td colSpan={cols} /></tr>

                <tr className="bsSectionRow">
                  <td colSpan={cols}>Equity</td>
                </tr>
                <LineRows lines={data.equityLines} showAccountCode={showAccountCode} creditSection showDecimals={showDecimals} />
                <tr className="bsTotalsRow">
                  <td colSpan={labelCols}>Total Equity</td>
                  <td className="bsColAmount">{formatCreditPresentationAmount(data.totalEquity, showDecimals)}</td>
                </tr>
                <tr className="bsSpacerRow"><td colSpan={cols} /></tr>

                <tr className="bsStatementTotalRow">
                  <td colSpan={labelCols}>Total Liabilities + Equity</td>
                  <td className="bsColAmount">{formatCreditPresentationAmount(data.totalLiabilitiesAndEquity, showDecimals)}</td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </section>

      {hasCompanyFooter && (
        <div className="bsReportCompanyFooterLine">{data.companyReportFooter}</div>
      )}

      <footer className="bsReportFooter">
        <span>Generated {generatedAt}</span>
      </footer>
    </div>
  );
}
