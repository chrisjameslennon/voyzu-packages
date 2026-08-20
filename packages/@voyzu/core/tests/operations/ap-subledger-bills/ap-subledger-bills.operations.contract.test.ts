import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/ap-subledger-bills/operations";

test("ap-subledger-bills exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `ap-subledger-bills.${name} must be callable`);
  }
});
