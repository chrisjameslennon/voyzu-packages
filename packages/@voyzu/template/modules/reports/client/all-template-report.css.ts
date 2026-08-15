export const allTemplatesReportCss = `
.templateReportDocument {
  width: 100%;
  overflow-x: auto;
  box-sizing: border-box;
  background: #fff;
  color: #0f172a;
  font-family: Inter, Arial, sans-serif;
  font-size: 0.72rem;
  line-height: 1.35;
}

@media print {
  @page { size: A4 landscape; }
}

.templateReportHeader {
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #222;
}

.templateReportHeader h1 {
  margin: 0;
  font-size: 1.25rem;
  line-height: 1.2;
}

.templateReportHeader p {
  margin: 0.35rem 0 0;
  color: #666;
  font-size: 0.7rem;
}

.templateReportTable {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.templateReportTable th,
.templateReportTable td {
  padding: 0.35rem 0.45rem;
  border-bottom: 1px solid #d4d4d4;
  text-align: left;
  vertical-align: top;
}

.templateReportTable th {
  border-bottom-color: #222;
  color: #333;
  font-weight: 700;
}

.templateReportInactive {
  color: #777;
}
`;
