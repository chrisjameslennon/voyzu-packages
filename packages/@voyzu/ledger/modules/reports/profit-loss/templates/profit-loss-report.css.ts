export const profitLossReportCss = `
.reportPage {
  font-family: "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 11px;
  line-height: 1.3;
  color: #1f2937;
  background: #fff;
}

.reportPage,
.reportPage * {
  box-sizing: border-box;
}

.reportHeader {
  margin-bottom: 14px;
  padding-bottom: 8px;
  border-bottom: 1.5px solid #404040;
}

.reportCompanyName {
  margin: 0;
  font-size: 22px;
  line-height: 1.2;
  font-weight: 700;
}

.reportOrgNameCentered {
  margin: 0 0 14px 0;
  text-align: center;
  font-size: 18px;
  line-height: 1.2;
  font-weight: 400;
}

.reportCompanyHeaderLines {
  margin: 0 0 12px 0;
  text-align: left;
  font-size: 11px;
  line-height: 1.3;
  font-weight: 400;
  color: #6b7280;
}

.reportHeaderLine {
  margin-top: 2px;
  font-size: 11px;
  line-height: 1.3;
  color: #6b7280;
}

.reportHeaderLineStrong {
  font-weight: 700;
  color: #1f2937;
}

.reportSection {
  margin: 0;
}

.reportTable {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-family: "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 11px;
  line-height: 1.25;
}

.reportTable td {
  padding: 4px 8px;
  vertical-align: top;
  border-bottom: 1px solid #d8d8d8;
  font-size: 11px;
  line-height: 1.25;
  font-weight: 400;
  color: #1f2937;
  background: #fff;
}

.reportTable tbody tr:last-child td {
  border-bottom: none;
}

.reportCompanyFooterLine {
  margin-top: 12px;
  padding-top: 6px;
  border-top: 1px solid #d8d8d8;
  font-size: 11px;
  line-height: 1.3;
  font-weight: 400;
  color: #6b7280;
}

.reportFooter {
  margin-top: 12px;
  padding-top: 6px;
  border-top: 1px solid #d9dde5;
  font-size: 11px;
  line-height: 1.3;
  color: #6b7280;
  text-align: right;
}

.colCode {
  width: 90px;
  white-space: nowrap;
  font-weight: 600;
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

.sectionRow td {
  padding-top: 0.45rem;
  font-weight: 700;
  border-bottom: none;
}

.lineName {
  padding-left: 0.65rem;
}

.indentCell {
  width: 1rem;
  padding: 0;
}

.categoryRow td {
  padding-top: 0.35rem;
  font-weight: 700;
  border-bottom: none;
}

.categoryTotalsRow td {
  font-weight: 700;
  border-top: none;
}

.totalsRow td {
  font-weight: 700;
  border-top: none;
  border-bottom: none;
}

.netProfitRow td {
  font-weight: 700;
  border-top: 2px solid #404040;
  border-bottom: none;
}

.spacerRow td {
  height: 0.35rem;
  padding: 0;
  border-bottom: none;
}
`;
