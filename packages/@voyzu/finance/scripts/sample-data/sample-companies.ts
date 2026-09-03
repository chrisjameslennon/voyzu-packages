import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

const SAMPLE_ORGANIZATION_CODE = "TESTCO";

async function main(): Promise<void> {
  const pool = getPool();
  try {
    const organizationResult = await pool.query<{
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

    const result = await pool.query(
      `INSERT INTO finance_organization (
         id, organization_id, tax_filing_anchor_month, tax_filing_interval_months,
         use_finance_template_settings, is_template,
         creation_actor_type, updated_actor_type
       )
       SELECT
         $1, $1, fc.tax_filing_anchor_month, fc.tax_filing_interval_months,
         FALSE, FALSE, 'SYSTEM', 'SYSTEM'
       FROM finance_country fc
       WHERE fc.code = $2
       ON CONFLICT (organization_id) DO UPDATE SET
         tax_filing_anchor_month = EXCLUDED.tax_filing_anchor_month,
         tax_filing_interval_months = EXCLUDED.tax_filing_interval_months,
         use_finance_template_settings = EXCLUDED.use_finance_template_settings,
         updated_date = NOW(), updated_actor_type = 'SYSTEM'`,
      [organization.id, organization.country_code],
    );
    if (!result.rowCount) {
      throw new Error(
        `Finance country configuration ${organization.country_code} was not found for TESTCO.`,
      );
    }

    console.log("Finance sample company TESTCO is ready.");
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Finance sample company setup failed:", error);
  process.exitCode = 1;
});
