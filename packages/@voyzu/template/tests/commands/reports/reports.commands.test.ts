import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, before, test } from "node:test";

import { getDb, getPool } from "@voyzu/capability/db";
import { createTemplate } from "../../../modules/template/commands";
import { getAllTemplatesReport } from "../../../modules/reports/commands";

const code = `OPTEST${randomUUID().replaceAll("-", "").slice(0, 8)}`.toUpperCase();

before(async () => {
  await createTemplate({ code, description: "Report command test" });
});

after(async () => {
  await getDb().query("DELETE FROM template WHERE code = $1", [code]);
  await getPool().end();
});

test("getAllTemplatesReport exposes report rows through the public command", async () => {
  const row = (await getAllTemplatesReport()).find((candidate) => candidate.code === code);
  assert.ok(row);
  assert.equal(row.description, "Report command test");
});
