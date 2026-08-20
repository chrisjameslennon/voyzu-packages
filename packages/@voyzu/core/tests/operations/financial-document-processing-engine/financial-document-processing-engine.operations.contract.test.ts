import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/financial-document-processing-engine/operations";

test("financial-document-processing-engine exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `financial-document-processing-engine.${name} must be callable`);
  }
});
