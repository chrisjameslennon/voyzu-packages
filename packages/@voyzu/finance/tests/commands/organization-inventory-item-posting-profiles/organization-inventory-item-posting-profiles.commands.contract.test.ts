import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/organization-inventory-item-posting-profiles/commands";

test("organization-inventory-item-posting-profiles exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `organization-inventory-item-posting-profiles.${name} must be callable`);
  }
});
