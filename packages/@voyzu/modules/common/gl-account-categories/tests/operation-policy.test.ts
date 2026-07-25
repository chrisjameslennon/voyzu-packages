import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { Deactivate, Delete } from "../domain/operation-policy";

describe("reporting category operation policy", () => {
  it("uses GL account references rather than posting history", () => {
    const unlinked = { code: "BANK", linkedBy: [] };
    assert.deepEqual(Deactivate(unlinked), []);
    assert.deepEqual(Delete(unlinked), []);

    const linked = { code: "BANK", linkedBy: [{ type: "General Ledger Accounts", code: "100000" }] };
    assert.equal(Deactivate(linked)[0]?.code, "LINKED_RECORD_CANNOT_BE_DEACTIVATED");
    assert.equal(Delete(linked)[0]?.code, "LINKED_RECORD_CANNOT_BE_DELETED");
  });
});
