import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/company-bank-cash-accounts/operations";

test("company-bank-cash-accounts exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `company-bank-cash-accounts.${name} must be callable`);
  }
});
