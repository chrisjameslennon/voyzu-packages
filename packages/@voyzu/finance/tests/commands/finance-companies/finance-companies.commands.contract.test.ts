import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/finance-companies/commands";

test("finance-companies exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `finance-companies.${name} must be callable`);
  }
});
