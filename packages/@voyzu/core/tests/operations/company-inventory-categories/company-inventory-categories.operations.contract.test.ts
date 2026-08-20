import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/company-inventory-categories/operations";

test("company-inventory-categories exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `company-inventory-categories.${name} must be callable`);
  }
});
