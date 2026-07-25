import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

type ControlAccountSeed = {
  code: string;
  name: string;
  glAccountCode: string;
  ledger: "ACCOUNTS_RECEIVABLE" | "ACCOUNTS_PAYABLE";
};

const ACCOUNTS: ControlAccountSeed[] = [
  { code: "AP_TRADE_PAYABLES", name: "Trade Payables", glAccountCode: "200000", ledger: "ACCOUNTS_PAYABLE" },
  { code: "AP_UNAPPLIED_PAYMENTS", name: "Supplier Payments Awaiting Allocation", glAccountCode: "201000", ledger: "ACCOUNTS_PAYABLE" },
  { code: "AR_TRADE_RECEIVABLES", name: "Trade Receivables", glAccountCode: "110000", ledger: "ACCOUNTS_RECEIVABLE" },
  { code: "AR_UNAPPLIED_CASH", name: "Customer Receipts Awaiting Allocation", glAccountCode: "111000", ledger: "ACCOUNTS_RECEIVABLE" },
];

async function main() {
  const pool = getPool();
  const client = await pool.connect();
  const reset = process.argv.includes("--reset");

  try {
    console.log("Seeding Control Accounts...");

    if (reset) {
      await client.query("SET session_replication_role = replica");
      await client.query("DELETE FROM ar_control_account");
      await client.query("DELETE FROM ap_control_account");
      await client.query("SET session_replication_role = DEFAULT");
      console.log("Reset ar_control_account and ap_control_account.");
    }

    await client.query("BEGIN");

    await client.query(
      `UPDATE ap_control_account
          SET name = CASE code
            WHEN 'AP_TRADE_PAYABLES' THEN 'Trade Payables'
            WHEN 'AP_UNAPPLIED_PAYMENTS' THEN 'Supplier Payments Awaiting Allocation'
            ELSE name
          END,
          updated_date = NOW(),
          updated_actor_type = 'SYSTEM'
        WHERE code IN ('AP_TRADE_PAYABLES', 'AP_UNAPPLIED_PAYMENTS')`,
    );
    await client.query(
      `UPDATE ar_control_account
          SET name = CASE code
            WHEN 'AR_TRADE_RECEIVABLES' THEN 'Trade Receivables'
            WHEN 'AR_UNAPPLIED_CASH' THEN 'Customer Receipts Awaiting Allocation'
            ELSE name
          END,
          updated_date = NOW(),
          updated_actor_type = 'SYSTEM'
        WHERE code IN ('AR_TRADE_RECEIVABLES', 'AR_UNAPPLIED_CASH')`,
    );

    const companies = await client.query<{ id: number; code: string }>(
      `SELECT id, code FROM company WHERE is_template = true ORDER BY code`,
    );
    if (!companies.rows.length) throw new Error("No companies found. Run seed-company.ts first.");

    const gas = await client.query(`SELECT company_id, id, code FROM gl_account`);
    const gaByCompanyAndCode = new Map<string, number>(
      gas.rows.map((r: { company_id: number; code: string; id: number }) => [`${r.company_id}:${r.code}`, r.id]),
    );

    for (const company of companies.rows) {
      for (const account of ACCOUNTS) {
        if (!gaByCompanyAndCode.has(`${company.id}:${account.glAccountCode}`)) {
          throw new Error(`Missing gl_account ${company.code}/${account.glAccountCode} for control account ${account.code}`);
        }
      }
    }

    const sql = `
      INSERT INTO __TABLE__ (company_id, code, ledger, name, gl_account_id, status, creation_actor_type, updated_actor_type)
      VALUES ($1, $2, $3, $4, $5, 'ACTIVE', 'SYSTEM', 'SYSTEM')
      ON CONFLICT (company_id, code) DO UPDATE
      SET ledger = EXCLUDED.ledger,
          name = EXCLUDED.name,
          gl_account_id = EXCLUDED.gl_account_id,
          updated_date = NOW(),
          updated_actor_type = 'SYSTEM'
    `;

    let count = 0;
    for (const company of companies.rows) {
      for (const account of ACCOUNTS) {
        const table = account.ledger === "ACCOUNTS_RECEIVABLE" ? "ar_control_account" : "ap_control_account";
        await client.query(sql.replace("__TABLE__", table), [
          company.id,
          account.code,
          account.ledger,
          account.name,
          gaByCompanyAndCode.get(`${company.id}:${account.glAccountCode}`),
        ]);
        console.log(`- ${company.code} ${account.code}`);
        count++;
      }
    }

    await client.query("COMMIT");
    console.log(`Control accounts seeded (${count}).`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Control account seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
