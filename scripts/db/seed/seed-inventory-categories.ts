import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

type InventoryCategorySeed = {
  code: string;
  name: string;
  description: string;
  postingProfileCode: string;
  status: "ACTIVE" | "INACTIVE";
};

const CATEGORIES: InventoryCategorySeed[] = [
  { code: "RESALE_GOODS", name: "Resale Goods", description: "Finished goods purchased from suppliers for resale", postingProfileCode: "RESALE_GOODS", status: "ACTIVE" },
  { code: "FINISHED_GOODS", name: "Finished Goods", description: "Manufactured or assembled products held for sale", postingProfileCode: "FINISHED_GOODS", status: "ACTIVE" },
  { code: "RAW_MATERIALS", name: "Raw Materials", description: "Materials consumed during manufacturing or production", postingProfileCode: "RAW_MATERIALS", status: "ACTIVE" },
  { code: "COMPONENTS", name: "Components", description: "Purchased parts used in assemblies or production", postingProfileCode: "RAW_MATERIALS", status: "ACTIVE" },
  { code: "WORK_IN_PROGRESS", name: "Work in Progress", description: "Part-complete products awaiting further processing", postingProfileCode: "WIP_GOODS", status: "ACTIVE" },
  { code: "PACKAGING", name: "Packaging", description: "Packaging and fulfilment materials", postingProfileCode: "PACKAGING", status: "ACTIVE" },
  { code: "CONSUMABLES", name: "Consumables", description: "Low-value stock consumed during normal operations", postingProfileCode: "CONSUMABLES", status: "ACTIVE" },
  { code: "SPARE_PARTS", name: "Spare Parts", description: "Parts held for maintenance repair or replacement", postingProfileCode: "SPARE_PARTS", status: "ACTIVE" },
  { code: "NON_INVENTORY", name: "Non-inventory Purchases", description: "Goods and charges that are expensed without stock tracking", postingProfileCode: "NON_INVENTORY_PURCHASES", status: "ACTIVE" },
  { code: "FREIGHT_AND_COURIER", name: "Freight and Courier", description: "Carrier freight courier and shipping costs", postingProfileCode: "FREIGHT_COSTS", status: "ACTIVE" },
  { code: "SERVICES", name: "Services", description: "Time-based fixed-fee or other non-stock services", postingProfileCode: "SERVICES", status: "ACTIVE" },
];

async function main() {
  const pool = getPool();
  const client = await pool.connect();
  const reset = process.argv.includes("--reset");

  try {
    console.log("Seeding Inventory Categories...");
    if (reset) {
      await client.query("DELETE FROM inventory_category");
      console.log("Reset inventory_category table.");
    }

    await client.query("BEGIN");
    const companies = await client.query<{ id: number; code: string }>(
      `SELECT id, code FROM company WHERE is_template = true ORDER BY code`,
    );
    if (!companies.rows.length) throw new Error("No companies found. Run seed-company.ts first.");

    const profiles = await client.query<{ company_id: number; id: number; code: string }>("SELECT company_id, id, code FROM item_posting_profile");
    const profileByCompanyAndCode = new Map(profiles.rows.map((row) => [`${row.company_id}:${row.code}`, row.id]));

    const sql = `
      INSERT INTO inventory_category (company_id, code, name, description, posting_profile_id, status, creation_actor_type, updated_actor_type)
      VALUES ($1, $2, $3, $4, $5, $6, 'SYSTEM', 'SYSTEM')
      ON CONFLICT (company_id, code) DO UPDATE
      SET name = EXCLUDED.name,
          description = EXCLUDED.description,
          posting_profile_id = EXCLUDED.posting_profile_id,
          status = EXCLUDED.status,
          updated_date = NOW(),
          updated_actor_type = 'SYSTEM'
    `;

    let count = 0;
    for (const company of companies.rows) {
      for (const category of CATEGORIES) {
        const profileId = profileByCompanyAndCode.get(`${company.id}:${category.postingProfileCode}`);
        if (!profileId) throw new Error(`Missing item_posting_profile.code=${company.code}/${category.postingProfileCode}`);
        await client.query(sql, [company.id, category.code, category.name, category.description, profileId, category.status]);
        console.log(`- ${company.code} ${category.code} - ${category.name}`);
        count++;
      }
    }

    await client.query("COMMIT");
    console.log(`Inventory categories seeded (${count}).`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Inventory category seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
