export const taxPositionReportTemplateCss = `
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

.reportOrgNameCentered {
  margin: 0 0 22px;
  text-align: center;
  font-size: 18px;
}

.reportCompanyHeaderLines {
  margin: 0 0 18px;
  color: #6b7280;
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

.reportTable {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 12px;
}

.reportTable th,
.reportTable td {
  padding: 9px 12px;
  border-bottom: 1px solid #d9dde5;
  text-align: left;
}

.reportTable th {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  color: #6b7280;
}

.reportCompanyFooterLine {
  margin-top: 20px;
  padding-top: 8px;
  border-top: 1px solid #d9dde5;
  color: #6b7280;
}

.reportFooter,
.reportGenerated {
  margin-top: 20px;
  padding-top: 8px;
  border-top: 1px solid #d9dde5;
  font-size: 11px;
  color: #6b7280;
  text-align: right;
}

.colLabel {
  font-weight: 600;
}

.colCode {
  width: 90px;
  white-space: nowrap;
  font-weight: 600;
}

.colAmount {
  width: 130px;
  text-align: right;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.colAmountHeader.colAmountHeader {
  width: 130px;
  text-align: right;
  white-space: nowrap;
}

.sectionRow.sectionRow td {
  padding-top: 0.75rem;
  font-weight: 700;
  border-bottom: none;
}

.totalsRow.totalsRow td {
  font-weight: 700;
  border-top: none;
  border-bottom: none;
}

.netTaxRow.netTaxRow td {
  font-weight: 700;
  border-top: 2px solid #404040;
  border-bottom: none;
}

.spacerRow td {
  height: 0.75rem;
  border-bottom: none;
}

`;

export const taxPositionReportTemplateStyles = {
  reportPage: "reportPage",
  reportHeader: "reportHeader",
  reportCompanyName: "reportCompanyName",
  reportOrgNameCentered: "reportOrgNameCentered",
  reportCompanyHeaderLines: "reportCompanyHeaderLines",
  reportHeaderLine: "reportHeaderLine",
  reportHeaderLineStrong: "reportHeaderLineStrong",
  reportSection: "reportSection",
  reportTable: "reportTable",
  reportCompanyFooterLine: "reportCompanyFooterLine",
  reportFooter: "reportFooter",
  reportGenerated: "reportGenerated",
  colLabel: "colLabel",
  colCode: "colCode",
  colAmount: "colAmount",
  colAmountHeader: "colAmountHeader",
  sectionRow: "sectionRow",
  totalsRow: "totalsRow",
  netTaxRow: "netTaxRow",
  spacerRow: "spacerRow",
} as const;
