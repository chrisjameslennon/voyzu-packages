import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/ap-subledger-counterparties/operations";

test("ap-subledger-counterparties exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `ap-subledger-counterparties.${name} must be callable`);
  }
});
