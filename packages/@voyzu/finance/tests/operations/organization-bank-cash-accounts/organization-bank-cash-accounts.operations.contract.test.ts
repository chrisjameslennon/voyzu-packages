import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/organization-bank-cash-accounts/operations";

test("organization-bank-cash-accounts exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `organization-bank-cash-accounts.${name} must be callable`);
  }
});
