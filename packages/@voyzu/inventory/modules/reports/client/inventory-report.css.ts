export const inventoryReportCss = `
.inventoryReportDocument {
  width: 100%;
  box-sizing: border-box;
  background: #fff;
  color: #1f2937;
  font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif;
  font-size: 11px;
  line-height: 1.4;
}

.inventoryReportHeader {
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1.5px solid #374151;
}

.inventoryReportHeader h1 {
  margin: 0;
  color: #111827;
  font-size: 26px;
  line-height: 1.2;
}

.inventoryReportHeader p {
  margin: 5px 0 0;
  color: #6b7280;
  font-size: 10px;
}

.inventoryReportTable {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;
  background: #fff;
}

.inventoryReportTable th,
.inventoryReportTable td {
  padding: 7px 9px;
  border-bottom: 1px solid #d1d5db;
  text-align: left;
  vertical-align: top;
}

.inventoryReportTable th {
  background: #e5e7eb;
  color: #374151;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.inventoryReportTable tbody tr:nth-child(even) {
  background: #f9fafb;
}

.inventoryReportDetailRow td {
  padding-top: 4px;
  padding-bottom: 4px;
  border-bottom-color: #94a3b8;
  background: #fafafa;
}

.inventoryReportDetailLines {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 3px 18px;
}

.inventoryReportDetailLine {
  display: grid;
  grid-template-columns: max-content minmax(0, 1fr);
  gap: 7px;
  align-items: baseline;
}

.inventoryReportDetailLine span {
  color: #64748b;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
}

.inventoryReportDetailLine strong {
  font-weight: 400;
}

.inventoryReportTable .inventoryReportNumeric {
  text-align: right;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.inventoryReportTable .inventoryReportCode,
.inventoryReportTable .inventoryReportStatus {
  white-space: nowrap;
}

.inventoryReportEmpty {
  padding: 36px 12px;
  color: #6b7280;
  text-align: center;
}

.inventoryReportFooter {
  margin-top: 18px;
  padding-top: 8px;
  border-top: 1px solid #d1d5db;
  color: #6b7280;
  font-size: 10px;
  text-align: right;
}

@media print {
  @page {
    size: A4 landscape;
    margin: 12mm;
  }

  .inventoryReportDocument {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }

  .inventoryReportTable thead {
    display: table-header-group;
  }

  .inventoryReportTable tr {
    break-inside: avoid;
  }
}
`;

export const inventoryReportStyles = {
  document: "inventoryReportDocument",
  header: "inventoryReportHeader",
  table: "inventoryReportTable",
  numeric: "inventoryReportNumeric",
  code: "inventoryReportCode",
  status: "inventoryReportStatus",
  inactiveRow: "inventoryReportInactiveRow",
  detailRow: "inventoryReportDetailRow",
  detailLines: "inventoryReportDetailLines",
  detailLine: "inventoryReportDetailLine",
  empty: "inventoryReportEmpty",
  footer: "inventoryReportFooter",
} as const;
