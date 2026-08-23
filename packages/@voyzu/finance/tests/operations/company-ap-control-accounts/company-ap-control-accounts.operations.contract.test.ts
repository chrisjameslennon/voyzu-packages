import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/company-ap-control-accounts/operations";

test("company-ap-control-accounts exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `company-ap-control-accounts.${name} must be callable`);
  }
});
