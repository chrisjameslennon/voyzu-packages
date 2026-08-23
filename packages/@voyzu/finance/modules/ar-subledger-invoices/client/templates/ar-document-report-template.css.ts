export const arInvoiceReportCss = `
.reportPage {
  --report-font: "Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --text-main: #1f1f1f;
  --text-muted: #6b7280;
  --line-strong: #404040;
  --line-mid: #d8d8d8;
  --line-soft: #ececec;
  --header-fill: #e8e8e8;

  box-sizing: border-box;
  font-family: var(--report-font);
  font-size: 12px;
  line-height: 1.4;
  color: var(--text-main);
  background: #fff;
}

.reportPage * {
  box-sizing: border-box;
}

.reportHeader {
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1.5px solid var(--line-strong);
}

.reportCompanyName {
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 700;
  color: var(--text-main);
}

.reportOrgNameCentered {
  margin: 0 0 22px;
  text-align: center;
  font-size: 18px;
  line-height: 1.2;
  font-weight: 400;
  color: var(--text-main);
}

.reportHeaderLine {
  margin-top: 4px;
  font-size: 13px;
  line-height: 1.35;
  font-weight: 400;
  color: var(--text-muted);
}

.reportHeaderLineStrong {
  font-weight: 700;
  color: var(--text-main);
}

.reportSection {
  margin: 0;
}

.reportFooter {
  margin-top: 20px;
  padding-top: 8px;
  border-top: 1px solid var(--line-mid);
  font-size: 11px;
  line-height: 1.35;
  color: var(--text-muted);
  text-align: right;
}

.grid12 {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  column-gap: 16px;
}

.rowBordered {
  padding-bottom: 18px;
  border-bottom: 1px solid var(--line-mid);
}

.topCompany {
  grid-column: 1 / 7;
  min-width: 0;
}

.topCounterparty {
  grid-column: 7 / 13;
  min-width: 0;
}

.fullWidth {
  grid-column: 1 / 13;
  min-width: 0;
}

.metaSlot {
  grid-column: span 3;
  min-width: 0;
}

.metaWideSlot {
  grid-column: span 6;
  min-width: 0;
}

.statementMetaSlot {
  grid-column: span 4;
  min-width: 0;
}

.addressBlock {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.label {
  margin: 0 0 4px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.name {
  margin: 0;
  color: var(--text-main);
  font-weight: 700;
  font-size: 14px;
  line-height: 1.35;
}

.line {
  margin: 0;
  color: var(--text-muted);
  font-size: 12px;
  line-height: 1.35;
}

.metaRow {
  padding: 16px 0 18px;
  border-bottom: 1px solid var(--line-mid);
  row-gap: 12px;
}

.metaValue {
  margin: 4px 0 0;
  color: var(--text-main);
  font-weight: 700;
  font-size: 13px;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.section {
  margin-top: 18px;
  padding: 16px 18px;
  background: #f4f5f7;
  border: 1px solid var(--line-mid);
  border-radius: 6px;
}

.sectionTitle {
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--text-main);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.table th {
  padding: 0 8px 8px;
  text-align: left;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--text-muted);
  border-bottom: 1px solid var(--line-mid);
}

.table th.number {
  text-align: right;
}

.table td {
  padding: 8px;
  border-bottom: 1px solid var(--line-soft);
  color: var(--text-main);
  vertical-align: top;
}

.table th:first-child,
.table td:first-child {
  padding-left: 0;
}

.table th:last-child,
.table td:last-child {
  padding-right: 0;
}

.number {
  text-align: right;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.code {
  font-weight: 700;
  color: var(--text-main);
  overflow-wrap: anywhere;
}

.muted {
  color: var(--text-muted);
}

.totalLine td {
  border-top: 1px solid var(--line-strong);
  border-bottom: none;
  padding-top: 10px;
  font-weight: 800;
  color: var(--text-main);
}

.payableLine {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 18px;
  margin-top: 18px;
  padding: 14px 18px;
  border-top: 2px solid var(--line-strong);
}

.payableLabel {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--text-main);
}

.payableValue {
  font-size: 16px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--text-main);
}

.rootRow td {
  font-weight: 400;
  color: var(--text-main);
  border-top: 1px solid var(--line-mid);
  padding-top: 12px;
}

.table tbody tr.rootRow:first-child td {
  border-top: none;
  padding-top: 8px;
}

.applicationRow td {
  color: var(--text-main);
  font-weight: 400;
  border-bottom: 1px dotted var(--line-soft);
}

.firstAppCell,
.appLabel {
  color: var(--text-main);
}

.totalsRow {
  display: flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 32px;
  margin-top: 18px;
  padding: 14px 18px;
  border-top: 2px solid var(--line-strong);
}

.totalsItem {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.totalsLabel {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.totalsValue {
  font-size: 14px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--text-main);
}

.totalsOwing .totalsLabel {
  color: var(--text-main);
}

.totalsOwing .totalsValue {
  font-size: 16px;
  font-weight: 800;
}

.totals {
  margin-top: 18px;
  padding: 14px 18px;
  border-top: 2px solid var(--line-strong);
}

.totalRow {
  display: grid;
  grid-template-columns: minmax(130px, 1fr) 110px;
  align-items: baseline;
  gap: 18px;
  margin-left: auto;
  width: min(280px, 100%);
  font-size: 13px;
  letter-spacing: 0.02em;
  color: var(--text-main);
}

.totalRow span {
  text-align: right;
  white-space: nowrap;
}

.totalRow strong {
  text-align: right;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: var(--text-main);
}

.totalAmountCell {
  display: inline-flex;
  justify-content: flex-end;
  align-items: baseline;
  gap: 18px;
  width: 100%;
}

.totalAmountCell strong {
  min-width: 90px;
  text-align: right;
}

@media print {
  .reportFooter {
    display: none;
  }

  .section {
    background: #f4f5f7 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    page-break-inside: avoid;
  }

  .rootRow,
  .applicationRow {
    page-break-inside: avoid;
  }
}

`;

export const arInvoiceReportStyles = {
  addressBlock: "addressBlock",
  appLabel: "appLabel",
  applicationRow: "applicationRow",
  code: "code",
  firstAppCell: "firstAppCell",
  fullWidth: "fullWidth",
  grid12: "grid12",
  label: "label",
  line: "line",
  metaRow: "metaRow",
  metaSlot: "metaSlot",
  metaValue: "metaValue",
  metaWideSlot: "metaWideSlot",
  muted: "muted",
  name: "name",
  number: "number",
  payableLabel: "payableLabel",
  payableLine: "payableLine",
  payableValue: "payableValue",
  reportCompanyName: "reportCompanyName",
  reportFooter: "reportFooter",
  reportHeader: "reportHeader",
  reportHeaderLine: "reportHeaderLine",
  reportHeaderLineStrong: "reportHeaderLineStrong",
  reportOrgNameCentered: "reportOrgNameCentered",
  reportPage: "reportPage",
  reportSection: "reportSection",
  rootRow: "rootRow",
  rowBordered: "rowBordered",
  section: "section",
  sectionTitle: "sectionTitle",
  statementMetaSlot: "statementMetaSlot",
  table: "table",
  topCompany: "topCompany",
  topCounterparty: "topCounterparty",
  totalAmountCell: "totalAmountCell",
  totalLine: "totalLine",
  totalRow: "totalRow",
  totals: "totals",
  totalsItem: "totalsItem",
  totalsLabel: "totalsLabel",
  totalsOwing: "totalsOwing",
  totalsRow: "totalsRow",
  totalsValue: "totalsValue",
} as const;

