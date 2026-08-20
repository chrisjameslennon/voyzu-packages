import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/company-inventory-item-posting-profiles/operations";

test("company-inventory-item-posting-profiles exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `company-inventory-item-posting-profiles.${name} must be callable`);
  }
});
