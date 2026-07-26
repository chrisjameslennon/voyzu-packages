import { config } from "dotenv";

const envFile = process.argv.includes("--production") ? ".env.production" : ".env.local";
config({ path: `apps/web/${envFile}` });

import { getPool } from "@voyzu/capability/db";
import { getCompany } from "../../../packages/@voyzu-modules/core/modules/companies/server/lib/company.service";
import {
  createInventoryItem,
  getInventoryItem,
} from "../../../packages/@voyzu-modules/core/modules/common/inventory-items/server/lib/inventory-item.service";
import type { InventoryItemCreateRequestDto } from "@voyzu-modules/core/types/modules/inventory-items";

const COMPANY_CODE = "SAMP-NZ";

const ITEMS: InventoryItemCreateRequestDto[] = [
  {
    item_code: "SKU-WID-001",
    item_name: "Standard Widget",
    description: "Standard inventory item purchased for resale",
    item_type: "INVENTORY",
    category_code: "RESALE_GOODS",
    unit_code: "ea",
    quantity_on_hand_derived: null,
    book_value_derived: null,
    avg_unit_book_value_derived: null,
  },
  {
    item_code: "SKU-SPR-001",
    item_name: "Replacement Gear Set",
    description: "Replacement parts held for maintenance and repair",
    item_type: "INVENTORY",
    category_code: "SPARE_PARTS",
    unit_code: "ea",
    quantity_on_hand_derived: null,
    book_value_derived: null,
    avg_unit_book_value_derived: null,
  },
];

async function main(): Promise<void> {
  const company = await getCompany(COMPANY_CODE);
  if (!company) throw new Error(`Sample company ${COMPANY_CODE} was not found`);

  for (const item of ITEMS) {
    const existing = await getInventoryItem(item.item_code, company.id);
    if (existing) {
      console.log(`sample inventory item ${item.item_code} already exists, skipping`);
      continue;
    }

    await createInventoryItem(item, company.id);
    console.log(`created sample inventory item ${item.item_code} for ${COMPANY_CODE}`);
  }

  await getPool().end();
}

main().catch(async (error) => {
  console.error("Sample inventory item creation failed:", error);
  await getPool().end();
  process.exitCode = 1;
});
