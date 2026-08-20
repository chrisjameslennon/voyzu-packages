import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/journals/operations";

test("journals exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `journals.${name} must be callable`);
  }
});
