import { getDb } from "@voyzu/capability/db";

import {
  createInventoryConfiguration,
  listInventoryConfiguration,
} from "../modules/configuration/operations";
import {
  createInventoryItem,
  listInventoryItems,
  patchInventoryItem,
} from "../modules/items/operations";
import {
  listInventoryStock,
  receiveInventoryStock,
} from "../modules/stock/operations";

const categories = [
  {
    code: "RAW",
    name: "Raw Materials",
    description: "Materials consumed when producing or assembling goods.",
  },
  {
    code: "FINISHED",
    name: "Finished Goods",
    description: "Completed products ready for sale or distribution.",
  },
  {
    code: "PACKAGING",
    name: "Packaging",
    description: "Boxes, labels, and other packing materials.",
  },
] as const;

const warehouses = [
  {
    code: "MAIN",
    name: "Main Warehouse",
    city: "Auckland",
    countryCode: "NZ",
  },
  {
    code: "SOUTH",
    name: "South Island Warehouse",
    city: "Christchurch",
    countryCode: "NZ",
  },
  {
    code: "RETURNS",
    name: "Returns Warehouse",
    city: "Auckland",
    countryCode: "NZ",
  },
] as const;

const items = [
  {
    sku: "SAMPLE-BEANS",
    name: "Premium Coffee Beans",
    categoryCode: "RAW",
    unit: "kg" as const,
  },
  {
    sku: "SAMPLE-MUG",
    name: "Ceramic Coffee Mug",
    categoryCode: "FINISHED",
    unit: "each" as const,
  },
  {
    sku: "SAMPLE-BOX",
    name: "Gift Shipping Box",
    categoryCode: "PACKAGING",
    unit: "box" as const,
  },
  {
    sku: "SAMPLE-GIFT-SET",
    name: "Coffee Gift Set",
    categoryCode: "FINISHED",
    unit: "each" as const,
  },
] as const;

const stockTargets = [
  { sku: "SAMPLE-BEANS", warehouseCode: "MAIN", quantity: 80 },
  { sku: "SAMPLE-BEANS", warehouseCode: "SOUTH", quantity: 35 },
  { sku: "SAMPLE-MUG", warehouseCode: "MAIN", quantity: 120 },
  { sku: "SAMPLE-MUG", warehouseCode: "SOUTH", quantity: 40 },
  { sku: "SAMPLE-BOX", warehouseCode: "MAIN", quantity: 200 },
  { sku: "SAMPLE-GIFT-SET", warehouseCode: "MAIN", quantity: 24 },
  {
    sku: "SAMPLE-GIFT-SET",
    warehouseCode: "RETURNS",
    quantity: 2,
  },
] as const;

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

async function seedOrganization(organization: Organization): Promise<void> {
  const categoryRows = await listInventoryConfiguration(
    organization.id,
    "category",
  );
  const categoryIds = new Map(
    categoryRows.filter(({ code }) => code).map(({ code, id }) => [code!, id]),
  );
  for (const category of categories) {
    if (categoryIds.has(category.code)) continue;
    const created = await createInventoryConfiguration(
      organization.id,
      "category",
      category,
    );
    categoryIds.set(category.code, created.id);
  }

  const warehouseRows = await listInventoryConfiguration(
    organization.id,
    "warehouse",
  );
  const warehouseIds = new Map(
    warehouseRows.filter(({ code }) => code).map(({ code, id }) => [code!, id]),
  );
  for (const warehouse of warehouses) {
    if (warehouseIds.has(warehouse.code)) continue;
    const created = await createInventoryConfiguration(
      organization.id,
      "warehouse",
      warehouse,
    );
    warehouseIds.set(warehouse.code, created.id);
  }

  const existingItems = new Map(
    (await listInventoryItems(organization.id)).map((item) => [item.sku, item]),
  );
  const itemIds = new Map<string, number>();
  for (const item of items) {
    const categoryId = categoryIds.get(item.categoryCode)!;
    const existing = existingItems.get(item.sku);
    if (existing) {
      const changed = await patchInventoryItem(organization.id, item.sku, {
        name: item.name,
        categoryId,
        unit: item.unit,
        quantityTracked: true,
      });
      itemIds.set(item.sku, changed.id);
      continue;
    }
    const created = await createInventoryItem(organization.id, {
      sku: item.sku,
      name: item.name,
      categoryId,
      unit: item.unit,
      quantityTracked: true,
    });
    itemIds.set(item.sku, created.id);
  }

  await patchInventoryItem(organization.id, "SAMPLE-GIFT-SET", {
    itemType: "ASSEMBLY",
    components: [
      { itemId: itemIds.get("SAMPLE-BEANS")!, quantity: 0.5 },
      { itemId: itemIds.get("SAMPLE-MUG")!, quantity: 1 },
      { itemId: itemIds.get("SAMPLE-BOX")!, quantity: 1 },
    ],
  });

  const positions = await listInventoryStock(organization.id);
  const current = new Map(
    positions.map((position) => [
      `${position.itemId}:${position.warehouseId}`,
      position.onHand,
    ]),
  );
  const receiptDate = new Date().toISOString();
  for (const target of stockTargets) {
    const itemId = itemIds.get(target.sku)!;
    const warehouseId = warehouseIds.get(target.warehouseCode)!;
    const onHand = current.get(`${itemId}:${warehouseId}`) ?? 0;
    const quantity = target.quantity - onHand;
    if (quantity <= 0) continue;
    await receiveInventoryStock(organization.id, {
      date: receiptDate,
      warehouseId,
      reference: "SAMPLE-DATA",
      notes: "Inventory package sample data",
      lines: [{ itemId, quantity }],
    });
  }

  console.log(
    `Inventory sample data ready for ${organization.code} (${organization.name}): ${categories.length} categories, ${warehouses.length} warehouses, ${items.length} items.`,
  );
}

/**
 * Creates repeatable Inventory demonstration data.
 * Pass an organization code to target one organization; without one, all active
 * organizations are seeded.
 */
export async function sampleData(organizationCode?: string): Promise<void> {
  const targets = await organizations(organizationCode);
  if (!targets.length) {
    throw new Error(
      organizationCode
        ? `Active organization ${organizationCode.toUpperCase()} was not found.`
        : "No active organizations are available for Inventory sample data.",
    );
  }
  for (const organization of targets) await seedOrganization(organization);
}

export default sampleData;
