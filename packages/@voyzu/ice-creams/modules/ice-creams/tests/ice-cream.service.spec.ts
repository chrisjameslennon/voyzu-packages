import {
  activateIceCream,
  batchCreateIceCreams,
  createIceCream,
  deactivateIceCream,
  deleteIceCream,
  getIceCream,
  listIceCreams,
  patchIceCream,
  searchIceCreams,
  updateIceCream,
} from "../server";
import { test, expect } from "./ice-creams.fixtures";

test("creates, reads, lists and searches an ice cream", async ({ iceCreams }) => {
  const input = iceCreams.input();
  const created = await createIceCream(input);
  iceCreams.track(created.code);
  expect(created).toMatchObject({
    code: input.code,
    name: input.name,
    supplier: input.supplier,
    status: "ACTIVE",
    flavor: { code: "VANILLA" },
  });
  expect(await getIceCream(input.code)).toMatchObject({ code: input.code });
  expect((await listIceCreams()).some(({ code }) => code === input.code)).toBe(true);
  expect((await searchIceCreams(input.code)).map(({ code }) => code)).toContain(input.code);
});

test("updates and patches writable fields", async ({ iceCreams }) => {
  const created = await iceCreams.create();
  const updated = await updateIceCream(created.code, {
    name: "Updated Matcha",
    flavorCode: "MATCHA",
    supplier: "Green Whisk Trading",
  });
  expect(updated).toMatchObject({ name: "Updated Matcha", flavor: { code: "MATCHA" } });
  const patched = await patchIceCream(created.code, { supplier: "New Supplier" });
  expect(patched.supplier).toBe("New Supplier");
  expect(patched.flavor.code).toBe("MATCHA");
});

test("deactivates and reactivates", async ({ iceCreams }) => {
  const created = await iceCreams.create();
  expect((await deactivateIceCream(created.code)).status).toBe("INACTIVE");
  expect((await activateIceCream(created.code)).status).toBe("ACTIVE");
});

test("deletes with an auditable deletion stamp", async ({ iceCreams }) => {
  const created = await iceCreams.create();
  await deleteIceCream(created.code);
  expect(await getIceCream(created.code)).toBeNull();
});

test("rejects duplicate codes and unknown flavours", async ({ iceCreams }) => {
  const created = await iceCreams.create();
  await expect(createIceCream({
    code: created.code,
    name: "Duplicate",
    flavorCode: "VANILLA",
    supplier: "Duplicate Supplier",
  })).rejects.toThrow(/already exists/i);
  await expect(createIceCream(iceCreams.input({
    flavorCode: "NOT_A_FLAVOR",
  }))).rejects.toThrow(/flavour.*not found/i);
});

test("rolls back an invalid batch", async ({ iceCreams }) => {
  const first = iceCreams.input();
  const second = iceCreams.input({ flavorCode: "NOT_A_FLAVOR" });
  iceCreams.track(first.code);
  iceCreams.track(second.code);
  await expect(batchCreateIceCreams([first, second])).rejects.toThrow();
  expect(await getIceCream(first.code)).toBeNull();
});
