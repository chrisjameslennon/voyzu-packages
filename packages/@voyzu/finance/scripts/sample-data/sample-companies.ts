import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

const SAMPLE_ORGANIZATION_CODE = "TESTCO";

async function main(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const organizationResult = await client.query<{
      id: number;
      country_code: string;
      status: string;
    }>(
      `SELECT id::int, country_code, status
         FROM organization
        WHERE code = $1`,
      [SAMPLE_ORGANIZATION_CODE],
    );
    const organization = organizationResult.rows[0];
    if (!organization || organization.status !== "ACTIVE") {
      throw new Error(
        "Active organization TESTCO was not found. Run @voyzu/erp-core:sampleData first.",
      );
    }

    const result = await client.query<{ id: number }>(
      `INSERT INTO finance_organization (
         id, organization_id, tax_filing_anchor_month, tax_filing_interval_months,
         creation_actor_type, updated_actor_type
       )
       SELECT
         $1, $1, fc.tax_filing_anchor_month, fc.tax_filing_interval_months,
         'SYSTEM', 'SYSTEM'
       FROM finance_country fc
       WHERE fc.code = $2
       ON CONFLICT (organization_id) DO UPDATE SET
         tax_filing_anchor_month = EXCLUDED.tax_filing_anchor_month,
         tax_filing_interval_months = EXCLUDED.tax_filing_interval_months,
         updated_date = NOW(), updated_actor_type = 'SYSTEM'
       RETURNING id::int`,
      [organization.id, organization.country_code],
    );
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
      const restored = await client.query(
        `INSERT INTO ${mapping.table} (
           finance_organization_id, code, ledger, name, status, gl_account_id,
           creation_actor_type, updated_actor_type
         )
         SELECT $1, $2, $5, $3, 'ACTIVE', ga.id, 'SYSTEM', 'SYSTEM'
         FROM gl_account ga
         WHERE ga.finance_organization_id = $1 AND ga.code = $4
         ON CONFLICT (finance_organization_id, code) DO UPDATE SET
           ledger = EXCLUDED.ledger,
           name = EXCLUDED.name,
           status = EXCLUDED.status,
           gl_account_id = EXCLUDED.gl_account_id,
           updated_date = NOW(), updated_actor_type = 'SYSTEM'`,
        [financeOrganizationId, mapping.code, mapping.name, mapping.glAccountCode, mapping.ledger],
      );
      if (!restored.rowCount) {
        throw new Error(
          `TESTCO GL account ${mapping.glAccountCode} is required for sample control account ${mapping.code}.`,
        );
      }
    }

    await client.query("COMMIT");
    console.log("Restored TESTCO AR and AP control-account mappings (110000, 111000, 200000 and 201000).");
    console.log("Finance sample company TESTCO is ready.");
  } catch (error) {
    await client.query("ROLLBACK");
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
