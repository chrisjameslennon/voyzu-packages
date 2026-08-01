import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";
import { createCompany } from "../../../packages/@voyzu/core/modules/companies/server/lib/company.service";
import { ConflictError } from "@voyzu/capability/errors";

const PREFIXES = [
  "Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Theta", "Kappa",
  "Nova", "Apex", "Vega", "Orion", "Atlas", "Titan", "Pulse", "Nexus",
  "Crest", "Peak", "Core", "Edge",
];

const SUFFIXES = [
  "Corp", "Ltd", "Inc", "Group", "Holdings", "Partners", "Solutions",
  "Industries", "Ventures", "Capital",
];

function pad(n: number): string {
  return String(n).padStart(3, "0");
}

async function main() {
  const pool = getPool();

  const countryRes = await pool.query<{ code: string; currency_code: string }>(
    `SELECT code, currency_code FROM country WHERE status = 'ACTIVE' ORDER BY code`,
  );
  if (!countryRes.rows.length) throw new Error("No active countries found — run seed-country.ts first");
  const countries = countryRes.rows;

  let created = 0;
  let skipped = 0;

  for (let i = 1; i <= 100; i++) {
    const prefix = PREFIXES[i % PREFIXES.length];
    const suffix = SUFFIXES[i % SUFFIXES.length];
    const country = countries[i % countries.length];
    const code = `SAMP-${pad(i)}`;
    const name = `${prefix} ${suffix} ${pad(i)}`;

    try {
      await createCompany({
        code,
        name,
        countryCode: country.code,
        baseCurrencyCode: country.currency_code,
      }, { actorType: "SYSTEM" });
      created++;
    } catch (err) {
      if (err instanceof ConflictError) {
        skipped++;
      } else {
        throw err;
      }
    }
  }

  console.log(`Generated sample companies: ${created} created, ${skipped} already existed`);
  await pool.end();
}

main();

