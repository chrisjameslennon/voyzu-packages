import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { AssignTarget } from "../domain/operation-policy";

describe("financial document default operation policy", () => {
  it("validates target kind, status, and allowed GL account type", () => {
    const current = { code: "SALES", targetType: "GENERAL_LEDGER" as const, allowedAccountTypes: ["REVENUE" as const] };
    assert.equal(AssignTarget(current, { kind: "BANK_CASH_ACCOUNT", id: 1, status: "ACTIVE" })[0]?.code, "TARGET_TYPE_INVALID");
    assert.deepEqual(
      AssignTarget(current, { kind: "GENERAL_LEDGER", id: 1, status: "INACTIVE", accountType: "ASSET" }).map(({ code }) => code),
      ["TARGET_NOT_ACTIVE", "GL_ACCOUNT_TYPE_INVALID"],
    );
  });
});
