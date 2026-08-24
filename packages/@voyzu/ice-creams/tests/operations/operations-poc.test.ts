import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { after, test } from "node:test";

import { getPool } from "@voyzu/capability/db";
import { operation } from "@voyzu/capability/operations";

await import("../../../../../.run/voyzu/apps/web/.generated/operations/register");

after(async () => {
  await getPool().end();
});

test("a decoupled package can optionally patch an ERP Core organization", async () => {
  const code = `POC${randomUUID().replaceAll("-", "").slice(0, 8)}`.toUpperCase();
  const originalName = "Operations POC organization";
  const created = await operation.callOptional(
    "@voyzu/erp-core.createOrganization",
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
    const result = await operation.callOptional(
      "@voyzu/erp-core.patchOrganization",
      code,
      { name: changedName },
    );

    assert.ok(result && typeof result === "object");
    assert.equal(Reflect.get(result, "name"), changedName);

    await assert.rejects(
      operation.callOptional(
        "@voyzu/erp-core.patchOrganization",
        code,
        { name: 42 },
      ),
      /Invalid operation arguments/,
    );
  } finally {
    await operation.callOptional("@voyzu/erp-core.deleteOrganization", code);
  }
});
