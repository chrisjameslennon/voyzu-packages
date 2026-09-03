import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/organization-tax-control-accounts/commands";

test("organization-tax-control-accounts exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `organization-tax-control-accounts.${name} must be callable`);
  }
});
