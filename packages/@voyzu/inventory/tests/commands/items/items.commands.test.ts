import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { createInventoryConfiguration } from "../../../modules/configuration/commands";
import {
  activateInventoryItem,
  activateInventoryItems,
  createInventoryItem,
  deactivateInventoryItem,
  deactivateInventoryItems,
  deleteInventoryItem,
  deleteInventoryItems,
  getInventoryItem,
  getOperationalInventoryItems,
  listInventoryItemCategories,
  listInventoryItems,
  patchInventoryItem,
  reserveInventoryItemSku,
} from "../../../modules/items/commands";
import {
  createTestOrganization,
  disposeTestOrganization,
  type TestOrganization,
} from "../support/test-organization";

let organization: TestOrganization | undefined;
let categoryId: number;

before(async () => {
  organization = await createTestOrganization("ITM");
  categoryId = (
    await createInventoryConfiguration(organization.id, "category", {
      code: "TESTCAT",
      name: "Test category",
    })
  ).id;
});

after(async () => {
  await disposeTestOrganization(organization);
});

test("item commands expose create, read, patch, and delete", async () => {
  const organizationId = organization!.id;
  assert.ok(
    (await listInventoryItemCategories(organizationId)).some(
      ({ id }) => id === categoryId,
    ),
  );

  const reservation = await reserveInventoryItemSku();
  assert.equal(reservation.sku, `SKU-${reservation.id}`);
  const generated = await createInventoryItem(organizationId, {
    reservedId: reservation.id,
    name: "Auto SKU item",
    unit: "each",
    categoryId,
    quantityTracked: true,
  });
  assert.equal(generated.id, reservation.id);
  assert.equal(generated.sku, `SKU-${generated.id}`);

  const created = await createInventoryItem(organizationId, {
    sku: "TEST-ITEM-1",
    name: "Test item",
    unit: "each",
    categoryId,
    quantityTracked: true,
  });
  assert.equal(created.sku, "TEST-ITEM-1");
  assert.equal(
    (await getInventoryItem(organizationId, "test-item-1"))?.id,
    created.id,
  );
  assert.ok(
    (await listInventoryItems(organizationId)).some(
      ({ id }) => id === created.id,
    ),
  );

  const patched = await patchInventoryItem(organizationId, created.sku, {
    name: "Changed item",
    description: "Changed through command",
    quantityTracked: false,
    unit: "kg",
  });
  assert.equal(patched.name, "Changed item");
  assert.equal(patched.description, "Changed through command");
  assert.equal(patched.quantityTracked, false);
  assert.equal(patched.unit, null);

  assert.equal(
    (await deactivateInventoryItem(organizationId, created.sku)).status,
    "INACTIVE",
  );
  assert.equal(
    (await activateInventoryItem(organizationId, created.sku)).status,
    "ACTIVE",
  );
  await deleteInventoryItem(organizationId, created.sku);
  await deleteInventoryItem(organizationId, generated.sku);
  assert.equal(await getInventoryItem(organizationId, created.sku), null);
});

test("item commands expose batch and operational projections", async () => {
  const organizationId = organization!.id;
  const component = await createInventoryItem(organizationId, {
    sku: "TEST-COMPONENT",
    name: "Test component",
    unit: "each",
    categoryId,
    quantityTracked: true,
  });
  const second = await createInventoryItem(organizationId, {
    sku: "TEST-SECOND",
    name: "Second test item",
    unit: "each",
    categoryId,
    quantityTracked: true,
  });
  assert.equal((await getOperationalInventoryItems(organizationId, [component.sku, second.sku])).length, 2);

  assert.ok(
    (
      await deactivateInventoryItems(organizationId, [
        component.sku,
        second.sku,
      ])
    ).every(({ status }) => status === "INACTIVE"),
  );
  assert.ok(
    (
      await activateInventoryItems(organizationId, [
        component.sku,
        second.sku,
      ])
    ).every(({ status }) => status === "ACTIVE"),
  );

  await deleteInventoryItem(organizationId, second.sku);
  await deleteInventoryItems(organizationId, [component.sku]);
  assert.equal(
    (await listInventoryItems(organizationId)).filter(({ sku }) =>
      sku.startsWith("TEST-"),
    ).length,
    0,
  );
});

test("item commands enforce quantity rules", async () => {
  const organizationId = organization!.id;
  await assert.rejects(
    createInventoryItem(organizationId, {
      sku: "TEST-NO-UNIT",
      name: "Invalid tracked item",
      unit: null,
      categoryId,
      quantityTracked: true,
    }),
    /unit is required/i,
  );
});
