
import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

const CURRENT_YEAR = new Date().getFullYear();
const START_YEAR = CURRENT_YEAR - 2;
const END_YEAR = CURRENT_YEAR + 5;

/**
 * NZ fiscal year: 1 Apr (year-1) – 31 Mar (year)
 * FY-2026 = 1 Apr 2025 – 31 Mar 2026
 */
function fyStartNZ(fy: number): string {
  return `${fy - 1}-04-01`;
}

function fyEndNZ(fy: number): string {
  return `${fy}-03-31`;
}

/**
 * Default (calendar year): 1 Jan – 31 Dec
 */
function fyStartDefault(fy: number): string {
  return `${fy}-01-01`;
}

function fyEndDefault(fy: number): string {
  return `${fy}-12-31`;
}

function fyStatus(year: number, isNZ: boolean): string {
  const today = new Date();
  const fyEnd = isNZ ? new Date(`${year}-03-31`) : new Date(`${year}-12-31`);
  if (fyEnd < today) return "INACTIVE";
  const fyStart = isNZ ? new Date(`${year - 1}-04-01`) : new Date(`${year}-01-01`);
  if (fyStart <= today) return "OPEN";
  return "PLANNED";
}

async function main() {
  const pool = getPool();
  const client = await pool.connect();

  const reset = process.argv.includes("--reset");

  try {
    console.log("Seeding Fiscal Years…");

    if (reset) {
      await client.query("SET session_replication_role = replica");
      await client.query("DELETE FROM fiscal_year");
      await client.query(`SELECT setval(pg_get_serial_sequence('fiscal_year', 'id'), 10000, false)`);
      await client.query("SET session_replication_role = DEFAULT");
      console.log("Reset fiscal_year — sequence reset.");
    }

    await client.query("BEGIN");

    // Fetch all companies with their country codes
    const companyRes = await client.query(
      `SELECT c.id, c.code, co.code AS country_code
       FROM company c
       LEFT JOIN country co ON co.code = c.country_code`
    );

    if (companyRes.rows.length === 0) {
      console.log("No companies found — skipping fiscal year seed.");
      await client.query("COMMIT");
      return;
    }

    const sql = `
      INSERT INTO fiscal_year (company_id, code, name, start_date, end_date, status, creation_date, creation_actor_type, updated_actor_type)
      VALUES ($1, $2, $3, $4, $5, $6, now(), 'SYSTEM', 'SYSTEM')
      ON CONFLICT (company_id, code) DO UPDATE
      SET name       = EXCLUDED.name,
          start_date = EXCLUDED.start_date,
          end_date   = EXCLUDED.end_date,
          status     = EXCLUDED.status,
          updated_date       = now(),
          updated_actor_type = 'SYSTEM'
    `;

    let total = 0;
    for (const company of companyRes.rows as Array<{ id: number; code: string; country_code: string }>) {
      const isNZ = company.country_code === "NZ";

      for (let year = START_YEAR; year <= END_YEAR; year++) {
        const code = `FY-${year}`;
        const name = `Financial Year ${year}`;
        const start = isNZ ? fyStartNZ(year) : fyStartDefault(year);
        const end   = isNZ ? fyEndNZ(year)   : fyEndDefault(year);
        const status = fyStatus(year, isNZ);

        await client.query(sql, [company.id, code, name, start, end, status]);
        console.log(`✔ ${company.code} ${code} (${start} – ${end}) [${status}]`);
        total++;
      }
    }

    await client.query("COMMIT");
    console.log(`Fiscal years seeded (${total}).`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Fiscal year seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();



