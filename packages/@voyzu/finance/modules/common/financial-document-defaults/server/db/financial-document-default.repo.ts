import { DataError } from "@voyzu/capability/errors";
import type { Filter } from "@voyzu/types/params";
import type { ListOptions } from "@voyzu/types/params";

import type { DbExecutor } from "@voyzu/capability/db";

import type {
  FinancialDocumentDefaultRow,
  InsertFinancialDocumentDefaultRow,
  UpdateFinancialDocumentDefaultRow,
  PatchFinancialDocumentDefaultRow,
} from "./financial-document-default.row.types";

const TABLE = "financial_document_default";

const COLUMNS: readonly string[] = [
  "finance_company_id", "document_code", "code", "name", "target_type", "allowed_account_types", "override_property_name", "override_scope",
  "gl_account_id", "bank_cash_control_account_id", "status",
  "creation_date", "creation_actor_type", "creation_user_id", "creation_mutation_id",
  "updated_date", "updated_actor_type", "updated_user_id", "updated_mutation_id",
];

const MUTABLE_COLUMNS: readonly string[] = [
  "gl_account_id", "bank_cash_control_account_id",
];

const SEARCHABLE_COLUMNS: readonly string[] = [
  "document_code", "code", "name", "target_type", "override_property_name", "override_scope", "status",
];

export interface FinancialDocumentDefaultKey {
  documentCode: string;
  code: string;
}

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
  let orderSql = "ORDER BY p.document_code ASC, p.code ASC";
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
  if (limit !== undefined) { params.push(limit); limitOffset += ` LIMIT $${params.length}`; }
  if (offset !== undefined) { params.push(offset); limitOffset += ` OFFSET $${params.length}`; }

  return `${orderSql}${limitOffset}`;
}

const SELECT_SQL = `
  SELECT p.*,
         ga.code AS gl_account_code,
         ga.name AS gl_account_name,
         ga.account_type AS gl_account_type,
         bca.code AS bank_cash_code,
         bca.type AS bank_cash_type,
         bank_ga.id AS bank_cash_gl_account_id,
         bank_ga.code AS bank_cash_gl_account_code,
         bank_ga.name AS bank_cash_gl_account_name,
         bank_ga.account_type AS bank_cash_gl_account_type`;
const JOIN_SQL = `
  LEFT JOIN gl_account ga ON ga.finance_company_id = p.finance_company_id AND ga.id = p.gl_account_id
  LEFT JOIN bank_cash_control_account bca ON bca.finance_company_id = p.finance_company_id AND bca.id = p.bank_cash_control_account_id
  LEFT JOIN gl_account bank_ga ON bank_ga.finance_company_id = p.finance_company_id AND bank_ga.id = bca.gl_account_id`;

export class FinancialDocumentDefaultRepo {
  constructor(private readonly db: DbExecutor) { }

  async insert(row: InsertFinancialDocumentDefaultRow): Promise<FinancialDocumentDefaultRow> {
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
    const sql = `INSERT INTO ${TABLE} (${cols.join(", ")}) VALUES (${placeholders}) RETURNING document_code, code`;

    const { rows } = await this.db.query(sql, vals);
    return this.getByKeyInternal(row.finance_company_id, String(rows[0].document_code), String(rows[0].code));
  }

  async get(companyId: number, documentCode: string, code: string): Promise<FinancialDocumentDefaultRow | null> {
    const { rows } = await this.db.query(
      `${SELECT_SQL} FROM ${TABLE} p ${JOIN_SQL} WHERE p.finance_company_id = $1 AND p.document_code = $2 AND p.code = $3`,
      [companyId, documentCode, code],
    );
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async update(companyId: number, documentCode: string, code: string, row: UpdateFinancialDocumentDefaultRow): Promise<FinancialDocumentDefaultRow> {
    const vals: unknown[] = [];
    const sets: string[] = [];
    for (const col of MUTABLE_COLUMNS) {
      const val = (row as unknown as Record<string, unknown>)[col];
      if (val !== undefined) {
        vals.push(val);
        sets.push(`${col} = $${vals.length}`);
      }
    }

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

    if (sets.length === 0) {
      const existing = await this.get(companyId, documentCode, code);
      if (!existing) throw new DataError(`Posting code ${documentCode}/${code} not found`);
      return existing;
    }

    vals.push(companyId, documentCode, code);
    const sql = `UPDATE ${TABLE} SET ${sets.join(", ")} WHERE finance_company_id = $${vals.length - 2} AND document_code = $${vals.length - 1} AND code = $${vals.length} RETURNING document_code, code`;

    const { rows } = await this.db.query(sql, vals);
    if (!rows[0]) throw new DataError(`Posting code ${documentCode}/${code} not found`);
    return this.getByKeyInternal(companyId, String(rows[0].document_code), String(rows[0].code));
  }

  async patch(companyId: number, documentCode: string, code: string, updates: PatchFinancialDocumentDefaultRow): Promise<FinancialDocumentDefaultRow> {
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
      const existing = await this.get(companyId, documentCode, code);
      if (!existing) throw new DataError(`Posting code ${documentCode}/${code} not found`);
      return existing;
    }

    vals.push(companyId, documentCode, code);
    const sql = `UPDATE ${TABLE} SET ${sets.join(", ")} WHERE finance_company_id = $${vals.length - 2} AND document_code = $${vals.length - 1} AND code = $${vals.length} RETURNING document_code, code`;

    const { rows } = await this.db.query(sql, vals);
    if (!rows[0]) throw new DataError(`Posting code ${documentCode}/${code} not found`);
    return this.getByKeyInternal(companyId, String(rows[0].document_code), String(rows[0].code));
  }

  async delete(companyId: number, documentCode: string, code: string): Promise<void> {
    await this.db.query(`DELETE FROM ${TABLE} WHERE finance_company_id = $1 AND document_code = $2 AND code = $3`, [companyId, documentCode, code]);
  }

  async listAll(companyId: number): Promise<FinancialDocumentDefaultRow[]> {
    const { rows } = await this.db.query(
      `${SELECT_SQL} FROM ${TABLE} p ${JOIN_SQL} WHERE p.finance_company_id = $1 ORDER BY p.document_code ASC, p.code ASC`,
      [companyId],
    );
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async batchDelete(companyId: number, keys: FinancialDocumentDefaultKey[]): Promise<void> {
    if (!keys.length) return;
    await this.db.query(
      `DELETE FROM ${TABLE}
       WHERE finance_company_id = $1
         AND (document_code, code) IN (
         SELECT document_code, code
         FROM UNNEST($2::text[], $3::text[]) AS keys(document_code, code)
       )`,
      [companyId, keys.map((k) => k.documentCode), keys.map((k) => k.code)],
    );
  }

  async countActiveByBankCashControlAccountId(bankCashControlAccountId: number): Promise<number> {
    const { rows } = await this.db.query(
      `SELECT COUNT(*)::int AS count
       FROM ${TABLE}
       WHERE bank_cash_control_account_id = $1
         AND status = 'ACTIVE'`,
      [bankCashControlAccountId],
    );
    return Number(rows[0]?.count ?? 0);
  }

  async getBankCashControlAccount(companyId: number, bankCashControlAccountId: number): Promise<{ id: number; status: "ACTIVE" | "INACTIVE" } | null> {
    const { rows } = await this.db.query(
      `SELECT id, status
       FROM bank_cash_control_account
       WHERE finance_company_id = $1
         AND id = $2`,
      [companyId, bankCashControlAccountId],
    );
    return rows[0] ? { id: Number(rows[0].id), status: rows[0].status as "ACTIVE" | "INACTIVE" } : null;
  }

  async filter(companyId: number, filters: Filter[], options?: ListOptions): Promise<FinancialDocumentDefaultRow[]> {
    const { sql: whereSql, params } = buildWhere(filters, "p");
    const shiftedWhere = whereSql.replace(/\$(\d+)/g, (_match, n: string) => `$${Number(n) + 1}`);
    const scopedParams: unknown[] = [companyId, ...params];
    const scopedWhere = shiftedWhere ? `WHERE p.finance_company_id = $1 AND ${shiftedWhere.slice("WHERE ".length)}` : "WHERE p.finance_company_id = $1";
    const tail = buildOrderLimitOffset(scopedParams, options);
    const sql = `${SELECT_SQL} FROM ${TABLE} p ${JOIN_SQL} ${scopedWhere} ${tail}`;
    const { rows } = await this.db.query(sql, scopedParams);
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async search(companyId: number, phrase: string, options?: ListOptions): Promise<FinancialDocumentDefaultRow[]> {
    const params: unknown[] = [companyId];
    const pattern = `%${phrase}%`;

    const likeParts = SEARCHABLE_COLUMNS.map((col) => {
      params.push(pattern);
      return `p.${col}::text ILIKE $${params.length}`;
    });
    params.push(pattern, pattern, pattern, pattern);
    const whereSql = `WHERE p.finance_company_id = $1 AND (${likeParts.join(" OR ")}
      OR ga.code::text ILIKE $${params.length - 3}
      OR ga.name::text ILIKE $${params.length - 2}
      OR bca.code::text ILIKE $${params.length - 1}
      OR bca.code::text ILIKE $${params.length})`;

    const tail = buildOrderLimitOffset(params, options);
    const sql = `${SELECT_SQL} FROM ${TABLE} p ${JOIN_SQL} ${whereSql} ${tail}`;
    const { rows } = await this.db.query(sql, params);
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async batchGet(companyId: number, keys: FinancialDocumentDefaultKey[]): Promise<FinancialDocumentDefaultRow[]> {
    if (!keys.length) return [];
    const { rows } = await this.db.query(
      `${SELECT_SQL} FROM ${TABLE} p ${JOIN_SQL}
       WHERE (p.document_code, p.code) IN (
         SELECT document_code, code
         FROM UNNEST($2::text[], $3::text[]) AS keys(document_code, code)
       )
         AND p.finance_company_id = $1
       ORDER BY p.document_code ASC, p.code ASC`,
      [companyId, keys.map((k) => k.documentCode), keys.map((k) => k.code)],
    );
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async getGlAccount(companyId: number, glAccountId: number): Promise<{ id: number; accountType: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE"; status: "ACTIVE" | "INACTIVE" } | null> {
    const { rows } = await this.db.query(
      `SELECT id, account_type, status FROM gl_account WHERE finance_company_id = $1 AND id = $2`,
      [companyId, glAccountId],
    );
    return rows[0] ? {
      id: Number(rows[0].id),
      accountType: rows[0].account_type as "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE",
      status: rows[0].status as "ACTIVE" | "INACTIVE",
    } : null;
  }

  private async getByKeyInternal(companyId: number, documentCode: string, code: string): Promise<FinancialDocumentDefaultRow> {
    const row = await this.get(companyId, documentCode, code);
    if (!row) throw new DataError(`Posting code ${documentCode}/${code} not found`);
    return row;
  }

  private mapRow(row: Record<string, unknown>): FinancialDocumentDefaultRow {
    return {
      ...row,
      finance_company_id: Number(row.finance_company_id),
      gl_account_id: row.gl_account_id == null ? null : Number(row.gl_account_id),
      bank_cash_control_account_id: row.bank_cash_control_account_id == null ? null : Number(row.bank_cash_control_account_id),
      bank_cash_gl_account_id: row.bank_cash_gl_account_id == null ? null : Number(row.bank_cash_gl_account_id),
      allowed_account_types: Array.isArray(row.allowed_account_types) ? row.allowed_account_types : [],
      creation_date: row.creation_date instanceof Date
        ? row.creation_date.toISOString()
        : String(row.creation_date),
      updated_date: row.updated_date instanceof Date
        ? row.updated_date.toISOString()
        : String(row.updated_date),
    } as FinancialDocumentDefaultRow;
  }
}
