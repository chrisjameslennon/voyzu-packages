 
import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

const MONTH_CODES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function toDateStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Generates month periods from fyStart through fyEnd, one per calendar month. */
function monthPeriods(fyStart: string, fyEnd: string): Array<{ code: string; name: string; start: string; end: string }> {
  const start = new Date(fyStart + "T00:00:00");
  const end = new Date(fyEnd + "T00:00:00");
  const periods: Array<{ code: string; name: string; start: string; end: string }> = [];
  let cur = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cur <= end) {
    const mi = cur.getMonth();
    const y = cur.getFullYear();
    periods.push({
      code: MONTH_CODES[mi],
      name: MONTH_NAMES[mi],
      start: toDateStr(new Date(y, mi, 1)),
      end: toDateStr(new Date(y, mi + 1, 0)),
    });
    cur = new Date(y, mi + 1, 1);
  }
  return periods;
}

async function main() {
  const pool = getPool();
  const client = await pool.connect();

  const reset = process.argv.includes("--reset");

  try {
    console.log("Seeding Fiscal Periods…");

    if (reset) {
      await client.query("SET session_replication_role = replica");
      await client.query("DELETE FROM fiscal_period");
      await client.query(`SELECT setval(pg_get_serial_sequence('fiscal_period', 'id'), 10000, false)`);
      await client.query("SET session_replication_role = DEFAULT");
      console.log("Reset fiscal_period — sequence reset.");
    }

    await client.query("BEGIN");

    const companyRes = await client.query(`SELECT id, code FROM company ORDER BY code`);
    if (companyRes.rows.length === 0) {
      throw new Error("No companies found – run seed-company first");
    }

    const sql = `
      INSERT INTO fiscal_period (company_id, fiscal_year_id, code, name, start_date, end_date, status, creation_actor_type, updated_actor_type)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'SYSTEM', 'SYSTEM')
      ON CONFLICT (fiscal_year_id, code) DO UPDATE
      SET name       = EXCLUDED.name,
          start_date = EXCLUDED.start_date,
          end_date   = EXCLUDED.end_date,
          status     = EXCLUDED.status,
          updated_date = NOW(),
          updated_actor_type = 'SYSTEM'
    `;

    let count = 0;
    for (const company of companyRes.rows) {
      const companyId: number = company.id;

      const fyRes = await client.query(
        `SELECT id, code, status, start_date::text, end_date::text FROM fiscal_year WHERE company_id = $1 ORDER BY code`,
        [companyId]
      );

      for (const fy of fyRes.rows) {
        // Periods only exist for OPEN and CLOSED years.
        // INACTIVE/PLANNED years have no periods yet (created automatically when the year is opened).
        if (fy.status !== "OPEN" && fy.status !== "CLOSED") {
          continue;
        }

          const periodStatus = fy.status;
        const periods = monthPeriods(fy.start_date, fy.end_date);

        for (const p of periods) {
          await client.query(sql, [companyId, fy.id, p.code, p.name, p.start, p.end, periodStatus]);
          count++;
        }
        console.log(`✔ ${company.code} ${fy.code} → ${periods.length} periods [${periodStatus}]`);
      }
    }

    await client.query("COMMIT");
    console.log(`Fiscal periods seeded (${count}).`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Fiscal period seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();



