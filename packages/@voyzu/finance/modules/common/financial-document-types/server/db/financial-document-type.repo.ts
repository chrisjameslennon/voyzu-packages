import { DataError } from "@voyzu/capability/errors";
import type { ActorType } from "@voyzu/finance/types/modules/core";
import type { Filter } from "@voyzu/types/params";
import type { ListOptions } from "@voyzu/types/params";

import type { DbExecutor } from "@voyzu/capability/db";

import type {
  FinancialDocumentTypeRow,
  InsertFinancialDocumentTypeRow,
  UpdateFinancialDocumentTypeRow,
  PatchFinancialDocumentTypeRow,
} from "./financial-document-type.row.types";

const TABLE = "financial_document_type";

const COLUMNS: readonly string[] = [
  "code", "name", "description", "document_purpose", "primary_supporting_ledger",
  "supports_dimensions", "cash_movement", "supports_items", "status",
  "creation_date", "creation_actor_type", "creation_user_id", "creation_mutation_id",
  "updated_date", "updated_actor_type", "updated_user_id", "updated_mutation_id",
];

const MUTABLE_COLUMNS: readonly string[] = ["code", "name", "description", "document_purpose", "primary_supporting_ledger", "status"];

const SEARCHABLE_COLUMNS: readonly string[] = ["code", "name", "description", "document_purpose", "primary_supporting_ledger", "status"];

const BASE_SELECT = `
  SELECT
    d.code, d.name, d.description, d.document_purpose, d.primary_supporting_ledger, d.status,
    d.supports_dimensions, d.cash_movement, d.supports_items,
    d.creation_date, d.creation_actor_type, d.creation_user_id, d.creation_mutation_id,
    d.updated_date, d.updated_actor_type, d.updated_user_id, d.updated_mutation_id
  FROM ${TABLE} d
`;

function assertColumn(field: string): void {
  if (!COLUMNS.includes(field)) throw new Error(`Unknown column: ${field}`);
}

function buildWhere(filters: Filter[]): { sql: string; params: unknown[] } {
  const parts: string[] = [];
  const params: unknown[] = [];
  for (const f of filters) {
    assertColumn(f.field);
    const col = `d.${f.field}`;
    switch (f.operator) {
      case "=":
      case "!=":
      case "<":
      case "<=":
      case ">":
      case ">=":
      case "LIKE":
      case "ILIKE":
        params.push(f.value);
        parts.push(`${col} ${f.operator} $${params.length}`);
        break;
      case "IN":
      case "NOT IN": {
        params.push(f.value);
        const op = f.operator === "IN" ? "= ANY" : "!= ALL";
        parts.push(`${col} ${op} ($${params.length}::text[])`);
        break;
      }
      case "BETWEEN": {
        const [lo, hi] = f.value as [string | number, string | number];
        params.push(lo, hi);
        parts.push(`${col} BETWEEN $${params.length - 1} AND $${params.length}`);
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
  return { sql: parts.length ? `WHERE ${parts.join(" AND ")}` : "", params };
}

function buildOrderLimitOffset(params: unknown[], options?: ListOptions): string {
  let orderSql = "ORDER BY d.code ASC";
  if (options?.orderBy?.length) {
    const parts = options.orderBy.map((ob) => {
      assertColumn(ob.field);
      return `d.${ob.field} ${ob.direction ?? "ASC"}`;
    });
    orderSql = `ORDER BY ${parts.join(", ")}`;
  }
  let limitOffset = "";
  const limit = options?.limit ?? options?.pagination?.pageSize;
  const offset = options?.offset ?? (
    options?.pagination ? (options.pagination.page - 1) * options.pagination.pageSize : undefined
  );
  if (limit !== undefined) { params.push(limit); limitOffset += ` LIMIT $${params.length}`; }
  if (offset !== undefined) { params.push(offset); limitOffset += ` OFFSET $${params.length}`; }
  return `${orderSql}${limitOffset}`;
}

export class FinancialDocumentTypeRepo {
  constructor(private readonly db: DbExecutor) { }

  async insert(row: InsertFinancialDocumentTypeRow): Promise<FinancialDocumentTypeRow> {
    const cols: string[] = [];
    const vals: unknown[] = [];
    for (const [key, value] of Object.entries(row)) {
      if (value !== undefined) {
        assertColumn(key);
        cols.push(key);
        vals.push(value);
      }
    }
    const placeholders = vals.map((_, i) => `$${i + 1}`).join(", ");
    const sql = `INSERT INTO ${TABLE} (${cols.join(", ")}) VALUES (${placeholders}) RETURNING code`;
    const { rows } = await this.db.query(sql, vals);
    return this.getByCodeInternal(rows[0].code as string);
  }

  async get(code: string): Promise<FinancialDocumentTypeRow | null> {
    const { rows } = await this.db.query(
      `${BASE_SELECT} WHERE d.code = $1 AND d.status != 'DELETED'`,
      [code],
    );
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async update(code: string, row: UpdateFinancialDocumentTypeRow): Promise<FinancialDocumentTypeRow> {
    const vals: unknown[] = [];
    const sets = MUTABLE_COLUMNS.map((col) => {
      const val = (row as unknown as Record<string, unknown>)[col];
      vals.push(val !== undefined ? val : null);
      return `${col} = $${vals.length}`;
    });
    if (row.updated_user_id !== undefined) {
      vals.push(row.updated_user_id);
      sets.push(`updated_user_id = $${vals.length}`);
    }
    vals.push(code);
    const sql = `UPDATE ${TABLE} SET ${sets.join(", ")} WHERE code = $${vals.length} RETURNING code`;
    const { rows } = await this.db.query(sql, vals);
    if (!rows[0]) throw new DataError(`Financial document type ${code} not found`);
    return this.getByCodeInternal(rows[0].code as string);
  }

  async patch(code: string, updates: PatchFinancialDocumentTypeRow): Promise<FinancialDocumentTypeRow> {
    const sets: string[] = [];
    const vals: unknown[] = [];
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        assertColumn(key);
        vals.push(value);
        sets.push(`${key} = $${vals.length}`);
      }
    }
    if (sets.length > 0) {
      vals.push(code);
      await this.db.query(`UPDATE ${TABLE} SET ${sets.join(", ")} WHERE code = $${vals.length}`, vals);
    }
    const existing = await this.get(code);
    if (!existing) throw new DataError(`Financial document type ${code} not found`);
    return existing;
  }

  async delete(code: string): Promise<void> {
    await this.db.query(`DELETE FROM ${TABLE} WHERE code = $1`, [code]);
  }

  async listAll(): Promise<FinancialDocumentTypeRow[]> {
    const { rows } = await this.db.query(
      `${BASE_SELECT} WHERE d.status != 'DELETED' ORDER BY d.code ASC`,
    );
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async batchDelete(codes: string[]): Promise<void> {
    if (!codes.length) return;
    await this.db.query(`DELETE FROM ${TABLE} WHERE code = ANY($1::text[])`, [codes]);
  }

  async batchGet(codes: string[]): Promise<FinancialDocumentTypeRow[]> {
    if (!codes.length) return [];
    const { rows } = await this.db.query(
      `${BASE_SELECT} WHERE d.code = ANY($1::text[]) AND d.status != 'DELETED' ORDER BY d.code ASC`,
      [codes],
    );
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async filter(filters: Filter[], options?: ListOptions): Promise<FinancialDocumentTypeRow[]> {
    const { sql: whereSql, params } = buildWhere(filters);
    const fullWhere = whereSql
      ? `${whereSql} AND d.status != 'DELETED'`
      : `WHERE d.status != 'DELETED'`;
    const tail = buildOrderLimitOffset(params, options);
    const sql = `${BASE_SELECT} ${fullWhere} ${tail}`;
    const { rows } = await this.db.query(sql, params);
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async search(phrase: string, options?: ListOptions): Promise<FinancialDocumentTypeRow[]> {
    const params: unknown[] = [];
    const pattern = `%${phrase}%`;
    const likeParts = SEARCHABLE_COLUMNS.map((col) => {
      params.push(pattern);
      return `d.${col}::text ILIKE $${params.length}`;
    });
    const whereSql = `WHERE (${likeParts.join(" OR ")}) AND d.status != 'DELETED'`;
    const tail = buildOrderLimitOffset(params, options);
    const sql = `${BASE_SELECT} ${whereSql} ${tail}`;
    const { rows } = await this.db.query(sql, params);
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }
  private async getByCodeInternal(code: string): Promise<FinancialDocumentTypeRow> {
    const { rows } = await this.db.query(
      `${BASE_SELECT} WHERE d.code = $1`,
      [code],
    );
    if (!rows[0]) throw new DataError(`Financial document type ${code} not found`);
    return this.mapRow(rows[0]);
  }

  private mapRow(row: Record<string, unknown>): FinancialDocumentTypeRow {
    return {
      code: row.code as string,
      name: row.name as string,
      description: row.description as string,
      document_purpose: row.document_purpose as string,
      primary_supporting_ledger: row.primary_supporting_ledger as string,
      supports_dimensions: Boolean(row.supports_dimensions),
      cash_movement: Boolean(row.cash_movement),
      supports_items: Boolean(row.supports_items),
      status: row.status as string,
      creation_date: row.creation_date instanceof Date ? row.creation_date.toISOString() : String(row.creation_date),
      creation_actor_type: row.creation_actor_type as ActorType,
      creation_user_id: (row.creation_user_id as string | null) ?? null,
      creation_mutation_id: (row.creation_mutation_id as string | null) ?? null,
      updated_date: row.updated_date instanceof Date ? row.updated_date.toISOString() : String(row.updated_date),
      updated_actor_type: row.updated_actor_type as ActorType,
      updated_user_id: (row.updated_user_id as string | null) ?? null,
      updated_mutation_id: (row.updated_mutation_id as string | null) ?? null,
    };
  }
}
