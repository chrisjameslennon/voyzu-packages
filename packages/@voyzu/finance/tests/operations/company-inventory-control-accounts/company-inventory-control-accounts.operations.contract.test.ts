import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/company-inventory-control-accounts/operations";

test("company-inventory-control-accounts exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `company-inventory-control-accounts.${name} must be callable`);
  }
});
