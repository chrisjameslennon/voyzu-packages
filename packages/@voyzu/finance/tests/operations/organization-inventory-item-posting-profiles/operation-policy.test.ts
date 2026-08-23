import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { AssignGLAccount, ConfigurePostingAccounts, Deactivate, Delete, PostingAccountEnabled, PostingAccountRequired } from "../../../modules/common/inventory-item-posting-profiles/domain/operation-policy";

describe("item posting profile operation policy", () => {
  it("validates the required active GL account type", () => {
    assert.deepEqual(
      AssignGLAccount({ code: "100000", status: "INACTIVE", accountType: "ASSET" }, "EXPENSE").map(({ code }) => code),
      ["GL_ACCOUNT_NOT_ACTIVE", "GL_ACCOUNT_TYPE_INVALID"],
    );
  });

  it("blocks lifecycle operations while inventory items reference the profile", () => {
    const state = { code: "GOODS", linkedBy: [{ type: "Inventory Items", code: "ITEM-1" }] };
    assert.equal(Deactivate(state)[0]?.code, "LINKED_RECORD_CANNOT_BE_DEACTIVATED");
    assert.equal(Delete(state)[0]?.code, "LINKED_RECORD_CANNOT_BE_DELETED");
  });

  it("enables GL account fields from the permitted operations", () => {
    const permissions = { is_sold: true, is_purchased: false, is_consumed: true };
    assert.equal(PostingAccountEnabled("revenue_code", permissions), true);
    assert.equal(PostingAccountEnabled("cogs_code", permissions), true);
    assert.equal(PostingAccountEnabled("purchase_expense_code", permissions), false);
    assert.equal(PostingAccountEnabled("consumption_code", permissions), true);
    assert.equal(PostingAccountEnabled("adjustment_gain_code", permissions), true);
  });

  it("rejects account configuration for an operation that is not permitted", () => {
    const blockers = ConfigurePostingAccounts(
      { is_sold: false, is_purchased: true, is_consumed: false },
      { revenue_code: "400000", purchase_expense_code: "600000", consumption_code: "610000" },
    );
    assert.deepEqual(blockers.map(({ code }) => code), ["POSTING_ACCOUNT_NOT_PERMITTED", "POSTING_ACCOUNT_NOT_PERMITTED"]);
  });

  it("requires the GL accounts used by each permitted operation", () => {
    const permissions = { is_sold: true, is_purchased: true, is_consumed: true };
    assert.equal(PostingAccountRequired("revenue_code", permissions), true);
    assert.equal(PostingAccountRequired("cogs_code", permissions), true);
    assert.equal(PostingAccountRequired("purchase_expense_code", permissions), true);
    assert.equal(PostingAccountRequired("consumption_code", permissions), true);
    assert.equal(PostingAccountRequired("adjustment_gain_code", permissions), false);

    const blockers = ConfigurePostingAccounts(permissions, {
      revenue_code: null,
      cogs_code: "",
      purchase_expense_code: "   ",
      consumption_code: null,
    });
    assert.deepEqual(blockers.map(({ code }) => code), [
      "POSTING_ACCOUNT_REQUIRED",
      "POSTING_ACCOUNT_REQUIRED",
      "POSTING_ACCOUNT_REQUIRED",
      "POSTING_ACCOUNT_REQUIRED",
    ]);
  });
});
