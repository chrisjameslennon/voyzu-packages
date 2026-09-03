import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/company-ap-control-accounts/commands";

test("company-ap-control-accounts exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `company-ap-control-accounts.${name} must be callable`);
  }
});
