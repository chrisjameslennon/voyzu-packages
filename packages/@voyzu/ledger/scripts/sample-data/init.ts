import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));

const scripts = [
  "sample-companies.ts",
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
] as const;

/** Install the repeatable Core demonstration data in dependency order. */
export async function install(): Promise<void> {
  for (const script of scripts) {
    console.log(`running ${script}...`);
    const result = spawnSync(
      process.execPath,
      [...process.execArgv, resolve(scriptDirectory, script)],
      { env: process.env, stdio: "inherit" },
    );
    if (result.error) throw result.error;
    if (result.status !== 0) {
      throw new Error(`${script} exited with status ${result.status ?? "unknown"}.`);
    }
  }
}

export default install;
