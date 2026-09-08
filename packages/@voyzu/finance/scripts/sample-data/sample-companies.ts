import { FinanceSampleDataRepo } from "../db/sample-data.repo";
import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

const SAMPLE_ORGANIZATION_CODE = "TESTCO";

async function main(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await new FinanceSampleDataRepo(client).begin();
    const organizationResult = await new FinanceSampleDataRepo(client).findOrganization(SAMPLE_ORGANIZATION_CODE);
    const organization = organizationResult.rows[0];
    if (!organization || organization.status !== "ACTIVE") {
      throw new Error(
        "Active organization TESTCO was not found. Run @voyzu/erp-core:sampleData first.",
      );
    }

    const result = await new FinanceSampleDataRepo(client).upsertFinancialEntity(organization.id, organization.country_code);
    if (!result.rowCount) {
      throw new Error(
        `Finance country configuration ${organization.country_code} was not found for TESTCO.`,
      );
    }

    const financeOrganizationId = result.rows[0].id;
    const mappings = [
      { table: "ar_control_account", ledger: "ACCOUNTS_RECEIVABLE", code: "AR_TRADE_RECEIVABLES", name: "Trade Receivables", glAccountCode: "110000" },
      { table: "ar_control_account", ledger: "ACCOUNTS_RECEIVABLE", code: "AR_UNAPPLIED_CASH", name: "Customer Receipts Awaiting Allocation", glAccountCode: "111000" },
      { table: "ap_control_account", ledger: "ACCOUNTS_PAYABLE", code: "AP_TRADE_PAYABLES", name: "Trade Payables", glAccountCode: "200000" },
      { table: "ap_control_account", ledger: "ACCOUNTS_PAYABLE", code: "AP_UNAPPLIED_PAYMENTS", name: "Supplier Payments Awaiting Allocation", glAccountCode: "201000" },
    ];
    for (const mapping of mappings) {
      const restored = await new FinanceSampleDataRepo(client).restoreControlMapping(financeOrganizationId, mapping.code, mapping.name, mapping.glAccountCode, mapping.ledger, mapping.table);
      if (!restored.rowCount) {
        throw new Error(
          `TESTCO GL account ${mapping.glAccountCode} is required for sample control account ${mapping.code}.`,
        );
      }
    }

    await new FinanceSampleDataRepo(client).commit();
    console.log("Restored TESTCO AR and AP control-account mappings (110000, 111000, 200000 and 201000).");
    console.log("Finance sample company TESTCO is ready.");
  } catch (error) {
    await new FinanceSampleDataRepo(client).rollback();
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Finance sample company setup failed:", error);
  process.exitCode = 1;
});
