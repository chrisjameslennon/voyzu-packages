import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";

import { getDb, getPool } from "@voyzu/capability/db";
import type { TemplateCreateRequestDto } from "../../../modules/types";
import {
  activateTemplate,
  activateTemplates,
  batchCreateTemplates,
  batchDeleteTemplates,
  batchGetTemplates,
  batchPatchTemplates,
  batchUpdateTemplates,
  createTemplate,
  deactivateTemplate,
  deactivateTemplates,
  deleteTemplate,
  filterTemplates,
  getTemplate,
  listTemplates,
  patchTemplate,
  searchTemplates,
  updateTemplate,
} from "../../../modules/template/commands";

const TEST_PREFIX = "OPTEST";

function uniqueCode(): string {
  return `${TEST_PREFIX}${randomUUID().replaceAll("-", "").slice(0, 8)}`.toUpperCase();
}

function input(overrides: Partial<TemplateCreateRequestDto> = {}): TemplateCreateRequestDto {
  const code = uniqueCode();
  return { code, description: `Command test ${code}`, ...overrides };
}

async function cleanup(): Promise<void> {
  await getDb().query("DELETE FROM template WHERE code LIKE $1", [`${TEST_PREFIX}%`]);
}

before(cleanup);
after(async () => {
  await cleanup();
  await getPool().end();
});

test("createTemplate, getTemplate, listTemplates, filterTemplates, and searchTemplates expose reads", async () => {
  const request = input();
  const created = await createTemplate(request);
  assert.equal(created.code, request.code);
  assert.equal((await getTemplate(request.code.toLowerCase()))?.id, created.id);
  assert.ok((await listTemplates()).some(({ code }) => code === request.code));
  assert.deepEqual(
    (await filterTemplates([{ field: "code", operator: "=", value: request.code }])).map(({ code }) => code),
    [request.code],
  );
  assert.ok((await searchTemplates(request.code.toLowerCase())).some(({ code }) => code === request.code));
});

test("updateTemplate and patchTemplate expose replacement and partial update", async () => {
  const created = await createTemplate(input());
  assert.equal((await updateTemplate(created.code, { description: "Fully updated" })).description, "Fully updated");
  assert.equal((await patchTemplate(created.code, { description: "Patched" })).description, "Patched");
});

test("activateTemplate, deactivateTemplate, and deleteTemplate expose single-record commands", async () => {
  const created = await createTemplate(input());
  assert.equal((await deactivateTemplate(created.code)).status, "INACTIVE");
  assert.equal((await activateTemplate(created.code)).status, "ACTIVE");
  await deleteTemplate(created.code);
  assert.equal(await getTemplate(created.code), null);
});

test("commands reject duplicate codes and redundant transitions", async () => {
  const request = input();
  const created = await createTemplate(request);
  await assert.rejects(createTemplate({ ...request, description: "Duplicate" }), /already exists/i);
  await assert.rejects(activateTemplate(created.code), /already active/i);
  await deactivateTemplate(created.code);
  await assert.rejects(deactivateTemplate(created.code), /already inactive/i);
});

test("batchCreateTemplates, batchGetTemplates, batchUpdateTemplates, and batchPatchTemplates expose batch writes", async () => {
  const created = await batchCreateTemplates([input(), input()]);
  const codes = created.map(({ code }) => code);
  assert.equal((await batchGetTemplates(codes)).length, 2);
  const updated = await batchUpdateTemplates(codes.map((code, index) => ({ code, description: `Updated ${index}` })));
  assert.deepEqual(updated.map(({ description }) => description), ["Updated 0", "Updated 1"]);
  const patched = await batchPatchTemplates(codes.map((code, index) => ({ code, description: `Patched ${index}` })));
  assert.deepEqual(patched.map(({ description }) => description), ["Patched 0", "Patched 1"]);
});

test("activateTemplates, deactivateTemplates, and batchDeleteTemplates expose batch commands", async () => {
  const created = await batchCreateTemplates([input(), input()]);
  const codes = created.map(({ code }) => code);
  assert.ok((await deactivateTemplates(codes)).every(({ status }) => status === "INACTIVE"));
  assert.ok((await activateTemplates(codes)).every(({ status }) => status === "ACTIVE"));
  await batchDeleteTemplates(codes);
  assert.equal((await batchGetTemplates(codes)).length, 0);
});

test("batchCreateTemplates rolls back duplicate records", async () => {
  const request = input();
  await assert.rejects(batchCreateTemplates([request, request]), /already exists/i);
  assert.equal(await getTemplate(request.code), null);
});
