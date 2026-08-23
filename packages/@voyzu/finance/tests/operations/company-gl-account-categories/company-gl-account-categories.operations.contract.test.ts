import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/company-gl-account-categories/operations";

test("company-gl-account-categories exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `company-gl-account-categories.${name} must be callable`);
  }
});
