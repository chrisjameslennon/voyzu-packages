import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { processTaxDocument } from "@voyzu/core/financial-document-processing-engine/server";

describe("Tax document posting engines", () => {
  it("previews a tax payment with matching bank cash details", async () => {
    const result = await processTaxDocument("TAX_PAYMENT", {
      document_type: "TAX_PAYMENT",
      company_code: "ACME",
      tax_authority_code: "IRD",
      document_id: "TAXPAYTEST",
      payment_date: "2026-04-20",
      payment_amount: 123.45,
      bank_cash_details: {
        code: "BANK_OPERATING",
        tx_id: "TEST-TAX-PAY",
        tx_ref: "TAXPAYTEST",
      },
    }, { preview: true });

    assert.equal(result.posting_details.journal_header.status, "EPHEMERAL");
    assert.equal(result.detailed_document.bank_cash_details?.code, "BANK_OPERATING");
    assert.deepEqual(
      result.posting_details.journal_lines.map((line) => `${line.dr_cr}:${line.source_ledger}:${line.source_control_account}`),
      ["DR:TAX:TAX_ON_SALES", "CR:BANK_CASH:BANK_OPERATING"],
    );
    assert.equal(result.tax_ledger_details[0].tax_movement_type_code, "TAX_ON_SALES");
    assert.equal(result.tax_ledger_details[0].entry_type, "DEBIT");
  });

  it("previews a tax refund with matching bank cash details", async () => {
    const result = await processTaxDocument("TAX_REFUND", {
      document_type: "TAX_REFUND",
      company_code: "ACME",
      tax_authority_code: "IRD",
      document_id: "TAXREFTEST",
      refund_date: "2026-04-21",
      refund_amount: 67.89,
      bank_cash_details: {
        code: "BANK_OPERATING",
        tx_id: "TEST-TAX-REF",
        tx_ref: "TAXREFTEST",
      },
    }, { preview: true });

    assert.equal(result.detailed_document.bank_cash_details?.tx_id, "TEST-TAX-REF");
    assert.deepEqual(
      result.posting_details.journal_lines.map((line) => `${line.dr_cr}:${line.source_ledger}:${line.source_control_account}`),
      ["DR:BANK_CASH:BANK_OPERATING", "CR:TAX:TAX_ON_PURCHASES"],
    );
    assert.equal(result.tax_ledger_details[0].tax_movement_type_code, "TAX_ON_PURCHASES");
    assert.equal(result.tax_ledger_details[0].entry_type, "CREDIT");
  });

  it("rejects bank cash details that do not match the selected bank cash account code", async () => {
    await assert.rejects(
      () => processTaxDocument("TAX_PAYMENT", {
        document_type: "TAX_PAYMENT",
        company_code: "ACME",
        tax_authority_code: "IRD",
        document_id: "TAXPAYBADBANK",
        payment_date: "2026-04-20",
        payment_amount: 10,
        bank_cash_details: { code: "BANK_PAYROLL" },
      }, { preview: true }),
      (error) => error instanceof Error && error.message.includes("does not match bank_cash_account_code"),
    );
  });

  it("rejects tax GL account overrides on payment and refund documents", async () => {
    await assert.rejects(
      () => processTaxDocument("TAX_PAYMENT", {
        document_type: "TAX_PAYMENT",
        company_code: "ACME",
        tax_authority_code: "IRD",
        document_id: "TAXPAYTAXOVERRIDE",
        payment_date: "2026-04-20",
        payment_amount: 10,
        tax_gl_account_code: "220000",
      }, { preview: true }),
      (error) => error instanceof Error && error.message.includes("TAX_PAYMENT does not support tax_gl_account_code"),
    );

    await assert.rejects(
      () => processTaxDocument("TAX_REFUND", {
        document_type: "TAX_REFUND",
        company_code: "ACME",
        tax_authority_code: "IRD",
        document_id: "TAXREFTAXOVERRIDE",
        refund_date: "2026-04-21",
        refund_amount: 10,
        tax_gl_account_code: "120000",
      }, { preview: true }),
      (error) => error instanceof Error && error.message.includes("TAX_REFUND does not support tax_gl_account_code"),
    );
  });

  it("previews all tax adjustment direction combinations", async () => {
    const cases = [
      { movement: "TAX_ON_SALES", effect: "INCREASES_TAX_PAYABLE", journal: ["DR:POSTING_CODE:TAX_ADJUSTMENT_OFFSET_ACCOUNT", "CR:TAX:TAX_ON_SALES"], taxEntry: "CREDIT" },
      { movement: "TAX_ON_SALES", effect: "REDUCES_TAX_PAYABLE", journal: ["CR:POSTING_CODE:TAX_ADJUSTMENT_OFFSET_ACCOUNT", "DR:TAX:TAX_ON_SALES"], taxEntry: "DEBIT" },
      { movement: "TAX_ON_PURCHASES", effect: "INCREASES_TAX_RECOVERABLE", journal: ["CR:POSTING_CODE:TAX_ADJUSTMENT_OFFSET_ACCOUNT", "DR:TAX:TAX_ON_PURCHASES"], taxEntry: "DEBIT" },
      { movement: "TAX_ON_PURCHASES", effect: "REDUCES_TAX_RECOVERABLE", journal: ["DR:POSTING_CODE:TAX_ADJUSTMENT_OFFSET_ACCOUNT", "CR:TAX:TAX_ON_PURCHASES"], taxEntry: "CREDIT" },
    ] as const;

    for (const [index, testCase] of cases.entries()) {
      const result = await processTaxDocument("TAX_ADJUSTMENT", {
        document_type: "TAX_ADJUSTMENT",
        company_code: "ACME",
        tax_authority_code: "IRD",
        document_id: `TAXADJTEST${index}`,
        adjustment_date: "2026-04-22",
        tax_movement_code: testCase.movement,
        adjustment_effect: testCase.effect,
        adjustment_amount: 25,
      }, { preview: true });

      assert.deepEqual(
        result.posting_details.journal_lines.map((line) => `${line.dr_cr}:${line.source_ledger}:${line.source_control_account}`),
        testCase.journal,
      );
      assert.equal(result.tax_ledger_details[0].tax_movement_type_code, testCase.movement);
      assert.equal(result.tax_ledger_details[0].entry_type, testCase.taxEntry);
    }
  });

  it("rejects bank cash details on tax adjustments", async () => {
    await assert.rejects(
      () => processTaxDocument("TAX_ADJUSTMENT", {
        document_type: "TAX_ADJUSTMENT",
        company_code: "ACME",
        tax_authority_code: "IRD",
        document_id: "TAXADJBANK",
        adjustment_date: "2026-04-22",
        tax_movement_code: "TAX_ON_SALES",
        adjustment_effect: "INCREASES_TAX_PAYABLE",
        adjustment_amount: 25,
        bank_cash_details: { code: "BANK_OPERATING" },
      }, { preview: true }),
      (error) => error instanceof Error && error.message.includes("TAX_ADJUSTMENT does not support bank_cash_details"),
    );
  });
});

