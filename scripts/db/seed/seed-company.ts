 
import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

async function main() {
  const pool = getPool();
  const reset = process.argv.includes("--reset");

  if (reset) {
    await pool.query("SET session_replication_role = replica");
    await pool.query("DELETE FROM company");
    await pool.query(`SELECT setval(pg_get_serial_sequence('company', 'id'), 10000, false)`);
    await pool.query("SET session_replication_role = DEFAULT");
    console.log("Reset company — sequence reset.");
  }

  const orgRes = await pool.query(`SELECT id FROM organization LIMIT 1`);
  if (!orgRes.rows.length) throw new Error("No organization found — run seed-organization.ts first");
  const organizationId: number = orgRes.rows[0].id;

  const companies = [
    { code: "TEMPLATE", name: "Company Defaults", countryCode: "NZ", currencyCode: "NZD", isTemplate: true },
  ];

  for (const company of companies) {
    await pool.query(
    `INSERT INTO company (
       code,
       name,
       country_code,
       base_currency_code,
       organization_id,
       tax_filing_anchor_month,
       tax_filing_interval_months,
       use_organization_standard_settings,
       is_template,
       creation_actor_type,
       updated_actor_type
     )
     SELECT $1, $2, c.code, $4, $5, c.tax_filing_anchor_month, c.tax_filing_interval_months, true, $6, 'SYSTEM', 'SYSTEM'
     FROM country c
     WHERE c.code = $3
     ON CONFLICT (code) DO UPDATE
     SET name = EXCLUDED.name,
         country_code = EXCLUDED.country_code,
         base_currency_code = EXCLUDED.base_currency_code,
         organization_id = EXCLUDED.organization_id,
         tax_filing_anchor_month = EXCLUDED.tax_filing_anchor_month,
         tax_filing_interval_months = EXCLUDED.tax_filing_interval_months,
         use_organization_standard_settings = EXCLUDED.use_organization_standard_settings,
         is_template = EXCLUDED.is_template,
         updated_date = NOW(),
         updated_actor_type = 'SYSTEM'`,
      [company.code, company.name, company.countryCode, company.currencyCode, organizationId, company.isTemplate]
    );
    console.log(`seeded company ${company.code}`);
  }

  await pool.end();
}

main();



