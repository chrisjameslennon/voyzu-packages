import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

type TaxMovementTypeSeed = {
  code: string;
  name: string;
  description: string;
  taxFamilyCode: "INDIRECT_TAX";
  glAccountCode: string;
};

const MOVEMENT_TYPES: TaxMovementTypeSeed[] = [
  {
    code: "TAX_ON_SALES",
    name: "Tax on Sales",
    description: "Tax arising from sales the business makes, including GST/VAT output tax and US sales/use-tax sales-side obligations.",
    taxFamilyCode: "INDIRECT_TAX",
    glAccountCode: "220000",
  },
  {
    code: "TAX_ON_PURCHASES",
    name: "Tax on Purchases",
    description: "Tax arising from purchases the business makes, usually recoverable input tax or purchase-side tax credits.",
    taxFamilyCode: "INDIRECT_TAX",
    glAccountCode: "120000",
  },
];

async function main() {
  const pool = getPool();
  const client = await pool.connect();
  const reset = process.argv.includes("--reset");

  try {
    console.log("Seeding Tax Control Accounts...");

    if (reset) {
      await client.query("DELETE FROM tax_control_account");
      console.log("Reset tax_control_account table.");
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
      INSERT INTO tax_control_account
        (company_id, code, ledger, name, description, tax_family_code, gl_account_id, status, creation_actor_type, updated_actor_type)
      VALUES ($1, $2, 'TAX', $3, $4, $5, $6, 'ACTIVE', 'SYSTEM', 'SYSTEM')
      ON CONFLICT (company_id, code) DO UPDATE
      SET ledger = EXCLUDED.ledger,
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          tax_family_code = EXCLUDED.tax_family_code,
          gl_account_id = EXCLUDED.gl_account_id,
          status = 'ACTIVE',
          updated_date = NOW(),
          updated_actor_type = 'SYSTEM'
    `;

    let count = 0;
    for (const company of companies.rows) {
      for (const movement of MOVEMENT_TYPES) {
        const glAccountId = gaByCompanyAndCode.get(`${company.id}:${movement.glAccountCode}`);
        if (!glAccountId) throw new Error(`Missing gl_account ${company.code}/${movement.glAccountCode} for tax control account ${movement.code}`);
        await client.query(sql, [
          company.id,
          movement.code,
          movement.name,
          movement.description,
          movement.taxFamilyCode,
          glAccountId,
        ]);
        console.log(`- ${company.code} ${movement.code}`);
        count++;
      }
    }

    await client.query("COMMIT");
    console.log(`Tax control accounts seeded (${count}).`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Tax control account seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
