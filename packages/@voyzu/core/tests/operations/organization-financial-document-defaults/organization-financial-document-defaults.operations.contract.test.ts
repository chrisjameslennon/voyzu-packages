import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/organization-financial-document-defaults/operations";

test("organization-financial-document-defaults exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `organization-financial-document-defaults.${name} must be callable`);
  }
});
