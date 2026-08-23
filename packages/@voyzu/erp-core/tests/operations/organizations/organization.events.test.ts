import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import { getPool } from "@voyzu/capability/db";
import { events as platformEvents } from "@voyzu/capability/events";
import type { OrganizationResponseDto } from "@voyzu/erp-core/types/modules/organizations";

import { events as organizationEvents } from "../../../modules/organizations/events";
import { createOrganization, deleteOrganization, patchOrganization } from "../../../modules/organizations/operations";

const code = "TEST-ERP-EVENT";

after(async () => {
  await getPool().query(`DELETE FROM organization WHERE code = $1`, [code]);
});

describe("ERP Core organization events", () => {
  it("dispatches organizationUpdated with the active transaction context", async () => {
    const unregisterEvents = platformEvents.registerModule("@voyzu/erp-core", "organizations", organizationEvents);
    let eventOrganization: OrganizationResponseDto | undefined;
    let transactionOrganizationName: string | undefined;
    const unsubscribe = platformEvents.listen<OrganizationResponseDto>(
      "@voyzu/erp-core.organizations.organizationUpdated",
      async (organization, context) => {
        console.log("[event] @voyzu/erp-core.organizations.organizationUpdated", organization);
        eventOrganization = organization;
        const { rows } = await context.transaction.query(
          `SELECT name FROM organization WHERE code = $1`,
          [organization.code],
        );
        transactionOrganizationName = String(rows[0]?.name);
      },
    );

    try {
      await createOrganization({
        code,
        name: "ERP Event Organization",
        countryCode: "NZ",
        baseCurrencyCode: "NZD",
      });

      const patchedOrganization = await patchOrganization(code, { name: "ERP Event Organization Patched" });

      assert.equal(patchedOrganization.name, "ERP Event Organization Patched");
      assert.equal(eventOrganization?.name, "ERP Event Organization Patched");
      assert.equal(transactionOrganizationName, "ERP Event Organization Patched");

      await deleteOrganization(code);
    } finally {
      unsubscribe();
      unregisterEvents();
    }
  });
});
