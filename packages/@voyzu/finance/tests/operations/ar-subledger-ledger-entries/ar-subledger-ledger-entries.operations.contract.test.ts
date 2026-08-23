import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/ar-subledger-ledger-entries/operations";

test("ar-subledger-ledger-entries exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `ar-subledger-ledger-entries.${name} must be callable`);
  }
});
