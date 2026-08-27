import type { DbExecutor } from "@voyzu/capability/db";

import type { ItemListRow, ItemStatus, ItemType } from "../../types/item-list.types";

export class ItemRepo {
  constructor(private readonly db: DbExecutor) {}

  async list(): Promise<ItemListRow[]> {
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
        LEFT JOIN item_category ON item_category.id = item.item_category_id
       ORDER BY item.sku
    `);

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
}
