import { getDb } from "@voyzu/capability/db";

import type { ItemListRow } from "../../types/item-list.types";
import type { FinanceItemDto, ItemPostingCodeUsageDto } from "../../types/finance-item.types";
import { ItemRepo } from "../db/item.repo";

export async function listItems(organizationId: number): Promise<ItemListRow[]> {
  return new ItemRepo(getDb()).list(organizationId);
}

export async function getItemsForFinance(organizationId: number, skus: string[]): Promise<FinanceItemDto[]> {
  return new ItemRepo(getDb()).listForFinance(organizationId, skus);
}

export async function getItemPostingCodeUsages(postingCodeIds: number[]): Promise<ItemPostingCodeUsageDto[]> {
  return new ItemRepo(getDb()).listPostingCodeUsages(postingCodeIds);
}
