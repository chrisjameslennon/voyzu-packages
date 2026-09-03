import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/ar-subledger-counterparties/commands";

test("ar-subledger-counterparties exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `ar-subledger-counterparties.${name} must be callable`);
  }
});
