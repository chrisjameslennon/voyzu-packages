import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, test } from "node:test";

import { getPool } from "@voyzu/capability/db";
import { command } from "@voyzu/capability/commands";

after(async () => {
  await getPool().end();
});

const createOrganization = "@voyzu/erp-core.createOrganization";
const patchOrganization = "@voyzu/erp-core.patchOrganization";
const deleteOrganization = "@voyzu/erp-core.deleteOrganization";
const missingCommand = "@voyzu/erp-core.missingCommand";

test("a decoupled package can inspect command availability", async () => {
  assert.equal(command.has(patchOrganization), true);
  assert.equal(command.has(missingCommand), false);
  assert.equal(await command.callOptional(missingCommand), undefined);
  await assert.rejects(
    command.call(missingCommand),
    /Command @voyzu\/erp-core\.missingCommand is not available/,
  );
});

test("a decoupled package can call ERP Core organization commands", async () => {
  const code = `POC${randomUUID().replaceAll("-", "").slice(0, 8)}`.toUpperCase();
  const originalName = "Commands POC organization";
  const created = await command.call(
    createOrganization,
    {
      code,
      name: originalName,
      countryCode: "NZ",
      baseCurrencyCode: "NZD",
    },
  );
  assert.ok(created && typeof created === "object");

  const changedName = `Commands POC ${Date.now()}`;
  try {
    const optionalResult = await command.callOptional(
      patchOrganization,
      code,
      { name: changedName },
    );

    assert.ok(optionalResult && typeof optionalResult === "object");
    assert.equal(Reflect.get(optionalResult, "name"), changedName);

    const requiredResult = await command.call(
      patchOrganization,
      code,
      { name: originalName },
    );

    assert.ok(requiredResult && typeof requiredResult === "object");
    assert.equal(Reflect.get(requiredResult, "name"), originalName);

    await assert.rejects(
      command.call(
        patchOrganization,
        code,
        { name: 42 },
      ),
      /Invalid command arguments/,
    );
  } finally {
    await command.call(deleteOrganization, code);
  }
});
