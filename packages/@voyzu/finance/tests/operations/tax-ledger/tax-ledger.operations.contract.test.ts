import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/tax-ledger/operations";

test("tax-ledger exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `tax-ledger.${name} must be callable`);
  }
});
