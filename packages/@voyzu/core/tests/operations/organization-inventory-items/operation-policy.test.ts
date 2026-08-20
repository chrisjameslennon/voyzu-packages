import assert from "node:assert/strict";
import test from "node:test";

import { ChangeCode, ChangeCodeAvailability, Deactivate, Delete } from "../../../modules/common/inventory-items/domain/operation-policy";

test("inventory item lifecycle is not restricted by postings", () => {
  const item = { item_code: "ITEM_1", hasPostings: true };
  assert.deepEqual(Deactivate(item), []);
  assert.deepEqual(Delete(item), []);
});

test("an item code is locked after the item has postings", () => {
  const posted = { item_code: "ITEM_1", hasPostings: true };
  assert.equal(ChangeCode(posted, "ITEM_2")[0]?.code, "HAS_POSTINGS_CODE_LOCKED");
  assert.equal(ChangeCodeAvailability(posted)[0]?.code, "HAS_POSTINGS_CODE_LOCKED");
  assert.deepEqual(ChangeCode(posted, "ITEM_1"), []);
  assert.deepEqual(ChangeCode({ ...posted, hasPostings: false }, "ITEM_2"), []);
});
