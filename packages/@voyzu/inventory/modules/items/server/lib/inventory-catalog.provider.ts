import { getDb } from "@voyzu/capability/db";
import { ItemRepo } from "../db/item.repo";
import { getOperationalItems as readOperationalItems, listItems as readItems } from "./item.service";

export async function get(id: number) {
  const row = await new ItemRepo(getDb()).getById(id);
  return row ? { id: row.id, sku: row.sku, name: row.name, category: row.category_name ?? null,
    unit: row.unit, quantityTracked: row.quantity_tracked, status: row.status } : null;
}
export async function byOrganization({ organizationId }: { organizationId: number }) {
  return (await readItems(organizationId)).map(({ id, sku, name, category, unit, quantityTracked, status }) =>
    ({ id, sku, name, category, unit, quantityTracked, status }));
}
export async function getOperational(id: number) {
  const row = await new ItemRepo(getDb()).getById(id);
  return row ? { id: row.id, sku: row.sku, name: row.name, description: row.description,
    quantityTracked: row.quantity_tracked, status: row.status } : null;
}
export async function bySkus(input: { organizationId: number; skus: string[] }) {
  return readOperationalItems(input.organizationId, input.skus);
}

export async function availabilityByOrganization({ organizationId }: { organizationId: number }) {
  const { listStockPositions } = await import("../../../stock/server/lib/stock.service");
  return (await listStockPositions(organizationId)).map(({ itemId, warehouseId, warehouseName, onHand, reserved, available }) => ({ itemId, warehouseId, warehouseName, onHand, reserved, available }));
}
