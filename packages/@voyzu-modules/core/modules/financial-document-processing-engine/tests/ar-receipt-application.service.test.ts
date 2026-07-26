import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import type { ArInvoiceRequestDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ar-invoice.request.dto";
import type { ArReceiptApplicationRequestDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ar-receipt-application.request.dto";
import type { ArReceiptRequestDto } from "@voyzu-modules/core/types/modules/financial-document-processing-engine/ar-receipt.request.dto";
import { getPool } from "@voyzu/capability/db";
import { processArInvoice } from "@voyzu-modules/core/financial-document-processing-engine/server";
import { processArReceipt } from "@voyzu-modules/core/financial-document-processing-engine/server";
import { processArReceiptApplication } from "@voyzu-modules/core/financial-document-processing-engine/server";

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
      name: "AR Receipt Application Test Customer",
      status: "ACTIVE",
      country_code: "NZ",
      state_or_province_code: null,
    },
    document_id: documentId,
    invoice_date: "2026-04-19",
    posting_date: "2026-04-19",
    revenue_posting_code: "400000",
    lines: [{ line_id: 1, description: "Application target invoice", quantity: 1, net_unit_price: 100, tax_rule: "NZ_STANDARD" }],
  };
}

function receiptRequest(documentId: string, counterpartyCode: string): ArReceiptRequestDto {
  createdDocumentIds.push(documentId);
  return {
    document_type: "AR_RECEIPT",
    company_code: "ACME",
    ar_counterparty_code: counterpartyCode,
    document_id: documentId,
    memo: "Unapplied receipt test",
    payment_date: "2026-05-01",
    receipt_amount: 115,
  };
}

function applicationRequest(documentId: string, counterpartyCode: string, receiptCode: string, invoiceCode: string): ArReceiptApplicationRequestDto {
  createdDocumentIds.push(documentId);
  return {
    document_type: "AR_RECEIPT_APPLICATION",
    company_code: "ACME",
    ar_counterparty_code: counterpartyCode,
    document_id: documentId,
    document_memo: "Apply receipt",
    application_date: "2026-05-08",
    applications: [{ source_receipt: { document_id: receiptCode }, target_invoice: { document_id: invoiceCode }, amount: 50 }],
  };
}

describe("AR_RECEIPT_APPLICATION document processing engine", () => {
  it("posts an unapplied receipt application to an invoice", async () => {
    const id = suffix();
    const counterpartyCode = `CUSTAPP${id}`;
    const invoice = await processArInvoice(invoiceRequest(`INVAPP${id}`, counterpartyCode));
    const receipt = await processArReceipt(receiptRequest(`PAYAPP${id}`, counterpartyCode));
    const invoiceCode = invoice.posting_details.journal_header.code;
    const receiptCode = receipt.posting_details.journal_header.code;
    assert.ok(invoiceCode);
    assert.ok(receiptCode);
    const invoiceDocumentId = invoice.detailed_document.document_id;
    const receiptDocumentId = receipt.detailed_document.document_id;

    const application = await processArReceiptApplication(applicationRequest(`APP${id}`, counterpartyCode, receiptDocumentId, invoiceDocumentId));

    assert.equal(application.detailed_document.total_application_amount, 50);
    assert.equal(application.detailed_document.applications[0].source_receipt_document_id, receiptDocumentId);
    assert.equal(application.detailed_document.applications[0].source_receipt_journal_code, receiptCode);
    assert.equal(application.detailed_document.applications[0].target_invoice_document_id, invoiceDocumentId);
    assert.equal(application.detailed_document.applications[0].target_invoice_journal_code, invoiceCode);
    assert.equal(application.ar_subledger_details.length, 2);
    assert.equal(application.ar_subledger_details[0].control_account_code, "AR_UNAPPLIED_CASH");
    assert.equal(application.ar_subledger_details[0].entry_type, "DEBIT");
    assert.equal(application.ar_subledger_details[1].control_account_code, "AR_TRADE_RECEIVABLES");
    assert.equal(application.ar_subledger_details[1].entry_type, "CREDIT");
    assert.equal(application.posting_details.journal_header.status, "POSTED");
  });

  it("generates document id from the AR receipt application code when omitted", async () => {
    const id = suffix();
    const counterpartyCode = `CUSTAPG${id}`;
    const invoice = await processArInvoice(invoiceRequest(`INVAPG${id}`, counterpartyCode));
    const receipt = await processArReceipt(receiptRequest(`PAYAPG${id}`, counterpartyCode));
    const invoiceDocumentId = invoice.detailed_document.document_id;
    const receiptDocumentId = receipt.detailed_document.document_id;

    const application = await processArReceiptApplication({
      document_type: "AR_RECEIPT_APPLICATION",
      company_code: "ACME",
      ar_counterparty_code: counterpartyCode,
      document_memo: "Generated application document id",
      application_date: "2026-05-08",
      applications: [{ source_receipt: { document_id: receiptDocumentId }, target_invoice: { document_id: invoiceDocumentId }, amount: 50 }],
    });

    createdDocumentIds.push(application.detailed_document.document_id);
    const journalHeaderId = application.posting_details.journal_header.id;
    assert.ok(journalHeaderId);
    assert.equal(application.detailed_document.document_id, `APP-${journalHeaderId}`);
    assert.equal(application.ar_subledger_details[0].code, `AR-${application.detailed_document.document_id}-1`);
    assert.equal(application.ar_subledger_details[1].code, `AR-${application.detailed_document.document_id}-2`);
    assert.equal(application.posting_details.journal_header.document_id, application.detailed_document.document_id);
  });

  it("rejects application amounts above source balance", async () => {
    const id = suffix();
    const counterpartyCode = `CUSTAPV${id}`;
    const invoice = await processArInvoice(invoiceRequest(`INVAPV${id}`, counterpartyCode));
    const receipt = await processArReceipt(receiptRequest(`PAYAPV${id}`, counterpartyCode));
    const invoiceDocumentId = invoice.detailed_document.document_id;
    const receiptDocumentId = receipt.detailed_document.document_id;

    await assert.rejects(
      () => processArReceiptApplication({
        ...applicationRequest(`APPBAD${id}`, counterpartyCode, receiptDocumentId, invoiceDocumentId),
        applications: [{ source_receipt: { document_id: receiptDocumentId }, target_invoice: { document_id: invoiceDocumentId }, amount: 116 }],
      }, { preview: true }),
      (err: unknown) => err instanceof Error && err.message.includes("exceeds source receipt"),
    );
  });
});

