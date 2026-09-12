export const balanceSheetReportCss = `
@page {
  size: A4 portrait;
}

.bsReportPage {
  --report-font:
    "Inter",
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif;

  --text-main: #1f1f1f;
  --text-muted: #6b6b6b;

  --line-strong: #404040;
  --line-mid: #d8d8d8;
  --line-soft: #ececec;

  --header-fill: #e8e8e8;
  font-family: var(--report-font);
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-main);
  background: #fff;
}

.bsReportPage,
.bsReportPage * {
  box-sizing: border-box;
}

.bsReportHeader {
  margin-bottom: 18px;
  padding-bottom: 8px;
  border-bottom: 1.5px solid var(--line-strong);
}

.bsReportCompanyName {
  margin: 0;
  font-size: 26px;
  line-height: 1.2;
  font-weight: 700;
  color: var(--text-main);
}

.bsReportOrgNameCentered {
  margin: 0 0 22px 0;
  text-align: center;
  font-size: 18px;
  line-height: 1.2;
  font-weight: 400;
  color: var(--text-main);
}

.bsReportCompanyHeaderLines {
  margin: 0 0 18px 0;
  text-align: left;
  font-size: 13px;
  line-height: 1.35;
  font-weight: 400;
  color: var(--text-muted);
}

.bsReportHeaderLine {
  margin-top: 2px;
  font-size: 13px;
  line-height: 1.35;
  font-weight: 400;
  color: var(--text-muted);
}

.bsReportHeaderLineStrong {
  font-weight: 700;
  color: var(--text-main);
}

.bsReportSection {
  margin: 0;
}

.bsReportTable {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-family: var(--report-font);
  font-size: 12px;
  line-height: 1.35;
}

.bsReportTable thead tr {
  background: var(--header-fill);
  border-top: 1px solid var(--line-mid);
}

.bsReportTable th {
  padding: 8px 12px;
  text-align: left;
  vertical-align: bottom;
  border-bottom: 1px solid var(--line-mid);
  font-size: 11px;
  line-height: 1.25;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #333;
}

.bsReportTable td {
  padding: 6px 10px;
  vertical-align: top;
  border-bottom: 1px solid var(--line-mid);
  font-size: 12px;
  line-height: 1.35;
  font-weight: 400;
  color: var(--text-main);
  background: #fff;
}

.bsReportTable tbody tr:last-child td {
  border-bottom: none;
}

.bsReportCompanyFooterLine {
  margin-top: 20px;
  padding-top: 8px;
  border-top: 1px solid var(--line-mid);
  font-size: 13px;
  line-height: 1.35;
  font-weight: 400;
  color: var(--text-muted);
}

.bsReportFooter {
  margin-top: 20px;
  padding-top: 8px;
  border-top: 1px solid var(--line-mid);
  font-size: 11px;
  line-height: 1.35;
  color: var(--text-muted);
  text-align: right;
}

.bsColCode {
  width: 90px;
  white-space: nowrap;
  font-weight: 600;
}

.bsColName {
  /* absorbs remaining space */
}

.bsColAmount {
  width: 130px;
  text-align: right;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.bsIndentCell {
  width: 1rem;
}

.bsSectionRow td {
  padding-top: 0.5rem;
  font-weight: 700;
  border-bottom: none;
}

.bsLineName {
  padding-left: 0.75rem;
}

.bsTotalsRow td,
.bsAssetTotalsRow td,
.bsStatementTotalRow td,
.bsCategoryTotalsRow td {
  font-weight: 700;
  border-bottom: none;
}

.bsTotalsRow td {
  border-top: none;
}

.bsAssetTotalsRow td,
.bsStatementTotalRow td {
  border-top: 2px solid #404040;
}

.bsCategoryRow td {
  padding-top: 0.35rem;
  font-weight: 600;
  border-bottom: none;
}

.bsCategoryTotalsRow td {
  border-top: 1px solid #808080;
}

.bsSpacerRow td {
  height: 0.45rem;
  border-bottom: none;
}
`;
