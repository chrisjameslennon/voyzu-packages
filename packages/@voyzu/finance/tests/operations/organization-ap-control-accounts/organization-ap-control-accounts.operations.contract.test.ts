import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/organization-ap-control-accounts/operations";

test("organization-ap-control-accounts exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `organization-ap-control-accounts.${name} must be callable`);
  }
});
