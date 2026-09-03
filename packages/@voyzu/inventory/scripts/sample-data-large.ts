import { getDb } from "@voyzu/capability/db";

import { listInventoryConfiguration } from "../modules/configuration/commands";
import {
  createInventoryItem,
  listInventoryItems,
} from "../modules/items/commands";
import {
  listInventoryStock,
  receiveInventoryStock,
} from "../modules/stock/commands";
import { sampleData } from "./sample-data";

const ITEM_COUNT = 100;

type Organization = { id: number; code: string; name: string };

async function organizations(code?: string): Promise<Organization[]> {
  const result = await getDb().query<Organization>(
    `SELECT id::int, code, name
       FROM organization
      WHERE status = 'ACTIVE'
        AND ($1::text IS NULL OR code = upper($1))
      ORDER BY code`,
    [code?.trim() || null],
  );
  return result.rows;
}

async function seedLargeOrganization(
  organization: Organization,
): Promise<void> {
  const categories = (
    await listInventoryConfiguration(organization.id, "category")
  ).filter((category) => category.status === "ACTIVE");
  const warehouses = (
    await listInventoryConfiguration(organization.id, "warehouse")
  ).filter(
    (warehouse) => warehouse.status === "ACTIVE" && warehouse.code,
  );
  if (!categories.length || !warehouses.length) {
    throw new Error(
      `Inventory categories and warehouses are required for ${organization.code}.`,
    );
  }

  const existingItems = new Map(
    (await listInventoryItems(organization.id)).map((item) => [item.sku, item]),
  );
  const largeItems: { id: number; sku: string }[] = [];

  for (let index = 1; index <= ITEM_COUNT; index += 1) {
    const suffix = String(index).padStart(3, "0");
    const sku = `LARGE-ITEM-${suffix}`;
    const existing = existingItems.get(sku);
    if (existing) {
      largeItems.push({ id: existing.id, sku });
      continue;
    }
    const category = categories[(index - 1) % categories.length]!;
    const created = await createInventoryItem(organization.id, {
      sku,
      name: `Large Sample Item ${suffix}`,
      categoryId: category.id,
      unit: "each",
      quantityTracked: true,
    });
    largeItems.push({ id: created.id, sku });
  }

  const positions = await listInventoryStock(organization.id);
  const onHandByPosition = new Map(
    positions.map((position) => [
      `${position.itemId}:${position.warehouseId}`,
      position.onHand,
    ]),
  );
  const receiptDate = new Date().toISOString();

  for (const [warehouseIndex, warehouse] of warehouses.entries()) {
    const lines = largeItems.flatMap((item, itemIndex) => {
      const targetQuantity =
        25 + ((itemIndex * 17 + warehouseIndex * 29) % 176);
      const currentQuantity =
        onHandByPosition.get(`${item.id}:${warehouse.id}`) ?? 0;
      const quantity = targetQuantity - currentQuantity;
      return quantity > 0 ? [{ itemId: item.id, quantity, reasonCode: "OPENING_STOCK" as const }] : [];
    });
    if (!lines.length) continue;
    await receiveInventoryStock(organization.id, {
      date: receiptDate,
      warehouseId: warehouse.id,
      reference: "SAMPLE-DATA-LARGE",
      lines,
    });
  }

  console.log(
    `Inventory large sample data ready for ${organization.code} (${organization.name}): ${largeItems.length} items stocked in each of ${warehouses.length} warehouses.`,
  );
}

/**
 * Adds a repeatable large Inventory dataset. Pass an organization code to
 * target one organization; without one, all active organizations are seeded.
 */
export async function sampleDataLarge(): Promise<void> {
  const organizationCode = process.argv[2];
  await sampleData(organizationCode);
  const targets = await organizations(organizationCode);
  for (const organization of targets) await seedLargeOrganization(organization);
}

export default sampleDataLarge;
