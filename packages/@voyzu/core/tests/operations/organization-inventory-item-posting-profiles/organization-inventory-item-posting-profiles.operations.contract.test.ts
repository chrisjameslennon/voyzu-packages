import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/organization-inventory-item-posting-profiles/operations";

test("organization-inventory-item-posting-profiles exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `organization-inventory-item-posting-profiles.${name} must be callable`);
  }
});
