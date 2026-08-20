import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import type { ArInvoiceRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ar-invoice.request.dto";
import type { ArReceiptRequestDto } from "@voyzu/core/types/modules/financial-document-processing-engine/ar-receipt.request.dto";
import { getPool } from "@voyzu/capability/db";
import { processArInvoice, processArReceipt } from "../../../modules/financial-document-processing-engine/operations";

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
      name: "AR Receipt Test Customer",
      status: "ACTIVE",
      country_code: "NZ",
      state_or_province_code: null,
    },
    document_id: documentId,
    invoice_date: "2026-04-19",
    posting_date: "2026-04-19",
    revenue_posting_code: "400000",
    lines: [
      {
        line_id: 1,
        description: "Receipt source invoice",
        quantity: 1,
        net_unit_price: 100,
        tax_rule: "NZ_STANDARD",
      },
    ],
  };
}

function receiptRequest(documentId: string, counterpartyCode: string, invoiceCode: string): ArReceiptRequestDto {
  createdDocumentIds.push(documentId);
  return {
    document_type: "AR_RECEIPT",
    company_code: "ACME",
    ar_counterparty_code: counterpartyCode,
    document_id: documentId,
    memo: "Receipt test",
    payment_date: "2026-05-01",
    allocations: [{ document_id: invoiceCode, amount: 115 }],
  };
}

describe("AR_RECEIPT document processing engine", () => {
  it("posts a receipt allocated to an invoice", async () => {
    const id = suffix();
    const invoice = await processArInvoice(invoiceRequest(`INVRC${id}`, `CUSTRC${id}`));
    const invoiceCode = invoice.posting_details.journal_header.code;
    assert.ok(invoiceCode);
    const invoiceDocumentId = invoice.detailed_document.document_id;

    const receipt = await processArReceipt({
      ...receiptRequest(`PAYRC${id}`, `CUSTRC${id}`, invoiceDocumentId),
      bank_cash_details: {
        code: "BANK_OPERATING",
        tx_id: `TEST-AR-PAYRC${id}`,
        tx_ref: `PAYRC${id}`,
        tx_details: "Receipt test bank transaction",
        payment_ref: `PAYRC${id}`,
      },
    });

    assert.equal(receipt.detailed_document.receipt_amount, 115);
    assert.equal(receipt.detailed_document.applied_amount, 115);
    assert.equal(receipt.detailed_document.unapplied_amount, 0);
    assert.equal(receipt.detailed_document.allocations[0].invoice_document_id, invoiceDocumentId);
    assert.equal(receipt.detailed_document.allocations[0].invoice_journal_code, invoiceCode);
    assert.equal(receipt.ar_subledger_details.length, 1);
    assert.equal(receipt.ar_subledger_details[0].control_account_code, "AR_TRADE_RECEIVABLES");
    assert.equal(receipt.ar_subledger_details[0].applied_to_ar_subledger_entry_id, invoice.ar_subledger_details.id);
    assert.equal(receipt.posting_details.journal_header.status, "POSTED");
    assert.equal(receipt.posting_details.journal_lines.length, 2);
    assert.equal(receipt.detailed_document.bank_cash_details?.code, "BANK_OPERATING");
    assert.equal(receipt.detailed_document.bank_cash_details?.tx_id, `TEST-AR-PAYRC${id}`);

    const header = await getPool().query<{ bank_cash_code: string | null; bank_cash_tx_id: string | null }>(
      `SELECT bank_cash_code, bank_cash_tx_id FROM journal_header WHERE id = $1`,
      [receipt.posting_details.journal_header.id],
    );
    assert.equal(header.rows[0].bank_cash_code, "BANK_OPERATING");
    assert.equal(header.rows[0].bank_cash_tx_id, `TEST-AR-PAYRC${id}`);
  });

  it("generates document id from the AR receipt code when omitted", async () => {
    const id = suffix();
    const counterpartyCode = `CUSTRCG${id}`;
    const invoice = await processArInvoice(invoiceRequest(`INVRCG${id}`, counterpartyCode));
    const invoiceDocumentId = invoice.detailed_document.document_id;

    const receipt = await processArReceipt({
      document_type: "AR_RECEIPT",
      company_code: "ACME",
      ar_counterparty_code: counterpartyCode,
      memo: "Generated receipt document id",
      payment_date: "2026-05-01",
      allocations: [{ document_id: invoiceDocumentId, amount: 115 }],
    });

    createdDocumentIds.push(receipt.detailed_document.document_id);
    const journalHeaderId = receipt.posting_details.journal_header.id;
    assert.ok(journalHeaderId);
    assert.equal(receipt.detailed_document.document_id, `RCT-${journalHeaderId}`);
    assert.equal(receipt.ar_subledger_details[0].code, `AR-${receipt.detailed_document.document_id}-1`);
    assert.equal(receipt.posting_details.journal_header.document_id, receipt.detailed_document.document_id);
  });

  it("rejects unknown fields", async () => {
    await assert.rejects(
      () => processArReceipt({
        document_type: "AR_RECEIPT",
        company_code: "ACME",
        ar_counterparty_code: "CUST_TEST",
        document_id: "PAYBADFIELD",
        payment_date: "2026-05-01",
        document_ref: "legacy",
      }, { preview: true }),
      (err: unknown) => err instanceof Error && err.message.includes("$.document_ref is not allowed"),
    );
  });
});

