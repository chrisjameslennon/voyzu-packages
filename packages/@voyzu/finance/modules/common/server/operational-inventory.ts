import "server-only";
import { OperationalInventoryRepo } from "../inventory-item-posting-profiles/server/db/operational-inventory.repo";


import { getDb } from "@voyzu/capability/db";
import { capabilities } from "@voyzu/capability/contracts";
import { BusinessRuleError } from "@voyzu/capability/errors";

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
  const catalog = capabilities.optional("erp.inventory-catalog");
  if (!catalog) return [];
  const { items } = await catalog.getOperationalItems({ organizationId, skus });
  const { rows } = await new OperationalInventoryRepo(getDb()).listAssignmentsForItems(organizationId, items.map(({ id }) => id));
  const profileByItem = new Map(rows.map((row: Record<string, unknown>) => [Number(row.inventory_item_id), Number(row.item_posting_profile_id)]));
  return items.map((item) => ({ ...item, itemPostingProfileId: profileByItem.get(item.id) ?? null }));
}

export async function getItemPostingProfileUsages(
  postingCodeIds: number[],
): Promise<Array<{ itemPostingProfileId: number; sku: string }>> {
  if (postingCodeIds.length === 0) return [];
  const { rows } = await new OperationalInventoryRepo(getDb()).listProfileUsages(postingCodeIds);
  if (!rows.length) return [];
  const catalog = capabilities.optional("erp.inventory-catalog");
  if (!catalog) throw new BusinessRuleError("Cannot check posting-profile usage: Inventory is unavailable.");
  const usages: Array<{ itemPostingProfileId: number; sku: string }> = [];
  const organizationIds = [...new Set(rows.map((row) => Number(row.organization_id)))];
  for (const organizationId of organizationIds) {
    const { items } = await catalog.listItems({ organizationId });
    const byId = new Map(items.map((item) => [item.id, item.sku]));
    for (const row of rows.filter((row) => Number(row.organization_id) === organizationId)) {
      const sku = byId.get(Number(row.inventory_item_id));
      if (sku === undefined) {
        throw new BusinessRuleError(`Cannot check posting-profile usage: assigned Inventory item ${row.inventory_item_id} was not found.`);
      }
      usages.push({ itemPostingProfileId: Number(row.item_posting_profile_id), sku });
    }
  }
  return usages;
}
