import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/organization-access/operations";

test("organization access exports callable operations", () => {
  assert.deepEqual(
    Object.keys(operations).sort(),
    ["listOrganizationAccess", "listOrganizationIdsForUser", "replaceUserOrganizationAccess"].sort(),
  );
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `organizationAccess.${name} must be callable`);
  }
});
