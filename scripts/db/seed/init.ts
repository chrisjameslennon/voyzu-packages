 
import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });
console.log(`Using env: ${envFile}`);

import { execSync } from "child_process";
const envFlag = process.argv.includes("--production") ? " --production" : "";

const scripts = [
  "seed-organization.ts",
  "seed-currency.ts",
  "seed-country.ts",
  "seed-tax.ts",
  "seed-company.ts",
  "seed-users.ts",
  "seed-gl-account-categories.ts",
  "seed-gl-accounts.ts",
  "seed-tax-movement-types.ts",
  "seed-inventory-control-accounts.ts",
  "seed-item-posting-profiles.ts",
  "seed-inventory-categories.ts",
  "seed-inventory-items.ts",
  "seed-control-accounts.ts",
  "seed-bank-cash-accounts.ts",
  "seed-dimensions.ts",
  "seed-fin-doc-processing.ts",
  "seed-posting-codes.ts",
  "seed-fiscal-years.ts",
  "seed-fiscal-periods.ts",
];

const RESET_SCRIPTS = new Set(["seed-fiscal-years.ts", "seed-fiscal-periods.ts"]);

for (const script of scripts) {
  console.log(`running ${script}...`);
  const resetFlag = RESET_SCRIPTS.has(script) ? " --reset" : "";
  execSync(`npx tsx scripts/db/seed/${script}${envFlag}${resetFlag}`, { stdio: "inherit" });
}
