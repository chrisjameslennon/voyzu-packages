import { DataError } from "@voyzu/capability/errors";
import type { Filter } from "@voyzu/types/params";
import type { ListOptions } from "@voyzu/types/params";

import { parsePostgresTextArray, type DbExecutor } from "@voyzu/capability/db";

import type {
  GlAccountRow,
  InsertGlAccountRow,
  UpdateGlAccountRow,
  PatchGlAccountRow,
} from "./gl-account.row.types";

const TABLE = "gl_account";

const COLUMNS: readonly string[] = [
  "id", "company_id", "code", "name", "account_type", "account_category_id", "status",
  "creation_date", "creation_actor_type", "creation_user_id", "creation_mutation_id",
  "updated_date", "updated_actor_type", "updated_user_id", "updated_mutation_id",
];

const MUTABLE_COLUMNS: readonly string[] = [
  "code", "name", "account_type", "account_category_id",
];

const SEARCHABLE_COLUMNS: readonly string[] = [
  "code", "name", "account_type", "status",
];

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
  JOIN journal_line jl ON jl.gl_account_id = a.id
  JOIN journal_header jh ON jh.id = jl.journal_header_id
    AND jh.company_id = posting_company.id
    AND jh.status = 'POSTED'
  WHERE source_company.id = a.company_id
  ORDER BY posting_company.code
), ARRAY[]::text[])`;

type LinkedByRow = GlAccountRow["linked_by"][number];

function assertColumn(field: string): void {
  if (!COLUMNS.includes(field)) {
    throw new Error(`Unknown column: ${field}`);
  }
}

function buildWhere(filters: Filter[], tableAlias?: string): { sql: string; params: unknown[] } {
  const parts: string[] = [];
  const params: unknown[] = [];

  for (const f of filters) {
    assertColumn(f.field);
    const col = tableAlias ? `${tableAlias}.${f.field}` : f.field;

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

export class GlAccountRepo {
  constructor(private readonly db: DbExecutor) {}

  private async withLinkedBy(rows: GlAccountRow[]): Promise<GlAccountRow[]> {
    if (rows.length === 0) return rows;
    const ids = [...new Set(rows.map((row) => row.id))];
    const { rows: linkRows } = await this.db.query(
      `SELECT DISTINCT gl_account_id::int AS gl_account_id, pointer_type, code
       FROM (
         SELECT gl_account_id, 'Accounts Receivable Control Accounts' AS pointer_type, code FROM ar_control_account WHERE company_id = $2
         UNION ALL
          SELECT gl_account_id, 'Accounts Payable Control Accounts' AS pointer_type, code FROM ap_control_account WHERE company_id = $2
         UNION ALL
          SELECT gl_account_id, 'Tax Control Accounts' AS pointer_type, code FROM tax_control_account WHERE company_id = $2
         UNION ALL
          SELECT gl_account_id, 'Inventory Control Accounts' AS pointer_type, code FROM inventory_control_account WHERE company_id = $2
         UNION ALL
          SELECT gl_account_id, 'Bank / Cash Accounts' AS pointer_type, code FROM bank_cash_control_account WHERE company_id = $2
         UNION ALL
          SELECT gl_account_id, 'Financial Document Defaults' AS pointer_type, code
          FROM financial_document_default
          WHERE company_id = $2 AND gl_account_id IS NOT NULL
         UNION ALL
          SELECT account_link.gl_account_id, 'Item Posting Profiles' AS pointer_type, ipp.code
          FROM item_posting_profile ipp
          CROSS JOIN LATERAL (
            VALUES
              (ipp.revenue_gl_account_id),
              (ipp.cogs_gl_account_id),
              (ipp.purchase_expense_gl_account_id),
              (ipp.consumption_gl_account_id),
              (ipp.adjustment_gain_gl_account_id),
              (ipp.adjustment_loss_gl_account_id)
          ) account_link(gl_account_id)
          WHERE ipp.company_id = $2 AND account_link.gl_account_id IS NOT NULL
       ) linked
       WHERE gl_account_id = ANY($1::int[])
       ORDER BY pointer_type ASC, code ASC`,
      [ids, rows[0].company_id],
    );
    const linksByAccountId = new Map<number, LinkedByRow[]>();
    for (const row of linkRows as Array<Record<string, unknown>>) {
      const glAccountId = Number(row.gl_account_id);
      const links = linksByAccountId.get(glAccountId) ?? [];
      links.push({
        type: String(row.pointer_type) as LinkedByRow["type"],
        code: String(row.code),
      });
      linksByAccountId.set(glAccountId, links);
    }
    return rows.map((row) => ({ ...row, linked_by: linksByAccountId.get(row.id) ?? [] }));
  }

  private async withLinkedByOne(row: GlAccountRow): Promise<GlAccountRow> {
    const [enriched] = await this.withLinkedBy([row]);
    return enriched;
  }


  async insert(row: InsertGlAccountRow): Promise<GlAccountRow> {
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
    return this.withLinkedByOne(this.mapRow(rows[0]));
  }

  async get(companyId: number, code: string): Promise<GlAccountRow | null> {
    const { rows } = await this.db.query(
      `SELECT a.*, c.code AS category_code, c.name AS category_name, ${COMPANIES_WITH_POSTINGS_SQL} AS companies_with_postings
       FROM ${TABLE} a
       LEFT JOIN gl_account_category c ON c.company_id = a.company_id AND c.id = a.account_category_id
       WHERE a.company_id = $1 AND a.code = $2 AND a.status != 'DELETED'`,
      [companyId, code],
    );
    return rows[0] ? this.withLinkedByOne(this.mapRow(rows[0])) : null;
  }

  async update(companyId: number, code: string, row: UpdateGlAccountRow): Promise<GlAccountRow> {
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
    if (!rows[0]) throw new DataError(`GL account ${code} not found`);
    return this.withLinkedByOne(this.mapRow(rows[0]));
  }

  async patch(companyId: number, code: string, updates: PatchGlAccountRow): Promise<GlAccountRow> {
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
      if (!existing) throw new DataError(`GL account ${code} not found`);
      return existing;
    }

    vals.push(companyId, code);
    const sql = `UPDATE ${TABLE} SET ${sets.join(", ")} WHERE company_id = $${vals.length - 1} AND code = $${vals.length} RETURNING *`;

    const { rows } = await this.db.query(sql, vals);
    if (!rows[0]) throw new DataError(`GL account ${code} not found`);
    return this.withLinkedByOne(this.mapRow(rows[0]));
  }

  async delete(companyId: number, code: string): Promise<void> {
    await this.db.query(`DELETE FROM ${TABLE} WHERE company_id = $1 AND code = $2`, [companyId, code]);
  }
  async listAll(companyId: number): Promise<GlAccountRow[]> {
    const { rows } = await this.db.query(
      `SELECT a.*, c.code AS category_code, c.name AS category_name, ${COMPANIES_WITH_POSTINGS_SQL} AS companies_with_postings
       FROM ${TABLE} a
       LEFT JOIN gl_account_category c ON c.company_id = a.company_id AND c.id = a.account_category_id
       WHERE a.company_id = $1 AND a.status != 'DELETED'
       ORDER BY a.code ASC`,
      [companyId],
    );
    return this.withLinkedBy(rows.map((r: Record<string, unknown>) => this.mapRow(r)));
  }

  async filter(companyId: number, filters: Filter[], options?: ListOptions): Promise<GlAccountRow[]> {
    const { sql: whereSql, params } = buildWhere(filters, "a");
    const fullWhere = whereSql ? `${whereSql} AND a.company_id = $${params.length + 1} AND a.status != 'DELETED'` : `WHERE a.company_id = $${params.length + 1} AND a.status != 'DELETED'`;
    params.push(companyId);
    const tail = buildOrderLimitOffset(params, options);
    const sql = `SELECT a.*, c.code AS category_code, c.name AS category_name, ${COMPANIES_WITH_POSTINGS_SQL} AS companies_with_postings
                 FROM ${TABLE} a
                 LEFT JOIN gl_account_category c ON c.company_id = a.company_id AND c.id = a.account_category_id
                 ${fullWhere} ${tail}`;
    const { rows } = await this.db.query(sql, params);
    return this.withLinkedBy(rows.map((r: Record<string, unknown>) => this.mapRow(r)));
  }

  async search(companyId: number, phrase: string, options?: ListOptions): Promise<GlAccountRow[]> {
    const params: unknown[] = [];
    const pattern = `%${phrase}%`;

    const likeParts = SEARCHABLE_COLUMNS.map((col) => {
      params.push(pattern);
      return `a.${col}::text ILIKE $${params.length}`;
    });
    params.push(companyId);
    const whereSql = `WHERE (${likeParts.join(" OR ")}) AND a.company_id = $${params.length} AND a.status != 'DELETED'`;

    const tail = buildOrderLimitOffset(params, options);
    const sql = `SELECT a.*, c.code AS category_code, c.name AS category_name, ${COMPANIES_WITH_POSTINGS_SQL} AS companies_with_postings
                 FROM ${TABLE} a
                 LEFT JOIN gl_account_category c ON c.company_id = a.company_id AND c.id = a.account_category_id
                 ${whereSql} ${tail}`;
    const { rows } = await this.db.query(sql, params);
    return this.withLinkedBy(rows.map((r: Record<string, unknown>) => this.mapRow(r)));
  }


  async batchGet(companyId: number, codes: string[]): Promise<GlAccountRow[]> {
    if (!codes.length) return [];
    const { rows } = await this.db.query(
      `SELECT a.*, c.code AS category_code, c.name AS category_name, ${COMPANIES_WITH_POSTINGS_SQL} AS companies_with_postings
       FROM ${TABLE} a
       LEFT JOIN gl_account_category c ON c.company_id = a.company_id AND c.id = a.account_category_id
       WHERE a.company_id = $1 AND a.code = ANY($2::text[]) AND a.status != 'DELETED' ORDER BY a.code ASC`,
      [companyId, codes],
    );
    return this.withLinkedBy(rows.map((r: Record<string, unknown>) => this.mapRow(r)));
  }

  async batchDelete(companyId: number, codes: string[]): Promise<void> {
    if (!codes.length) return;
    await this.db.query(`DELETE FROM ${TABLE} WHERE company_id = $1 AND code = ANY($2::text[])`, [companyId, codes]);
  }

  private mapRow(row: Record<string, unknown>): GlAccountRow {
    const companiesWithPostings = parsePostgresTextArray(row.companies_with_postings);
    return {
      ...row,
      id: Number(row.id),
      company_id: Number(row.company_id),
      account_category_id: row.account_category_id != null ? Number(row.account_category_id) : null,
      creation_date: row.creation_date instanceof Date
        ? row.creation_date.toISOString()
        : String(row.creation_date),
      updated_date: row.updated_date instanceof Date
        ? row.updated_date.toISOString()
        : String(row.updated_date),
      linked_by: [],
      has_postings: companiesWithPostings.length > 0,
      companies_with_postings: companiesWithPostings,
    } as unknown as GlAccountRow;
  }
}

