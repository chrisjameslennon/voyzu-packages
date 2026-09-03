import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/country-tax-settings/commands";

test("country-tax-settings exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `country-tax-settings.${name} must be callable`);
  }
});
