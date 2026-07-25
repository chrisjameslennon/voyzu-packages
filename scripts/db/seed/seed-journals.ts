import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

async function main() {
  const pool = getPool();
  const client = await pool.connect();
  const reset = process.argv.includes("--reset");

  try {
    console.log("Seeding Journals…");

    if (reset) {
      await client.query("SET session_replication_role = replica");
      await client.query("DELETE FROM journal_line");
      await client.query(`SELECT setval(pg_get_serial_sequence('journal_line', 'id'), 10000, false)`);
      await client.query("DELETE FROM journal_header");
      await client.query(`SELECT setval(pg_get_serial_sequence('journal_header', 'id'), 10000, false)`);
      await client.query("SET session_replication_role = DEFAULT");
      console.log("Reset journal_line and journal_header sequences.");
    }

    console.log("Done. (no entries seeded)");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => { console.error(err); process.exit(1); });



