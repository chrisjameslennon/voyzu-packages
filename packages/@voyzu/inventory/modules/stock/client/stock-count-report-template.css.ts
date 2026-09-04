export const stockCountReportCss = `
.reportPage {
  --report-font: "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --text-main: #1f1f1f;
  --text-muted: #6b7280;
  --line-strong: #404040;
  --line-mid: #d8d8d8;
  --line-soft: #ececec;
  box-sizing: border-box;
  font-family: var(--report-font);
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-main);
  background: #fff;
}
.reportPage * { box-sizing: border-box; }
.reportHeader { margin-bottom: 24px; padding-bottom: 12px; border-bottom: 1.5px solid var(--line-strong); }
.reportCompanyName { margin: 0; font-size: 28px; line-height: 1.2; font-weight: 700; }
.reportHeaderLine { margin-top: 4px; font-size: 13px; line-height: 1.35; font-weight: 400; color: var(--text-muted); }
.reportHeaderLineStrong { font-weight: 700; color: var(--text-main); }
.documentTypeLine { font-size: 26px; color: #4b5563; }
.documentDateLine { color: #000; }
.reportSection { margin: 0; }
.reportFooter { margin-top: 20px; padding-top: 8px; border-top: 1px solid var(--line-mid); font-size: 11px; color: var(--text-muted); text-align: right; }
.grid12 { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); column-gap: 16px; }
.rowBordered { padding-bottom: 18px; border-bottom: 1px solid var(--line-mid); }
.topCompany { grid-column: 1 / 7; min-width: 0; }
.topWarehouse { grid-column: 7 / 13; min-width: 0; }
.addressBlock { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.label { margin: 0 0 4px; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase; color: var(--text-muted); }
.name { margin: 0; font-size: 14px; line-height: 1.35; font-weight: 700; }
.line { margin: 0; color: var(--text-muted); font-size: 12px; line-height: 1.35; }
.metaRow { padding: 16px 0 18px; border-bottom: 1px solid var(--line-mid); row-gap: 12px; }
.metaSlot { grid-column: span 3; min-width: 0; }
.metaValue { margin: 4px 0 0; font-size: 13px; line-height: 1.35; font-weight: 700; overflow-wrap: anywhere; }
.section { margin-top: 18px; padding: 16px 18px; background: #f4f5f7; border: 1px solid var(--line-mid); border-radius: 6px; }
.sectionTitle { margin: 0 0 10px; font-size: 13px; font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; }
.table { width: 100%; border-collapse: collapse; font-size: 12px; }
.table th { padding: 0 8px 8px; text-align: left; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase; color: var(--text-muted); border-bottom: 1px solid var(--line-mid); }
.table th.number { text-align: right; }
.table td { padding: 8px; border-bottom: 1px solid var(--line-soft); vertical-align: top; }
.table th:first-child, .table td:first-child { padding-left: 0; }
.table th:last-child, .table td:last-child { padding-right: 0; }
.number { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
.code { font-weight: 700; overflow-wrap: anywhere; }
.muted { color: var(--text-muted); }
.variance { font-weight: 700; }
.notes { margin: 0; white-space: pre-wrap; }
@media print {
  .reportFooter { display: none; }
  .section { background: #f4f5f7 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; page-break-inside: avoid; }
}
`;

export const stockCountReportStyles = {
  addressBlock: "addressBlock",
  code: "code",
  documentTypeLine: "documentTypeLine",
  documentDateLine: "documentDateLine",
  grid12: "grid12",
  label: "label",
  line: "line",
  metaRow: "metaRow",
  metaSlot: "metaSlot",
  metaValue: "metaValue",
  muted: "muted",
  name: "name",
  notes: "notes",
  number: "number",
  reportCompanyName: "reportCompanyName",
  reportFooter: "reportFooter",
  reportHeader: "reportHeader",
  reportHeaderLine: "reportHeaderLine",
  reportHeaderLineStrong: "reportHeaderLineStrong",
  reportPage: "reportPage",
  reportSection: "reportSection",
  rowBordered: "rowBordered",
  section: "section",
  sectionTitle: "sectionTitle",
  table: "table",
  topCompany: "topCompany",
  topWarehouse: "topWarehouse",
  variance: "variance",
} as const;
