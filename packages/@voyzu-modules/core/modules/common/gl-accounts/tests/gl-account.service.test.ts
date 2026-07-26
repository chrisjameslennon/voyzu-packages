import assert from "node:assert/strict";
import { describe, it, before, after } from "node:test";

import type { GlAccountCreateRequestDto } from "@voyzu-modules/core/types/modules/gl-accounts/gl-account.create.request.dto";
import type { GlAccountPatchRequestDto } from "@voyzu-modules/core/types/modules/gl-accounts/gl-account.patch.request.dto";
import type { GlAccountResponseDto } from "@voyzu-modules/core/types/modules/gl-accounts/gl-account.response.dto";
import type { GlAccountUpdateRequestDto } from "@voyzu-modules/core/types/modules/gl-accounts/gl-account.update.request.dto";
import type { AccountType } from "@voyzu/types/modules/core";

import { getPool } from "@voyzu/capability/db";
import {
  createGlAccount,
  getGlAccount,
  updateGlAccount,
  patchGlAccount,
  deleteGlAccount,
  listGlAccounts,
  filterGlAccounts,
  searchGlAccounts,
  batchCreateGlAccounts,
  batchGetGlAccounts,
  batchUpdateGlAccounts,
  batchPatchGlAccounts,
  batchDeleteGlAccounts,
  batchDeleteGlAccounts,
} from "../server";
import { listGlAccountCategories } from "../../gl-account-categories/server";

const createdCodes: string[] = [];
const testCodes = ["SVC-GA-A", "SVC-GA-B", "SVC-GA-C", "SVC-GA-D"];
const categoryIds = new Map<AccountType, number>();

before(async () => {
  await batchDeleteGlAccounts(testCodes);
  const categories = await listGlAccountCategories();
  for (const accountType of ["ASSET", "LIABILITY", "EQUITY", "REVENUE"] as const) {
    const category = categories.find((candidate) => candidate.accountType === accountType && candidate.status === "ACTIVE");
    assert.ok(category, `An active ${accountType} reporting category is required for this test`);
    categoryIds.set(accountType, category.id);
  }
});

after(async () => {
  if (createdCodes.length) {
    try {
      await batchDeleteGlAccounts([...createdCodes]);
    } catch {
      // best-effort cleanup
    }
  }
  await getPool().end();
});

describe("gl-account.service", () => {
  it("creates a gl account with a reporting category", async () => {
    const input: GlAccountCreateRequestDto = {
      code: "SVC-GA-A",
      name: "Service Test GA A",
      accountType: "ASSET",
      accountCategoryId: categoryIds.get("ASSET")!,
    };
    const account: GlAccountResponseDto = await createGlAccount(input);
    createdCodes.push(account.code);

    assert.equal(account.code, "SVC-GA-A");
    assert.equal(account.name, "Service Test GA A");
    assert.equal(account.accountType, "ASSET");
    assert.equal(account.accountCategoryId, categoryIds.get("ASSET"));
    assert.equal(account.status, "ACTIVE");
    assert.ok(account.id > 0);
    assert.ok(account.audit.created.date);
    assert.ok(account.audit.updated.date);
  });

  it("creates a second gl account", async () => {
    const input: GlAccountCreateRequestDto = {
      code: "SVC-GA-B",
      name: "Service Test GA B",
      accountType: "LIABILITY",
      accountCategoryId: categoryIds.get("LIABILITY")!,
    };
    const account: GlAccountResponseDto = await createGlAccount(input);
    createdCodes.push(account.code);

    assert.equal(account.code, "SVC-GA-B");
    assert.equal(account.accountType, "LIABILITY");
  });

  it("gets a gl account by code", async () => {
    const account = await getGlAccount("SVC-GA-A");
    assert.ok(account);
    assert.equal(account.code, "SVC-GA-A");
    assert.equal(account.name, "Service Test GA A");
  });

  it("returns null for non-existent code", async () => {
    const account = await getGlAccount("DOES-NOT-EXIST");
    assert.equal(account, null);
  });

  it("updates a gl account by code (full replace)", async () => {
    const input: GlAccountUpdateRequestDto = {
      code: "SVC-GA-A",
      name: "Service Test GA A Updated",
      accountType: "ASSET",
      status: "INACTIVE",
    };
    const account = await updateGlAccount("SVC-GA-A", input);

    assert.equal(account.name, "Service Test GA A Updated");
    assert.equal(account.status, "INACTIVE");
    assert.equal(account.accountCategoryId, undefined);
  });

  it("patches a gl account (partial update)", async () => {
    const input: GlAccountPatchRequestDto = { name: "Service Test GA A Patched", status: "ACTIVE" };
    const account: GlAccountResponseDto = await patchGlAccount("SVC-GA-A", input);

    assert.equal(account.name, "Service Test GA A Patched");
    assert.equal(account.status, "ACTIVE");
    assert.equal(account.accountType, "ASSET");
  });

  it("lists all gl accounts (includes test accounts)", async () => {
    const accounts: GlAccountResponseDto[] = await listGlAccounts();
    const testCodes = accounts.map((a) => a.code).filter((c) => c.startsWith("SVC-GA-"));
    assert.ok(testCodes.includes("SVC-GA-A"));
    assert.ok(testCodes.includes("SVC-GA-B"));
  });

  it("filters gl accounts by status", async () => {
    const accounts = await filterGlAccounts([{ field: "status", operator: "=", value: "ACTIVE" }]);
    const testAccounts = accounts.filter((a) => a.code.startsWith("SVC-GA-"));
    assert.ok(testAccounts.length >= 1);
    assert.ok(testAccounts.every((a) => a.status === "ACTIVE"));
  });

  it("searches gl accounts by phrase", async () => {
    const accounts = await searchGlAccounts("Patched");
    const found = accounts.find((a) => a.code === "SVC-GA-A");
    assert.ok(found);
  });
  it("batch creates gl accounts", async () => {
    const inputs: GlAccountCreateRequestDto[] = [
      { code: "SVC-GA-C", name: "Service Test GA C", accountType: "EQUITY", accountCategoryId: categoryIds.get("EQUITY")! },
      { code: "SVC-GA-D", name: "Service Test GA D", accountType: "REVENUE", accountCategoryId: categoryIds.get("REVENUE")! },
    ];
    const accounts = await batchCreateGlAccounts(inputs);
    for (const a of accounts) createdCodes.push(a.code);

    assert.equal(accounts.length, 2);
    assert.equal(accounts[0].code, "SVC-GA-C");
    assert.equal(accounts[1].code, "SVC-GA-D");
  });

  it("batch gets gl accounts by codes", async () => {
    const accounts = await batchGetGlAccounts(["SVC-GA-A", "SVC-GA-B"]);
    assert.equal(accounts.length, 2);
    const codes = accounts.map((a) => a.code);
    assert.ok(codes.includes("SVC-GA-A"));
    assert.ok(codes.includes("SVC-GA-B"));
  });

  it("batch updates gl accounts (full replace)", async () => {
    const inputs: GlAccountUpdateRequestDto[] = [
      { code: "SVC-GA-C", name: "Service Test GA C Updated", accountType: "EQUITY", status: "INACTIVE" },
      { code: "SVC-GA-D", name: "Service Test GA D Updated", accountType: "REVENUE", status: "INACTIVE" },
    ];
    const accounts = await batchUpdateGlAccounts(inputs);

    assert.equal(accounts.length, 2);
    assert.equal(accounts[0].name, "Service Test GA C Updated");
    assert.equal(accounts[0].status, "INACTIVE");
    assert.equal(accounts[1].name, "Service Test GA D Updated");
    assert.equal(accounts[1].status, "INACTIVE");
  });

  it("batch patches gl accounts (partial update)", async () => {
    const inputs: Array<GlAccountPatchRequestDto & { code: string }> = [
      { code: "SVC-GA-C", name: "Service Test GA C Patched", status: "ACTIVE" },
      { code: "SVC-GA-D", name: "Service Test GA D Patched", status: "ACTIVE" },
    ];
    const accounts = await batchPatchGlAccounts(inputs);

    assert.equal(accounts.length, 2);
    assert.equal(accounts[0].name, "Service Test GA C Patched");
    assert.equal(accounts[0].status, "ACTIVE");
    assert.equal(accounts[1].name, "Service Test GA D Patched");
    assert.equal(accounts[1].status, "ACTIVE");
  });

  it("deletes a single gl account by code", async () => {
    const code = createdCodes.shift()!;
    await deleteGlAccount(code);

    const account = await getGlAccount(code);
    assert.equal(account, null);
  });

  it("batch deletes remaining gl accounts", async () => {
    await batchDeleteGlAccounts([...createdCodes]);

    for (const code of createdCodes) {
      const account = await getGlAccount(code);
      assert.equal(account, null);
    }

    createdCodes.length = 0;
  });

  it("validates required fields on create", async () => {
    await assert.rejects(
      () => createGlAccount({ code: "", name: "", accountType: "ASSET" } as GlAccountCreateRequestDto),
      (err: Error) => {
        assert.ok(err.message.includes("Code is required"));
        assert.ok(err.message.includes("Name is required"));
        assert.ok(err.message.includes("Reporting category is required"));
        return true;
      },
    );
  });

  it("validates invalid status on patch", async () => {
    await assert.rejects(
      () => patchGlAccount("SVC-GA-A", { status: "DELETED" as never }),
      (err: Error) => {
        assert.ok(err.message.includes("Status must be"));
        return true;
      },
    );
  });
});

