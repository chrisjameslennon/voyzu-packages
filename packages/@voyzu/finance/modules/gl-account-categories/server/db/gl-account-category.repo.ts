import { DataError } from "@voyzu/capability/errors";
import { parsePostgresTextArray, type DbExecutor } from "@voyzu/capability/db";
import type { Filter, ListOptions } from "@voyzu/types/params";

import type {
  GlAccountCategoryRow,
  InsertGlAccountCategoryRow,
  PatchGlAccountCategoryRow,
  UpdateGlAccountCategoryRow,
} from "./gl-account-category.row.types";

const TABLE = "gl_account_category";

const COLUMNS = [
  "id",
  "finance_organization_id",
  "code",
  "name",
  "account_type",
  "sequence",
  "status",
  "creation_date",
  "creation_actor_type",
  "creation_user_id",
  "creation_mutation_id",
  "updated_date",
  "updated_actor_type",
  "updated_user_id",
  "updated_mutation_id",
] as const;

const MUTABLE_COLUMNS = ["name", "account_type", "sequence"] as const;
const SEARCHABLE_COLUMNS = ["code", "name", "account_type", "status"] as const;

const COMPANIES_WITH_POSTINGS_SQL = `COALESCE(ARRAY(
           SELECT DISTINCT posting_organization.code
           FROM finance_organization source_finance_organization
           JOIN finance_organization posting_finance_organization ON posting_finance_organization.id = source_finance_organization.id
           JOIN organization posting_organization ON posting_organization.id = posting_finance_organization.organization_id
             AND posting_organization.status != 'DELETED'
           JOIN gl_account ga ON ga.finance_organization_id = gac.finance_organization_id
             AND ga.account_category_id = gac.id
             AND ga.status != 'DELETED'
           JOIN journal_line jl ON jl.gl_account_id = ga.id
           JOIN journal_header jh ON jh.id = jl.journal_header_id
             AND jh.finance_organization_id = posting_finance_organization.id
             AND jh.status = 'POSTED'
           WHERE source_finance_organization.id = gac.finance_organization_id
           ORDER BY posting_organization.code
         ), ARRAY[]::text[])`;

const SELECT_WITH_DERIVED = `
  SELECT gac.*,
         ${COMPANIES_WITH_POSTINGS_SQL} AS companies_with_postings,
         COALESCE((
           SELECT jsonb_agg(jsonb_build_object('type', 'General Ledger Accounts', 'code', linked_account.code) ORDER BY linked_account.code)
           FROM gl_account linked_account
           WHERE linked_account.finance_organization_id = gac.finance_organization_id
             AND linked_account.account_category_id = gac.id
             AND linked_account.status != 'DELETED'
         ), '[]'::jsonb) AS linked_by
  FROM ${TABLE} gac
`;

function assertColumn(field: string): void {
  if (!COLUMNS.includes(field as typeof COLUMNS[number])) {
    throw new Error(`Unknown column: ${field}`);
  }
}

function buildWhere(filters: Filter[]): { sql: string; params: unknown[] } {
  const parts: string[] = [];
  const params: unknown[] = [];

  for (const filter of filters) {
    assertColumn(filter.field);
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
        parts.push(`${filter.field} ${filter.operator} $${params.length}`);
        break;
      case "IN":
      case "NOT IN": {
        params.push(filter.value);
        const operator = filter.operator === "IN" ? "= ANY" : "!= ALL";
        parts.push(`${filter.field} ${operator} ($${params.length}::text[])`);
        break;
      }
      case "BETWEEN": {
        const [lower, upper] = filter.value as [string | number, string | number];
        params.push(lower, upper);
        parts.push(`${filter.field} BETWEEN $${params.length - 1} AND $${params.length}`);
        break;
      }
      case "IS NULL":
        parts.push(`${filter.field} IS NULL`);
        break;
      case "IS NOT NULL":
        parts.push(`${filter.field} IS NOT NULL`);
        break;
    }
  }

  return { sql: parts.length ? `WHERE ${parts.join(" AND ")}` : "", params };
}

function buildOrderLimitOffset(params: unknown[], options?: ListOptions): string {
  let orderSql = "ORDER BY sequence ASC, code ASC";
  if (options?.orderBy?.length) {
    orderSql = `ORDER BY ${options.orderBy.map((order) => {
      assertColumn(order.field);
      return `${order.field} ${order.direction ?? "ASC"}`;
    }).join(", ")}`;
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

export class GlAccountCategoryRepo {
  constructor(private readonly db: DbExecutor) { }

  async insert(row: InsertGlAccountCategoryRow): Promise<GlAccountCategoryRow> {
    const columns: string[] = [];
    const values: unknown[] = [];
    for (const [key, value] of Object.entries(row)) {
      if (value !== undefined) {
        assertColumn(key);
        columns.push(key);
        values.push(value);
      }
    }

    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
    const { rows } = await this.db.query(
      `INSERT INTO ${TABLE} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING id`,
      values,
    );
    return this.getById(row.finance_organization_id, Number(rows[0].id));
  }

  async get(companyId: number, code: string): Promise<GlAccountCategoryRow | null> {
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE gac.finance_organization_id = $1 AND gac.code = $2 AND gac.status != 'DELETED'`,
      [companyId, code],
    );
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async getById(companyId: number, id: number): Promise<GlAccountCategoryRow> {
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE gac.finance_organization_id = $1 AND gac.id = $2`,
      [companyId, id],
    );
    if (!rows[0]) throw new DataError(`GL account category id ${id} not found`);
    return this.mapRow(rows[0]);
  }

  async update(companyId: number, code: string, row: UpdateGlAccountCategoryRow): Promise<GlAccountCategoryRow> {
    const values: unknown[] = [];
    const sets = MUTABLE_COLUMNS.map((column) => {
      values.push((row as unknown as Record<string, unknown>)[column] ?? null);
      return `${column} = $${values.length}`;
    });
    if (row.updated_user_id !== undefined) {
      values.push(row.updated_user_id);
      sets.push(`updated_user_id = $${values.length}`);
    }
    if (row.updated_actor_type !== undefined) {
      values.push(row.updated_actor_type);
      sets.push(`updated_actor_type = $${values.length}::actor_type`);
    }
    if (row.updated_date !== undefined) {
      values.push(row.updated_date);
      sets.push(`updated_date = $${values.length}::timestamptz`);
    }
    if (row.updated_mutation_id !== undefined) {
      values.push(row.updated_mutation_id);
      sets.push(`updated_mutation_id = $${values.length}::uuid`);
    }
    values.push(companyId, code);

    const { rows } = await this.db.query(
      `UPDATE ${TABLE} SET ${sets.join(", ")} WHERE finance_organization_id = $${values.length - 1} AND code = $${values.length} RETURNING id`,
      values,
    );
    if (!rows[0]) throw new DataError(`GL account category ${code} not found`);
    return this.getById(companyId, Number(rows[0].id));
  }

  async patch(companyId: number, code: string, updates: PatchGlAccountCategoryRow): Promise<GlAccountCategoryRow> {
    const sets: string[] = [];
    const values: unknown[] = [];
    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        assertColumn(key);
        values.push(value);
        if (key === "updated_actor_type") {
          sets.push(`${key} = $${values.length}::actor_type`);
        } else if (key === "updated_date") {
          sets.push(`${key} = $${values.length}::timestamptz`);
        } else if (key === "updated_mutation_id") {
          sets.push(`${key} = $${values.length}::uuid`);
        } else {
          sets.push(`${key} = $${values.length}`);
        }
      }
    }

    if (!sets.length) {
      const existing = await this.get(companyId, code);
      if (!existing) throw new DataError(`GL account category ${code} not found`);
      return existing;
    }

    values.push(companyId, code);
    const { rows } = await this.db.query(
      `UPDATE ${TABLE} SET ${sets.join(", ")} WHERE finance_organization_id = $${values.length - 1} AND code = $${values.length} RETURNING id`,
      values,
    );
    if (!rows[0]) throw new DataError(`GL account category ${code} not found`);
    return this.getById(companyId, Number(rows[0].id));
  }

  async delete(companyId: number, code: string): Promise<void> {
    await this.db.query(`DELETE FROM ${TABLE} WHERE finance_organization_id = $1 AND code = $2`, [companyId, code]);
  }

  async listAll(companyId: number): Promise<GlAccountCategoryRow[]> {
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE gac.finance_organization_id = $1 AND gac.status != 'DELETED' ORDER BY gac.sequence ASC, gac.code ASC`,
      [companyId],
    );
    return rows.map((row: Record<string, unknown>) => this.mapRow(row));
  }

  async filter(companyId: number, filters: Filter[], options?: ListOptions): Promise<GlAccountCategoryRow[]> {
    const { sql: whereSql, params } = buildWhere(filters);
    const fullWhere = whereSql
      ? `${whereSql} AND gac.finance_organization_id = $${params.length + 1} AND gac.status != 'DELETED'`
      : `WHERE gac.finance_organization_id = $${params.length + 1} AND gac.status != 'DELETED'`;
    params.push(companyId);
    const tail = buildOrderLimitOffset(params, options);
    const { rows } = await this.db.query(`${SELECT_WITH_DERIVED} ${fullWhere} ${tail}`, params);
    return rows.map((row: Record<string, unknown>) => this.mapRow(row));
  }

  async search(companyId: number, phrase: string, options?: ListOptions): Promise<GlAccountCategoryRow[]> {
    const params: unknown[] = [];
    const pattern = `%${phrase}%`;
    const likeParts = SEARCHABLE_COLUMNS.map((column) => {
      params.push(pattern);
      return `${column}::text ILIKE $${params.length}`;
    });
    params.push(companyId);
    const whereSql = `WHERE (${likeParts.join(" OR ")}) AND gac.finance_organization_id = $${params.length} AND gac.status != 'DELETED'`;
    const tail = buildOrderLimitOffset(params, options);
    const { rows } = await this.db.query(`${SELECT_WITH_DERIVED} ${whereSql} ${tail}`, params);
    return rows.map((row: Record<string, unknown>) => this.mapRow(row));
  }

  async batchGet(companyId: number, codes: string[]): Promise<GlAccountCategoryRow[]> {
    if (!codes.length) return [];
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE gac.finance_organization_id = $1 AND gac.code = ANY($2::text[]) AND gac.status != 'DELETED' ORDER BY gac.sequence ASC, gac.code ASC`,
      [companyId, codes],
    );
    return rows.map((row: Record<string, unknown>) => this.mapRow(row));
  }

  async batchDelete(companyId: number, codes: string[]): Promise<void> {
    if (!codes.length) return;
    await this.db.query(`DELETE FROM ${TABLE} WHERE finance_organization_id = $1 AND code = ANY($2::text[])`, [companyId, codes]);
  }
  private mapRow(row: Record<string, unknown>): GlAccountCategoryRow {
    const companiesWithPostings = parsePostgresTextArray(row.companies_with_postings);
    return {
      ...row,
      id: Number(row.id),
      finance_organization_id: Number(row.finance_organization_id),
      sequence: Number(row.sequence),
      creation_date: row.creation_date instanceof Date ? row.creation_date.toISOString() : String(row.creation_date),
      updated_date: row.updated_date instanceof Date ? row.updated_date.toISOString() : String(row.updated_date),
      has_postings: companiesWithPostings.length > 0,
      companies_with_postings: companiesWithPostings,
      linked_by: Array.isArray(row.linked_by) ? row.linked_by as GlAccountCategoryRow["linked_by"] : [],
    } as GlAccountCategoryRow;
  }
}
