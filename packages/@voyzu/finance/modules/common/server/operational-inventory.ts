import "server-only";
import { OperationalInventoryRepo } from "../inventory-item-posting-profiles/server/db/operational-inventory.repo";


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
  // TODO(contracts, retrieval): restore @voyzu/inventory.getOperationalInventoryItems; integration temporarily unavailable.
  const result: unknown = undefined;
  if (!Array.isArray(result)) return [];
  const items = result as Omit<OperationalInventoryItem, "itemPostingProfileId">[];
  const { rows } = await new OperationalInventoryRepo(getDb()).listAssignmentsForItems(organizationId, items.map(({ id }) => id));
  const profileByItem = new Map(rows.map((row: Record<string, unknown>) => [Number(row.inventory_item_id), Number(row.item_posting_profile_id)]));
  return items.map((item) => ({ ...item, itemPostingProfileId: profileByItem.get(item.id) ?? null }));
}

export async function getItemPostingProfileUsages(
  postingCodeIds: number[],
): Promise<Array<{ itemPostingProfileId: number; sku: string }>> {
  if (postingCodeIds.length === 0) return [];
  const { rows } = await new OperationalInventoryRepo(getDb()).listProfileUsages(postingCodeIds);
  // TODO(contracts, retrieval): restore @voyzu/inventory.listInventoryItems for SKU usage lookup.
  // Fail closed: unavailable Inventory enrichment must not permit deletion of assigned profiles.
  if (rows.length > 0) {
    throw new Error("Cannot check posting-profile usage: Inventory integration is awaiting migration to contracts.");
  }
  return [];
}
