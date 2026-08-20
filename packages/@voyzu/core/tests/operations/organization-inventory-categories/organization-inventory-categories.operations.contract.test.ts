import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/organization-inventory-categories/operations";

test("organization-inventory-categories exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `organization-inventory-categories.${name} must be callable`);
  }
});
