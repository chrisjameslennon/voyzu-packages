import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/organization-dimensions/commands";

test("organization-dimensions exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `organization-dimensions.${name} must be callable`);
  }
});
