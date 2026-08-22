import { DataError } from "@voyzu/capability/errors";
import type { DbExecutor } from "@voyzu/capability/db";
import type { Filter, ListOptions } from "@voyzu/types/params";

import type { UpdateAuditStamp } from "../../../server";
import type { InsertInventoryItemRow, InventoryItemRow, PatchInventoryItemRow, UpdateInventoryItemRow } from "./inventory-item.row.types";

const SELECT_SQL = `
  SELECT ii.id::int,
         ii.finance_company_id::int,
         ii.code AS item_code,
         ii.name AS item_name,
         ii.description,
         ii.item_type,
         ic.code AS category_code,
         ii.unit_code,
         ii.status,
         EXISTS (
           SELECT 1
           FROM inventory_ledger_entry_line inventory_line
           WHERE inventory_line.item_id = ii.id
         ) AS has_postings,
         ii.quantity_on_hand_derived::float8 AS quantity_on_hand_derived,
         ii.book_value_derived::float8 AS book_value_derived,
         ii.avg_unit_book_value_derived::float8 AS avg_unit_book_value_derived
         , ii.creation_date,
         ii.creation_actor_type,
         ii.creation_user_id,
         ii.creation_mutation_id,
         ii.updated_date,
         ii.updated_actor_type,
         ii.updated_user_id,
         ii.updated_mutation_id
  FROM inventory_item ii
  JOIN inventory_category ic ON ic.finance_company_id = ii.finance_company_id AND ic.id = ii.category_id
`;

const MUTABLE_COLUMNS = [
  "code", "name", "description", "item_type", "category_id", "unit_code",
  "status",
  "quantity_on_hand_derived", "book_value_derived", "avg_unit_book_value_derived",
  "updated_user_id", "updated_actor_type", "updated_date", "updated_mutation_id",
] as const;
const FILTERABLE_COLUMNS = ["code", "name", "description", "item_type", "unit_code", "status"] as const;
const SEARCHABLE_COLUMNS = ["code", "name", "description", "item_type", "unit_code", "status"] as const;

function mapRow(row: Record<string, unknown>): InventoryItemRow {
  return {
    id: Number(row.id),
    finance_company_id: Number(row.finance_company_id),
    item_code: String(row.item_code),
    item_name: String(row.item_name),
    description: String(row.description),
    item_type: String(row.item_type) as InventoryItemRow["item_type"],
    category_code: String(row.category_code),
    unit_code: String(row.unit_code),
    status: String(row.status) as InventoryItemRow["status"],
    has_postings: row.has_postings === true,
    quantity_on_hand_derived: row.quantity_on_hand_derived == null ? null : Number(row.quantity_on_hand_derived),
    book_value_derived: row.book_value_derived == null ? null : Number(row.book_value_derived),
    avg_unit_book_value_derived: row.avg_unit_book_value_derived == null ? null : Number(row.avg_unit_book_value_derived),
    creation_date: row.creation_date instanceof Date ? row.creation_date.toISOString() : String(row.creation_date ?? ""),
    creation_actor_type: row.creation_actor_type as InventoryItemRow["creation_actor_type"],
    creation_user_id: row.creation_user_id == null ? null : String(row.creation_user_id),
    creation_mutation_id: row.creation_mutation_id == null ? null : String(row.creation_mutation_id),
    updated_date: row.updated_date instanceof Date ? row.updated_date.toISOString() : String(row.updated_date ?? row.creation_date ?? ""),
    updated_actor_type: row.updated_actor_type as InventoryItemRow["updated_actor_type"],
    updated_user_id: row.updated_user_id == null ? null : String(row.updated_user_id),
    updated_mutation_id: row.updated_mutation_id == null ? null : String(row.updated_mutation_id),
  };
}

function assertColumn(field: string): void {
  if (!FILTERABLE_COLUMNS.includes(field as (typeof FILTERABLE_COLUMNS)[number])) throw new Error(`Unknown column: ${field}`);
}

function buildWhere(filters: Filter[], startAt = 2): { sql: string; params: unknown[] } {
  const parts: string[] = [];
  const params: unknown[] = [];
  for (const filter of filters) {
    assertColumn(filter.field);
    const col = `ii.${filter.field}`;
    switch (filter.operator) {
      case "=":
      case "!=":
      case "<":
      case "<=":
      case ">":
      case ">=":
      case "LIKE":
      case "ILIKE":
        params.push(filter.value);
        parts.push(`${col} ${filter.operator} $${startAt + params.length - 1}`);
        break;
      case "IN":
      case "NOT IN":
        params.push(filter.value);
        parts.push(`${col} ${filter.operator === "IN" ? "= ANY" : "!= ALL"} ($${startAt + params.length - 1}::text[])`);
        break;
      case "BETWEEN": {
        const [lo, hi] = filter.value as [string | number, string | number];
        params.push(lo, hi);
        parts.push(`${col} BETWEEN $${startAt + params.length - 2} AND $${startAt + params.length - 1}`);
        break;
      }
      case "IS NULL":
        parts.push(`${col} IS NULL`);
        break;
      case "IS NOT NULL":
        parts.push(`${col} IS NOT NULL`);
        break;
    }
  }
  return { sql: parts.length ? ` AND ${parts.join(" AND ")}` : "", params };
}

function buildOrderLimitOffset(params: unknown[], options?: ListOptions): string {
  let orderSql = "ORDER BY ii.code ASC";
  if (options?.orderBy?.length) {
    orderSql = `ORDER BY ${options.orderBy.map((order) => {
      assertColumn(order.field);
      return `ii.${order.field} ${order.direction ?? "ASC"}`;
    }).join(", ")}`;
  }
  let tail = "";
  const limit = options?.limit ?? options?.pagination?.pageSize;
  const offset = options?.offset ?? (options?.pagination ? (options.pagination.page - 1) * options.pagination.pageSize : undefined);
  if (limit !== undefined) {
    params.push(limit);
    tail += ` LIMIT $${params.length}`;
  }
  if (offset !== undefined) {
    params.push(offset);
    tail += ` OFFSET $${params.length}`;
  }
  return `${orderSql}${tail}`;
}

export class InventoryItemRepo {
  constructor(private readonly db: DbExecutor) { }

  async resolveCategoryId(companyId: number, categoryCode: string): Promise<number> {
    const category = await this.db.query(`SELECT id::int FROM inventory_category WHERE finance_company_id = $1 AND code = $2`, [companyId, categoryCode]);
    if (!category.rows[0]) throw new DataError(`Unknown category ${categoryCode}`);
    return Number(category.rows[0].id);
  }

  async insert(row: InsertInventoryItemRow): Promise<InventoryItemRow> {
    const categoryId = await this.resolveCategoryId(row.finance_company_id, row.category_code);
    await this.db.query(
      `INSERT INTO inventory_item (
        finance_company_id, code, name, description, item_type, category_id, unit_code,
        status, quantity_on_hand_derived, book_value_derived, avg_unit_book_value_derived,
        creation_date, creation_actor_type, creation_user_id, creation_mutation_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        row.finance_company_id, row.code, row.name, row.description, row.item_type, categoryId, row.unit_code,
        row.status, row.quantity_on_hand_derived, row.book_value_derived, row.avg_unit_book_value_derived,
        row.creation_date, row.creation_actor_type, row.creation_user_id ?? null, row.creation_mutation_id ?? null,
      ],
    );
    const inserted = await this.get(row.finance_company_id, row.code);
    if (!inserted) throw new DataError(`Inventory item ${row.code} not found after insert`);
    return inserted;
  }

  async listAll(companyId: number): Promise<InventoryItemRow[]> {
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE ii.finance_company_id = $1 ORDER BY ii.code`, [companyId]);
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async get(companyId: number, code: string): Promise<InventoryItemRow | null> {
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE ii.finance_company_id = $1 AND ii.code = $2`, [companyId, code]);
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async batchGet(companyId: number, codes: string[]): Promise<InventoryItemRow[]> {
    if (!codes.length) return [];
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE ii.finance_company_id = $1 AND ii.code = ANY($2::text[]) ORDER BY ii.code`, [companyId, codes]);
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async filter(companyId: number, filters: Filter[], options?: ListOptions): Promise<InventoryItemRow[]> {
    const { sql, params } = buildWhere(filters);
    const queryParams: unknown[] = [companyId, ...params];
    const tail = buildOrderLimitOffset(queryParams, options);
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE ii.finance_company_id = $1${sql} ${tail}`, queryParams);
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async search(companyId: number, phrase: string, options?: ListOptions): Promise<InventoryItemRow[]> {
    const params: unknown[] = [companyId];
    const pattern = `%${phrase}%`;
    const likeParts = SEARCHABLE_COLUMNS.map((column) => {
      params.push(pattern);
      return `ii.${column}::text ILIKE $${params.length}`;
    });
    const tail = buildOrderLimitOffset(params, options);
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE ii.finance_company_id = $1 AND (${likeParts.join(" OR ")}) ${tail}`, params);
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async update(companyId: number, code: string, row: UpdateInventoryItemRow, audit: UpdateAuditStamp): Promise<InventoryItemRow> {
    const categoryId = await this.resolveCategoryId(companyId, row.category_code);
    await this.db.query(
      `UPDATE inventory_item
       SET name = $3, description = $4, item_type = $5, category_id = $6,
           unit_code = $7, quantity_on_hand_derived = $8, book_value_derived = $9, avg_unit_book_value_derived = $10,
           updated_date = $11::timestamptz, updated_actor_type = $12::actor_type, updated_user_id = $13, updated_mutation_id = $14::uuid
       WHERE finance_company_id = $1 AND code = $2`,
      [
        companyId, code, row.name, row.description, row.item_type, categoryId,
        row.unit_code, row.quantity_on_hand_derived, row.book_value_derived, row.avg_unit_book_value_derived,
        audit.timestamp, audit.actorType, audit.userId, audit.mutationId,
      ],
    );
    const updated = await this.get(companyId, code);
    if (!updated) throw new DataError(`Inventory item ${code} not found`);
    return updated;
  }

  async patch(companyId: number, code: string, updates: PatchInventoryItemRow): Promise<InventoryItemRow> {
    const refs: Record<string, number> = {};
    if (updates.category_code) {
      const { rows } = await this.db.query(`SELECT id::int FROM inventory_category WHERE finance_company_id = $1 AND code = $2`, [companyId, updates.category_code]);
      if (!rows[0]) throw new DataError(`Unknown category ${updates.category_code}`);
      refs.category_id = Number(rows[0].id);
    }
    const dbUpdates = {
      ...updates,
      ...(refs.category_id !== undefined && { category_id: refs.category_id }),
    } as Record<string, unknown>;
    delete dbUpdates.category_code;

    const sets: string[] = [];
    const vals: unknown[] = [];
    for (const [key, value] of Object.entries(dbUpdates)) {
      if (MUTABLE_COLUMNS.includes(key as (typeof MUTABLE_COLUMNS)[number])) {
        vals.push(value);
        if (key === "updated_actor_type") {
          sets.push(`${key} = $${vals.length}::actor_type`);
        } else if (key === "updated_date") {
          sets.push(`${key} = $${vals.length}::timestamptz`);
        } else if (key === "updated_mutation_id") {
          sets.push(`${key} = $${vals.length}::uuid`);
        } else {
          sets.push(`${key} = $${vals.length}`);
        }
      }
    }
    let resultCode = code;
    if (sets.length) {
      vals.push(code);
      vals.push(companyId);
      const { rows } = await this.db.query(
        `UPDATE inventory_item
         SET ${sets.join(", ")}
         WHERE code = $${vals.length - 1} AND finance_company_id = $${vals.length}
         RETURNING code`,
        vals,
      );
      if (!rows[0]) throw new DataError(`Inventory item ${code} not found`);
      resultCode = String(rows[0].code);
    }
    const updated = await this.get(companyId, resultCode);
    if (!updated) throw new DataError(`Inventory item ${code} not found`);
    return updated;
  }

  async delete(companyId: number, code: string): Promise<void> {
    const { rowCount } = await this.db.query(`DELETE FROM inventory_item WHERE finance_company_id = $1 AND code = $2`, [companyId, code]);
    if (!rowCount) throw new DataError(`Inventory item ${code} not found`);
  }

}
