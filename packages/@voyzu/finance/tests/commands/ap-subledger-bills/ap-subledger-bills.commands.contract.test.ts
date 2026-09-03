import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/ap-subledger-bills/commands";

test("ap-subledger-bills exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `ap-subledger-bills.${name} must be callable`);
  }
});
