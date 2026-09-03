import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/organization-gl-account-categories/commands";

test("organization-gl-account-categories exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `organization-gl-account-categories.${name} must be callable`);
  }
});
