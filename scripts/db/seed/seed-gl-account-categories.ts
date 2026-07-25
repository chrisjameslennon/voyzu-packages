import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";
type ActiveStatus = "ACTIVE" | "INACTIVE";

type GLCategorySeed = {
  code: string;
  name: string;
  accountType: AccountType;
  sequence: number;
  status: ActiveStatus;
};

const CATEGORIES: GLCategorySeed[] = [
  { code: "ASSET_CURRENT", name: "Current Assets", accountType: "ASSET", sequence: 100, status: "ACTIVE" },
  { code: "ASSET_BANK", name: "Bank / Cash", accountType: "ASSET", sequence: 110, status: "ACTIVE" },
  { code: "ASSET_ACCOUNTS_REC", name: "Accounts Receivable", accountType: "ASSET", sequence: 120, status: "ACTIVE" },
  { code: "ASSET_INVENTORY", name: "Inventory", accountType: "ASSET", sequence: 130, status: "ACTIVE" },
  { code: "ASSET_PREPAYMENTS", name: "Prepayments", accountType: "ASSET", sequence: 140, status: "ACTIVE" },
  { code: "ASSET_NONCURRENT", name: "Non-current Assets", accountType: "ASSET", sequence: 200, status: "ACTIVE" },
  { code: "ASSET_PPE", name: "Property, Plant & Equipment", accountType: "ASSET", sequence: 210, status: "ACTIVE" },
  { code: "ASSET_ACCUM_DEP", name: "Accumulated Depreciation", accountType: "ASSET", sequence: 220, status: "ACTIVE" },
  { code: "ASSET_INTANGIBLE", name: "Intangible Assets", accountType: "ASSET", sequence: 230, status: "ACTIVE" },
  { code: "LIABILITY_CURRENT", name: "Current Liabilities", accountType: "LIABILITY", sequence: 300, status: "ACTIVE" },
  { code: "LIABILITY_AP", name: "Accounts Payable", accountType: "LIABILITY", sequence: 310, status: "ACTIVE" },
  { code: "LIABILITY_GST", name: "GST / VAT", accountType: "LIABILITY", sequence: 320, status: "ACTIVE" },
  { code: "LIABILITY_PAYROLL", name: "Payroll Liabilities", accountType: "LIABILITY", sequence: 330, status: "ACTIVE" },
  { code: "LIABILITY_DEFERRED", name: "Deferred Revenue", accountType: "LIABILITY", sequence: 340, status: "ACTIVE" },
  { code: "LIABILITY_LOANS", name: "Loans", accountType: "LIABILITY", sequence: 410, status: "ACTIVE" },
  { code: "EQUITY", name: "Equity", accountType: "EQUITY", sequence: 500, status: "ACTIVE" },
  { code: "EQUITY_CAPITAL", name: "Capital", accountType: "EQUITY", sequence: 510, status: "ACTIVE" },
  { code: "EQUITY_RETAINED", name: "Retained Earnings", accountType: "EQUITY", sequence: 520, status: "ACTIVE" },
  { code: "EQUITY_DRAWINGS", name: "Drawings / Distributions", accountType: "EQUITY", sequence: 530, status: "ACTIVE" },
  { code: "REVENUE_OPERATING", name: "Operating Revenue", accountType: "REVENUE", sequence: 600, status: "ACTIVE" },
  { code: "REVENUE_OTHER", name: "Other Income", accountType: "REVENUE", sequence: 650, status: "ACTIVE" },
  { code: "EXPENSE_COGS", name: "Cost of Goods Sold", accountType: "EXPENSE", sequence: 700, status: "ACTIVE" },
  { code: "EXPENSE_OPERATING", name: "Operating Expenses", accountType: "EXPENSE", sequence: 800, status: "ACTIVE" },
  { code: "EXPENSE_DEPRECIATION", name: "Depreciation & Amortisation", accountType: "EXPENSE", sequence: 850, status: "ACTIVE" },
  { code: "EXPENSE_INTEREST", name: "Finance Costs", accountType: "EXPENSE", sequence: 860, status: "ACTIVE" },
];

async function main() {
  const pool = getPool();
  const client = await pool.connect();
  const reset = process.argv.includes("--reset");

  try {
    console.log("Starting GL account category seed...");

    if (reset) {
      await client.query("SET session_replication_role = replica");
      await client.query("DELETE FROM gl_account_category");
      await client.query(`SELECT setval(pg_get_serial_sequence('gl_account_category', 'id'), 10000, false)`);
      await client.query("SET session_replication_role = DEFAULT");
      console.log("Reset gl_account_category sequence.");
    }

    await client.query("BEGIN");

    const companies = await client.query<{ id: number; code: string }>(
      `SELECT id, code FROM company WHERE is_template = true ORDER BY code`,
    );
    if (!companies.rows.length) throw new Error("No companies found. Run seed-company.ts first.");

    const sql = `
      INSERT INTO gl_account_category (company_id, code, name, account_type, sequence, status, creation_actor_type, updated_actor_type)
      VALUES ($1, $2, $3, $4, $5, $6, 'SYSTEM', 'SYSTEM')
      ON CONFLICT (company_id, code) DO UPDATE
      SET name = EXCLUDED.name,
          account_type = EXCLUDED.account_type,
          sequence = EXCLUDED.sequence,
          status = EXCLUDED.status,
          updated_date = NOW(),
          updated_actor_type = 'SYSTEM'
    `;

    let count = 0;
    for (const company of companies.rows) {
      for (const category of CATEGORIES) {
        const res = await client.query(sql, [
          company.id,
          category.code,
          category.name,
          category.accountType,
          category.sequence,
          category.status,
        ]);
        count += res.rowCount ?? 0;
        console.log(`- ${company.code} ${category.code}`);
      }
    }

    await client.query("COMMIT");
    console.log(`GL account category seed complete (${count} rows affected).`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
