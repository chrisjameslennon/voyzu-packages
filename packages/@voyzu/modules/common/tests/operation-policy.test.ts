import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { CodeChange, Deactivation, Deletion, GLAccountReassignment } from "../domain/operation-policy";

describe("shared operation policy", () => {
  const linkedBy = [{ type: "Defaults", code: "BANK" }];

  it("only blocks real code and GL-account changes after postings", () => {
    const current = { code: "100000", glAccountId: 1, hasPostings: true };
    assert.deepEqual(CodeChange(current, "100000", "Account"), []);
    assert.equal(CodeChange(current, "100001", "Account")[0]?.code, "HAS_POSTINGS_CODE_LOCKED");
    assert.deepEqual(GLAccountReassignment(current, 1, "Account"), []);
    assert.equal(GLAccountReassignment(current, 2, "Account")[0]?.code, "HAS_POSTINGS_GL_ACCOUNT_LOCKED");
  });

  it("blocks deactivation and deletion when referenced", () => {
    assert.equal(Deactivation({ code: "BANK", linkedBy }, "Account")[0]?.code, "LINKED_RECORD_CANNOT_BE_DEACTIVATED");
    assert.equal(Deletion({ code: "BANK", linkedBy }, "Account")[0]?.code, "LINKED_RECORD_CANNOT_BE_DELETED");
  });

  it("only treats postings as a deletion blocker when requested", () => {
    const current = { code: "100000", hasPostings: true };
    assert.deepEqual(Deletion(current, "Account"), []);
    assert.equal(Deletion(current, "Account", { blockWhenHasPostings: true })[0]?.code, "HAS_POSTINGS_CANNOT_BE_DELETED");
  });
});
