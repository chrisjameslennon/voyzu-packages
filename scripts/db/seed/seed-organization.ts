import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

async function main() {
  const pool = getPool();
  const client = await pool.connect();
  const reset = process.argv.includes("--reset");

  try {
    console.log("Seeding Organization...");

    if (reset) {
      await client.query("SET session_replication_role = replica");
      await client.query("DELETE FROM organization");
      await client.query(`SELECT setval(pg_get_serial_sequence('organization', 'id'), 10000, false)`);
      await client.query("SET session_replication_role = DEFAULT");
      console.log("Reset organization — sequence reset.");
    }

    await client.query(`
      INSERT INTO organization (code, organization_name, creation_actor_type, updated_actor_type)
      VALUES ('ORG-MAIN', 'Default Organization', 'SYSTEM', 'SYSTEM')
      ON CONFLICT (code) DO UPDATE
      SET organization_name = EXCLUDED.organization_name,
          updated_date = NOW(),
          updated_actor_type = 'SYSTEM'
    `);
    console.log("✔ Organization seeded");
  } catch (err) {
    console.error("Organization seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();



