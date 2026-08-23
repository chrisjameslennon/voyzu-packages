import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";
import { createOrganization } from "@voyzu/erp-core/organizations/server";
import { ConflictError } from "@voyzu/capability/errors";

const COMPANIES: Record<string, { name: string; suffix: string }> = {
  NZ: { name: "Acme New Zealand", suffix: "Ltd" },
  AU: { name: "Acme Australia", suffix: "Pty Ltd" },
  US: { name: "Acme United States", suffix: "Inc" },
  GB: { name: "Acme United Kingdom", suffix: "Ltd" },
  CA: { name: "Acme Canada", suffix: "Inc" },
};

async function main() {
  const pool = getPool();

  const countryRes = await pool.query<{ code: string; currency_code: string }>(
    `SELECT code, currency_code FROM country WHERE status = 'ACTIVE' ORDER BY code`,
  );

  for (const country of countryRes.rows) {
    const meta = COMPANIES[country.code];
    if (!meta) continue;

    try {
      await createOrganization({
        code: `SAMP-${country.code}`,
        name: `${meta.name} ${meta.suffix}`,
        countryCode: country.code,
        baseCurrencyCode: country.currency_code,
      });
      console.log(`created company SAMP-${country.code}`);
    } catch (err) {
      if (err instanceof ConflictError) {
        console.log(`company SAMP-${country.code} already exists, skipping`);
      } else {
        throw err;
      }
    }

    await pool.query(
      `INSERT INTO finance_organization (
         id, organization_id, tax_filing_anchor_month, tax_filing_interval_months,
         use_finance_template_settings, is_template,
         creation_actor_type, updated_actor_type
       )
       SELECT
         c.id,
         c.id,
         fc.tax_filing_anchor_month,
         fc.tax_filing_interval_months,
         $2,
         FALSE,
         'SYSTEM',
         'SYSTEM'
       FROM organization c
       JOIN finance_country fc ON fc.code = c.country_code
       WHERE c.code = $1
       ON CONFLICT (organization_id) DO UPDATE SET
         tax_filing_anchor_month = EXCLUDED.tax_filing_anchor_month,
         tax_filing_interval_months = EXCLUDED.tax_filing_interval_months,
         use_finance_template_settings = EXCLUDED.use_finance_template_settings,
         updated_date = NOW(), updated_actor_type = 'SYSTEM'`,
      [`SAMP-${country.code}`, country.code !== "NZ"],
    );
  }

  await pool.end();
}

main();
