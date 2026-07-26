import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getPostingCodeAllowedAccountTypes } from "@voyzu-modules/core/financial-document-processing-engine/posting-code-metadata";

describe("financial document posting code metadata", () => {
  const expected = [
    ["AP_BILL", "PURCHASE_ACCOUNT", ["EXPENSE", "ASSET"]],
    ["AP_CREDIT_NOTE", "PURCHASE_REVERSAL_ACCOUNT", ["EXPENSE", "ASSET"]],
    ["AP_OPENING_BALANCE", "OPENING_BALANCE_EQUITY_ACCOUNT", ["EQUITY"]],
    ["AP_WRITE_OFF", "SUPPLIER_WRITE_OFF_INCOME_ACCOUNT", ["REVENUE"]],
    ["AR_CREDIT_NOTE", "REVENUE_REVERSAL_ACCOUNT", ["REVENUE"]],
    ["AR_INVOICE", "REVENUE_ACCOUNT", ["REVENUE"]],
    ["AR_OPENING_BALANCE", "OPENING_BALANCE_EQUITY_ACCOUNT", ["EQUITY"]],
    ["AR_WRITE_OFF", "CUSTOMER_WRITE_OFF_EXPENSE_ACCOUNT", ["EXPENSE"]],
    ["TAX_ADJUSTMENT", "TAX_ADJUSTMENT_OFFSET_ACCOUNT", ["EXPENSE"]],
  ] as const;

  for (const [documentCode, postingCode, allowedAccountTypes] of expected) {
    it(`${documentCode}/${postingCode} exposes its allowed account types`, () => {
      assert.deepEqual(getPostingCodeAllowedAccountTypes(documentCode, postingCode), allowedAccountTypes);
    });
  }

  it("rejects an unregistered posting code", () => {
    assert.throws(
      () => getPostingCodeAllowedAccountTypes("AP_BILL", "UNKNOWN"),
      /No posting code metadata is registered/,
    );
  });
});
