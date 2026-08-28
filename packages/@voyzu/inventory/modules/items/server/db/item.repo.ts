import type { DbExecutor } from "@voyzu/capability/db";

import type { ItemListRow, ItemStatus, ItemType } from "../../types/item-list.types";
import type { FinanceItemDto, ItemPostingCodeUsageDto } from "../../types/finance-item.types";

export class ItemRepo {
  constructor(private readonly db: DbExecutor) {}

  async list(organizationId: number): Promise<ItemListRow[]> {
    const { rows } = await this.db.query(`
      SELECT item.id,
             item.sku,
             item.name,
             item_category.name AS category,
             item.item_type,
             item.unit,
             item.quantity_tracked,
             item.status
        FROM item
        LEFT JOIN item_category
          ON item_category.organization_id = item.organization_id
         AND item_category.id = item.item_category_id
       WHERE item.organization_id = $1
       ORDER BY item.sku
    `, [organizationId]);

    return rows.map((row: Record<string, unknown>) => ({
      id: Number(row.id),
      sku: String(row.sku),
      name: String(row.name),
      category: row.category === null ? null : String(row.category),
      itemType: row.item_type as ItemType,
      unit: String(row.unit),
      quantityTracked: Boolean(row.quantity_tracked),
      cost: null,
      status: row.status as ItemStatus,
    }));
  }

  async listForFinance(organizationId: number, skus: string[]): Promise<FinanceItemDto[]> {
    if (skus.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT id::int, sku, name, description, quantity_tracked, item_posting_code_id::int, status
         FROM item
        WHERE organization_id = $1
          AND sku = ANY($2::text[])`,
      [organizationId, skus],
    );
    return rows.map((row: Record<string, unknown>) => ({
      id: Number(row.id),
      sku: String(row.sku),
      name: String(row.name),
      description: String(row.description),
      quantityTracked: Boolean(row.quantity_tracked),
      itemPostingCodeId: row.item_posting_code_id == null ? null : Number(row.item_posting_code_id),
      status: row.status as FinanceItemDto["status"],
    }));
  }

  async listPostingCodeUsages(postingCodeIds: number[]): Promise<ItemPostingCodeUsageDto[]> {
    if (postingCodeIds.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT item_posting_code_id::int, sku
         FROM item
        WHERE item_posting_code_id = ANY($1::bigint[])
        ORDER BY sku`,
      [postingCodeIds],
    );
    return rows.map((row: Record<string, unknown>) => ({
      itemPostingCodeId: Number(row.item_posting_code_id),
      sku: String(row.sku),
    }));
  }
}
