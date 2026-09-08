import { getOperationalItems as readOperationalItems, listItems as readItems } from "./item.service";

export async function listItems({ organizationId }: { organizationId: number }) {
  const items = await readItems(organizationId);
  return { items: items.map(({ id, sku, name, category, unit, quantityTracked, status }) => ({
    id, sku, name, category, unit, quantityTracked, status,
  })) };
}

export async function getOperationalItems(input: { organizationId: number; skus: string[] }) {
  return { items: await readOperationalItems(input.organizationId, input.skus) };
}
