import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ChangeCode, ChangeCodeAvailability, ChangeType, ChangeTypeAvailability, Deactivate, Delete, UpdateGLAccount } from "../../../modules/common/bank-cash-accounts/domain/operation-policy";

describe("bank / cash account operation policy", () => {
  const state = { code: "BANK", glAccountId: 1, hasPostings: false, linkedBy: [] };

  it("allows code changes only when the account has no postings or links", () => {
    assert.deepEqual(ChangeCode(state, "BANK_NEW"), []);
    assert.equal(ChangeCode({ ...state, linkedBy: [{ type: "Defaults", code: "PAYMENT" }] }, "BANK_NEW")[0]?.code, "LINKED_RECORD_CODE_LOCKED");
    assert.equal(ChangeCodeAvailability({ ...state, hasPostings: true })[0]?.code, "HAS_POSTINGS_CODE_LOCKED");
    assert.equal(ChangeCode({ ...state, hasPostings: true }, "BANK_NEW")[0]?.code, "HAS_POSTINGS_CODE_LOCKED");
  });

  it("allows type changes only when the account has no postings or links", () => {
    assert.deepEqual(ChangeType({ ...state, type: "BANK" }, "CASH"), []);
    assert.deepEqual(ChangeType({ ...state, type: "BANK" }, "BANK"), []);
    assert.equal(ChangeTypeAvailability({ ...state, hasPostings: true })[0]?.code, "HAS_POSTINGS_TYPE_LOCKED");
    assert.equal(ChangeType({ ...state, type: "BANK", linkedBy: [{ type: "Defaults", code: "PAYMENT" }] }, "CASH")[0]?.code, "LINKED_RECORD_TYPE_LOCKED");
  });

  it("validates a changed GL account and retains every blocker", () => {
    const blockers = UpdateGLAccount(
      { ...state, hasPostings: true },
      { id: 2, status: "INACTIVE", accountType: "LIABILITY" },
    );
    assert.deepEqual(blockers.map(({ code }) => code), ["HAS_POSTINGS_GL_ACCOUNT_LOCKED", "GL_ACCOUNT_NOT_ACTIVE", "GL_ACCOUNT_TYPE_INVALID"]);
  });

  it("blocks deletion for postings and references, but deactivation only for references", () => {
    assert.deepEqual(Deactivate({ ...state, hasPostings: true }), []);
    assert.equal(Delete({ ...state, hasPostings: true })[0]?.code, "HAS_POSTINGS_CANNOT_BE_DELETED");
    assert.equal(Deactivate({ ...state, linkedBy: [{ type: "Defaults", code: "PAYMENT" }] })[0]?.code, "LINKED_RECORD_CANNOT_BE_DEACTIVATED");
  });
});
