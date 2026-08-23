import type { AccountType } from "@voyzu/finance/types/modules/core";
import { DataError } from "@voyzu/capability/errors";
import { parsePostgresTextArray, type DbExecutor } from "@voyzu/capability/db";
import type { Filter, ListOptions } from "@voyzu/types/params";
import type { BankCashAccountRow, InsertBankCashAccountRow, PatchBankCashAccountRow } from "./bank-cash-account.row.types";

const TABLE = "bank_cash_control_account";
const COLUMNS = [
  "code", "type", "gl_account_id",
  "bank_name", "bank_branch_name", "bank_account_identifier", "cash_account_identifier", "status",
  "updated_date", "updated_actor_type", "updated_user_id", "updated_mutation_id",
] as const;
const SEARCHABLE_COLUMNS = ["code", "type", "bank_name", "bank_branch_name", "bank_account_identifier", "cash_account_identifier", "status"] as const;

const COMPANIES_WITH_POSTINGS_SQL = `COALESCE(ARRAY(
           SELECT DISTINCT posting_company.code
           FROM finance_company source_finance_company
           JOIN finance_company posting_finance_company ON (
             (source_finance_company.is_template = true
               AND posting_finance_company.is_template = false
               AND posting_finance_company.use_organization_standard_settings = true)
             OR (source_finance_company.is_template = false AND posting_finance_company.id = source_finance_company.id)
           )
           JOIN journal_line jl ON jl.gl_account_id = bca.gl_account_id
           JOIN journal_header jh ON jh.id = jl.journal_header_id
             AND jh.finance_company_id = posting_finance_company.id
             AND jh.status = 'POSTED'
           JOIN company posting_company ON posting_company.id = posting_finance_company.company_id
             AND posting_company.status != 'DELETED'
           WHERE source_finance_company.id = bca.finance_company_id
           ORDER BY posting_company.code
         ), ARRAY[]::text[])`;

const LINKED_BY_SQL = `COALESCE(ARRAY(
           SELECT DISTINCT fdd.code
           FROM financial_document_default fdd
           WHERE fdd.finance_company_id = bca.finance_company_id
             AND fdd.bank_cash_control_account_id = bca.id
           ORDER BY fdd.code
         ), ARRAY[]::text[])`;

const SELECT_SQL = `
  SELECT bca.*,
         ga.code AS gl_account_code,
         ga.name AS gl_account_name,
         ga.account_type AS gl_account_type,
         ${COMPANIES_WITH_POSTINGS_SQL} AS companies_with_postings,
         ${LINKED_BY_SQL} AS linked_by
  FROM ${TABLE} bca
  LEFT JOIN gl_account ga ON ga.finance_company_id = bca.finance_company_id AND ga.id = bca.gl_account_id
`;

function mapRow(row: Record<string, unknown>): BankCashAccountRow {
  const companiesWithPostings = parsePostgresTextArray(row.companies_with_postings);
  const linkedBy = parsePostgresTextArray(row.linked_by).map((code) => ({
    type: "Financial Document Defaults" as const,
    code,
  }));
  return {
    ...row,
    id: Number(row.id),
    finance_company_id: Number(row.finance_company_id),
    gl_account_id: Number(row.gl_account_id),
    creation_date: row.creation_date instanceof Date ? row.creation_date.toISOString() : String(row.creation_date),
    updated_date: row.updated_date instanceof Date ? row.updated_date.toISOString() : String(row.updated_date),
    has_postings: companiesWithPostings.length > 0,
    companies_with_postings: companiesWithPostings,
    linked_by: linkedBy,
  } as BankCashAccountRow;
}

function assertColumn(field: string): void {
  if (!COLUMNS.includes(field as (typeof COLUMNS)[number])) throw new Error(`Unknown column: ${field}`);
}

function buildWhere(filters: Filter[], startAt = 2): { sql: string; params: unknown[] } {
  const parts: string[] = [];
  const params: unknown[] = [];
  for (const filter of filters) {
    assertColumn(filter.field);
    const col = `bca.${filter.field}`;
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
  let orderSql = "ORDER BY bca.code ASC";
  if (options?.orderBy?.length) {
    orderSql = `ORDER BY ${options.orderBy.map((order) => {
      assertColumn(order.field);
      return `bca.${order.field} ${order.direction ?? "ASC"}`;
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

export class BankCashAccountRepo {
  constructor(private readonly db: DbExecutor) { }

  async insert(row: InsertBankCashAccountRow): Promise<BankCashAccountRow> {
    const { rows } = await this.db.query(
      `INSERT INTO ${TABLE}
         (finance_company_id, code, ledger, type, gl_account_id, bank_name, bank_branch_name, bank_account_identifier, cash_account_identifier, status,
          creation_date, creation_actor_type, creation_user_id, creation_mutation_id)
       VALUES ($1, $2, 'BANK_CASH', $3, $4, $5, $6, $7, $8, COALESCE($9, 'ACTIVE'), $10, $11, $12, $13)
       RETURNING id`,
      [
        row.finance_company_id,
        row.code,
        row.type,
        row.gl_account_id,
        row.bank_name ?? null,
        row.bank_branch_name ?? null,
        row.bank_account_identifier ?? null,
        row.cash_account_identifier ?? null,
        row.status ?? "ACTIVE",
        row.creation_date,
        row.creation_actor_type,
        row.creation_user_id ?? null,
        row.creation_mutation_id ?? null,
      ],
    );
    return this.getById(row.finance_company_id, Number(rows[0].id));
  }

  async get(companyId: number, code: string): Promise<BankCashAccountRow | null> {
    const { rows } = await this.db.query(
      `${SELECT_SQL} WHERE bca.finance_company_id = $1 AND bca.code = $2`,
      [companyId, code],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async getById(companyId: number, id: number): Promise<BankCashAccountRow> {
    const { rows } = await this.db.query(
      `${SELECT_SQL} WHERE bca.finance_company_id = $1 AND bca.id = $2`,
      [companyId, id],
    );
    if (!rows[0]) throw new DataError(`Bank / Cash Account id ${id} not found`);
    return mapRow(rows[0]);
  }

  async listAll(companyId: number): Promise<BankCashAccountRow[]> {
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE bca.finance_company_id = $1 ORDER BY bca.code ASC`, [companyId]);
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async batchGet(companyId: number, codes: string[]): Promise<BankCashAccountRow[]> {
    if (!codes.length) return [];
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE bca.finance_company_id = $1 AND bca.code = ANY($2::text[]) ORDER BY bca.code ASC`, [companyId, codes]);
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async filter(companyId: number, filters: Filter[], options?: ListOptions): Promise<BankCashAccountRow[]> {
    const { sql, params } = buildWhere(filters);
    const queryParams: unknown[] = [companyId, ...params];
    const tail = buildOrderLimitOffset(queryParams, options);
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE bca.finance_company_id = $1${sql} ${tail}`, queryParams);
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async search(companyId: number, phrase: string, options?: ListOptions): Promise<BankCashAccountRow[]> {
    const params: unknown[] = [companyId];
    const pattern = `%${phrase}%`;
    const likeParts = SEARCHABLE_COLUMNS.map((column) => {
      params.push(pattern);
      return `bca.${column}::text ILIKE $${params.length}`;
    });
    const tail = buildOrderLimitOffset(params, options);
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE bca.finance_company_id = $1 AND (${likeParts.join(" OR ")}) ${tail}`, params);
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async patch(companyId: number, code: string, updates: PatchBankCashAccountRow): Promise<BankCashAccountRow> {
    const sets: string[] = [];
    const values: unknown[] = [];
    for (const key of COLUMNS) {
      const value = updates[key as keyof PatchBankCashAccountRow];
      if (value !== undefined) {
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
    if (sets.length === 0) {
      const existing = await this.get(companyId, code);
      if (!existing) throw new DataError(`Bank / Cash Account ${code} not found`);
      return existing;
    }
    values.push(code);
    const { rows } = await this.db.query(
      `UPDATE ${TABLE} SET ${sets.join(", ")} WHERE finance_company_id = $${values.length + 1} AND code = $${values.length} RETURNING id`,
      [...values, companyId],
    );
    if (!rows[0]) throw new DataError(`Bank / Cash Account ${code} not found`);
    return this.getById(companyId, Number(rows[0].id));
  }

  async delete(companyId: number, code: string): Promise<BankCashAccountRow> {
    const existing = await this.get(companyId, code);
    if (!existing) throw new DataError(`Bank / Cash Account ${code} not found`);
    await this.db.query(`DELETE FROM ${TABLE} WHERE id = $1`, [existing.id]);
    return existing;
  }

  async getGlAccount(companyId: number, id: number): Promise<{ id: number; account_type: AccountType; status: string } | null> {
    const { rows } = await this.db.query(
      `SELECT id, account_type, status
       FROM gl_account
       WHERE finance_company_id = $1
         AND id = $2`,
      [companyId, id],
    );
    return rows[0] ? {
      id: Number(rows[0].id),
      account_type: String(rows[0].account_type) as AccountType,
      status: String(rows[0].status),
    } : null;
  }

  async getActiveResolved(companyId: number, code: string): Promise<BankCashAccountRow | null> {
    const { rows } = await this.db.query(
      `${SELECT_SQL}
       WHERE bca.finance_company_id = $1
         AND bca.code = $2
         AND bca.status = 'ACTIVE'
         AND ga.status = 'ACTIVE'`,
      [companyId, code],
    );
    return rows[0] ? mapRow(rows[0]) : null;
  }

}
