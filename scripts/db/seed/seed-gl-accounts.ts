 
import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

type AccountType = "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE";

type GLAccountSeed = {
  code: string;
  name: string;
  accountType: AccountType;
  categoryCode: string;
};

const ACCOUNTS: GLAccountSeed[] = [
  // ======================================================
  // ASSETS – CURRENT (100xxx)
  // ======================================================
  { code: "100000", name: "Bank – Operating Account", accountType: "ASSET", categoryCode: "ASSET_BANK" },
  { code: "100100", name: "Bank – Payroll Account", accountType: "ASSET", categoryCode: "ASSET_BANK" },
  { code: "100200", name: "Bank – Savings Account", accountType: "ASSET", categoryCode: "ASSET_BANK" },
  { code: "100300", name: "Bank Clearing / Settlement Account", accountType: "ASSET", categoryCode: "ASSET_BANK" },
  { code: "100400", name: "Undeposited Funds", accountType: "ASSET", categoryCode: "ASSET_BANK" },
  { code: "101000", name: "Cash on Hand", accountType: "ASSET", categoryCode: "ASSET_BANK" },

  { code: "110000", name: "Accounts Receivable – Trade", accountType: "ASSET", categoryCode: "ASSET_ACCOUNTS_REC" },
  { code: "111000", name: "Accounts Receivable – Unapplied Cash / Credits", accountType: "ASSET", categoryCode: "ASSET_ACCOUNTS_REC" },
  { code: "112000", name: "Allowance for Doubtful Debts", accountType: "ASSET", categoryCode: "ASSET_ACCOUNTS_REC" },

  { code: "120000", name: "Tax on Purchases - Recoverable", accountType: "ASSET", categoryCode: "ASSET_ACCOUNTS_REC" },
  { code: "121000", name: "Inventory Control", accountType: "ASSET", categoryCode: "ASSET_INVENTORY" },
  { code: "121500", name: "Inventory Receipt Clearing", accountType: "ASSET", categoryCode: "ASSET_INVENTORY" },

  { code: "130000", name: "Prepayments", accountType: "ASSET", categoryCode: "ASSET_PREPAYMENTS" },
  { code: "131000", name: "Deposits Paid", accountType: "ASSET", categoryCode: "ASSET_PREPAYMENTS" },
  { code: "132000", name: "Accrued Income", accountType: "ASSET", categoryCode: "ASSET_PREPAYMENTS" },

  // ======================================================
  // ASSETS – NON-CURRENT (150xxx)
  // ======================================================
  { code: "150000", name: "Plant & Equipment – Cost", accountType: "ASSET", categoryCode: "ASSET_PPE" },
  { code: "151000", name: "Accumulated Depreciation – PPE", accountType: "ASSET", categoryCode: "ASSET_ACCUM_DEP" },
  { code: "152000", name: "Motor Vehicles – Cost", accountType: "ASSET", categoryCode: "ASSET_PPE" },
  { code: "153000", name: "Accumulated Depreciation – Vehicles", accountType: "ASSET", categoryCode: "ASSET_ACCUM_DEP" },
  { code: "158000", name: "Capital Work in Progress", accountType: "ASSET", categoryCode: "ASSET_PPE" },
  { code: "159000", name: "Asset Disposal Clearing", accountType: "ASSET", categoryCode: "ASSET_PPE" },

  { code: "160000", name: "Software – Cost", accountType: "ASSET", categoryCode: "ASSET_INTANGIBLE" },
  { code: "161000", name: "Accumulated Amortisation – Software", accountType: "ASSET", categoryCode: "ASSET_INTANGIBLE" },

  // ======================================================
  // LIABILITIES – CURRENT (200xxx)
  // ======================================================
  { code: "200000", name: "Accounts Payable – Trade", accountType: "LIABILITY", categoryCode: "LIABILITY_AP" },
  { code: "201000", name: "Accounts Payable – Unapplied Payments / Credits", accountType: "LIABILITY", categoryCode: "LIABILITY_AP" },

  { code: "210000", name: "GST / VAT Payable", accountType: "LIABILITY", categoryCode: "LIABILITY_GST" },
  { code: "211000", name: "GST / VAT Receivable", accountType: "LIABILITY", categoryCode: "LIABILITY_GST" },
  { code: "220000", name: "Tax on Sales - Payable", accountType: "LIABILITY", categoryCode: "LIABILITY_GST" },
  { code: "222000", name: "Payroll Liabilities – Super", accountType: "LIABILITY", categoryCode: "LIABILITY_PAYROLL" },
  { code: "223000", name: "Employer Contributions Payable", accountType: "LIABILITY", categoryCode: "LIABILITY_PAYROLL" },

  { code: "230000", name: "Deferred Revenue", accountType: "LIABILITY", categoryCode: "LIABILITY_DEFERRED" },
  { code: "240000", name: "Accrued Expenses", accountType: "LIABILITY", categoryCode: "LIABILITY_AP" },

  // ======================================================
  // LIABILITIES – NON-CURRENT (250xxx)
  // ======================================================
  { code: "250000", name: "Bank Loans – Long Term", accountType: "LIABILITY", categoryCode: "LIABILITY_LOANS" },
  { code: "251000", name: "Lease Liabilities", accountType: "LIABILITY", categoryCode: "LIABILITY_LOANS" },
  { code: "260000", name: "Interest Payable", accountType: "LIABILITY", categoryCode: "LIABILITY_LOANS" },

  // ======================================================
  // EQUITY (300xxx)
  // ======================================================
  { code: "300000", name: "Opening Balance Equity", accountType: "EQUITY", categoryCode: "EQUITY_CAPITAL" },
  { code: "310000", name: "Retained Earnings", accountType: "EQUITY", categoryCode: "EQUITY_RETAINED" },
  { code: "320000", name: "Current Year Earnings", accountType: "EQUITY", categoryCode: "EQUITY_RETAINED" },
  { code: "330000", name: "Owner Drawings", accountType: "EQUITY", categoryCode: "EQUITY_DRAWINGS" },
  { code: "340000", name: "Dividends Payable", accountType: "EQUITY", categoryCode: "EQUITY_DRAWINGS" },
  { code: "390000", name: "Legacy Opening Balance Equity", accountType: "EQUITY", categoryCode: "EQUITY_RETAINED" },

  // ======================================================
  // REVENUE (400xxx)
  // ======================================================
  { code: "400000", name: "Sales  Products", accountType: "REVENUE", categoryCode: "REVENUE_OPERATING" },
  { code: "401000", name: "Sales - Events", accountType: "REVENUE", categoryCode: "REVENUE_OPERATING" },
  { code: "402000", name: "Sales  Subscriptions", accountType: "REVENUE", categoryCode: "REVENUE_OPERATING" },
  { code: "403000", name: "Sales  Services", accountType: "REVENUE", categoryCode: "REVENUE_OPERATING" },
  { code: "405000", name: "Inventory Adjustment Gain / Stock Gain", accountType: "REVENUE", categoryCode: "REVENUE_OTHER" },
  { code: "410000", name: "Sales Discounts", accountType: "REVENUE", categoryCode: "REVENUE_OPERATING" },

  { code: "450000", name: "Other Income", accountType: "REVENUE", categoryCode: "REVENUE_OTHER" },
  { code: "451000", name: "Interest Income", accountType: "REVENUE", categoryCode: "REVENUE_OTHER" },
  { code: "452000", name: "Supplier Balances Written Off", accountType: "REVENUE", categoryCode: "REVENUE_OTHER" },

  // ======================================================
  // COST OF GOODS SOLD / INVENTORY CONSUMPTION (500xxx)
  // ======================================================
  { code: "500000", name: "Cost of Goods Sold", accountType: "EXPENSE", categoryCode: "EXPENSE_COGS" },
  { code: "501000", name: "Cost of Goods Sold  Labour", accountType: "EXPENSE", categoryCode: "EXPENSE_COGS" },
  { code: "502000", name: "Freight Inwards", accountType: "EXPENSE", categoryCode: "EXPENSE_COGS" },
  { code: "503000", name: "Packaging and Fulfilment Supplies", accountType: "EXPENSE", categoryCode: "EXPENSE_COGS" },
  { code: "504000", name: "Raw Materials Consumed", accountType: "EXPENSE", categoryCode: "EXPENSE_COGS" },
  { code: "505000", name: "Inventory Adjustment Loss", accountType: "EXPENSE", categoryCode: "EXPENSE_COGS" },
  { code: "506000", name: "Samples and Demo Stock Consumed", accountType: "EXPENSE", categoryCode: "EXPENSE_COGS" },

  // ======================================================
  // OPERATING EXPENSES (600xxx)
  // ======================================================
  { code: "600000", name: "Wages and Salaries", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },
  { code: "601000", name: "Payroll Taxes", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },
  { code: "602000", name: "Superannuation Expense", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },
  { code: "603000", name: "Tax Adjustments", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },

  { code: "610000", name: "Bad Debt Expense", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },
  { code: "611000", name: "Repairs and Maintenance", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },
  { code: "612000", name: "Office Supplies", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },
  { code: "613000", name: "Consumables Expense", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },
  { code: "614000", name: "Freight and Courier", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },

  { code: "620000", name: "Utilities", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },
  { code: "630000", name: "IT and Software", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },
  { code: "631000", name: "Telecommunications", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },

  { code: "640000", name: "Advertising", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },
  { code: "641000", name: "Marketing & Promotions", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },

  { code: "650000", name: "Professional Fees", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },
  { code: "651000", name: "Accounting & Audit Fees", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },

  {
    code: "699000",
    name: "General Expenses",
    accountType: "EXPENSE",
    categoryCode: "EXPENSE_OPERATING"
  },


  // ======================================================
  // DEPRECIATION / FINANCE (700xxx / 800xxx)
  // ======================================================
  { code: "700000", name: "Depreciation – Plant & Equipment", accountType: "EXPENSE", categoryCode: "EXPENSE_DEPRECIATION" },
  { code: "701000", name: "Depreciation – Vehicles", accountType: "EXPENSE", categoryCode: "EXPENSE_DEPRECIATION" },
  { code: "710000", name: "Amortisation – Software", accountType: "EXPENSE", categoryCode: "EXPENSE_DEPRECIATION" },

  { code: "800000", name: "Interest Expense", accountType: "EXPENSE", categoryCode: "EXPENSE_INTEREST" },
  { code: "810000", name: "Bank Fees", accountType: "EXPENSE", categoryCode: "EXPENSE_INTEREST" },
  { code: "820000", name: "Doubtful Debt Expense", accountType: "EXPENSE", categoryCode: "EXPENSE_OPERATING" },
];

async function main() {
  const pool = getPool();
  const client = await pool.connect();

  const reset = process.argv.includes("--reset");

  try {
    console.log("Seeding expanded ERP-grade Chart of Accounts…");

    if (reset) {
      await client.query("SET session_replication_role = replica");
      await client.query("DELETE FROM gl_account");
      await client.query(`SELECT setval(pg_get_serial_sequence('gl_account', 'id'), 10000, false)`);
      await client.query("SET session_replication_role = DEFAULT");
      console.log("Reset gl_account — sequence reset.");
    }

    await client.query("BEGIN");

    const companies = await client.query<{ id: number; code: string }>(
      `SELECT id, code FROM company WHERE is_template = true ORDER BY code`,
    );
    if (!companies.rows.length) throw new Error("No companies found. Run seed-company.ts first.");

    const cats = await client.query(`select company_id, id, code from gl_account_category`);
    const categoryByCompanyAndCode = new Map<string, number>(
      cats.rows.map(r => [`${r.company_id}:${r.code}`, r.id])
    );

    for (const company of companies.rows) {
      for (const a of ACCOUNTS) {
        if (!categoryByCompanyAndCode.has(`${company.id}:${a.categoryCode}`)) {
          throw new Error(`Missing gl_account_category: ${company.code}/${a.categoryCode}`);
        }
      }
    }

    const sql = `
      INSERT INTO gl_account (
        company_id,
        code,
        name,
        account_type,
        account_category_id,
        status,
        creation_actor_type,
        updated_actor_type
      )
      VALUES ($1, $2, $3, $4, $5, 'ACTIVE', 'SYSTEM', 'SYSTEM')
      ON CONFLICT (company_id, code) DO UPDATE
      SET
        name = EXCLUDED.name,
        account_type = EXCLUDED.account_type,
        account_category_id = EXCLUDED.account_category_id,
        updated_date = NOW(),
        updated_actor_type = 'SYSTEM'
    `;

    let count = 0;
    for (const company of companies.rows) {
      for (const a of ACCOUNTS) {
      await client.query(sql, [
        company.id,
        a.code,
        a.name,
        a.accountType,
        categoryByCompanyAndCode.get(`${company.id}:${a.categoryCode}`),
      ]);
      console.log(`✔ ${a.code} – ${a.name}`);
      count++;
      }
    }

    await client.query("COMMIT");
    console.log(`COA seeded (${count} accounts).`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("COA seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
