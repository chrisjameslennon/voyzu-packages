import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/company-gl-account-categories/commands";

test("company-gl-account-categories exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `company-gl-account-categories.${name} must be callable`);
  }
});
