import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/organization-inventory-items/operations";

test("organization-inventory-items exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `organization-inventory-items.${name} must be callable`);
  }
});
