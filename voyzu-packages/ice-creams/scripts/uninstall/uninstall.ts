import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { withTransaction } from "@voyzu/capability/db";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const scripts = [
  "remove-ice-cream-audit.sql",
  "drop-ice-cream.sql",
  "drop-ice-cream-flavor.sql",
] as const;

/**
 * Explicit destructive package removal. The platform installer must require a
 * separate confirmation before calling this function.
 */
export async function uninstall(): Promise<void> {
  await withTransaction(async (db) => {
    for (const filename of scripts) {
      await db.query(await readFile(join(scriptDirectory, "sql", filename), "utf8"));
    }
  });
}

export default uninstall;
