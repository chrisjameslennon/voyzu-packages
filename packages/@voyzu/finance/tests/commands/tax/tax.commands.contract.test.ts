import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/tax/commands";

test("tax exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `tax.${name} must be callable`);
  }
});
