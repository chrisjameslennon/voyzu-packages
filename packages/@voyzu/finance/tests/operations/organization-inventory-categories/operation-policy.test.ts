import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { Deactivate, Delete } from "../../../modules/common/inventory-categories/domain/operation-policy";

describe("inventory category operation policy", () => {
  it("blocks deactivation while active items use the category", () => {
    assert.equal(Deactivate({ code: "GOODS", numberOfItems: { total: 2, active: 1 } })[0]?.code, "LINKED_RECORD_CANNOT_BE_DEACTIVATED");
    assert.deepEqual(Deactivate({ code: "GOODS", numberOfItems: { total: 1, active: 0 } }), []);
  });

  it("blocks deletion while any items use the category", () => {
    assert.equal(Delete({ code: "GOODS", numberOfItems: { total: 1, active: 0 } })[0]?.code, "LINKED_RECORD_CANNOT_BE_DELETED");
    assert.deepEqual(Delete({ code: "GOODS", numberOfItems: { total: 0, active: 0 } }), []);
  });
});
