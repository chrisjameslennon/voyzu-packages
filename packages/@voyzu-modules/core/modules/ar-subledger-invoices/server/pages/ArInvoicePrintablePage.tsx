import "server-only";

import { notFound } from "next/navigation";

import { getSelectedCompany } from "@voyzu-modules/core/journals/server";

import { getArInvoiceStatement } from "../lib/ar-invoice-statement.service";

function money(value: number, currency: string) {
  return `${currency} ${value.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export async function ArInvoicePrintablePage({ documentId }: { documentId?: string }) {
  if (!documentId) notFound();
  const company = await getSelectedCompany();
  if (!company) notFound();
  const report = await getArInvoiceStatement(company, decodeURIComponent(documentId));
  if (!report) notFound();

  return (
    <main style={{ width: "210mm", minHeight: "297mm", margin: "0 auto", padding: "24mm", background: "#fff", color: "#001538", fontFamily: "Inter, Arial, sans-serif" }}>
      <header style={{ borderBottom: "1px solid #1f2937", paddingBottom: "12px", marginBottom: "24px" }}>
        <h1 style={{ margin: 0, fontSize: "28px" }}>{report.company.name}</h1>
        <h2 style={{ margin: "6px 0 0", fontSize: "16px" }}>Invoice {report.invoice.document_id}</h2>
        <div style={{ marginTop: "4px", color: "#526079" }}>Customer: {report.counterpartyName}</div>
      </header>
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div>
          <strong>Invoice date</strong>
          <div>{report.invoice.invoice_date}</div>
        </div>
        <div>
          <strong>Posting date</strong>
          <div>{report.invoice.posting_date}</div>
        </div>
      </section>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "24px" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", borderBottom: "1px solid #d8dde6", padding: "8px" }}>Description</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #d8dde6", padding: "8px" }}>Net</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #d8dde6", padding: "8px" }}>Tax</th>
            <th style={{ textAlign: "right", borderBottom: "1px solid #d8dde6", padding: "8px" }}>Gross</th>
          </tr>
        </thead>
        <tbody>
          {report.invoice.lines.map((line) => (
            <tr key={line.line_id}>
              <td style={{ borderBottom: "1px solid #eef1f5", padding: "8px" }}>{line.line_description}</td>
              <td style={{ borderBottom: "1px solid #eef1f5", padding: "8px", textAlign: "right" }}>{money(line.net_line_total, report.company.baseCurrencyCode)}</td>
              <td style={{ borderBottom: "1px solid #eef1f5", padding: "8px", textAlign: "right" }}>{money(line.tax_amount, report.company.baseCurrencyCode)}</td>
              <td style={{ borderBottom: "1px solid #eef1f5", padding: "8px", textAlign: "right" }}>{money(line.gross_line_total, report.company.baseCurrencyCode)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <section style={{ marginLeft: "auto", width: "280px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
          <span>Invoice total</span>
          <strong>{money(report.invoiceAmount, report.company.baseCurrencyCode)}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
          <span>Applied</span>
          <strong>{money(report.appliedAmount, report.company.baseCurrencyCode)}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "2px solid #1f2937" }}>
          <span>Open balance</span>
          <strong>{money(report.openBalance, report.company.baseCurrencyCode)}</strong>
        </div>
      </section>
    </main>
  );
}
