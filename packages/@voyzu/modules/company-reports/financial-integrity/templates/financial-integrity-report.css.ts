export const financialIntegrityReportCss = `
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

.sectionTitle {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 700;
}

.sectionDivider {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid #cfd5df;
}

.note {
  margin: 0 0 10px;
  color: #555;
  font-size: 11px;
}

.summaryTable,
.detailTable {
  width: 100%;
  border-collapse: collapse;
  font-size: 9px;
}

.summaryTable th,
.summaryTable td,
.detailTable th,
.detailTable td {
  border-bottom: 1px solid #ddd;
  padding: 5px 6px;
  vertical-align: top;
}

.summaryTable th,
.detailTable th {
  color: #666;
  font-size: 8px;
  letter-spacing: 0;
  text-align: left;
  text-transform: uppercase;
}

.amount {
  text-align: right;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.summaryTable th.amount,
.detailTable th.amount {
  text-align: right;
}

.documentList {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.documentBlock {
  border: 1px solid #d9dde5;
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
}

.nestedDocument {
  margin-top: 10px;
  margin-left: 14px;
  border-style: dashed;
}

.documentHeader,
.journalHeader,
.linkedHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.documentTitle {
  font-size: 12px;
  font-weight: 700;
}

.accountingFormula {
  margin-top: 2px;
  color: #374151;
  font-size: 9px;
  font-weight: 600;
}

.documentMeta,
.documentStatus {
  color: #555;
  font-size: 9px;
}

.fieldGrid,
.totalsGrid,
.sourceFields {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: 8px 0;
  font-size: 9px;
}

.fieldGrid div,
.totalsGrid div,
.sourceFields div {
  min-width: 0;
}

.fieldGrid span,
.totalsGrid span,
.sourceFields span {
  display: block;
  color: #777;
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
}

.sourceDocumentBlock {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #e2e5eb;
}

.subledgerBlock {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid #e2e5eb;
}

.jsonBlock {
  margin: 0;
  padding: 8px;
  border: 1px solid #d9dde5;
  border-radius: 4px;
  background: #f7f8fa;
  color: #1f2937;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  font-size: 8px;
  line-height: 1.35;
  white-space: pre-wrap;
  word-break: break-word;
  overflow: visible;
}

.subsectionTitle {
  margin-bottom: 6px;
  font-size: 10px;
  font-weight: 700;
}

.sourceLineTable {
  margin-top: 6px;
}

.sourceLineFields {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 12px;
}

.sourceLineFields span {
  white-space: nowrap;
}

.sourceLineFields strong {
  margin-right: 4px;
  color: #666;
}

.journalBlock,
.linkedDocument {
  margin-top: 10px;
}

.journalHeader,
.linkedHeader {
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-bottom: 5px;
  color: #333;
  font-size: 9px;
  font-weight: 600;
}

.badge {
  display: inline-block;
  margin-left: 4px;
  padding: 1px 5px;
  border: 1px solid #ccd2dc;
  border-radius: 999px;
  background: #f7f8fa;
  color: #233044;
  font-size: 8px;
  font-weight: 700;
  white-space: nowrap;
}

.pass {
  color: #147a3e;
}

.fail {
  color: #b42318;
}

.indicators {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 10px;
}

.reconciliationPass,
.reconciliationFail {
  border: 1px solid #d9dde5;
  border-radius: 6px;
  padding: 8px;
  margin-bottom: 10px;
  font-size: 9px;
}

.reconciliationHeader {
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 8px;
}

.reconciliationHeader span {
  font-size: 8px;
  font-weight: 800;
}

.reconciliationPass .reconciliationHeader span {
  color: #147a3e;
}

.reconciliationFail .reconciliationHeader span {
  color: #b42318;
}

.reconciliationGrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.reconciliationGrid div {
  min-width: 0;
  font-variant-numeric: tabular-nums;
}

.reconciliationGrid span {
  display: block;
  color: #777;
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
}

.indicatorPass,
.indicatorFail {
  border: 1px solid #d9dde5;
  border-radius: 6px;
  padding: 8px;
  font-size: 9px;
}

.indicatorPass span,
.indicatorFail span {
  display: inline-block;
  margin-right: 6px;
  font-size: 8px;
  font-weight: 800;
}

.indicatorPass span {
  color: #147a3e;
}

.indicatorFail span {
  color: #b42318;
}

.indicatorPass small,
.indicatorFail small {
  display: block;
  margin-top: 3px;
  color: #666;
}

.inventoryTable {
  margin-top: 4px;
}

.empty {
  padding: 12px;
  color: #666;
  font-size: 10px;
}

`;


