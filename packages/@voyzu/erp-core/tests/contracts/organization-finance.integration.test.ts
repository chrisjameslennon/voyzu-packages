import { OrganizationRepo } from "../../modules/organizations/server/db/organization.repo";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { capabilities, masterData, registerContracts } from "@voyzu/capability/contracts";
import { getDb, withTransaction } from "@voyzu/capability/db";
import { createOrganization } from "../../modules/organizations/server/lib/organization.service";
import erp from "../../voyzu.package";
import finance from "../../../finance/voyzu.package";

// Requires an initialized development DB with Finance country settings for NZ.
// Every write (including fiscal calendar provisioning) is rolled back.
test("organization, Finance capability and composed master data share a transaction", async () => {
  // Test-only bootstrap of platform identity: audit helpers now use its semantic contract.
  const runtimeRoot = process.env.VOYZU_WORKSPACE_ROOT;
  if (!runtimeRoot) throw new Error("Run through npm run test:contracts");
  const { platformContracts } = await import(pathToFileURL(resolve(runtimeRoot, "voyzu/contracts/index.ts")).href);
  const { default: auth } = await import(pathToFileURL(resolve(runtimeRoot, "voyzu/packages/@voyzu/auth/voyzu.package.ts")).href);
  const identityPackages = [
    { name: "voyzu-platform", contracts: platformContracts },
    { name: "@voyzu/auth", contracts: auth.contracts },
  ];
  const code = `CT${randomUUID().replaceAll("-", "").slice(0, 12)}`.toUpperCase();
  const rollback = new Error("test rollback");
  // Isolate organization contracts; country composition additionally requires platform definitions.
  const packages = [
    { name: "@voyzu/erp-core", contracts: {
      ...erp.contracts,
      defines: { capabilities: erp.contracts.defines.capabilities, masterData: {
        "erp.organization": erp.contracts.defines.masterData["erp.organization"],
        "erp.organization.finance": erp.contracts.defines.masterData["erp.organization.finance"],
      } },
    } },
    { name: "@voyzu/finance", contracts: {
      implements: { capabilities: finance.contracts.implements.capabilities, masterData: {
        "erp.organization.finance": finance.contracts.implements.masterData["erp.organization.finance"],
      } },
    } },
  ];
  try {
    await assert.rejects(withTransaction(async () => {
      registerContracts([...identityPackages, packages[0]]);
      assert.equal(capabilities.optional("erp.organization-finance"), undefined);
      const organization = await createOrganization({ code, name: "Contract integration test", countryCode: "NZ", baseCurrencyCode: "NZD" });
      await assert.rejects(masterData.get("erp.organization.finance", organization.id), /No implementation/);
      await assert.rejects(masterData.compose("erp.organization", organization.id, ["erp.organization.finance"]), /No implementation/);
      registerContracts([...identityPackages, ...packages]);
      const result = await capabilities.use("erp.organization-finance").createFinancialEntity({ organizationId: organization.id });
      assert.equal(typeof result.financialEntityId, "number");
      const composed = await masterData.compose("erp.organization", organization.id, ["erp.organization.finance"]);
      assert.deepEqual(composed?.organization, organization);
      assert.equal(composed?.extensions.finance?.financeCompanyId, result.financialEntityId);
      assert.equal(composed?.extensions.finance?.id, organization.id);
      assert.equal(composed?.extensions.finance?.financeEnabled, true);
      assert.ok(composed?.extensions.finance?.audit.created);
      // Validate the automatic creation hook as well as explicit capability invocation.
      const automatic = await createOrganization({ code: `${code.slice(0, 13)}A`, name: "Automatic Finance test", countryCode: "NZ", baseCurrencyCode: "NZD" });
      assert.equal((await masterData.get("erp.organization.finance", automatic.id))?.financeEnabled, true);
      throw rollback;
    }), (error) => error === rollback);
    const { rows } = await new OrganizationRepo(getDb()).findIdByCode(code);
    assert.equal(rows.length, 0, "outer rollback must include organization and Finance writes");
  } finally { registerContracts([...identityPackages, ...packages]); }
});
