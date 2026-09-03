import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/organization-financial-document-defaults/commands";

test("organization-financial-document-defaults exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `organization-financial-document-defaults.${name} must be callable`);
  }
});
