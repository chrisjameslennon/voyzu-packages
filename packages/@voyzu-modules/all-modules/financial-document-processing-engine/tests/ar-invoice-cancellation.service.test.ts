import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import type { ArInvoiceCancellationRequestDto } from "@voyzu-modules/types/modules/financial-document-processing-engine/ar-invoice-cancellation.request.dto";
import type { ArInvoiceRequestDto } from "@voyzu-modules/types/modules/financial-document-processing-engine/ar-invoice.request.dto";
import { getPool } from "@voyzu/capability/db";
import { processArInvoice } from "@voyzu-modules/all-modules/financial-document-processing-engine/server";
import { processArInvoiceCancellation } from "@voyzu-modules/all-modules/financial-document-processing-engine/server";

const createdDocumentIds: string[] = [];
const createdCounterpartyCodes: string[] = [];

after(async () => {
  const pool = getPool();
  try {
    if (createdDocumentIds.length) {
      const journalIds = await pool.query<{ id: number }>(
        `SELECT id FROM journal_header WHERE document_id = ANY($1::text[])`,
        [[...createdDocumentIds]],
      );
      const ids = journalIds.rows.map((row) => row.id);
      if (ids.length) {
        await pool.query(`SET session_replication_role = replica`);
        try {
          await pool.query(`DELETE FROM tax_ledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
          await pool.query(`DELETE FROM ar_subledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
          await pool.query(`DELETE FROM journal_line WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
          await pool.query(`DELETE FROM journal_header WHERE id = ANY($1::bigint[])`, [ids]);
        } finally {
          await pool.query(`SET session_replication_role = DEFAULT`);
        }
      }
    }
    if (createdCounterpartyCodes.length) {
      await pool.query(`DELETE FROM ar_counterparty WHERE code = ANY($1::text[])`, [[...createdCounterpartyCodes]]);
    }
  } finally {
    await pool.end();
  }
});

function suffix(): string {
  return String(Date.now()).slice(-8);
}

function invoiceRequest(documentId: string, counterpartyCode: string): ArInvoiceRequestDto {
  createdDocumentIds.push(documentId);
  createdCounterpartyCodes.push(counterpartyCode);
  return {
    document_type: "AR_INVOICE",
    company_code: "ACME",
    ar_counterparty: {
      code: counterpartyCode,
      name: "AR Cancellation Test Customer",
      status: "ACTIVE",
      country_code: "NZ",
      state_or_province_code: null,
    },
    document_id: documentId,
    invoice_date: "2026-04-19",
    posting_date: "2026-04-20",
    revenue_posting_code: "400000",
    lines: [{ line_id: 1, description: "Cancellation source invoice", quantity: 1, net_unit_price: 100, tax_rule: "NZ_STANDARD" }],
  };
}

function cancellationRequest(documentId: string, counterpartyCode: string, invoiceCode: string): ArInvoiceCancellationRequestDto {
  createdDocumentIds.push(documentId);
  return {
    document_type: "AR_INVOICE_CANCELLATION",
    company_code: "ACME",
    ar_counterparty_code: counterpartyCode,
    document_id: documentId,
    document_memo: "Cancel invoice",
    source_invoice: { document_id: invoiceCode },
    cancellation_date: "2026-05-09",
  };
}

describe("AR_INVOICE_CANCELLATION document processing engine", () => {
  it("posts a cancellation for a fully open invoice", async () => {
    const id = suffix();
    const counterpartyCode = `CUSTWD${id}`;
    const invoice = await processArInvoice(invoiceRequest(`INVWD${id}`, counterpartyCode));
    const invoiceCode = invoice.posting_details.journal_header.code;
    assert.ok(invoiceCode);
    const invoiceDocumentId = invoice.detailed_document.document_id;

    const cancellation = await processArInvoiceCancellation(cancellationRequest(`WD${id}`, counterpartyCode, invoiceDocumentId));

    assert.equal(cancellation.detailed_document.source_invoice_document_id, invoiceDocumentId);
    assert.equal(cancellation.detailed_document.source_invoice_journal_code, invoiceCode);
    assert.equal(cancellation.detailed_document.posting_date, "2026-04-19");
    assert.equal(cancellation.detailed_document.gross_amount, 115);
    assert.equal(cancellation.ar_subledger_details.entry_type, "CREDIT");
    assert.equal(cancellation.ar_subledger_details.applied_to_ar_subledger_entry_id, invoice.ar_subledger_details.id);
    assert.equal(cancellation.tax_ledger_details.length, 1);
    assert.equal(cancellation.tax_ledger_details[0].entry_type, "DEBIT");
    assert.equal(cancellation.posting_details.journal_header.status, "POSTED");
    assert.equal(cancellation.posting_details.journal_lines.at(-1)?.source_control_account, "AR_TRADE_RECEIVABLES");
  });

  it("generates document id from the AR invoice cancellation code when omitted", async () => {
    const id = suffix();
    const counterpartyCode = `CUSTWG${id}`;
    const invoice = await processArInvoice(invoiceRequest(`INVWG${id}`, counterpartyCode));
    const invoiceDocumentId = invoice.detailed_document.document_id;

    const cancellation = await processArInvoiceCancellation({
      document_type: "AR_INVOICE_CANCELLATION",
      company_code: "ACME",
      ar_counterparty_code: counterpartyCode,
      document_memo: "Generated cancellation document id",
      source_invoice: { document_id: invoiceDocumentId },
      cancellation_date: "2026-05-09",
    });

    createdDocumentIds.push(cancellation.detailed_document.document_id);
    assert.equal(cancellation.detailed_document.document_id, cancellation.ar_subledger_details.code!.replace(/^AR-/, ""));
    assert.equal(cancellation.posting_details.journal_header.document_id, cancellation.detailed_document.document_id);
    assert.equal(cancellation.detailed_document.generated_description, `Invoice Cancellation ${cancellation.detailed_document.document_id}`);
  });

  it("rejects unknown source invoices", async () => {
    const id = suffix();
    const counterpartyCode = `CUSTWV${id}`;
    await processArInvoice(invoiceRequest(`INVWV${id}`, counterpartyCode));

    await assert.rejects(
      () => processArInvoiceCancellation({
        document_type: "AR_INVOICE_CANCELLATION",
        company_code: "ACME",
        ar_counterparty_code: counterpartyCode,
        document_id: "WDBADSOURCE",
        source_invoice: { document_id: "INV-2099-999999" },
        cancellation_date: "2026-05-09",
      }, { preview: true }),
      (err: unknown) => err instanceof Error && err.message.includes("source_invoice.document_id INV-2099-999999 was not found"),
    );
  });
});

