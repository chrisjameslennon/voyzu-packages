import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, test } from "node:test";

import { getPool } from "@voyzu/capability/db";
import { operation } from "@voyzu/capability/operations";

after(async () => {
  await getPool().end();
});

const createOrganization = "@voyzu/erp-core.createOrganization";
const patchOrganization = "@voyzu/erp-core.patchOrganization";
const deleteOrganization = "@voyzu/erp-core.deleteOrganization";
const missingOperation = "@voyzu/erp-core.missingOperation";

test("a decoupled package can inspect operation availability", async () => {
  assert.equal(operation.has(patchOrganization), true);
  assert.equal(operation.has(missingOperation), false);
  assert.equal(await operation.callOptional(missingOperation), undefined);
  await assert.rejects(
    operation.call(missingOperation),
    /Operation @voyzu\/erp-core\.missingOperation is not available/,
  );
});

test("a decoupled package can call ERP Core organization operations", async () => {
  const code = `POC${randomUUID().replaceAll("-", "").slice(0, 8)}`.toUpperCase();
  const originalName = "Operations POC organization";
  const created = await operation.call(
    createOrganization,
    {
      code,
      name: originalName,
      countryCode: "NZ",
      baseCurrencyCode: "NZD",
    },
  );
  assert.ok(created && typeof created === "object");

  const changedName = `Operations POC ${Date.now()}`;
  try {
    const optionalResult = await operation.callOptional(
      patchOrganization,
      code,
      { name: changedName },
    );

    assert.ok(optionalResult && typeof optionalResult === "object");
    assert.equal(Reflect.get(optionalResult, "name"), changedName);

    const requiredResult = await operation.call(
      patchOrganization,
      code,
      { name: originalName },
    );

    assert.ok(requiredResult && typeof requiredResult === "object");
    assert.equal(Reflect.get(requiredResult, "name"), originalName);

    await assert.rejects(
      operation.call(
        patchOrganization,
        code,
        { name: 42 },
      ),
      /Invalid operation arguments/,
    );
  } finally {
    await operation.call(deleteOrganization, code);
  }
});
