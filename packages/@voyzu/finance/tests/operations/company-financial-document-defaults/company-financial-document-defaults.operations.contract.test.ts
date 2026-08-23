import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/company-financial-document-defaults/operations";

test("company-financial-document-defaults exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `company-financial-document-defaults.${name} must be callable`);
  }
});
