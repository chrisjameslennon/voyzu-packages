import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { getPool } from "@voyzu/capability/db";

import { financeInstall } from "../../install/manifest";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

function packageFile(declaredPath: string): string {
  return resolve(packageRoot, declaredPath);
}

async function coreTableNames(): Promise<string[]> {
  const names: string[] = [];
  const pattern = /CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+([a-z_][a-z0-9_]*)/giu;

  for (const declaredPath of financeInstall.sql) {
    const sql = await readFile(packageFile(declaredPath), "utf8");
    for (const match of sql.matchAll(pattern)) names.push(match[1]);
  }

  return [...new Set(names)];
}

/** Destructively recreate Core-owned tables and restore Core seed data. */
export async function purgeAndRecreate(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const tableNames = await coreTableNames();
    for (const tableName of tableNames.reverse()) {
      await client.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE`);
      console.log(`dropped ${tableName}`);
    }

    for (const declaredPath of [...financeInstall.sql, ...financeInstall.seedSql]) {
      const sql = await readFile(packageFile(declaredPath), "utf8");
      await client.query(sql);
      console.log(`executed ${declaredPath}`);
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

export default purgeAndRecreate;
