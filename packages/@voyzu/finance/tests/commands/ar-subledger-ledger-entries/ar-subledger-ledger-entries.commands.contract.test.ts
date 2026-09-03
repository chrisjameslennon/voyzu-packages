import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/ar-subledger-ledger-entries/commands";

test("ar-subledger-ledger-entries exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `ar-subledger-ledger-entries.${name} must be callable`);
  }
});
