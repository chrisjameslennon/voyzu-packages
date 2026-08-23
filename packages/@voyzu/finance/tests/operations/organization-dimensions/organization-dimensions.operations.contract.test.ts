import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/organization-dimensions/operations";

test("organization-dimensions exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `organization-dimensions.${name} must be callable`);
  }
});
