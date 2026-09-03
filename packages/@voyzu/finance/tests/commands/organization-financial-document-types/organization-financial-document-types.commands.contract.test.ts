import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/organization-financial-document-types/commands";

test("organization-financial-document-types exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `organization-financial-document-types.${name} must be callable`);
  }
});
