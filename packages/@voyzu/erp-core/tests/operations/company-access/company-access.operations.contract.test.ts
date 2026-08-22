import assert from "node:assert/strict";
import { test } from "node:test";

import { operations } from "../../../modules/company-access/operations";

test("company access exports callable operations", () => {
  assert.deepEqual(
    Object.keys(operations).sort(),
    ["listCompanyAccess", "listCompanyIdsForUser", "replaceUserCompanyAccess"].sort(),
  );
  for (const [name, operation] of Object.entries(operations)) {
    assert.equal(typeof operation, "function", `companyAccess.${name} must be callable`);
  }
});
