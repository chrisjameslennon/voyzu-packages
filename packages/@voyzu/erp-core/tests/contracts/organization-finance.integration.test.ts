import { OrganizationRepo } from "../../modules/organizations/server/db/organization.repo";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { capabilities, semanticData, registerContracts } from "@voyzu/capability/contracts";
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
  const packages = [
    { name: "@voyzu/erp-core", contracts: erp.contracts },
    { name: "@voyzu/finance", contracts: finance.contracts },
  ];
  try {
    await assert.rejects(withTransaction(async () => {
      registerContracts([...identityPackages, packages[0]]);
      assert.equal(capabilities.optional("erp.organization-finance"), undefined);
      const organization = await createOrganization({ code, name: "Contract integration test", countryCode: "NZ", baseCurrencyCode: "NZD" });
      await assert.rejects(semanticData.get("organization.finance", organization.id), /No implementation/);
      await assert.rejects(semanticData.get("organization.withFinance", organization.id), /No implementation/);
      registerContracts([...identityPackages, ...packages]);
      const result = await capabilities.use("erp.organization-finance").createFinancialEntity({ organizationId: organization.id });
      assert.equal(typeof result.financialEntityId, "number");
      const composed = await semanticData.get("organization.withFinance", organization.id);
      assert.equal(composed?.code, organization.code);
      assert.equal(composed?.financeCompanyId, result.financialEntityId);
      assert.equal(composed?.id, organization.id);
      assert.equal(composed?.financeEnabled, true);
      assert.ok(composed?.audit.created);
      // Validate the automatic creation hook as well as explicit capability invocation.
      const automatic = await createOrganization({ code: `${code.slice(0, 13)}A`, name: "Automatic Finance test", countryCode: "NZ", baseCurrencyCode: "NZD" });
      assert.equal((await semanticData.get("organization.finance", automatic.id))?.financeEnabled, true);
      throw rollback;
    }), (error) => error === rollback);
    const { rows } = await new OrganizationRepo(getDb()).findIdByCode(code);
    assert.equal(rows.length, 0, "outer rollback must include organization and Finance writes");
  } finally { registerContracts([...identityPackages, ...packages]); }
});
