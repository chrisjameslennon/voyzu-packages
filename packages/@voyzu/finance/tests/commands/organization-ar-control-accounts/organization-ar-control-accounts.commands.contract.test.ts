import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/organization-ar-control-accounts/commands";

test("organization-ar-control-accounts exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `organization-ar-control-accounts.${name} must be callable`);
  }
});
