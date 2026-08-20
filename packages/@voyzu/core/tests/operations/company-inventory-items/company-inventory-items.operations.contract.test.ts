import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/company-inventory-items/operations";

test("company-inventory-items exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `company-inventory-items.${name} must be callable`);
  }
});
