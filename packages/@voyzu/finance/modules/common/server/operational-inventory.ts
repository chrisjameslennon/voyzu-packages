import "server-only";

import { operation } from "@voyzu/capability/operations";
import { getDb } from "@voyzu/capability/db";

export interface OperationalInventoryItem {
  id: number;
  sku: string;
  name: string;
  description: string;
  quantityTracked: boolean;
  itemPostingProfileId: number | null;
  status: "ACTIVE" | "INACTIVE";
}

export async function getOperationalInventoryItems(
  organizationId: number,
  skus: string[],
): Promise<OperationalInventoryItem[]> {
  if (skus.length === 0) return [];
  const result = await operation.callOptional("@voyzu/inventory.getOperationalInventoryItems", organizationId, skus);
  if (!Array.isArray(result)) return [];
  const items = result as Omit<OperationalInventoryItem, "itemPostingProfileId">[];
  const { rows } = await getDb().query(
    `SELECT assignment.inventory_item_id::int, assignment.item_posting_profile_id::int
     FROM inventory_item_posting_profile_assignment assignment
     JOIN finance_organization finance ON finance.id = assignment.finance_organization_id
     WHERE finance.organization_id = $1 AND assignment.inventory_item_id = ANY($2::bigint[])`,
    [organizationId, items.map(({ id }) => id)],
  );
  const profileByItem = new Map(rows.map((row: Record<string, unknown>) => [Number(row.inventory_item_id), Number(row.item_posting_profile_id)]));
  return items.map((item) => ({ ...item, itemPostingProfileId: profileByItem.get(item.id) ?? null }));
}

export async function getItemPostingProfileUsages(
  postingCodeIds: number[],
): Promise<Array<{ itemPostingProfileId: number; sku: string }>> {
  if (postingCodeIds.length === 0) return [];
  const { rows } = await getDb().query(
    `SELECT assignment.item_posting_profile_id::int, assignment.inventory_item_id::int, finance.organization_id::int
     FROM inventory_item_posting_profile_assignment assignment
     JOIN finance_organization finance ON finance.id = assignment.finance_organization_id
     WHERE assignment.item_posting_profile_id = ANY($1::bigint[])`,
    [postingCodeIds],
  );
  const results: Array<{ itemPostingProfileId: number; sku: string }> = [];
  for (const organizationId of [...new Set(rows.map((row: Record<string, unknown>) => Number(row.organization_id)))]) {
    const inventory = await operation.callOptional("@voyzu/inventory.listInventoryItems", organizationId);
    if (!Array.isArray(inventory)) continue;
    const skuById = new Map((inventory as Array<{ id: number; sku: string }>).map((item) => [item.id, item.sku]));
    for (const row of rows as Record<string, unknown>[]) {
      if (Number(row.organization_id) !== organizationId) continue;
      const sku = skuById.get(Number(row.inventory_item_id));
      if (sku) results.push({ itemPostingProfileId: Number(row.item_posting_profile_id), sku });
    }
  }
  return results;
}
