import assert from "node:assert/strict";
import { describe, it, before, after } from "node:test";

import type { GlAccountCategoryCreateRequestDto } from "@voyzu-modules/core/types/modules/gl-account-categories/gl-account-category.create.request.dto";
import type { GlAccountCategoryPatchRequestDto } from "@voyzu-modules/core/types/modules/gl-account-categories/gl-account-category.patch.request.dto";
import type { GlAccountCategoryResponseDto } from "@voyzu-modules/core/types/modules/gl-account-categories/gl-account-category.response.dto";
import type { GlAccountCategoryUpdateRequestDto } from "@voyzu-modules/core/types/modules/gl-account-categories/gl-account-category.update.request.dto";

import { getPool } from "@voyzu/capability/db";
import { createGlAccount, deleteGlAccount } from "../../gl-accounts/server/lib/gl-account.service";
import {
  createGlAccountCategory,
  getGlAccountCategory,
  updateGlAccountCategory,
  patchGlAccountCategory,
  deleteGlAccountCategory,
  deactivateGlAccountCategories,
  listGlAccountCategories,
  filterGlAccountCategories,
  searchGlAccountCategories,
  batchCreateGlAccountCategories,
  batchGetGlAccountCategories,
  batchUpdateGlAccountCategories,
  batchPatchGlAccountCategories,
  batchDeleteGlAccountCategories,
  batchDeleteGlAccountCategories,
} from "../server/lib/gl-account-category.service";

const createdCodes: string[] = [];
const createdGlAccountCodes: string[] = [];
const testCodes = ["SVC-GAC-A", "SVC-GAC-B", "SVC-GAC-C", "SVC-GAC-D", "SVC-GAC-LINKED"];
const testGlAccountCodes = ["SVC-GACL-GL"];

before(async () => {
  for (const code of testGlAccountCodes) {
    try {
      await deleteGlAccount(code);
    } catch {
      // best-effort cleanup
    }
  }
  await batchDeleteGlAccountCategories(testCodes);
});

after(async () => {
  for (const code of createdGlAccountCodes) {
    try {
      await deleteGlAccount(code);
    } catch {
      // best-effort cleanup
    }
  }
  if (createdCodes.length) {
    try {
      await batchDeleteGlAccountCategories([...createdCodes]);
    } catch {
      // best-effort cleanup
    }
  }
  await getPool().end();
});

describe("gl-account-category.service", () => {
  it("creates a gl account category", async () => {
    const input: GlAccountCategoryCreateRequestDto = {
      code: "SVC-GAC-A",
      name: "Service Test GAC A",
      accountType: "ASSET",
      sequence: 999,
    };
    const category: GlAccountCategoryResponseDto = await createGlAccountCategory(input);
    createdCodes.push(category.code);

    assert.equal(category.code, "SVC-GAC-A");
    assert.equal(category.name, "Service Test GAC A");
    assert.equal(category.accountType, "ASSET");
    assert.equal(category.sequence, 999);
    assert.equal(category.status, "ACTIVE");
    assert.ok(category.id > 0);
    assert.ok(category.audit.created.date);
    assert.ok(category.audit.updated.date);
  });

  it("creates a second gl account category", async () => {
    const input: GlAccountCategoryCreateRequestDto = {
      code: "SVC-GAC-B",
      name: "Service Test GAC B",
      accountType: "LIABILITY",
      sequence: 998,
    };
    const category: GlAccountCategoryResponseDto = await createGlAccountCategory(input);
    createdCodes.push(category.code);

    assert.equal(category.code, "SVC-GAC-B");
    assert.equal(category.accountType, "LIABILITY");
  });

  it("gets a gl account category by code", async () => {
    const category = await getGlAccountCategory("SVC-GAC-A");
    assert.ok(category);
    assert.equal(category.code, "SVC-GAC-A");
    assert.equal(category.name, "Service Test GAC A");
  });

  it("returns null for non-existent code", async () => {
    const category = await getGlAccountCategory("DOES-NOT-EXIST");
    assert.equal(category, null);
  });

  it("updates a gl account category by code (full replace)", async () => {
    const input: GlAccountCategoryUpdateRequestDto = {
      code: "SVC-GAC-A",
      name: "Service Test GAC A Updated",
      accountType: "ASSET",
      sequence: 997,
      status: "INACTIVE",
    };
    const category = await updateGlAccountCategory("SVC-GAC-A", input);

    assert.equal(category.name, "Service Test GAC A Updated");
    assert.equal(category.sequence, 997);
    assert.equal(category.status, "INACTIVE");
  });

  it("patches a gl account category (partial update)", async () => {
    const input: GlAccountCategoryPatchRequestDto = { name: "Service Test GAC A Patched", status: "ACTIVE" };
    const category: GlAccountCategoryResponseDto = await patchGlAccountCategory("SVC-GAC-A", input);

    assert.equal(category.name, "Service Test GAC A Patched");
    assert.equal(category.status, "ACTIVE");
    assert.equal(category.accountType, "ASSET");
  });

  it("lists all gl account categories (includes test categories)", async () => {
    const categories: GlAccountCategoryResponseDto[] = await listGlAccountCategories();
    const testCodes = categories.map((c) => c.code).filter((c) => c.startsWith("SVC-GAC-"));
    assert.ok(testCodes.includes("SVC-GAC-A"));
    assert.ok(testCodes.includes("SVC-GAC-B"));
  });

  it("filters gl account categories by status", async () => {
    const categories = await filterGlAccountCategories([{ field: "status", operator: "=", value: "ACTIVE" }]);
    const testCats = categories.filter((c) => c.code.startsWith("SVC-GAC-"));
    assert.ok(testCats.length >= 1);
    assert.ok(testCats.every((c) => c.status === "ACTIVE"));
  });

  it("searches gl account categories by phrase", async () => {
    const categories = await searchGlAccountCategories("Patched");
    const found = categories.find((c) => c.code === "SVC-GAC-A");
    assert.ok(found);
  });
  it("batch creates gl account categories", async () => {
    const inputs: GlAccountCategoryCreateRequestDto[] = [
      { code: "SVC-GAC-C", name: "Service Test GAC C", accountType: "EQUITY", sequence: 996 },
      { code: "SVC-GAC-D", name: "Service Test GAC D", accountType: "REVENUE", sequence: 995 },
    ];
    const categories = await batchCreateGlAccountCategories(inputs);
    for (const c of categories) createdCodes.push(c.code);

    assert.equal(categories.length, 2);
    assert.equal(categories[0].code, "SVC-GAC-C");
    assert.equal(categories[1].code, "SVC-GAC-D");
  });

  it("batch gets gl account categories by codes", async () => {
    const categories = await batchGetGlAccountCategories(["SVC-GAC-A", "SVC-GAC-B"]);
    assert.equal(categories.length, 2);
    const codes = categories.map((c) => c.code);
    assert.ok(codes.includes("SVC-GAC-A"));
    assert.ok(codes.includes("SVC-GAC-B"));
  });

  it("batch updates gl account categories (full replace)", async () => {
    const inputs: GlAccountCategoryUpdateRequestDto[] = [
      { code: "SVC-GAC-C", name: "Service Test GAC C Updated", accountType: "EQUITY", sequence: 994, status: "INACTIVE" },
      { code: "SVC-GAC-D", name: "Service Test GAC D Updated", accountType: "REVENUE", sequence: 993, status: "INACTIVE" },
    ];
    const categories = await batchUpdateGlAccountCategories(inputs);

    assert.equal(categories.length, 2);
    assert.equal(categories[0].name, "Service Test GAC C Updated");
    assert.equal(categories[0].status, "INACTIVE");
    assert.equal(categories[1].name, "Service Test GAC D Updated");
    assert.equal(categories[1].status, "INACTIVE");
  });

  it("batch patches gl account categories (partial update)", async () => {
    const inputs: Array<GlAccountCategoryPatchRequestDto & { code: string }> = [
      { code: "SVC-GAC-C", name: "Service Test GAC C Patched", status: "ACTIVE" },
      { code: "SVC-GAC-D", name: "Service Test GAC D Patched", status: "ACTIVE" },
    ];
    const categories = await batchPatchGlAccountCategories(inputs);

    assert.equal(categories.length, 2);
    assert.equal(categories[0].name, "Service Test GAC C Patched");
    assert.equal(categories[0].status, "ACTIVE");
    assert.equal(categories[1].name, "Service Test GAC D Patched");
    assert.equal(categories[1].status, "ACTIVE");
  });

  it("allows only name changes when a category is in use", async () => {
    const category = await createGlAccountCategory({
      code: "SVC-GAC-LINKED",
      name: "Service Test Linked Category",
      accountType: "ASSET",
      sequence: 992,
    });
    createdCodes.push(category.code);

    const glAccount = await createGlAccount({
      code: "SVC-GACL-GL",
      name: "Service Test Linked GL",
      accountType: "ASSET",
      accountCategoryId: category.id,
    });
    createdGlAccountCodes.push(glAccount.code);

    const renamed = await patchGlAccountCategory("SVC-GAC-LINKED", { name: "Service Test Linked Category Renamed" });
    assert.equal(renamed.name, "Service Test Linked Category Renamed");
    assert.equal(renamed.hasPostings, true);

    await assert.rejects(
      () => patchGlAccountCategory("SVC-GAC-LINKED", { status: "INACTIVE" }),
      (err: Error) => {
        assert.ok(err.message.includes("is in use and only its name can be changed"));
        return true;
      },
    );

    await assert.rejects(
      () => updateGlAccountCategory("SVC-GAC-LINKED", {
        code: "SVC-GAC-LINKED",
        name: "Service Test Linked Category Renamed Again",
        accountType: "ASSET",
        sequence: 991,
        status: "ACTIVE",
      }),
      (err: Error) => {
        assert.ok(err.message.includes("is in use and only its name can be changed"));
        return true;
      },
    );

    await assert.rejects(
      () => deactivateGlAccountCategories(["SVC-GAC-LINKED"]),
      (err: Error) => {
        assert.ok(err.message.includes("is in use and cannot be deactivated"));
        return true;
      },
    );

    await assert.rejects(
      () => deleteGlAccountCategory("SVC-GAC-LINKED"),
      (err: Error) => {
        assert.ok(err.message.includes("is in use and cannot be deleted"));
        return true;
      },
    );

    await deleteGlAccount("SVC-GACL-GL");
    createdGlAccountCodes.splice(createdGlAccountCodes.indexOf("SVC-GACL-GL"), 1);
    await deleteGlAccountCategory("SVC-GAC-LINKED");
    createdCodes.splice(createdCodes.indexOf("SVC-GAC-LINKED"), 1);
  });

  it("deletes a single gl account category by code", async () => {
    const code = createdCodes.shift()!;
    await deleteGlAccountCategory(code);

    const category = await getGlAccountCategory(code);
    assert.equal(category, null);
  });

  it("batch deletes remaining gl account categories", async () => {
    await batchDeleteGlAccountCategories([...createdCodes]);

    for (const code of createdCodes) {
      const category = await getGlAccountCategory(code);
      assert.equal(category, null);
    }

    createdCodes.length = 0;
  });

  it("validates required fields on create", async () => {
    await assert.rejects(
      () => createGlAccountCategory({ code: "", name: "", accountType: "ASSET", sequence: 1 }),
      (err: Error) => {
        assert.ok(err.message.includes("Code is required"));
        assert.ok(err.message.includes("Name is required"));
        return true;
      },
    );
  });

  it("validates invalid status on patch", async () => {
    await assert.rejects(
      () => patchGlAccountCategory("SVC-GAC-A", { status: "INVALID" as never }),
      (err: Error) => {
        assert.ok(err.message.includes("Status must be"));
        return true;
      },
    );
  });
});

