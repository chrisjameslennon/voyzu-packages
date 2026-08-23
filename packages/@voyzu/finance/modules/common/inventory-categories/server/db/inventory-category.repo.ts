import { DataError } from "@voyzu/capability/errors";
import type { UpdateAuditStamp } from "../../../server";
import type { DbExecutor } from "@voyzu/capability/db";
import type { Filter, ListOptions } from "@voyzu/types/params";

import type { InsertInventoryCategoryRow, InventoryCategoryRow, PatchInventoryCategoryRow, UpdateInventoryCategoryRow } from "./inventory-category.row.types";

const TABLE = "inventory_category";
const COLUMNS = ["code", "name", "description", "status"] as const;
const SEARCHABLE_COLUMNS = ["code", "name", "description", "status"] as const;
const SELECT_SQL = `SELECT ic.*,
  (
    SELECT jsonb_build_object(
      'total', COUNT(*)::int,
      'active', (COUNT(*) FILTER (WHERE item.status = 'ACTIVE'))::int,
      'inactive', (COUNT(*) FILTER (WHERE item.status = 'INACTIVE'))::int
    )
    FROM inventory_item item
    WHERE item.finance_organization_id = ic.finance_organization_id
      AND item.category_id = ic.id
  ) AS number_of_items,
  COALESCE((
    SELECT jsonb_agg(jsonb_build_object('type', 'Inventory Items', 'code', item.code) ORDER BY item.code)
    FROM inventory_item item
    WHERE item.finance_organization_id = ic.finance_organization_id
      AND item.category_id = ic.id
  ), '[]'::jsonb) AS linked_by,
  ipp.code AS posting_profile_code
  FROM ${TABLE} ic
  JOIN item_posting_profile ipp ON ipp.finance_organization_id = ic.finance_organization_id AND ipp.id = ic.posting_profile_id`;

function mapRow(row: Record<string, unknown>): InventoryCategoryRow {
  const numberOfItems = row.number_of_items && typeof row.number_of_items === "object"
    ? row.number_of_items as Record<string, unknown>
    : {};
  return {
    id: Number(row.id),
    finance_organization_id: Number(row.finance_organization_id),
    code: String(row.code),
    name: String(row.name),
    description: String(row.description),
    posting_profile_code: String(row.posting_profile_code),
    status: String(row.status) as InventoryCategoryRow["status"],
    number_of_items: {
      total: Number(numberOfItems.total ?? 0),
      active: Number(numberOfItems.active ?? 0),
      inactive: Number(numberOfItems.inactive ?? 0),
    },
    linked_by: Array.isArray(row.linked_by) ? row.linked_by as InventoryCategoryRow["linked_by"] : [],
    creation_date: row.creation_date instanceof Date ? row.creation_date.toISOString() : String(row.creation_date ?? ""),
    creation_actor_type: row.creation_actor_type as InventoryCategoryRow["creation_actor_type"],
    creation_user_id: row.creation_user_id == null ? null : String(row.creation_user_id),
    creation_mutation_id: row.creation_mutation_id == null ? null : String(row.creation_mutation_id),
    updated_date: row.updated_date instanceof Date ? row.updated_date.toISOString() : String(row.updated_date ?? row.creation_date ?? ""),
    updated_actor_type: row.updated_actor_type as InventoryCategoryRow["updated_actor_type"],
    updated_user_id: row.updated_user_id == null ? null : String(row.updated_user_id),
    updated_mutation_id: row.updated_mutation_id == null ? null : String(row.updated_mutation_id),
  };
}

function assertColumn(field: string): void {
  if (!COLUMNS.includes(field as (typeof COLUMNS)[number])) throw new Error(`Unknown column: ${field}`);
}

function buildWhere(filters: Filter[], startAt = 2): { sql: string; params: unknown[] } {
  const parts: string[] = [];
  const params: unknown[] = [];
  for (const filter of filters) {
    assertColumn(filter.field);
    const col = `ic.${filter.field}`;
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
  let orderSql = "ORDER BY ic.code ASC";
  if (options?.orderBy?.length) {
    orderSql = `ORDER BY ${options.orderBy.map((order) => {
      assertColumn(order.field);
      return `ic.${order.field} ${order.direction ?? "ASC"}`;
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

export class InventoryCategoryRepo {
  constructor(private readonly db: DbExecutor) { }

  private async resolvePostingProfileId(companyId: number, postingProfileCode: string): Promise<number> {
    const { rows } = await this.db.query(
      `SELECT id::int FROM item_posting_profile WHERE finance_organization_id = $1 AND code = $2`,
      [companyId, postingProfileCode],
    );
    if (!rows[0]) throw new DataError(`Unknown posting profile ${postingProfileCode}`);
    return Number(rows[0].id);
  }

  async insert(row: InsertInventoryCategoryRow): Promise<InventoryCategoryRow> {
    const postingProfileId = await this.resolvePostingProfileId(row.finance_organization_id, row.posting_profile_code);
    const { rows } = await this.db.query(
      `INSERT INTO ${TABLE} (finance_organization_id, code, name, description, posting_profile_id, status, creation_date, creation_actor_type, creation_user_id, creation_mutation_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING id`,
      [
        row.finance_organization_id,
        row.code,
        row.name,
        row.description,
        postingProfileId,
        row.status,
        row.creation_date,
        row.creation_actor_type,
        row.creation_user_id ?? null,
        row.creation_mutation_id ?? null,
      ],
    );
    return this.getById(row.finance_organization_id, Number(rows[0].id));
  }

  async listAll(companyId: number): Promise<InventoryCategoryRow[]> {
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE ic.finance_organization_id = $1 ORDER BY ic.code`, [companyId]);
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async get(companyId: number, code: string): Promise<InventoryCategoryRow | null> {
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE ic.finance_organization_id = $1 AND ic.code = $2`, [companyId, code]);
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async batchGet(companyId: number, codes: string[]): Promise<InventoryCategoryRow[]> {
    if (!codes.length) return [];
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE ic.finance_organization_id = $1 AND ic.code = ANY($2::text[]) ORDER BY ic.code`, [companyId, codes]);
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async filter(companyId: number, filters: Filter[], options?: ListOptions): Promise<InventoryCategoryRow[]> {
    const { sql, params } = buildWhere(filters);
    const queryParams: unknown[] = [companyId, ...params];
    const tail = buildOrderLimitOffset(queryParams, options);
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE ic.finance_organization_id = $1${sql} ${tail}`, queryParams);
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async search(companyId: number, phrase: string, options?: ListOptions): Promise<InventoryCategoryRow[]> {
    const params: unknown[] = [companyId];
    const pattern = `%${phrase}%`;
    const likeParts = SEARCHABLE_COLUMNS.map((column) => {
      params.push(pattern);
      return `ic.${column}::text ILIKE $${params.length}`;
    });
    const tail = buildOrderLimitOffset(params, options);
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE ic.finance_organization_id = $1 AND (${likeParts.join(" OR ")}) ${tail}`, params);
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async getById(companyId: number, id: number): Promise<InventoryCategoryRow> {
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE ic.finance_organization_id = $1 AND ic.id = $2`, [companyId, id]);
    if (!rows[0]) throw new DataError(`Inventory category id ${id} not found`);
    return mapRow(rows[0]);
  }

  async update(companyId: number, code: string, row: UpdateInventoryCategoryRow, audit: UpdateAuditStamp): Promise<InventoryCategoryRow> {
    const postingProfileId = await this.resolvePostingProfileId(companyId, row.posting_profile_code);
    const { rows } = await this.db.query(
      `UPDATE ${TABLE}
       SET name = $3, description = $4, posting_profile_id = $5,
           updated_date = $6::timestamptz,
           updated_actor_type = $7::actor_type,
           updated_user_id = $8,
           updated_mutation_id = $9::uuid
       WHERE finance_organization_id = $1 AND code = $2
       RETURNING id`,
      [companyId, code, row.name, row.description, postingProfileId, audit.timestamp, audit.actorType, audit.userId, audit.mutationId],
    );
    if (!rows[0]) throw new DataError(`Inventory category ${code} not found`);
    return this.getById(companyId, Number(rows[0].id));
  }

  async patch(companyId: number, code: string, updates: PatchInventoryCategoryRow): Promise<InventoryCategoryRow> {
    const postingProfileId = updates.posting_profile_code === undefined
      ? undefined
      : await this.resolvePostingProfileId(companyId, updates.posting_profile_code);
    const sets: string[] = [];
    const vals: unknown[] = [];
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined && COLUMNS.includes(key as (typeof COLUMNS)[number])) {
        vals.push(value);
        sets.push(`${key} = $${vals.length}`);
      }
    }
    if (postingProfileId !== undefined) {
      vals.push(postingProfileId);
      sets.push(`posting_profile_id = $${vals.length}`);
    }
    if (updates.updated_date !== undefined) {
      vals.push(updates.updated_date);
      sets.push(`updated_date = $${vals.length}::timestamptz`);
    }
    if (updates.updated_actor_type !== undefined) {
      vals.push(updates.updated_actor_type);
      sets.push(`updated_actor_type = $${vals.length}::actor_type`);
    }
    if (updates.updated_user_id !== undefined) {
      vals.push(updates.updated_user_id);
      sets.push(`updated_user_id = $${vals.length}`);
    }
    if (updates.updated_mutation_id !== undefined) {
      vals.push(updates.updated_mutation_id);
      sets.push(`updated_mutation_id = $${vals.length}::uuid`);
    }
    if (sets.length === 0) {
      const existing = await this.get(companyId, code);
      if (!existing) throw new DataError(`Inventory category ${code} not found`);
      return existing;
    }
    vals.push(code);
    vals.push(companyId);
    const { rows } = await this.db.query(
      `UPDATE ${TABLE}
       SET ${sets.join(", ")}
       WHERE code = $${vals.length - 1} AND finance_organization_id = $${vals.length}
       RETURNING id`,
      vals,
    );
    if (!rows[0]) throw new DataError(`Inventory category ${code} not found`);
    return this.getById(companyId, Number(rows[0].id));
  }

  async delete(companyId: number, code: string): Promise<void> {
    const { rowCount } = await this.db.query(`DELETE FROM ${TABLE} WHERE finance_organization_id = $1 AND code = $2`, [companyId, code]);
    if (!rowCount) throw new DataError(`Inventory category ${code} not found`);
  }
}
