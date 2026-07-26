import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";
import { createCompany } from "../../../packages/@voyzu-modules/all-modules/companies/server/lib/company.service";
import { ConflictError } from "@voyzu/capability/errors";

const COMPANIES: Record<string, { name: string; suffix: string }> = {
  NZ: { name: "Acme New Zealand",    suffix: "Ltd" },
  AU: { name: "Acme Australia",      suffix: "Pty Ltd" },
  US: { name: "Acme United States",  suffix: "Inc" },
  GB: { name: "Acme United Kingdom", suffix: "Ltd" },
  CA: { name: "Acme Canada",         suffix: "Inc" },
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
      await createCompany({
        code: `SAMP-${country.code}`,
        name: `${meta.name} ${meta.suffix}`,
        countryCode: country.code,
        baseCurrencyCode: country.currency_code,
        useOrganizationStandardSettings: country.code !== "NZ",
      }, { actorType: "SYSTEM" });
      console.log(`created company SAMP-${country.code}`);
    } catch (err) {
      if (err instanceof ConflictError) {
        console.log(`company SAMP-${country.code} already exists, skipping`);
      } else {
        throw err;
      }
    }
  }

  await pool.end();
}

main();

