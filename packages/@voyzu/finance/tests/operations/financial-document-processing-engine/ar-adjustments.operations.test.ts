import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import type { ArInvoiceRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-invoice.request.dto";
import type { ArReceiptRequestDto } from "@voyzu/finance/types/modules/financial-document-processing-engine/ar-receipt.request.dto";
import { getPool } from "@voyzu/capability/db";
import { processArInvoice, processArReceipt, processArAdjustment } from "../../../modules/financial-document-processing-engine/operations";

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
      name: "AR Adjustment Test Customer",
      status: "ACTIVE",
      country_code: "NZ",
      state_or_province_code: null,
    },
    document_id: documentId,
    invoice_date: "2026-04-19",
    posting_date: "2026-04-19",
    revenue_posting_code: "400000",
    lines: [{ line_id: 1, description: "Adjustment target invoice", quantity: 1, net_unit_price: 100, tax_rule: "NZ_STANDARD" }],
  };
}

function receiptRequest(documentId: string, counterpartyCode: string): ArReceiptRequestDto {
  createdDocumentIds.push(documentId);
  return {
    document_type: "AR_RECEIPT",
    company_code: "ACME",
    ar_counterparty_code: counterpartyCode,
    document_id: documentId,
    memo: "Unapplied credit source",
    payment_date: "2026-05-01",
    receipt_amount: 115,
  };
}

describe("AR adjustment document processing engines", () => {
  it("previews an unallocated customer credit note", async () => {
    const id = suffix();
    const response = await processArAdjustment("AR_CREDIT_NOTE", {
      document_type: "AR_CREDIT_NOTE",
      company_code: "ACME",
      ar_counterparty: {
        code: `CUSTCN${id}`,
        name: "Credit Note Preview Customer",
        status: "ACTIVE",
        country_code: "NZ",
      },
      document_id: `CN${id}`,
      memo: "Credit note preview",
      credit_note_date: "2026-05-12",
      revenue_posting_code: "400000",
      lines: [{ line_id: 1, description: "Credit service line", quantity: 1, net_unit_price: 100, tax_rule: "NZ_STANDARD" }],
    }, { preview: true });

    assert.equal(response.detailed_document.document_type, "AR_CREDIT_NOTE");
    assert.equal(response.detailed_document.gross_amount, 115);
    assert.equal(response.detailed_document.unapplied_amount, 115);
    assert.equal(response.ar_subledger_details[0].control_account_code, "AR_UNAPPLIED_CASH");
    assert.equal(response.ar_subledger_details[0].entry_type, "CREDIT");
    assert.equal(response.tax_ledger_details?.[0].entry_type, "DEBIT");
    assert.equal(response.posting_details.journal_header.total_debit_base_amount, 115);
    assert.equal(response.posting_details.journal_header.total_credit_base_amount, 115);
  });

  it("previews AR opening balance items", async () => {
    const id = suffix();
    const response = await processArAdjustment("AR_OPENING_BALANCE", {
      document_type: "AR_OPENING_BALANCE",
      company_code: "ACME",
      ar_counterparty: {
        code: `CUSTOB${id}`,
        name: "Opening Balance Preview Customer",
        status: "ACTIVE",
        country_code: "NZ",
      },
      document_id: `OB${id}`,
      opening_balance_date: "2026-04-01",
      items: [{ line_id: 1, description: "Migrated invoice", amount: 200, original_invoice_date: "2026-03-15" }],
    }, { preview: true });

    assert.equal(response.detailed_document.document_type, "AR_OPENING_BALANCE");
    assert.equal(response.detailed_document.total_amount, 200);
    assert.equal(response.ar_subledger_details[0].control_account_code, "AR_TRADE_RECEIVABLES");
    assert.equal(response.ar_subledger_details[0].entry_type, "DEBIT");
    assert.equal(response.posting_details.journal_lines.length, 2);
  });

  it("previews a customer refund against unapplied credit", async () => {
    const id = suffix();
    const counterpartyCode = `CUSTRF${id}`;
    await processArInvoice(invoiceRequest(`INVRF${id}`, counterpartyCode));
    const receipt = await processArReceipt(receiptRequest(`PAYRF${id}`, counterpartyCode));

    const response = await processArAdjustment("AR_REFUND", {
      document_type: "AR_REFUND",
      company_code: "ACME",
      ar_counterparty_code: counterpartyCode,
      document_id: `REF${id}`,
      refund_date: "2026-05-10",
      refund_amount: 50,
    }, { preview: true });

    assert.equal(response.detailed_document.document_type, "AR_REFUND");
    assert.equal(response.detailed_document.refund_amount, 50);
    assert.equal(response.detailed_document.unapplied_balance_before, receipt.detailed_document.unapplied_amount);
    assert.equal(response.detailed_document.unapplied_balance_after, receipt.detailed_document.unapplied_amount - 50);
    assert.equal(response.ar_subledger_details[0].control_account_code, "AR_UNAPPLIED_CASH");
    assert.equal(response.ar_subledger_details[0].entry_type, "DEBIT");
    assert.equal(response.posting_details.journal_header.total_debit_base_amount, 50);
  });

  it("rejects customer refunds above the open unapplied balance", async () => {
    const id = suffix();
    const counterpartyCode = `CUSTRFX${id}`;
    await processArInvoice(invoiceRequest(`INVRFX${id}`, counterpartyCode));
    const receipt = await processArReceipt(receiptRequest(`PAYRFX${id}`, counterpartyCode));

    await assert.rejects(
      () => processArAdjustment("AR_REFUND", {
        document_type: "AR_REFUND",
        company_code: "ACME",
        ar_counterparty_code: counterpartyCode,
        document_id: `REFX${id}`,
        refund_date: "2026-05-10",
        refund_amount: receipt.detailed_document.unapplied_amount + 1,
      }, { preview: true }),
      (err: unknown) => err instanceof Error && err.message.includes("refund_amount exceeds open unapplied balance"),
    );
  });

  it("rejects refund applications", async () => {
    const id = suffix();
    const counterpartyCode = `CUSTRFA${id}`;

    await assert.rejects(
      () => processArAdjustment("AR_REFUND", {
        document_type: "AR_REFUND",
        company_code: "ACME",
        ar_counterparty_code: counterpartyCode,
        document_id: `REFA${id}`,
        refund_date: "2026-05-10",
        refund_amount: 50,
        applications: [{ source_credit: { document_id: "PAY-DOES-NOT-MATTER" }, amount: 50 }],
      } as never, { preview: true }),
      (err: unknown) => err instanceof Error && err.message.includes("$.applications is not allowed"),
    );
  });

  it("previews a receivable write-off against an open invoice", async () => {
    const id = suffix();
    const counterpartyCode = `CUSTWO${id}`;
    const invoice = await processArInvoice(invoiceRequest(`INVWO${id}`, counterpartyCode));

    const response = await processArAdjustment("AR_WRITE_OFF", {
      document_type: "AR_WRITE_OFF",
      company_code: "ACME",
      ar_counterparty_code: counterpartyCode,
      document_id: `WO${id}`,
      write_off_date: "2026-05-15",
      applications: [{ target_invoice: { document_id: invoice.detailed_document.document_id }, amount: 25 }],
    }, { preview: true });

    assert.equal(response.detailed_document.document_type, "AR_WRITE_OFF");
    assert.equal(response.detailed_document.total_write_off_amount, 25);
    assert.equal(response.detailed_document.applications[0].target_invoice_document_id, invoice.detailed_document.document_id);
    assert.equal(response.ar_subledger_details[0].control_account_code, "AR_TRADE_RECEIVABLES");
    assert.equal(response.ar_subledger_details[0].entry_type, "CREDIT");
    assert.equal(response.posting_details.journal_header.total_credit_base_amount, 25);
  });

  it("rejects dimensions on non-dimensional adjustment documents", async () => {
    await assert.rejects(
      () => processArAdjustment("AR_WRITE_OFF", {
        document_type: "AR_WRITE_OFF",
        company_code: "ACME",
        ar_counterparty_code: "CUST_TEST",
        document_id: "WOBADDIMS",
        write_off_date: "2026-05-15",
        dimensions: { DEPARTMENT: "SALES" },
        applications: [{ target_invoice: { document_id: "INV-DOES-NOT-MATTER" }, amount: 10 }],
      }, { preview: true }),
      (err: unknown) => err instanceof Error && err.message.includes("AR_WRITE_OFF does not support dimensions"),
    );
  });
});

