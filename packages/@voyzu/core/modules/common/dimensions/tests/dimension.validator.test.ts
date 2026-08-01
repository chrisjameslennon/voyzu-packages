import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  validatePatch,
  validateDimensionValueCreate,
  validateDimensionValuePatch,
} from "../server/lib/dimension.validator";

describe("dimension validation", () => {
  it("accepts a valid code patch", () => {
    assert.deepEqual(validatePatch({ code: "SALES_CHANNEL" }), []);
  });

  it("rejects empty, long, or invalid code patches", () => {
    assert.match(validatePatch({ code: "" })[0] ?? "", /cannot be empty/);
    assert.match(validatePatch({ code: "123456789012345" })[0] ?? "", /1 to 14/);
    assert.match(validatePatch({ code: "Sales Channel" })[0] ?? "", /capital letters/);
  });
});

describe("dimension value validation", () => {
  it("accepts names up to 14 permitted characters", () => {
    assert.deepEqual(validateDimensionValueCreate({ name: "North 1_A-B" }), []);
    assert.deepEqual(validateDimensionValueCreate({ name: "12345678901234" }), []);
  });

  it("rejects names over 14 characters or containing other punctuation", () => {
    assert.match(validateDimensionValueCreate({ name: "123456789012345" })[0] ?? "", /1 to 14/);
    assert.match(validateDimensionValuePatch({ name: "North/Online" })[0] ?? "", /letters, numbers/);
  });
});
