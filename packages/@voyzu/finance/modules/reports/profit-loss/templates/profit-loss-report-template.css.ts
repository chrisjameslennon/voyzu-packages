export const profitLossReportTemplateCss = `
.reportPage {
  font-family: "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 12px;
  line-height: 1.4;
  color: #1f2937;
  background: #fff;
}

.reportPage,
.reportPage * {
  box-sizing: border-box;
}

.reportHeader {
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1.5px solid #404040;
}

.reportCompanyName {
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 700;
}

.reportHeaderLine {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.35;
  color: #6b7280;
}

.reportHeaderLineStrong {
  font-weight: 700;
  color: #1f2937;
}

.reportSection {
  margin: 0;
}

.reportFooter {
  margin-top: 20px;
  padding-top: 8px;
  border-top: 1px solid #d9dde5;
  font-size: 11px;
  line-height: 1.35;
  color: #6b7280;
  text-align: right;
}

.colCode {
  width: 90px;
  white-space: nowrap;
  font-weight: 600;
}

.colName {
  /* absorbs remaining space */
}

.nowrapCell {
  white-space: nowrap;
}

.colAmount {
  width: 130px;
  text-align: right !important;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.sectionRow.sectionRow td {
  padding-top: 0.75rem;
  font-weight: 700;
  border-bottom: none;
}

.lineName {
  padding-left: 1rem;
}

.indentCell {
  width: 1rem;
  padding: 0;
}

.categoryRow.categoryRow td {
  padding-top: 0.5rem;
  font-weight: 700;
  border-bottom: none;
}

.categoryTotalsRow.categoryTotalsRow td {
  font-weight: 700;
  border-top: none;
}

.totalsRow.totalsRow td {
  font-weight: 700;
  border-top: none;
  border-bottom: none;
}

.netProfitRow.netProfitRow td {
  font-weight: 700;
  border-top: 2px solid #404040;
  border-bottom: none;
}

.spacerRow td {
  height: 0.75rem;
  border-bottom: none;
}

`;

export const profitLossReportTemplateStyles = {
  reportPage: "reportPage",
  reportHeader: "reportHeader",
  reportCompanyName: "reportCompanyName",
  reportHeaderLine: "reportHeaderLine",
  reportHeaderLineStrong: "reportHeaderLineStrong",
  reportSection: "reportSection",
  reportFooter: "reportFooter",
  colCode: "colCode",
  colName: "colName",
  nowrapCell: "nowrapCell",
  colAmount: "colAmount",
  sectionRow: "sectionRow",
  lineName: "lineName",
  indentCell: "indentCell",
  categoryRow: "categoryRow",
  categoryTotalsRow: "categoryTotalsRow",
  totalsRow: "totalsRow",
  netProfitRow: "netProfitRow",
  spacerRow: "spacerRow",
} as const;
