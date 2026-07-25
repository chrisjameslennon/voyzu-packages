import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

type InventoryControlAccountSeed = {
  code: string;
  name: string;
  description: string;
  glAccountCode: string;
};

const CONTROL_ACCOUNTS: InventoryControlAccountSeed[] = [
  {
    code: "INVENTORY_CONTROL",
    name: "Inventory Control",
    description: "Inventory control account used to hold the book value of inventory on hand.",
    glAccountCode: "121000",
  },
];

async function main() {
  const pool = getPool();
  const client = await pool.connect();
  const reset = process.argv.includes("--reset");

  try {
    console.log("Seeding Inventory Control Accounts...");

    if (reset) {
      await client.query("DELETE FROM inventory_control_account");
      console.log("Reset inventory_control_account table.");
    }

    await client.query("BEGIN");

    const companies = await client.query<{ id: number; code: string }>(
      `SELECT id, code FROM company WHERE is_template = true ORDER BY code`,
    );
    if (!companies.rows.length) throw new Error("No companies found. Run seed-company.ts first.");

    const gas = await client.query(`SELECT company_id, id, code FROM gl_account`);
    const gaByCompanyAndCode = new Map<string, number>(
      gas.rows.map((r: { company_id: number; code: string; id: number }) => [`${r.company_id}:${r.code}`, r.id]),
    );

    const sql = `
      INSERT INTO inventory_control_account
        (company_id, code, ledger, name, description, gl_account_id, status, creation_actor_type, updated_actor_type)
      VALUES ($1, $2, 'INVENTORY', $3, $4, $5, 'ACTIVE', 'SYSTEM', 'SYSTEM')
      ON CONFLICT (company_id, code) DO UPDATE
      SET ledger = EXCLUDED.ledger,
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          gl_account_id = EXCLUDED.gl_account_id,
          status = 'ACTIVE',
          updated_date = NOW(),
          updated_actor_type = 'SYSTEM'
    `;

    let count = 0;
    for (const company of companies.rows) {
      for (const account of CONTROL_ACCOUNTS) {
        const glAccountId = gaByCompanyAndCode.get(`${company.id}:${account.glAccountCode}`);
        if (!glAccountId) throw new Error(`Missing gl_account ${company.code}/${account.glAccountCode} for inventory control account ${account.code}`);
        await client.query(sql, [
          company.id,
          account.code,
          account.name,
          account.description,
          glAccountId,
        ]);
        console.log(`- ${company.code} ${account.code}`);
        count++;
      }
    }

    await client.query("COMMIT");
    console.log(`Inventory control accounts seeded (${count}).`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Inventory control account seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
