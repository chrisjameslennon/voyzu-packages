import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/company-bank-cash-accounts/commands";

test("company-bank-cash-accounts exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `company-bank-cash-accounts.${name} must be callable`);
  }
});
