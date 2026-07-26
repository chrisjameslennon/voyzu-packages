import { DataError } from "@voyzu/capability/errors";
import type { Filter } from "@voyzu/types/params";
import type { ListOptions } from "@voyzu/types/params";

import { parsePostgresTextArray, type DbExecutor } from "@voyzu/capability/db";

import type { DimensionRow, InsertDimensionRow, UpdateDimensionRow, PatchDimensionRow } from "./dimension.row.types";

const TABLE = "dimension";

const COLUMNS: readonly string[] = [
  "id", "company_id", "code", "name", "status",
  "creation_date", "creation_actor_type", "creation_user_id", "creation_mutation_id",
  "updated_date", "updated_actor_type", "updated_user_id", "updated_mutation_id",
];

const MUTABLE_COLUMNS: readonly string[] = ["name"];

const SEARCHABLE_COLUMNS: readonly string[] = ["code", "name", "status"];

const COMPANIES_WITH_POSTINGS_SQL = `COALESCE(ARRAY(
  SELECT DISTINCT posting_company.code
  FROM company source_company
  JOIN company posting_company ON (
    (source_company.is_template = true
      AND posting_company.organization_id = source_company.organization_id
      AND posting_company.is_template = false
      AND posting_company.status != 'DELETED'
      AND posting_company.use_organization_standard_settings = true)
    OR (source_company.is_template = false AND posting_company.id = source_company.id)
  )
  JOIN journal_line_dimension jld ON jld.dimension_id = d.id
  JOIN journal_line jl ON jl.id = jld.journal_line_id
  JOIN journal_header jh ON jh.id = jl.journal_header_id
    AND jh.company_id = posting_company.id
    AND jh.status = 'POSTED'
  WHERE source_company.id = d.company_id
  ORDER BY posting_company.code
), ARRAY[]::text[])`;

const SELECT_WITH_DERIVED = `SELECT d.*, ${COMPANIES_WITH_POSTINGS_SQL} AS companies_with_postings FROM ${TABLE} d`;

function assertColumn(field: string): void {
  if (!COLUMNS.includes(field)) {
    throw new Error(`Unknown column: ${field}`);
  }
}

function buildWhere(filters: Filter[]): { sql: string; params: unknown[] } {
  const parts: string[] = [];
  const params: unknown[] = [];

  for (const f of filters) {
    assertColumn(f.field);

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
        parts.push(`${f.field} ${f.operator} $${params.length}`);
        break;
      case "IN":
      case "NOT IN": {
        params.push(f.value);
        const op = f.operator === "IN" ? "= ANY" : "!= ALL";
        parts.push(`${f.field} ${op} ($${params.length}::text[])`);
        break;
      }
      case "BETWEEN": {
        const [lo, hi] = f.value as [string | number, string | number];
        params.push(lo, hi);
        parts.push(`${f.field} BETWEEN $${params.length - 1} AND $${params.length}`);
        break;
      }
      case "IS NULL":
        parts.push(`${f.field} IS NULL`);
        break;
      case "IS NOT NULL":
        parts.push(`${f.field} IS NOT NULL`);
        break;
    }
  }

  return { sql: parts.length ? `WHERE ${parts.join(" AND ")}` : "", params };
}

function buildOrderLimitOffset(params: unknown[], options?: ListOptions): string {
  let orderSql = "ORDER BY code ASC";
  if (options?.orderBy?.length) {
    const parts = options.orderBy.map((ob) => {
      assertColumn(ob.field);
      return `${ob.field} ${ob.direction ?? "ASC"}`;
    });
    orderSql = `ORDER BY ${parts.join(", ")}`;
  }

  let limitOffset = "";

  const limit = options?.limit ?? options?.pagination?.pageSize;
  const offset = options?.offset ?? (
    options?.pagination ? (options.pagination.page - 1) * options.pagination.pageSize : undefined
  );

  if (limit !== undefined) {
    params.push(limit);
    limitOffset += ` LIMIT $${params.length}`;
  }
  if (offset !== undefined) {
    params.push(offset);
    limitOffset += ` OFFSET $${params.length}`;
  }

  return `${orderSql}${limitOffset}`;
}

export class DimensionRepo {
  constructor(private readonly db: DbExecutor) {}

  async insert(row: InsertDimensionRow): Promise<DimensionRow> {
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
    const sql = `INSERT INTO ${TABLE} (${cols.join(", ")}) VALUES (${placeholders}) RETURNING *`;

    const { rows } = await this.db.query(sql, vals);
    return this.mapRow(rows[0]);
  }

  async get(companyId: number, code: string): Promise<DimensionRow | null> {
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE d.company_id = $1 AND d.code = $2 AND d.status != 'DELETED'`,
      [companyId, code],
    );
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async update(companyId: number, code: string, row: UpdateDimensionRow): Promise<DimensionRow> {
    const vals: unknown[] = [];
    const sets = MUTABLE_COLUMNS.map((col) => {
      vals.push((row as unknown as Record<string, unknown>)[col] ?? null);
      return `${col} = $${vals.length}`;
    });

    if (row.updated_user_id !== undefined) {
      vals.push(row.updated_user_id);
      sets.push(`updated_user_id = $${vals.length}`);
    }
    if (row.updated_actor_type !== undefined) {
      vals.push(row.updated_actor_type);
      sets.push(`updated_actor_type = $${vals.length}::actor_type`);
    }
    if (row.updated_date !== undefined) {
      vals.push(row.updated_date);
      sets.push(`updated_date = $${vals.length}::timestamptz`);
    }
    if (row.updated_mutation_id !== undefined) {
      vals.push(row.updated_mutation_id);
      sets.push(`updated_mutation_id = $${vals.length}::uuid`);
    }

    vals.push(companyId, code);
    const sql = `UPDATE ${TABLE} SET ${sets.join(", ")} WHERE company_id = $${vals.length - 1} AND code = $${vals.length} RETURNING *`;

    const { rows } = await this.db.query(sql, vals);
    if (!rows[0]) throw new DataError(`Dimension ${code} not found`);
    const updated = await this.get(companyId, String(rows[0].code));
    return updated ?? this.mapRow(rows[0]);
  }

  async patch(companyId: number, code: string, updates: PatchDimensionRow): Promise<DimensionRow> {
    const sets: string[] = [];
    const vals: unknown[] = [];

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        assertColumn(key);
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

    if (sets.length === 0) {
      const existing = await this.get(companyId, code);
      if (!existing) throw new DataError(`Dimension ${code} not found`);
      return existing;
    }

    vals.push(companyId, code);
    const sql = `UPDATE ${TABLE} SET ${sets.join(", ")} WHERE company_id = $${vals.length - 1} AND code = $${vals.length} RETURNING *`;

    const { rows } = await this.db.query(sql, vals);
    if (!rows[0]) throw new DataError(`Dimension ${code} not found`);
    const updated = await this.get(companyId, String(rows[0].code));
    return updated ?? this.mapRow(rows[0]);
  }

  async delete(companyId: number, code: string): Promise<void> {
    await this.db.query(`DELETE FROM ${TABLE} WHERE company_id = $1 AND code = $2`, [companyId, code]);
  }
  async listAll(companyId: number): Promise<DimensionRow[]> {
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE d.company_id = $1 AND d.status != 'DELETED' ORDER BY d.code ASC`,
      [companyId],
    );
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async filter(companyId: number, filters: Filter[], options?: ListOptions): Promise<DimensionRow[]> {
    const { sql: whereSql, params } = buildWhere(filters);
    const shiftedWhere = whereSql.replace(/\$(\d+)/g, (_match, n: string) => `$${Number(n) + 1}`);
    const scopedParams: unknown[] = [companyId, ...params];
    const fullWhere = shiftedWhere ? `WHERE d.company_id = $1 AND ${shiftedWhere.slice("WHERE ".length)} AND d.status != 'DELETED'` : `WHERE d.company_id = $1 AND d.status != 'DELETED'`;
    const tail = buildOrderLimitOffset(scopedParams, options);
    const sql = `${SELECT_WITH_DERIVED} ${fullWhere} ${tail}`;
    const { rows } = await this.db.query(sql, scopedParams);
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async search(companyId: number, phrase: string, options?: ListOptions): Promise<DimensionRow[]> {
    const params: unknown[] = [companyId];
    const pattern = `%${phrase}%`;

    const likeParts = SEARCHABLE_COLUMNS.map((col) => {
      params.push(pattern);
      return `d.${col}::text ILIKE $${params.length}`;
    });
    const whereSql = `WHERE d.company_id = $1 AND (${likeParts.join(" OR ")}) AND d.status != 'DELETED'`;

    const tail = buildOrderLimitOffset(params, options);
    const sql = `${SELECT_WITH_DERIVED} ${whereSql} ${tail}`;
    const { rows } = await this.db.query(sql, params);
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async batchGet(companyId: number, codes: string[]): Promise<DimensionRow[]> {
    if (!codes.length) return [];
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE d.company_id = $1 AND d.code = ANY($2::text[]) AND d.status != 'DELETED' ORDER BY d.code ASC`,
      [companyId, codes],
    );
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async batchDelete(companyId: number, codes: string[]): Promise<void> {
    if (!codes.length) return;
    await this.db.query(`DELETE FROM ${TABLE} WHERE company_id = $1 AND code = ANY($2::text[])`, [companyId, codes]);
  }

  private mapRow(row: Record<string, unknown>): DimensionRow {
    const companiesWithPostings = parsePostgresTextArray(row.companies_with_postings);
    return {
      ...row,
      id: Number(row.id),
      company_id: Number(row.company_id),
      has_postings: companiesWithPostings.length > 0,
      companies_with_postings: companiesWithPostings,
      creation_date: row.creation_date instanceof Date
        ? row.creation_date.toISOString()
        : String(row.creation_date),
      updated_date: row.updated_date instanceof Date
        ? row.updated_date.toISOString()
        : String(row.updated_date),
    } as DimensionRow;
  }
}
