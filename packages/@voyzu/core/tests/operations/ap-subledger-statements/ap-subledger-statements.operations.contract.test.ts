import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/ap-subledger-statements/operations";

test("ap-subledger-statements exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `ap-subledger-statements.${name} must be callable`);
  }
});
