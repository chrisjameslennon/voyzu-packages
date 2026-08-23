import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/tax/operations";

test("tax exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `tax.${name} must be callable`);
  }
});
