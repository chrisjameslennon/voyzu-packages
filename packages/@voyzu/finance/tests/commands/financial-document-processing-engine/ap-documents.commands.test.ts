import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import { getPool } from "@voyzu/capability/db";
import { processApBill, processApDocument } from "../../../modules/financial-document-processing-engine/commands";

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
        const apHeaderIds = await pool.query<{ id: number }>(
          `SELECT id FROM ap_subledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`,
          [ids],
        );
        const apIds = apHeaderIds.rows.map((row) => row.id);
        const taxHeaderIds = await pool.query<{ id: number }>(
          `SELECT id FROM tax_ledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`,
          [ids],
        );
        const taxIds = taxHeaderIds.rows.map((row) => row.id);
        await pool.query("ALTER TABLE journal_header DISABLE TRIGGER USER");
        await pool.query("ALTER TABLE journal_line DISABLE TRIGGER USER");
        try {
          if (taxIds.length) await pool.query(`DELETE FROM tax_ledger_entry_line WHERE tax_ledger_entry_header_id = ANY($1::bigint[])`, [taxIds]);
          if (apIds.length) await pool.query(`DELETE FROM ap_subledger_entry_line WHERE ap_subledger_entry_header_id = ANY($1::bigint[]) OR source_entry_header_id = ANY($1::bigint[]) OR target_entry_header_id = ANY($1::bigint[])`, [apIds]);
          await pool.query(`DELETE FROM tax_ledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
          await pool.query(`DELETE FROM ap_subledger_entry_header WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
          await pool.query(`DELETE FROM journal_line WHERE journal_header_id = ANY($1::bigint[])`, [ids]);
          await pool.query(`DELETE FROM journal_header WHERE id = ANY($1::bigint[])`, [ids]);
        } finally {
          await pool.query("ALTER TABLE journal_line ENABLE TRIGGER USER");
          await pool.query("ALTER TABLE journal_header ENABLE TRIGGER USER");
        }
      }
    }
    if (createdCounterpartyCodes.length) {
      await pool.query(`DELETE FROM ap_counterparty WHERE code = ANY($1::text[])`, [[...createdCounterpartyCodes]]);
    }
  } finally {
    await pool.end();
  }
});

function track<T extends { document_id?: string | null }>(request: T): T {
  if (request.document_id) createdDocumentIds.push(request.document_id);
  return request;
}

async function bill(documentId: string, counterpartyCode: string, gross = 115) {
  if (!createdCounterpartyCodes.includes(counterpartyCode)) createdCounterpartyCodes.push(counterpartyCode);
  const tax = Math.round((gross - gross / 1.15) * 100) / 100;
  const net = Math.round((gross - tax) * 100) / 100;
  return processApBill(track({
    document_type: "AP_BILL",
    company_code: "ACME",
    ap_counterparty: {
      code: counterpartyCode,
      name: `AP Test Supplier ${counterpartyCode}`,
      status: "ACTIVE",
      country_code: "NZ",
      state_or_province_code: null,
    },
    document_id: documentId,
    supplier_invoice_number: `INV-${documentId}`,
    bill_date: "2026-04-19",
    posting_date: "2026-04-19",
    purchase_posting_code: "699000",
    lines: [{ line_id: 1, description: "AP test bill", net_amount: net, tax_rule: "NZ_STANDARD", gross_amount: gross }],
  }));
}

describe("AP document posting engines", () => {
  it("posts payments, applications, credits, refunds, opening balances, write-offs, and cancellations by document_id", async () => {
    const suffix = String(Date.now()).slice(-6);
    const cp = `AP${suffix}`;

    await bill(`BIL${suffix}A`, cp, 230);
    const payment = await processApDocument("AP_PAYMENT", track({
      document_type: "AP_PAYMENT",
      company_code: "ACME",
      ap_counterparty_code: cp,
      document_id: `PAY${suffix}A`,
      payment_date: "2026-04-20",
      payment_amount: 100,
      bank_cash_details: {
        code: "BANK_OPERATING",
        tx_id: `TEST-AP-PAY${suffix}A`,
        tx_ref: `PAY${suffix}A`,
        tx_details: "AP payment test bank transaction",
        payment_ref: `PAY${suffix}A`,
      },
      allocations: [{ document_id: `BIL${suffix}A`, amount: 100 }],
    }));
    assert.equal(payment.posting_details.journal_header.status, "POSTED");
    assert.deepEqual(payment.ap_subledger_details.map((line) => line.control_account_code), ["AP_TRADE_PAYABLES"]);
    assert.equal(payment.ap_subledger_details[0].entry_type, "DEBIT");
    assert.equal((payment.detailed_document as { bank_cash_details?: { code?: string | null } }).bank_cash_details?.code, "BANK_OPERATING");
    const paymentHeader = await getPool().query<{ bank_cash_code: string | null; bank_cash_tx_id: string | null }>(
      `SELECT bank_cash_code, bank_cash_tx_id FROM journal_header WHERE id = $1`,
      [payment.posting_details.journal_header.id],
    );
    assert.equal(paymentHeader.rows[0].bank_cash_code, "BANK_OPERATING");
    assert.equal(paymentHeader.rows[0].bank_cash_tx_id, `TEST-AP-PAY${suffix}A`);

    await bill(`BIL${suffix}B`, cp, 115);
    await processApDocument("AP_PAYMENT", track({
      document_type: "AP_PAYMENT",
      company_code: "ACME",
      ap_counterparty_code: cp,
      document_id: `PAY${suffix}B`,
      payment_date: "2026-04-21",
      payment_amount: 60,
    }));
    const application = await processApDocument("AP_PAYMENT_APPLICATION", track({
      document_type: "AP_PAYMENT_APPLICATION",
      company_code: "ACME",
      ap_counterparty_code: cp,
      document_id: `APP${suffix}B`,
      application_date: "2026-04-22",
      applications: [{
        source_payment: { document_id: `PAY${suffix}B` },
        target_bill: { document_id: `BIL${suffix}B` },
        amount: 50,
      }],
    }));
    assert.deepEqual(application.posting_details.journal_lines.map((line) => `${line.dr_cr}:${line.source_control_account}`), ["CR:AP_UNAPPLIED_PAYMENTS", "DR:AP_TRADE_PAYABLES"]);

    await bill(`BIL${suffix}C`, cp, 115);
    const credit = await processApDocument("AP_CREDIT_NOTE", track({
      document_type: "AP_CREDIT_NOTE",
      company_code: "ACME",
      ap_counterparty_code: cp,
      document_id: `CN${suffix}C`,
      supplier_credit_note_number: `CN-${suffix}`,
      credit_note_date: "2026-04-23",
      lines: [{ line_id: 1, description: "Supplier credit", net_amount: 100, tax_rule: "NZ_STANDARD", gross_amount: 115 }],
      allocations: [{ document_id: `BIL${suffix}C`, amount: 115 }],
    }));
    assert.equal(credit.tax_ledger_details?.[0]?.status, "POSTED");
    assert.equal(credit.tax_ledger_details?.[0]?.tax_movement_type_code, "TAX_ON_PURCHASES");

    const refund = await processApDocument("AP_REFUND", track({
      document_type: "AP_REFUND",
      company_code: "ACME",
      ap_counterparty_code: cp,
      document_id: `REF${suffix}`,
      refund_date: "2026-04-24",
      refund_amount: 10,
      bank_cash_details: {
        code: "BANK_OPERATING",
        tx_id: `TEST-AP-REF${suffix}`,
        tx_ref: `REF${suffix}`,
      },
    }));
    assert.equal(refund.ap_subledger_details[0].control_account_code, "AP_UNAPPLIED_PAYMENTS");
    assert.equal(refund.ap_subledger_details[0].entry_type, "CREDIT");
    assert.equal((refund.detailed_document as { bank_cash_details?: { tx_id?: string | null } }).bank_cash_details?.tx_id, `TEST-AP-REF${suffix}`);

    await processApDocument("AP_OPENING_BALANCE", track({
      document_type: "AP_OPENING_BALANCE",
      company_code: "ACME",
      ap_counterparty_code: cp,
      document_id: `OB${suffix}`,
      opening_balance_date: "2026-04-01",
      items: [{ line_id: 1, description: "Legacy payable", gross_amount: 40 }],
    }));
    const openingPayment = await processApDocument("AP_PAYMENT", track({
      document_type: "AP_PAYMENT",
      company_code: "ACME",
      ap_counterparty_code: cp,
      document_id: `PAY${suffix}O`,
      payment_date: "2026-04-25",
      payment_amount: 40,
      allocations: [{ document_id: `OB${suffix}`, amount: 40 }],
    }));
    assert.equal(openingPayment.ap_subledger_details[0].applied_to_ap_subledger_entry_id === null, false);

    await bill(`BIL${suffix}D`, cp, 80);
    const writeOff = await processApDocument("AP_WRITE_OFF", track({
      document_type: "AP_WRITE_OFF",
      company_code: "ACME",
      ap_counterparty_code: cp,
      document_id: `WO${suffix}`,
      write_off_date: "2026-04-26",
      applications: [{ target_bill: { document_id: `BIL${suffix}D` }, amount: 25 }],
    }));
    assert.equal(writeOff.posting_details.journal_lines[1].source_ledger, "POSTING_CODE");
    assert.equal(writeOff.posting_details.journal_lines[1].source_control_account, "SUPPLIER_WRITE_OFF_INCOME_ACCOUNT");

    await bill(`BIL${suffix}E`, cp, 70);
    const cancellation = await processApDocument("AP_BILL_CANCELLATION", track({
      document_type: "AP_BILL_CANCELLATION",
      company_code: "ACME",
      ap_counterparty_code: cp,
      document_id: `CAN${suffix}`,
      source_bill: { document_id: `BIL${suffix}E` },
      cancellation_date: "2026-04-27",
    }));
    assert.equal(cancellation.ap_subledger_details[0].entry_type, "DEBIT");
    assert.equal(cancellation.tax_ledger_details?.[0]?.entry_type, "CREDIT");
  });

  it("rejects cancellation once an AP bill is partially settled", async () => {
    const suffix = `R${String(Date.now()).slice(-5)}`;
    const cp = `AP${suffix}`;
    await bill(`BIL${suffix}`, cp, 115);
    await processApDocument("AP_PAYMENT", track({
      document_type: "AP_PAYMENT",
      company_code: "ACME",
      ap_counterparty_code: cp,
      document_id: `PAY${suffix}`,
      payment_date: "2026-04-20",
      payment_amount: 10,
      allocations: [{ document_id: `BIL${suffix}`, amount: 10 }],
    }));

    await assert.rejects(
      () => processApDocument("AP_BILL_CANCELLATION", track({
        document_type: "AP_BILL_CANCELLATION",
        company_code: "ACME",
        ap_counterparty_code: cp,
        document_id: `CAN${suffix}`,
        source_bill: { document_id: `BIL${suffix}` },
        cancellation_date: "2026-04-21",
      })),
      (error) => error instanceof Error && error.message.includes("must be fully open"),
    );
  });

  it("rejects bank cash details on AP documents without cash movement", async () => {
    const suffix = `BC${String(Date.now()).slice(-5)}`;
    const cp = `AP${suffix}`;
    await assert.rejects(
      () => processApDocument("AP_OPENING_BALANCE", track({
        document_type: "AP_OPENING_BALANCE",
        company_code: "ACME",
        ap_counterparty_code: cp,
        document_id: `OB${suffix}`,
        opening_balance_date: "2026-04-01",
        bank_cash_details: { code: "BANK_OPERATING" },
        items: [{ line_id: 1, description: "Legacy payable", gross_amount: 40 }],
      })),
      (error) => error instanceof Error && error.message.includes("AP_OPENING_BALANCE does not support bank_cash_details"),
    );
  });
});

