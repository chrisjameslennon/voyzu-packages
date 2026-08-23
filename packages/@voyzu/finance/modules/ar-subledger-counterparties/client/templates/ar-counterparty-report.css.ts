export const arCounterpartyReportCss = `
.counterpartyReport {
  box-sizing: border-box;
  width: 100%;
  background: #fff;
  color: #1f1f1f;
  font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif;
  font-size: 12px;
  line-height: 1.4;
}

.counterpartyReport * { box-sizing: border-box; }

.reportHeader {
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1.5px solid #404040;
}

.companyName { margin: 0; font-size: 28px; line-height: 1.2; font-weight: 700; }
.reportTitle { margin: 4px 0 0; font-size: 14px; line-height: 1.3; }

.parties {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #d8d8d8;
}

.party { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.label { margin: 0 0 4px; color: #6b7280; font-size: 11px; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase; }
.name { margin: 0; font-size: 14px; font-weight: 700; }
.line { margin: 0; color: #6b7280; }

.details { margin-top: 20px; width: 100%; border-collapse: collapse; }
.details th, .details td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: left; }
.details th { width: 34%; background: #f4f5f7; color: #6b7280; font-size: 11px; letter-spacing: 0.03em; text-transform: uppercase; }
.details td { font-weight: 600; }

.reportFooter { margin-top: 20px; padding-top: 8px; border-top: 1px solid #d8d8d8; color: #6b7280; font-size: 11px; text-align: right; }

@media print {
  .reportFooter { display: none; }
  .details th { background: #f4f5f7 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;

export const arCounterpartyReportStyles = {
  counterpartyReport: "counterpartyReport",
  reportHeader: "reportHeader",
  companyName: "companyName",
  reportTitle: "reportTitle",
  parties: "parties",
  party: "party",
  label: "label",
  name: "name",
  line: "line",
  details: "details",
  reportFooter: "reportFooter",
} as const;
