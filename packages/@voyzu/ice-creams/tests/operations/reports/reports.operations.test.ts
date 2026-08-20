import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";

import { getDb, getPool } from "@voyzu/capability/db";
import { createIceCream, listIceCreamFlavors } from "../../../modules/ice-creams/operations";
import { getAllIceCreamsReport } from "../../../modules/reports/operations";

const code = `OPTEST${randomUUID().replaceAll("-", "").slice(0, 8)}`.toUpperCase();

before(async () => {
  const flavor = (await listIceCreamFlavors()).find(({ status }) => status === "ACTIVE");
  assert.ok(flavor, "An active ice-cream flavour is required for report operation tests");
  await createIceCream({
    code,
    name: "Report operation test",
    flavorCode: flavor.code,
    supplier: "Report Test Creamery",
  });
});

after(async () => {
  await getDb().query("DELETE FROM ice_cream WHERE code = $1", [code]);
  await getPool().end();
});

test("getAllIceCreamsReport exposes report rows through the public operation", async () => {
  const row = (await getAllIceCreamsReport()).find((candidate) => candidate.code === code);
  assert.ok(row);
  assert.equal(row.name, "Report operation test");
  assert.equal(row.supplier, "Report Test Creamery");
});
