import assert from "node:assert/strict";
import { after, describe, it } from "node:test";

import { getPool } from "@voyzu/capability/db";
import { events as platformEvents } from "@voyzu/capability/events";
import type { CompanyResponseDto } from "@voyzu/erp-core/types/modules/companies";

import { events as companyEvents } from "../../../modules/companies/events";
import { createCompany, deleteCompany, patchCompany } from "../../../modules/companies/operations";

const code = "TEST-ERP-EVENT";

after(async () => {
  await getPool().query(`DELETE FROM company WHERE code = $1`, [code]);
});

describe("ERP Core company events", () => {
  it("dispatches companyUpdated with the active transaction context", async () => {
    const unregisterEvents = platformEvents.registerModule("@voyzu/erp-core", "companies", companyEvents);
    let eventCompany: CompanyResponseDto | undefined;
    let transactionCompanyName: string | undefined;
    const unsubscribe = platformEvents.listen<CompanyResponseDto>(
      "@voyzu/erp-core.companies.companyUpdated",
      async (company, context) => {
        console.log("[event] @voyzu/erp-core.companies.companyUpdated", company);
        eventCompany = company;
        const { rows } = await context.transaction.query(
          `SELECT name FROM company WHERE code = $1`,
          [company.code],
        );
        transactionCompanyName = String(rows[0]?.name);
      },
    );

    try {
      await createCompany({
        code,
        name: "ERP Event Company",
        countryCode: "NZ",
        baseCurrencyCode: "NZD",
      });

      const patchedCompany = await patchCompany(code, { name: "ERP Event Company Patched" });

      assert.equal(patchedCompany.name, "ERP Event Company Patched");
      assert.equal(eventCompany?.name, "ERP Event Company Patched");
      assert.equal(transactionCompanyName, "ERP Event Company Patched");

      await deleteCompany(code);
    } finally {
      unsubscribe();
      unregisterEvents();
    }
  });
});
