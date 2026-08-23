import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/organization-tax-control-accounts/operations";

test("organization-tax-control-accounts exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `organization-tax-control-accounts.${name} must be callable`);
  }
});
