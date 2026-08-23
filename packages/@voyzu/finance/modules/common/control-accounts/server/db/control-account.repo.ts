import type { AccountType, Status } from "@voyzu/finance/types/modules/core";
import type { UpdateAuditStamp } from "../../../server";
import type { Filter, ListOptions } from "@voyzu/types/params";

import { parsePostgresTextArray, type DbExecutor } from "@voyzu/capability/db";
import { DataError } from "@voyzu/capability/errors";

import type { ControlAccountRow } from "./control-account.row.types";

const COLUMNS: readonly string[] = [
  "finance_organization_id", "code", "ledger", "name", "gl_account_id", "status",
  "creation_date", "creation_actor_type", "creation_user_id", "creation_mutation_id",
  "updated_date", "updated_actor_type", "updated_user_id", "updated_mutation_id",
];

const SEARCHABLE_COLUMNS: readonly string[] = ["code", "name", "status"];

const CONTROL_ACCOUNT_UNION_SQL = `
  (
    SELECT finance_organization_id, ledger, code, name, gl_account_id, status,
           creation_date, creation_actor_type, creation_user_id, creation_mutation_id,
           updated_date, updated_actor_type, updated_user_id, updated_mutation_id
    FROM ar_control_account
    UNION ALL
    SELECT finance_organization_id, ledger, code, name, gl_account_id, status,
           creation_date, creation_actor_type, creation_user_id, creation_mutation_id,
           updated_date, updated_actor_type, updated_user_id, updated_mutation_id
    FROM ap_control_account
  )
`;

const JOIN_SQL = `LEFT JOIN gl_account ga ON ga.finance_organization_id = ca.finance_organization_id AND ga.id = ca.gl_account_id`;
const COMPANIES_WITH_POSTINGS_SQL = `COALESCE(ARRAY(
  SELECT DISTINCT posting_organization.code
  FROM finance_organization source_finance_organization
  JOIN finance_organization posting_finance_organization ON (
    (source_finance_organization.is_template = true
      AND posting_finance_organization.is_template = false
      AND posting_finance_organization.use_finance_template_settings = true)
    OR (source_finance_organization.is_template = false AND posting_finance_organization.id = source_finance_organization.id)
  )
  JOIN organization posting_organization ON posting_organization.id = posting_finance_organization.organization_id
    AND posting_organization.status != 'DELETED'
  JOIN journal_line jl ON jl.gl_account_id = ca.gl_account_id
  JOIN journal_header jh ON jh.id = jl.journal_header_id
    AND jh.finance_organization_id = posting_finance_organization.id
    AND jh.status = 'POSTED'
  WHERE source_finance_organization.id = ca.finance_organization_id
  ORDER BY posting_organization.code
), ARRAY[]::text[])`;
const SELECT_SQL = `SELECT ca.*, ga.code AS gl_account_code, ga.name AS gl_account_name, ga.account_type AS gl_account_type,
  ${COMPANIES_WITH_POSTINGS_SQL} AS companies_with_postings`;

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
  let orderSql = "ORDER BY ca.code ASC";
  if (options?.orderBy?.length) {
    const parts = options.orderBy.map((ob) => {
      assertColumn(ob.field);
      return `ca.${ob.field} ${ob.direction ?? "ASC"}`;
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

export class ControlAccountRepo {
  constructor(private readonly db: DbExecutor) { }

  async get(companyId: number, code: string): Promise<ControlAccountRow | null> {
    const { rows } = await this.db.query(
      `${SELECT_SQL} FROM ${CONTROL_ACCOUNT_UNION_SQL} ca ${JOIN_SQL} WHERE ca.finance_organization_id = $1 AND ca.code = $2`,
      [companyId, code],
    );
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async listAll(companyId: number): Promise<ControlAccountRow[]> {
    const { rows } = await this.db.query(
      `${SELECT_SQL} FROM ${CONTROL_ACCOUNT_UNION_SQL} ca ${JOIN_SQL} WHERE ca.finance_organization_id = $1 ORDER BY ca.code ASC`,
      [companyId],
    );
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async listByCodes(companyId: number, codes: readonly string[]): Promise<ControlAccountRow[]> {
    if (codes.length === 0) return [];
    const { rows } = await this.db.query(
      `${SELECT_SQL} FROM ${CONTROL_ACCOUNT_UNION_SQL} ca ${JOIN_SQL} WHERE ca.finance_organization_id = $1 AND ca.code = ANY($2::text[])`,
      [companyId, [...codes]],
    );
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async filter(companyId: number, filters: Filter[], options?: ListOptions): Promise<ControlAccountRow[]> {
    const { sql: whereSql, params } = buildWhere(filters, "ca");
    const shiftedWhere = whereSql.replace(/\$(\d+)/g, (_match, n: string) => `$${Number(n) + 1}`);
    const scopedParams: unknown[] = [companyId, ...params];
    const scopedWhere = shiftedWhere ? `WHERE ca.finance_organization_id = $1 AND ${shiftedWhere.slice("WHERE ".length)}` : "WHERE ca.finance_organization_id = $1";
    const tail = buildOrderLimitOffset(scopedParams, options);
    const sql = `${SELECT_SQL} FROM ${CONTROL_ACCOUNT_UNION_SQL} ca ${JOIN_SQL} ${scopedWhere} ${tail}`;
    const { rows } = await this.db.query(sql, scopedParams);
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async search(companyId: number, phrase: string, options?: ListOptions): Promise<ControlAccountRow[]> {
    const params: unknown[] = [companyId];
    const pattern = `%${phrase}%`;
    const likeParts = SEARCHABLE_COLUMNS.map((col) => {
      params.push(pattern);
      return `ca.${col}::text ILIKE $${params.length}`;
    });
    const whereSql = `WHERE ca.finance_organization_id = $1 AND (${likeParts.join(" OR ")})`;
    const tail = buildOrderLimitOffset(params, options);
    const sql = `${SELECT_SQL} FROM ${CONTROL_ACCOUNT_UNION_SQL} ca ${JOIN_SQL} ${whereSql} ${tail}`;
    const { rows } = await this.db.query(sql, params);
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async patchGlAccount(companyId: number, code: string, glAccountId: number, audit: UpdateAuditStamp): Promise<ControlAccountRow> {
    const existing = await this.get(companyId, code);
    if (!existing) throw new DataError(`Control account ${code} not found`);

    const table = existing.ledger === "ACCOUNTS_RECEIVABLE" ? "ar_control_account" : "ap_control_account";
    const { rows } = await this.db.query(
      `UPDATE ${table}
       SET gl_account_id = $3,
           updated_date = $4::timestamptz,
           updated_actor_type = $5::actor_type,
           updated_user_id = $6,
           updated_mutation_id = $7::uuid
       WHERE finance_organization_id = $1
         AND code = $2
       RETURNING code`,
      [companyId, code, glAccountId, audit.timestamp, audit.actorType, audit.userId, audit.mutationId],
    );
    if (!rows[0]) throw new DataError(`Control account ${code} not found`);

    const updated = await this.get(companyId, code);
    if (!updated) throw new DataError(`Control account ${code} not found after update`);
    return updated;
  }

  async getGlAccount(companyId: number, id: number): Promise<{ id: number; account_type: AccountType; status: Status } | null> {
    const { rows } = await this.db.query(
      `SELECT id, account_type, status
       FROM gl_account
       WHERE finance_organization_id = $1
         AND id = $2`,
      [companyId, id],
    );
    return rows[0] ? {
      id: Number(rows[0].id),
      account_type: String(rows[0].account_type) as AccountType,
      status: String(rows[0].status) as Status,
    } : null;
  }

  private mapRow(row: Record<string, unknown>): ControlAccountRow {
    const companiesWithPostings = parsePostgresTextArray(row.companies_with_postings);
    return {
      ...row,
      finance_organization_id: Number(row.finance_organization_id),
      gl_account_id: Number(row.gl_account_id),
      creation_date: row.creation_date instanceof Date
        ? row.creation_date.toISOString()
        : String(row.creation_date),
      updated_date: row.updated_date instanceof Date
        ? row.updated_date.toISOString()
        : String(row.updated_date),
      has_postings: companiesWithPostings.length > 0,
      companies_with_postings: companiesWithPostings,
    } as ControlAccountRow;
  }
}
