import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createInventoryConfiguration } from "../../../modules/configuration/operations";
import { createInventoryItem } from "../../../modules/items/operations";
import {
  adjustInventoryStock,
  completeInventoryStockCount,
  createInventoryStockCount,
  deleteInventoryStockCount,
  getInventoryStockCount,
  getInventoryStockOptions,
  issueInventoryStock,
  listInventoryStock,
  listInventoryStockActivity,
  listInventoryStockCounts,
  receiveInventoryStock,
  reserveInventoryStock,
  saveInventoryStockCount,
  transferInventoryStock,
} from "../../../modules/stock/operations";
import {
  createTestOrganization,
  disposeTestOrganization,
  type TestOrganization,
} from "../support/test-organization";

let organization: TestOrganization | undefined;
let itemId: number;
let warehouseOneId: number;
let warehouseTwoId: number;
const commandDate = "2026-08-29";

before(async () => {
  organization = await createTestOrganization("STK");
  const category = await createInventoryConfiguration(
    organization.id,
    "category",
    { code: "TESTCAT", name: "Test category" },
  );
  warehouseOneId = (
    await createInventoryConfiguration(organization.id, "warehouse", {
      code: "TESTWH1",
      name: "Test warehouse one",
    })
  ).id;
  warehouseTwoId = (
    await createInventoryConfiguration(organization.id, "warehouse", {
      code: "TESTWH2",
      name: "Test warehouse two",
    })
  ).id;
  itemId = (
    await createInventoryItem(organization.id, {
      sku: "TEST-STOCK-ITEM",
      name: "Test stock item",
      unit: "each",
      categoryId: category.id,
      quantityTracked: true,
    })
  ).id;
});

after(async () => {
  await disposeTestOrganization(organization);
});

test("stock commands expose movements, reservations, and positions", async () => {
  const organizationId = organization!.id;
  const options = await getInventoryStockOptions(organizationId);
  assert.ok(options.items.some(({ id }) => id === itemId));
  assert.ok(options.warehouses.some(({ id }) => id === warehouseOneId));

  assert.ok(
    (await receiveInventoryStock(organizationId, {
      date: commandDate,
      warehouseId: warehouseOneId,
      reference: "TEST-RECEIPT",
      lines: [{ itemId, quantity: 10 }],
    })) > 0,
  );
  await reserveInventoryStock(organizationId, {
    itemId,
    reference: "TEST-RESERVATION",
    lines: [{ warehouseId: warehouseOneId, quantity: 2 }],
  });
  assert.ok(
    (await issueInventoryStock(organizationId, {
      date: commandDate,
      warehouseId: warehouseOneId,
      reference: "TEST-ISSUE",
      lines: [{ itemId, quantity: 3 }],
    })) > 0,
  );
  assert.ok(
    (await transferInventoryStock(organizationId, {
      date: commandDate,
      itemId,
      fromWarehouseId: warehouseOneId,
      toWarehouseId: warehouseTwoId,
      quantity: 2,
      reference: "TEST-TRANSFER",
    })) > 0,
  );
  assert.ok(
    (await adjustInventoryStock(organizationId, {
      date: commandDate,
      warehouseId: warehouseTwoId,
      reference: "TEST-ADJUSTMENT",
      lines: [{ itemId, quantityChange: 1 }],
    })) > 0,
  );

  const positions = await listInventoryStock(organizationId);
  const first = positions.find(
    (row) => row.itemId === itemId && row.warehouseId === warehouseOneId,
  );
  const second = positions.find(
    (row) => row.itemId === itemId && row.warehouseId === warehouseTwoId,
  );
  assert.equal(first?.onHand, 5);
  assert.equal(first?.reserved, 2);
  assert.equal(first?.available, 3);
  assert.equal(second?.onHand, 3);

  const activity = await listInventoryStockActivity(organizationId);
  assert.ok(activity.some(({ type }) => type === "RECEIPT"));
  assert.ok(activity.some(({ type }) => type === "ISSUE"));
  assert.ok(activity.some(({ type }) => type === "TRANSFER"));
  assert.ok(activity.some(({ type }) => type === "ADJUSTMENT"));
  assert.ok(activity.every(({ type }) => type !== "RESERVATION"));
  assert.ok(activity.every(({ code }) => code.startsWith("INV-")));
});

test("stock count commands expose draft, save, completion, and deletion", async () => {
  const organizationId = organization!.id;
  const draft = await createInventoryStockCount(organizationId, {
    warehouseId: warehouseOneId,
    countDate: commandDate,
    notes: "Command test count",
    lines: [{ itemId, countedQuantity: 4 }],
  });
  assert.equal(draft.status, "DRAFT");
  assert.equal(
    (await getInventoryStockCount(organizationId, draft.id))?.id,
    draft.id,
  );

  const saved = await saveInventoryStockCount(
    organizationId,
    draft.id,
    {
      warehouseId: warehouseOneId,
      countDate: commandDate,
      notes: "Count in progress",
      lines: [{ itemId, countedQuantity: 4 }],
    },
    "IN_PROGRESS",
  );
  assert.equal(saved.status, "IN_PROGRESS");
  const completed = await completeInventoryStockCount(organizationId, draft.id);
  assert.equal(completed.status, "COMPLETED");
  assert.ok(
    (await listInventoryStockCounts(organizationId)).some(
      ({ id }) => id === draft.id,
    ),
  );
  await assert.rejects(
    deleteInventoryStockCount(organizationId, draft.id),
    /completed stocktake cannot be deleted/i,
  );

  const disposable = await createInventoryStockCount(organizationId, {
    warehouseId: warehouseTwoId,
    countDate: commandDate,
    lines: [],
  });
  await deleteInventoryStockCount(organizationId, disposable.id);
  assert.equal(
    await getInventoryStockCount(organizationId, disposable.id),
    null,
  );
});

test("stock commands reject movements beyond available stock", async () => {
  await assert.rejects(
    issueInventoryStock(organization!.id, {
      date: commandDate,
      warehouseId: warehouseTwoId,
      reference: "TEST-OVER-ISSUE",
      lines: [{ itemId, quantity: 1000 }],
    }),
    /available/i,
  );
  await assert.rejects(
    transferInventoryStock(organization!.id, {
      date: commandDate,
      itemId,
      fromWarehouseId: warehouseOneId,
      toWarehouseId: warehouseOneId,
      quantity: 1,
      reference: "TEST-SAME-WAREHOUSE",
    }),
    /must be different/i,
  );
});
