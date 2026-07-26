import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  ChangeCode,
  ChangeCodeAvailability,
  ChangeValueName,
  Deactivate,
  DeactivateValue,
  Delete,
  DeleteValue,
} from "@voyzu-modules/all-modules/common/dimensions/domain/operation-policy";

describe("dimension operation policy", () => {
  it("allows an unused dimension code to change", () => {
    const dimension = { code: "COST_CENTRE", hasPostings: false };

    assert.deepEqual(ChangeCodeAvailability(dimension), []);
    assert.deepEqual(ChangeCode(dimension, "DEPARTMENT"), []);
  });

  it("prevents a dimension code with postings from changing", () => {
    const dimension = { code: "COST_CENTRE", hasPostings: true };

    assert.equal(ChangeCodeAvailability(dimension)[0]?.code, "HAS_POSTINGS_CODE_LOCKED");
    assert.equal(ChangeCode(dimension, "DEPARTMENT")[0]?.code, "HAS_POSTINGS_CODE_LOCKED");
    assert.deepEqual(ChangeCode(dimension, "COST_CENTRE"), []);
  });

  it("allows a used dimension to be deactivated but not deleted", () => {
    const dimension = { code: "COST_CENTRE", hasPostings: true };

    assert.deepEqual(Deactivate(dimension), []);
    assert.equal(Delete(dimension)[0]?.code, "HAS_POSTINGS_CANNOT_BE_DELETED");
  });

  it("allows an unused dimension to be deleted", () => {
    assert.deepEqual(Delete({ code: "PROJECT", hasPostings: false }), []);
  });
});

describe("dimension value operation policy", () => {
  const usedValue = { name: "Sales", hasPostings: true };

  it("prevents a used value from being renamed", () => {
    assert.equal(ChangeValueName(usedValue, "Revenue")[0]?.code, "HAS_POSTINGS_NAME_LOCKED");
    assert.deepEqual(ChangeValueName(usedValue, "Sales"), []);
  });

  it("allows a used value to be deactivated but not deleted", () => {
    assert.deepEqual(DeactivateValue(usedValue), []);
    assert.equal(DeleteValue(usedValue)[0]?.code, "HAS_POSTINGS_CANNOT_BE_DELETED");
  });

  it("allows an unused value to be renamed or deleted", () => {
    const unusedValue = { name: "Old", hasPostings: false };

    assert.deepEqual(ChangeValueName(unusedValue, "New"), []);
    assert.deepEqual(DeleteValue(unusedValue), []);
  });
});
