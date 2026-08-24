import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";

import { getDb, getPool } from "@voyzu/capability/db";
import type { IceCreamCreateRequestDto } from "@voyzu/ice-creams/types";
import {
  activateIceCream,
  activateIceCreams,
  batchCreateIceCreams,
  batchDeleteIceCreams,
  batchGetIceCreams,
  batchPatchIceCreams,
  batchUpdateIceCreams,
  createIceCream,
  deactivateIceCream,
  deactivateIceCreams,
  deleteIceCream,
  filterIceCreams,
  getIceCream,
  listIceCreamFlavors,
  listIceCreams,
  patchIceCream,
  searchIceCreams,
  updateIceCream,
} from "../../../modules/ice-creams/operations";

const TEST_PREFIX = "OPTEST";
let flavorCode: string;

function uniqueCode(): string {
  return `${TEST_PREFIX}${randomUUID().replaceAll("-", "").slice(0, 8)}`.toUpperCase();
}

function input(overrides: Partial<IceCreamCreateRequestDto> = {}): IceCreamCreateRequestDto {
  const code = uniqueCode();
  return {
    code,
    name: `Operation test ${code}`,
    flavorCode,
    supplier: "Operation Test Creamery",
    ...overrides,
  };
}

async function cleanup(): Promise<void> {
  await getDb().query("DELETE FROM ice_cream WHERE code LIKE $1", [`${TEST_PREFIX}%`]);
}

before(async () => {
  await cleanup();
  const flavors = await listIceCreamFlavors();
  const flavor = flavors.find(({ status }) => status === "ACTIVE");
  assert.ok(flavor, "An active ice-cream flavour is required for operation tests");
  flavorCode = flavor.code;
});

after(async () => {
  await cleanup();
  await getPool().end();
});

test("listIceCreamFlavors exposes the installed flavor reference data", async () => {
  assert.ok((await listIceCreamFlavors()).some(({ code }) => code === flavorCode));
});

test("createIceCream, getIceCream, listIceCreams, filterIceCreams, and searchIceCreams expose reads", async () => {
  const request = input();
  const created = await createIceCream(request);
  assert.equal(created.code, request.code);
  assert.equal((await getIceCream(request.code.toLowerCase()))?.id, created.id);
  assert.ok((await listIceCreams()).some(({ code }) => code === request.code));
  assert.deepEqual(
    (await filterIceCreams([{ field: "code", operator: "=", value: request.code }])).map(({ code }) => code),
    [request.code],
  );
  assert.ok((await searchIceCreams(request.code.toLowerCase())).some(({ code }) => code === request.code));
});

test("updateIceCream and patchIceCream expose replacement and partial update", async () => {
  const created = await createIceCream(input());
  const updated = await updateIceCream(created.code, {
    name: "Fully updated ice cream",
    flavorCode,
    supplier: "Updated Creamery",
  });
  assert.equal(updated.name, "Fully updated ice cream");
  const patched = await patchIceCream(created.code, { supplier: "Patched Creamery" });
  assert.equal(patched.supplier, "Patched Creamery");
  assert.equal(patched.name, "Fully updated ice cream");
});

test("activateIceCream, deactivateIceCream, and deleteIceCream expose single-record commands", async () => {
  const created = await createIceCream(input());
  assert.equal((await deactivateIceCream(created.code)).status, "INACTIVE");
  assert.equal((await activateIceCream(created.code)).status, "ACTIVE");
  await deleteIceCream(created.code);
  assert.equal(await getIceCream(created.code), null);
});

test("operations reject duplicate codes, unknown flavors, and redundant transitions", async () => {
  const request = input();
  const created = await createIceCream(request);
  await assert.rejects(createIceCream({ ...request, name: "Duplicate" }), /already exists/i);
  await assert.rejects(createIceCream(input({ flavorCode: "NOT_A_FLAVOR" })), /flavour.*not found/i);
  await assert.rejects(activateIceCream(created.code), /already active/i);
  await deactivateIceCream(created.code);
  await assert.rejects(deactivateIceCream(created.code), /already inactive/i);
});

test("batchCreateIceCreams, batchGetIceCreams, batchUpdateIceCreams, and batchPatchIceCreams expose batch writes", async () => {
  const requests = [input(), input()];
  const created = await batchCreateIceCreams(requests);
  const codes = created.map(({ code }) => code);
  assert.equal((await batchGetIceCreams(codes)).length, 2);

  const updated = await batchUpdateIceCreams(created.map(({ code }, index) => ({
    code,
    name: `Batch updated ${index}`,
    flavorCode,
    supplier: "Batch Creamery",
  })));
  assert.deepEqual(updated.map(({ name }) => name), ["Batch updated 0", "Batch updated 1"]);

  const patched = await batchPatchIceCreams(created.map(({ code }, index) => ({
    code,
    supplier: `Batch patched ${index}`,
  })));
  assert.deepEqual(patched.map(({ supplier }) => supplier), ["Batch patched 0", "Batch patched 1"]);
});

test("activateIceCreams, deactivateIceCreams, and batchDeleteIceCreams expose batch commands", async () => {
  const created = await batchCreateIceCreams([input(), input()]);
  const codes = created.map(({ code }) => code);
  assert.ok((await deactivateIceCreams(codes)).every(({ status }) => status === "INACTIVE"));
  assert.ok((await activateIceCreams(codes)).every(({ status }) => status === "ACTIVE"));
  await batchDeleteIceCreams(codes);
  assert.equal((await batchGetIceCreams(codes)).length, 0);
});

test("batchCreateIceCreams rolls back when a later record has an unknown flavor", async () => {
  const valid = input();
  await assert.rejects(
    batchCreateIceCreams([valid, input({ flavorCode: "NOT_A_FLAVOR" })]),
    /flavour.*not found/i,
  );
  assert.equal(await getIceCream(valid.code), null);
});
