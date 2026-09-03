import assert from "node:assert/strict";
import { test } from "node:test";

import { commands } from "../../../modules/company-reports/commands";

test("company-reports exports callable commands", () => {
  assert.ok(Object.keys(commands).length > 0);
  for (const [name, command] of Object.entries(commands)) {
    assert.equal(typeof command, "function", `company-reports.${name} must be callable`);
  }
});
