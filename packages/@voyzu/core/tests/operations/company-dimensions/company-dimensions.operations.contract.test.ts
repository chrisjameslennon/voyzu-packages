import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/company-dimensions/operations";

test("company-dimensions exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `company-dimensions.${name} must be callable`);
  }
});
