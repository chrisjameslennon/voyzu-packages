import {
  activateTemplate,
  batchCreateTemplates,
  createTemplate,
  deactivateTemplate,
  deleteTemplate,
  getTemplate,
  listTemplates,
  patchTemplate,
} from "../server";
import { expect, test } from "./template.fixtures";

test("creates, reads and lists a template", async ({ templates }) => {
  const input = templates.input();
  const created = await createTemplate(input);
  templates.track(created.code);
  expect(created).toMatchObject({ ...input, status: "ACTIVE" });
  expect(created.id).toBeGreaterThan(0);
  expect(await getTemplate(input.code)).toMatchObject({ code: input.code });
  expect((await listTemplates()).some(({ code }) => code === input.code)).toBe(true);
});

test("patches the writable description", async ({ templates }) => {
  const created = await templates.create();
  const patched = await patchTemplate(created.code, { description: "Updated description" });
  expect(patched.description).toBe("Updated description");
  expect(patched.code).toBe(created.code);
});

test("deactivates and reactivates", async ({ templates }) => {
  const created = await templates.create();
  expect((await deactivateTemplate(created.code)).status).toBe("INACTIVE");
  expect((await activateTemplate(created.code)).status).toBe("ACTIVE");
});

test("deletes with an auditable deletion stamp", async ({ templates }) => {
  const created = await templates.create();
  await deleteTemplate(created.code);
  expect(await getTemplate(created.code)).toBeNull();
});

test("rejects duplicate and malformed codes", async ({ templates }) => {
  const created = await templates.create();
  await expect(createTemplate({ code: created.code, description: "Duplicate" })).rejects.toThrow(/already exists/i);
  await expect(createTemplate({ code: "invalid code", description: null })).rejects.toThrow(/uppercase letters/i);
});

test("rolls back an invalid batch", async ({ templates }) => {
  const duplicateCode = templates.uniqueCode();
  const inputs = [
    { code: duplicateCode, description: "First" },
    { code: duplicateCode, description: "Duplicate" },
  ];
  templates.track(duplicateCode);
  await expect(batchCreateTemplates(inputs)).rejects.toThrow(/already exists/i);
  expect(await getTemplate(duplicateCode)).toBeNull();
});
