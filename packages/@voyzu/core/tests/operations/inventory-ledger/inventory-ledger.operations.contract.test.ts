import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/inventory-ledger/operations";

test("inventory-ledger exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `inventory-ledger.${name} must be callable`);
  }
});
