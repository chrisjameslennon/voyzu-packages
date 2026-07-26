import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { ChangeCode, Deactivate, Delete } from "../domain/operation-policy";

describe("GL account operation policy", () => {
  const state = { code: "100000", hasPostings: false, linkedBy: [] };

  it("blocks code changes and deletion after postings", () => {
    const posted = { ...state, hasPostings: true };
    assert.equal(ChangeCode(posted, "100001")[0]?.code, "HAS_POSTINGS_CODE_LOCKED");
    assert.equal(Delete(posted)[0]?.code, "HAS_POSTINGS_CANNOT_BE_DELETED");
  });

  it("blocks deactivation when linked", () => {
    assert.equal(Deactivate({ ...state, linkedBy: [{ type: "Control Accounts", code: "AP" }] })[0]?.code, "LINKED_RECORD_CANNOT_BE_DEACTIVATED");
  });
});
