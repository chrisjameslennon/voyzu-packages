import { getDb } from "@voyzu/capability/db";

import {
  addInventoryOptionValue,
  createInventoryConfiguration,
  deleteInventoryOptionValue,
  getInventoryConfiguration,
  listInventoryConfiguration,
  patchInventoryConfiguration,
  patchInventoryOptionValue,
  transitionInventoryConfiguration,
} from "../modules/configuration/commands";
import {
  createInventoryItem,
  listInventoryItems,
  patchInventoryItem,
} from "../modules/items/commands";
import {
  listInventoryStock,
  receiveInventoryStock,
  reserveInventoryStock,
} from "../modules/stock/commands";

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

type SampleOptionList = {
  name: string;
  legacyNames: readonly string[];
  description: string;
  values: readonly { value: string; legacyValues: readonly string[] }[];
};

const customOptionLists: readonly SampleOptionList[] = [
  {
    name: "Quality Inspection Result",
    legacyNames: ["Quality Inspection"],
    description: "Quality inspection outcomes for inventory items.",
    values: [
      { value: "Pass", legacyValues: ["Passed"] },
      { value: "Fail", legacyValues: ["Failed"] },
      { value: "Pending", legacyValues: [] },
    ],
  },
  {
    name: "Size",
    legacyNames: [],
    description: "Standard clothing and product sizes.",
    values: ["XS", "S", "M", "L", "XL"].map((value) => ({
      value,
      legacyValues: [],
    })),
  },
] as const;

const customFields: readonly {
  name: string;
  legacyNames: readonly string[];
  optionListName: string;
}[] = [
  {
    name: "Quality Inspection Result",
    legacyNames: ["Quality Inspection"],
    optionListName: "Quality Inspection Result",
  },
  {
    name: "Size",
    legacyNames: [],
    optionListName: "Size",
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

async function sampleOrganization(): Promise<Organization> {
  const result = await getDb().query<Organization>(
    `SELECT id::int, code, name
       FROM organization
      WHERE status = 'ACTIVE'
        AND code = 'TESTCO'`,
  );
  const organization = result.rows[0];
  if (!organization) {
    throw new Error(
      "Active organization TESTCO was not found. Run @voyzu/erp-core:sampleData first.",
    );
  }
  return organization;
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
    const existing = categoryRows.find(({ code }) => code === category.code);
    if (existing) {
      await patchInventoryConfiguration(organization.id, "category", existing.id, category);
      if (existing.status !== "ACTIVE") {
        await transitionInventoryConfiguration(organization.id, "category", [existing.id], "ACTIVE");
      }
      categoryIds.set(category.code, existing.id);
    } else {
      const created = await createInventoryConfiguration(
        organization.id,
        "category",
        category,
      );
      categoryIds.set(category.code, created.id);
    }
  }

  const warehouseRows = await listInventoryConfiguration(
    organization.id,
    "warehouse",
  );
  const warehouseIds = new Map(
    warehouseRows.filter(({ code }) => code).map(({ code, id }) => [code!, id]),
  );
  for (const warehouse of warehouses) {
    const existing = warehouseRows.find(({ code }) => code === warehouse.code);
    if (existing) {
      await patchInventoryConfiguration(organization.id, "warehouse", existing.id, warehouse);
      if (existing.status !== "ACTIVE") {
        await transitionInventoryConfiguration(organization.id, "warehouse", [existing.id], "ACTIVE");
      }
      warehouseIds.set(warehouse.code, existing.id);
    } else {
      const created = await createInventoryConfiguration(
        organization.id,
        "warehouse",
        warehouse,
      );
      warehouseIds.set(warehouse.code, created.id);
    }
  }

  const optionListRows = await listInventoryConfiguration(
    organization.id,
    "option-list",
  );
  const optionListIds = new Map<string, number>();
  for (const optionList of customOptionLists) {
    const existingList = optionListRows.find(
      ({ name }) => name === optionList.name || optionList.legacyNames.includes(name),
    );
    let optionListId: number;
    if (existingList) {
      optionListId = existingList.id;
      await patchInventoryConfiguration(organization.id, "option-list", optionListId, {
        name: optionList.name,
        isShared: true,
      });
      if (existingList.status !== "ACTIVE") {
        await transitionInventoryConfiguration(organization.id, "option-list", [optionListId], "ACTIVE");
      }
    } else {
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
    }
    optionListIds.set(optionList.name, optionListId);
    const detail = await getInventoryConfiguration(
      organization.id,
      "option-list",
      optionListId,
    );
    const existingValues = detail?.options ?? [];
    const retainedIds = new Set<number>();
    for (const option of optionList.values) {
      const existingValue = existingValues.find(
        ({ value }) => value === option.value || option.legacyValues.includes(value),
      );
      if (existingValue) {
        retainedIds.add(existingValue.id);
        await patchInventoryOptionValue(organization.id, optionListId, existingValue.id, {
          value: option.value,
          status: "ACTIVE",
        });
      } else {
        await addInventoryOptionValue(organization.id, optionListId, {
          value: option.value,
        });
      }
    }
    for (const existingValue of existingValues) {
      if (!retainedIds.has(existingValue.id)) {
        await deleteInventoryOptionValue(organization.id, optionListId, existingValue.id);
      }
    }
  }

  const customFieldRows = await listInventoryConfiguration(
    organization.id,
    "custom-field",
  );
  for (const customField of customFields) {
    const input = {
      name: customField.name,
      dataType: "OPTION",
      appliesTo: "ITEM",
      required: false,
      showInFilter: true,
      optionListId: optionListIds.get(customField.optionListName)!,
    };
    const existing = customFieldRows.find(
      ({ name, appliesTo }) =>
        appliesTo === "ITEM"
        && (name === customField.name || customField.legacyNames.includes(name)),
    );
    if (existing) {
      await patchInventoryConfiguration(organization.id, "custom-field", existing.id, input);
      if (existing.status !== "ACTIVE") {
        await transitionInventoryConfiguration(organization.id, "custom-field", [existing.id], "ACTIVE");
      }
    } else {
      await createInventoryConfiguration(organization.id, "custom-field", input);
    }
  }

  const existingItems = new Map(
    (await listInventoryItems(organization.id, "")).map((item) => [item.sku, item]),
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
      lines: [{ itemId, quantity, reasonCode: "OPENING_STOCK" }],
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
        { warehouseId: warehouseIds.get("INV-MAIN")!, quantity: 5, reasonCode: "SALE" },
        { warehouseId: warehouseIds.get("INV-SOUTH")!, quantity: 3, reasonCode: "SALE" },
      ],
    });
  }

  console.log(
    `Inventory sample data ready for ${organization.code} (${organization.name}): ${categories.length} categories, ${warehouses.length} warehouses, ${customOptionLists.length} custom option lists, ${customFields.length} custom fields, ${items.length} items.`,
  );
}

/**
 * Creates repeatable Inventory demonstration data for the shared TESTCO
 * organization owned by ERP Core.
 */
export async function sampleData(): Promise<void> {
  await seedOrganization(await sampleOrganization());
}

export default sampleData;
