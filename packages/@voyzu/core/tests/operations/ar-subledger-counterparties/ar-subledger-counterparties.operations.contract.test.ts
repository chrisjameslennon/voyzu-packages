import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/ar-subledger-counterparties/operations";

test("ar-subledger-counterparties exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `ar-subledger-counterparties.${name} must be callable`);
  }
});
