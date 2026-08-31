import { getDb } from "@voyzu/capability/db";

import {
  addInventoryOptionValue,
  createInventoryConfiguration,
  getInventoryConfiguration,
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
  reserveInventoryStock,
} from "../modules/stock/operations";

const categories = [
  {
    code: "INV-RAW",
    name: "Raw Materials",
    description: "Materials consumed when producing or assembling goods.",
  },
  {
    code: "INV-FINISHED",
    name: "Finished Goods",
    description: "Completed products ready for sale or distribution.",
  },
  {
    code: "INV-PACKAGING",
    name: "Packaging",
    description: "Boxes, labels, and other packing materials.",
  },
] as const;

const warehouses = [
  {
    code: "INV-MAIN",
    name: "Main Warehouse",
    city: "Auckland",
    countryCode: "NZ",
  },
  {
    code: "INV-SOUTH",
    name: "South Island Warehouse",
    city: "Christchurch",
    countryCode: "NZ",
  },
  {
    code: "INV-RETURNS",
    name: "Returns Warehouse",
    city: "Auckland",
    countryCode: "NZ",
  },
] as const;

const customOptionLists = [
  {
    name: "Quality Inspection",
    description: "Quality inspection outcomes for inventory items.",
    values: ["Passed", "Failed", "Pending"],
  },
  {
    name: "Size",
    description: "Standard clothing and product sizes.",
    values: ["XS", "S", "M", "L", "XL", "XXL"],
  },
] as const;

const items = [
  {
    sku: "SAMPLE-BEANS",
    name: "Premium Coffee Beans",
    categoryCode: "INV-RAW",
    unit: "kg" as const,
  },
  {
    sku: "SAMPLE-MUG",
    name: "Ceramic Coffee Mug",
    categoryCode: "INV-FINISHED",
    unit: "each" as const,
  },
  {
    sku: "SAMPLE-BOX",
    name: "Gift Shipping Box",
    categoryCode: "INV-PACKAGING",
    unit: "box" as const,
  },
  {
    sku: "SAMPLE-GIFT-SET",
    name: "Coffee Gift Set",
    categoryCode: "INV-FINISHED",
    unit: "each" as const,
  },
] as const;

const stockTargets = [
  { sku: "SAMPLE-BEANS", warehouseCode: "INV-MAIN", quantity: 80 },
  { sku: "SAMPLE-BEANS", warehouseCode: "INV-SOUTH", quantity: 35 },
  { sku: "SAMPLE-MUG", warehouseCode: "INV-MAIN", quantity: 120 },
  { sku: "SAMPLE-MUG", warehouseCode: "INV-SOUTH", quantity: 40 },
  { sku: "SAMPLE-BOX", warehouseCode: "INV-MAIN", quantity: 200 },
  { sku: "SAMPLE-GIFT-SET", warehouseCode: "INV-MAIN", quantity: 24 },
  {
    sku: "SAMPLE-GIFT-SET",
    warehouseCode: "INV-RETURNS",
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

  const optionListRows = await listInventoryConfiguration(
    organization.id,
    "option-list",
  );
  const optionListIds = new Map(
    optionListRows.map(({ name, id }) => [name, id]),
  );
  for (const optionList of customOptionLists) {
    let optionListId = optionListIds.get(optionList.name);
    if (!optionListId) {
      const created = await createInventoryConfiguration(
        organization.id,
        "option-list",
        {
          name: optionList.name,
          description: optionList.description,
          isShared: true,
        },
      );
      optionListId = created.id;
      optionListIds.set(optionList.name, optionListId);
    }
    const detail = await getInventoryConfiguration(
      organization.id,
      "option-list",
      optionListId,
    );
    const existingValues = new Set(detail?.options.map(({ value }) => value));
    for (const value of optionList.values) {
      if (existingValues.has(value)) continue;
      await addInventoryOptionValue(organization.id, optionListId, { value });
    }
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
        itemType: "SINGLE_ITEM",
        components: [],
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
      { itemId: itemIds.get("SAMPLE-BEANS")!, quantity: 1 },
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
      lines: [{ itemId, quantity }],
    });
  }

  const existingReservation = await getDb().query(
    `SELECT 1
       FROM inventory_reservation
      WHERE organization_id = $1
        AND reference = 'SAMPLE-RESERVATION'
      LIMIT 1`,
    [organization.id],
  );
  if (!existingReservation.rows.length) {
    await reserveInventoryStock(organization.id, {
      itemId: itemIds.get("SAMPLE-BEANS")!,
      reference: "SAMPLE-RESERVATION",
      lines: [
        { warehouseId: warehouseIds.get("INV-MAIN")!, quantity: 5 },
        { warehouseId: warehouseIds.get("INV-SOUTH")!, quantity: 3 },
      ],
    });
  }

  console.log(
    `Inventory sample data ready for ${organization.code} (${organization.name}): ${categories.length} categories, ${warehouses.length} warehouses, ${customOptionLists.length} custom option lists, ${items.length} items.`,
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
