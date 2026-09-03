import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/financial-document-processing-engine/commands";

test("financial-document-processing-engine exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `financial-document-processing-engine.${name} must be callable`);
  }
});
