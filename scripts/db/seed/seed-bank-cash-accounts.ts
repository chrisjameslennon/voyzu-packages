import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

type BankCashType = "BANK" | "CASH" | "OTHER";

interface BankCashAccountSeed {
  code: string;
  type: BankCashType;
  glAccountCode: string;
  bankName?: string | null;
  bankBranchName?: string | null;
  bankAccountIdentifier?: string | null;
  cashAccountIdentifier?: string | null;
}

const ACCOUNTS: BankCashAccountSeed[] = [
  {
    code: "BANK_OPERATING",
    type: "BANK",
    glAccountCode: "100000",
  },
];

async function main() {
  const pool = getPool();
  const client = await pool.connect();
  const reset = process.argv.includes("--reset");

  try {
    console.log("Seeding Bank / Cash Accounts...");

    if (reset) {
      await client.query("SET session_replication_role = replica");
      await client.query("DELETE FROM bank_cash_control_account");
      await client.query(`SELECT setval(pg_get_serial_sequence('bank_cash_control_account', 'id'), 10000, false)`);
      await client.query("SET session_replication_role = DEFAULT");
      console.log("Reset bank_cash_control_account table.");
    }

    await client.query("BEGIN");

    const companies = await client.query<{ id: number; code: string }>(
      `SELECT id, code FROM company WHERE is_template = true ORDER BY code`,
    );
    if (!companies.rows.length) throw new Error("No companies found. Run seed-company.ts first.");

    const glRows = await client.query(`SELECT company_id, id, code FROM gl_account`);
    const glByCompanyAndCode = new Map(
      glRows.rows.map((row) => [`${row.company_id}:${String(row.code)}`, Number(row.id)]),
    );

    const upsert = `
      INSERT INTO bank_cash_control_account
        (company_id, code, ledger, type, gl_account_id, bank_name, bank_branch_name, bank_account_identifier, cash_account_identifier, status, creation_actor_type, updated_actor_type)
      VALUES ($1, $2, 'BANK_CASH', $3, $4, $5, $6, $7, $8, 'ACTIVE', 'SYSTEM', 'SYSTEM')
      ON CONFLICT (company_id, code) DO UPDATE
      SET ledger = EXCLUDED.ledger,
          type = EXCLUDED.type,
          gl_account_id = EXCLUDED.gl_account_id,
          bank_name = EXCLUDED.bank_name,
          bank_branch_name = EXCLUDED.bank_branch_name,
          bank_account_identifier = EXCLUDED.bank_account_identifier,
          cash_account_identifier = EXCLUDED.cash_account_identifier,
          status = 'ACTIVE',
          updated_date = NOW(),
          updated_actor_type = 'SYSTEM'
    `;

    let count = 0;
    for (const company of companies.rows) {
      for (const account of ACCOUNTS) {
        const glAccountId = glByCompanyAndCode.get(`${company.id}:${account.glAccountCode}`);
        if (!glAccountId) throw new Error(`Missing gl_account ${company.code}/${account.glAccountCode} for bank/cash account ${account.code}`);
        await client.query(upsert, [
          company.id,
          account.code,
          account.type,
          glAccountId,
          account.bankName ?? null,
          account.bankBranchName ?? null,
          account.bankAccountIdentifier ?? null,
          account.cashAccountIdentifier ?? null,
        ]);
        console.log(`- ${company.code} ${account.code}`);
        count++;
      }
    }

    await client.query("COMMIT");
    console.log(`Bank / Cash Accounts seeded (${count}).`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Bank / Cash Account seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
