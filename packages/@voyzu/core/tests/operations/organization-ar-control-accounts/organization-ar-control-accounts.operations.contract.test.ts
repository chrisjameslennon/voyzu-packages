import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/organization-ar-control-accounts/operations";

test("organization-ar-control-accounts exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `organization-ar-control-accounts.${name} must be callable`);
  }
});
