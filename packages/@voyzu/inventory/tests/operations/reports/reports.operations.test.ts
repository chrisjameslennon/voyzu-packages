import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createInventoryConfiguration } from "../../../modules/configuration/operations";
import { createInventoryItem } from "../../../modules/items/operations";
import { getInventoryReport } from "../../../modules/reports/operations";
import type { InventoryReportKey } from "../../../modules/reports/types/report.types";
import { receiveInventoryStock } from "../../../modules/stock/operations";
import {
  createTestOrganization,
  disposeTestOrganization,
  type TestOrganization,
} from "../support/test-organization";

let organization: TestOrganization | undefined;
let sku: string;

before(async () => {
  organization = await createTestOrganization("RPT");
  const category = await createInventoryConfiguration(
    organization.id,
    "category",
    { code: "TESTCAT", name: "Test category" },
  );
  const warehouse = await createInventoryConfiguration(
    organization.id,
    "warehouse",
    { code: "TESTWH", name: "Test warehouse" },
  );
  const item = await createInventoryItem(organization.id, {
    sku: "TEST-REPORT-ITEM",
    name: "Test report item",
    unit: "each",
    categoryId: category.id,
    quantityTracked: true,
  });
  sku = item.sku;
  await receiveInventoryStock(organization.id, {
    date: "2026-08-29",
    warehouseId: warehouse.id,
    reference: "TEST-REPORT-RECEIPT",
    lines: [{ itemId: item.id, quantity: 3 }],
  });
});

after(async () => {
  await disposeTestOrganization(organization);
});

test("report command exposes every inventory report", async () => {
  const keys: InventoryReportKey[] = [
    "items",
    "item-categories",
    "stock-on-hand",
    "stock-availability",
    "stock-activity",
    "stock-transfers",
    "stock-reservations",
    "stocktake-variance",
    "quantity-adjustments",
  ];
  for (const key of keys) {
    const report = await getInventoryReport(organization!.id, key);
    assert.ok(report.title);
    assert.ok(report.headers.length > 0);
    assert.ok(Array.isArray(report.rows));
  }

  const items = await getInventoryReport(organization!.id, "items");
  assert.ok(items.rows.some(({ cells }) => cells[0] === sku));
  const stock = await getInventoryReport(organization!.id, "stock-on-hand");
  assert.ok(stock.rows.some(({ cells }) => cells[0] === sku));
});
