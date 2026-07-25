import { config } from "dotenv";

const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

type DimensionSeed = {
  code: string;
  name: string;
  status?: "ACTIVE" | "INACTIVE";
  values?: Array<{
    code: string;
    name: string;
    status: "ACTIVE" | "INACTIVE";
    sortOrder: number;
  }>;
};

const DIMENSIONS: DimensionSeed[] = [
  { code: "DEPARTMENT", name: "Department" },
  { code: "COST_CENTRE", name: "Cost Centre" },
  { code: "PROJECT", name: "Project" },
  { code: "PRODUCT_RANGE", name: "Product Range" },
  {
    code: "SALES_CHANNEL",
    name: "Sales Channel",
    status: "ACTIVE",
    values: [
      { code: "DIRECT", name: "Direct", status: "ACTIVE", sortOrder: 10 },
      { code: "ONLINE", name: "Online", status: "ACTIVE", sortOrder: 20 },
      { code: "WHOLESALE", name: "Wholesale", status: "ACTIVE", sortOrder: 30 },
      { code: "RETAIL", name: "Retail", status: "ACTIVE", sortOrder: 40 },
      { code: "MARKETPLACE", name: "Marketplace", status: "ACTIVE", sortOrder: 50 },
      { code: "PARTNER", name: "Partner", status: "ACTIVE", sortOrder: 60 },
    ],
  },
];

async function main() {
  const pool = getPool();
  const client = await pool.connect();
  const reset = process.argv.includes("--reset");

  try {
    console.log("Seeding Dimensions...");

    if (reset) {
      await client.query("SET session_replication_role = replica");
      await client.query("DELETE FROM dimension_value");
      await client.query("DELETE FROM dimension");
      await client.query(`SELECT setval(pg_get_serial_sequence('dimension_value', 'id'), 10000, false)`);
      await client.query(`SELECT setval(pg_get_serial_sequence('dimension', 'id'), 10000, false)`);
      await client.query("SET session_replication_role = DEFAULT");
      console.log("Reset dimension tables and sequences.");
    }

    await client.query("BEGIN");

    const companies = await client.query<{ id: number; code: string }>(
      `SELECT id, code FROM company WHERE is_template = true ORDER BY code`,
    );
    if (!companies.rows.length) throw new Error("No companies found. Run seed-company.ts first.");

    const valueSql = `
      INSERT INTO dimension_value (company_id, dimension_id, name, status, creation_actor_type, updated_actor_type)
      VALUES ($1, $2, $3, $4, 'SYSTEM', 'SYSTEM')
      ON CONFLICT (company_id, dimension_id, lower(name)) DO UPDATE
      SET status = EXCLUDED.status,
          updated_date = NOW(),
          updated_actor_type = 'SYSTEM'
    `;

    let count = 0;
    let valueCount = 0;
    for (const company of companies.rows) {
      for (const d of DIMENSIONS) {
        const result = await client.query<{ id: number }>(
          `INSERT INTO dimension (company_id, code, name, status, creation_actor_type, updated_actor_type) VALUES ($1, $2, $3, $4, 'SYSTEM', 'SYSTEM')
           ON CONFLICT (company_id, code) DO UPDATE
           SET name = EXCLUDED.name,
               status = EXCLUDED.status,
               updated_date = NOW(),
               updated_actor_type = 'SYSTEM'
           RETURNING id`,
          [company.id, d.code, d.name, d.status ?? "ACTIVE"],
        );
        console.log(`${company.code} ${d.code} - ${d.name}`);
        count++;

        if (d.values?.length) {
          const dimId = result.rows[0].id;
          for (const v of [...d.values].sort((a, b) => a.sortOrder - b.sortOrder)) {
            await client.query(valueSql, [company.id, dimId, v.name, v.status]);
            console.log(`   ${v.code} - ${v.name}`);
            valueCount++;
          }
        }
      }
    }

    await client.query("COMMIT");
    console.log(`Dimensions seeded (${count}), values seeded (${valueCount}).`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Dimension seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
