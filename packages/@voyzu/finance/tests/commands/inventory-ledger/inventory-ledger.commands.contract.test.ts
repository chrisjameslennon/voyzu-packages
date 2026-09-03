import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/inventory-ledger/commands";

test("inventory-ledger exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `inventory-ledger.${name} must be callable`);
  }
});
