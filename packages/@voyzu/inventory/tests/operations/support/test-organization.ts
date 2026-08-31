import { randomUUID } from "node:crypto";

import { getDb, getPool } from "@voyzu/capability/db";
import {
  createOrganization,
  deleteOrganization,
} from "@voyzu/erp-core/organizations/operations";

export type TestOrganization = { id: number; code: string };

async function purgeInventoryData(organizationId: number): Promise<void> {
  const db = getDb();
  for (const table of [
    "inv_custom_field_value",
    "inv_option_list_value",
    "item_component",
    "inventory_reservation_line",
    "inventory_reservation",
    "stock_count_line",
    "stock_count",
    "inventory_transaction_line",
    "inventory_transaction",
    "item",
    "inv_custom_field",
    "inv_option_list",
    "warehouse",
    "item_category",
  ]) {
    await db.query(`DELETE FROM ${table} WHERE organization_id = $1`, [
      organizationId,
    ]);
  }
}

async function removeTestOrganization(
  organization: TestOrganization,
): Promise<void> {
  await purgeInventoryData(organization.id);
  await deleteOrganization(organization.code);
}

export async function createTestOrganization(
  moduleCode: string,
): Promise<TestOrganization> {
  const prefix = `IV${moduleCode}`.toUpperCase();
  const stale = await getDb().query<{ id: number; code: string }>(
    "SELECT id::int, code FROM organization WHERE code LIKE $1",
    [`${prefix}%`],
  );
  for (const row of stale.rows) await removeTestOrganization(row);

  const code = `${prefix}${randomUUID().replaceAll("-", "").slice(0, 6)}`
    .slice(0, 14)
    .toUpperCase();
  const organization = await createOrganization({
    code,
    name: `Inventory ${moduleCode} command tests`,
    countryCode: "NZ",
    baseCurrencyCode: "NZD",
  });
  return { id: organization.id, code: organization.code };
}

export async function disposeTestOrganization(
  organization: TestOrganization | undefined,
): Promise<void> {
  try {
    if (organization) await removeTestOrganization(organization);
  } finally {
    await getPool().end();
  }
}
