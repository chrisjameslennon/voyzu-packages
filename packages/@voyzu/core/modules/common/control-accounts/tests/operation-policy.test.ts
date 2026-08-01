import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { UpdateGLAccount } from "../domain/operation-policy";

const current = {
  code: "AP_TRADE_PAYABLES",
  glAccountId: 10000,
  hasPostings: false,
};
const requirements = { requiredAccountType: "LIABILITY" as const };

describe("control-account operation policy", () => {
  it("allows assigning the currently linked account as a no-op", () => {
    const blockers = UpdateGLAccount(
      { ...current, hasPostings: true },
      { id: 10000, status: "INACTIVE", accountType: "ASSET" },
      requirements,
    );

    assert.deepEqual(blockers, []);
  });

  it("allows a different active GL account of the required type", () => {
    const blockers = UpdateGLAccount(
      current,
      { id: 10001, status: "ACTIVE", accountType: "LIABILITY" },
      requirements,
    );

    assert.deepEqual(blockers, []);
  });

  it("returns every applicable blocker for a proposed change", () => {
    const blockers = UpdateGLAccount(
      { ...current, hasPostings: true },
      { id: 10001, status: "INACTIVE", accountType: "ASSET" },
      requirements,
    );

    assert.deepEqual(blockers.map((blocker) => blocker.code), [
      "CONTROL_ACCOUNT_HAS_POSTINGS",
      "GL_ACCOUNT_NOT_ACTIVE",
      "GL_ACCOUNT_TYPE_INVALID",
    ]);
  });
});
