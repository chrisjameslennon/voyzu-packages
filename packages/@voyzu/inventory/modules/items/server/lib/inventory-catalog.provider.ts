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
