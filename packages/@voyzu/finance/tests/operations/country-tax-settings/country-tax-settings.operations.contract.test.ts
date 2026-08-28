import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/country-tax-settings/operations";

test("country-tax-settings exports callable operations", () => {
  assert.ok(Object.keys(operations).length > 0);
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `country-tax-settings.${name} must be callable`);
  }
});
