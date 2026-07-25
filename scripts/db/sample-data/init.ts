import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });
console.log(`Using env: ${envFile}`);

import { execSync } from "child_process";
const envFlag = process.argv.includes("--production") ? " --production" : "";

const scripts = [
  "sample-companies.ts",
  "sample-inventory-items.ts",
  "sample-users.ts",
  "post-inventory-documents.ts",
  "post-ar-invoices.ts",
  "post-ar-invoice-cancellation.ts",
  "post-ar-receipt.ts",
  "post-ar-receipt-application.ts",
  "post-ar-adjustments.ts",
  "post-ledger-journals.ts",
  "post-tax-documents.ts",
  "post-ap-bills.ts",
  "post-ap-bill-cancellation.ts",
  "post-ap-payments.ts",
  "post-ap-payment-application.ts",
  "post-ap-adjustments.ts",
];

for (const script of scripts) {
  console.log(`running ${script}...`);
  execSync(`npx tsx scripts/db/sample-data/${script}${envFlag}`, { stdio: "inherit" });
}
