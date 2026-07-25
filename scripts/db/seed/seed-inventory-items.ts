import { config } from "dotenv";
const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";

type InventoryItemSeed = {
  code: string;
  name: string;
  description: string;
  itemType: "INVENTORY" | "NON_INVENTORY" | "SERVICE";
  categoryCode: string;
  unitCode: string;
  status: "ACTIVE" | "INACTIVE";
  quantityOnHand: number | null;
  bookValue: number | null;
  avgUnitBookValue: number | null;
};

export const SEED_ITEMS: InventoryItemSeed[] = [
  { code: "NON-FREIGHT", name: "Freight and Courier Charges", description: "Freight and courier charges purchased without inventory tracking", itemType: "NON_INVENTORY", categoryCode: "FREIGHT_AND_COURIER", unitCode: "service", status: "ACTIVE", quantityOnHand: null, bookValue: null, avgUnitBookValue: null },
  { code: "NON-OFFICE", name: "Office Supplies", description: "Office supplies purchased and expensed without inventory tracking", itemType: "NON_INVENTORY", categoryCode: "NON_INVENTORY", unitCode: "ea", status: "ACTIVE", quantityOnHand: null, bookValue: null, avgUnitBookValue: null },
  { code: "NON-GENERAL", name: "General Non-inventory Purchase", description: "General goods and charges purchased and expensed without inventory tracking", itemType: "NON_INVENTORY", categoryCode: "NON_INVENTORY", unitCode: "ea", status: "ACTIVE", quantityOnHand: null, bookValue: null, avgUnitBookValue: null },
  { code: "SVC-GENERAL", name: "General Services", description: "General non-stock services sold or purchased", itemType: "SERVICE", categoryCode: "SERVICES", unitCode: "service", status: "ACTIVE", quantityOnHand: null, bookValue: null, avgUnitBookValue: null },
  { code: "SVC-LABOUR", name: "Labour Services", description: "Labour services sold or purchased", itemType: "SERVICE", categoryCode: "SERVICES", unitCode: "hour", status: "ACTIVE", quantityOnHand: null, bookValue: null, avgUnitBookValue: null },
];

export async function seedInventoryItems(items: InventoryItemSeed[], reset = false) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    if (reset) {
      await client.query("DELETE FROM inventory_item");
      console.log("Reset inventory_item table.");
    }

    await client.query("BEGIN");
    const companies = await client.query<{ id: number; code: string }>(
      `SELECT id, code
       FROM company
       WHERE is_template = true
       ORDER BY code`,
    );
    if (!companies.rows.length) throw new Error("No companies found. Run seed-company.ts first.");

    const categories = await client.query<{ company_id: number; id: number; code: string }>("SELECT company_id, id, code FROM inventory_category");
    const categoryByCompanyAndCode = new Map(categories.rows.map((row) => [`${row.company_id}:${row.code}`, row.id]));

    const sql = `
      INSERT INTO inventory_item (
        company_id, code, name, description, item_type, category_id, unit_code,
        status, quantity_on_hand_derived, book_value_derived, avg_unit_book_value_derived,
        creation_actor_type, updated_actor_type
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'SYSTEM', 'SYSTEM')
      ON CONFLICT (company_id, code) DO UPDATE
      SET name = EXCLUDED.name,
          description = EXCLUDED.description,
          item_type = EXCLUDED.item_type,
          category_id = EXCLUDED.category_id,
          unit_code = EXCLUDED.unit_code,
          status = EXCLUDED.status,
          quantity_on_hand_derived = EXCLUDED.quantity_on_hand_derived,
          book_value_derived = EXCLUDED.book_value_derived,
          avg_unit_book_value_derived = EXCLUDED.avg_unit_book_value_derived,
          updated_date = NOW(),
          updated_actor_type = 'SYSTEM'
    `;

    let count = 0;
    for (const company of companies.rows) {
      for (const item of items) {
        const categoryId = categoryByCompanyAndCode.get(`${company.id}:${item.categoryCode}`);
        if (!categoryId) throw new Error(`Missing inventory_category.code=${company.code}/${item.categoryCode}`);

        await client.query(sql, [
          company.id,
          item.code,
          item.name,
          item.description,
          item.itemType,
          categoryId,
          item.unitCode,
          item.status,
          item.quantityOnHand,
          item.bookValue,
          item.avgUnitBookValue,
        ]);
        console.log(`- ${company.code} ${item.code} - ${item.name}`);
        count++;
      }
    }

    await client.query("COMMIT");
    console.log(`Inventory items seeded (${count}).`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Inventory item seed failed:", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

async function main() {
  console.log("Seeding Inventory Items...");
  await seedInventoryItems(SEED_ITEMS, process.argv.includes("--reset"));
}

if (process.argv[1]?.endsWith("seed-inventory-items.ts")) {
  void main();
}
