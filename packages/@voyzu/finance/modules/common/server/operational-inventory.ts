import "server-only";

import { operation } from "@voyzu/capability/operations";

export interface OperationalInventoryItem {
  id: number;
  sku: string;
  name: string;
  description: string;
  quantityTracked: boolean;
  itemPostingCodeId: number | null;
  status: "ACTIVE" | "INACTIVE";
}

export async function getOperationalInventoryItems(
  organizationId: number,
  skus: string[],
): Promise<OperationalInventoryItem[]> {
  if (skus.length === 0) return [];
  return operation.call("@voyzu/inventory.getItemsForFinance", organizationId, skus) as Promise<OperationalInventoryItem[]>;
}

export async function getItemPostingCodeUsages(
  postingCodeIds: number[],
): Promise<Array<{ itemPostingCodeId: number; sku: string }>> {
  if (postingCodeIds.length === 0) return [];
  return operation.call("@voyzu/inventory.getItemPostingCodeUsages", postingCodeIds) as Promise<Array<{
    itemPostingCodeId: number;
    sku: string;
  }>>;
}
