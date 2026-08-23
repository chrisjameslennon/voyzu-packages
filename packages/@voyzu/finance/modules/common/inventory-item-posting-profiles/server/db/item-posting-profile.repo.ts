import { DataError } from "@voyzu/capability/errors";
import type { DbExecutor } from "@voyzu/capability/db";
import type { UpdateAuditStamp } from "../../../server";
import type { Filter, ListOptions } from "@voyzu/types/params";

import type { InsertItemPostingProfileRow, ItemPostingProfileRow, PatchItemPostingProfileRow, UpdateItemPostingProfileRow } from "./item-posting-profile.row.types";

const SELECT_SQL = `
  SELECT ipp.id::int,
         ipp.finance_company_id::int,
         ipp.code AS profile_code,
         ipp.name AS profile_name,
         ipp.description,
         ipp.is_sold,
         ipp.is_purchased,
         ipp.is_consumed,
         rev.code AS revenue_code,
         rev.name AS revenue_name,
         cogs.code AS cogs_code,
         cogs.name AS cogs_name,
         purchase.code AS purchase_expense_code,
         purchase.name AS purchase_expense_name,
         consumption.code AS consumption_code,
         consumption.name AS consumption_name,
         gain.code AS adjustment_gain_code,
         gain.name AS adjustment_gain_name,
         loss.code AS adjustment_loss_code,
         loss.name AS adjustment_loss_name,
         ipp.status,
         ipp.creation_date,
         ipp.creation_actor_type,
         ipp.creation_user_id,
         ipp.creation_mutation_id,
         ipp.updated_date,
         ipp.updated_actor_type,
         ipp.updated_user_id,
         ipp.updated_mutation_id,
         COALESCE((
           SELECT jsonb_agg(jsonb_build_object('type', 'Inventory Categories', 'code', category.code) ORDER BY category.code)
           FROM inventory_category category
           WHERE category.finance_company_id = ipp.finance_company_id
             AND category.posting_profile_id = ipp.id
         ), '[]'::jsonb) AS linked_by
  FROM item_posting_profile ipp
  LEFT JOIN gl_account rev ON rev.finance_company_id = ipp.finance_company_id AND rev.id = ipp.revenue_gl_account_id
  LEFT JOIN gl_account cogs ON cogs.finance_company_id = ipp.finance_company_id AND cogs.id = ipp.cogs_gl_account_id
  LEFT JOIN gl_account purchase ON purchase.finance_company_id = ipp.finance_company_id AND purchase.id = ipp.purchase_expense_gl_account_id
  LEFT JOIN gl_account consumption ON consumption.finance_company_id = ipp.finance_company_id AND consumption.id = ipp.consumption_gl_account_id
  LEFT JOIN gl_account gain ON gain.finance_company_id = ipp.finance_company_id AND gain.id = ipp.adjustment_gain_gl_account_id
  LEFT JOIN gl_account loss ON loss.finance_company_id = ipp.finance_company_id AND loss.id = ipp.adjustment_loss_gl_account_id
`;

function mapRow(row: Record<string, unknown>): ItemPostingProfileRow {
  return {
    ...row,
    id: Number(row.id),
    finance_company_id: Number(row.finance_company_id),
    linked_by: Array.isArray(row.linked_by) ? row.linked_by : [],
    creation_date: row.creation_date instanceof Date ? row.creation_date.toISOString() : String(row.creation_date ?? ""),
    creation_actor_type: row.creation_actor_type as ItemPostingProfileRow["creation_actor_type"],
    creation_user_id: row.creation_user_id == null ? null : String(row.creation_user_id),
    creation_mutation_id: row.creation_mutation_id == null ? null : String(row.creation_mutation_id),
    updated_date: row.updated_date instanceof Date ? row.updated_date.toISOString() : String(row.updated_date ?? row.creation_date ?? ""),
    updated_actor_type: row.updated_actor_type as ItemPostingProfileRow["updated_actor_type"],
    updated_user_id: row.updated_user_id == null ? null : String(row.updated_user_id),
    updated_mutation_id: row.updated_mutation_id == null ? null : String(row.updated_mutation_id),
  } as ItemPostingProfileRow;
}

const MUTABLE_COLUMNS = [
  "code", "name", "description", "is_sold", "is_purchased", "is_consumed", "revenue_gl_account_id", "cogs_gl_account_id", "purchase_expense_gl_account_id",
  "consumption_gl_account_id", "adjustment_gain_gl_account_id", "adjustment_loss_gl_account_id", "status",
] as const;

const FILTERABLE_COLUMNS = [
  "code", "name", "description", "is_sold", "is_purchased", "is_consumed", "revenue_gl_account_id", "cogs_gl_account_id", "purchase_expense_gl_account_id",
  "consumption_gl_account_id", "adjustment_gain_gl_account_id", "adjustment_loss_gl_account_id", "status",
] as const;

const SEARCHABLE_COLUMNS = ["code", "name", "description", "status"] as const;

const ACCOUNT_FIELDS = {
  revenue_code: "revenue_gl_account_id",
  cogs_code: "cogs_gl_account_id",
  purchase_expense_code: "purchase_expense_gl_account_id",
  consumption_code: "consumption_gl_account_id",
  adjustment_gain_code: "adjustment_gain_gl_account_id",
  adjustment_loss_code: "adjustment_loss_gl_account_id",
} as const;

const ACCOUNT_TYPES: Record<AccountCodeField, "REVENUE" | "EXPENSE"> = {
  revenue_code: "REVENUE",
  cogs_code: "EXPENSE",
  purchase_expense_code: "EXPENSE",
  consumption_code: "EXPENSE",
  adjustment_gain_code: "REVENUE",
  adjustment_loss_code: "EXPENSE",
};

type AccountCodeField = keyof typeof ACCOUNT_FIELDS;

function assertColumn(field: string): void {
  if (!FILTERABLE_COLUMNS.includes(field as (typeof FILTERABLE_COLUMNS)[number])) throw new Error(`Unknown column: ${field}`);
}

function buildWhere(filters: Filter[], startAt = 2): { sql: string; params: unknown[] } {
  const parts: string[] = [];
  const params: unknown[] = [];
  for (const filter of filters) {
    assertColumn(filter.field);
    const col = `ipp.${filter.field}`;
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
  let orderSql = "ORDER BY ipp.code ASC";
  if (options?.orderBy?.length) {
    orderSql = `ORDER BY ${options.orderBy.map((order) => {
      assertColumn(order.field);
      return `ipp.${order.field} ${order.direction ?? "ASC"}`;
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

export class ItemPostingProfileRepo {
  constructor(private readonly db: DbExecutor) { }

  async getGlAccount(companyId: number, code: string): Promise<{ id: number; code: string; accountType: "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE"; status: "ACTIVE" | "INACTIVE" } | null> {
    const { rows } = await this.db.query(`SELECT id::int, code, account_type, status FROM gl_account WHERE finance_company_id = $1 AND code = $2`, [companyId, code]);
    if (!rows[0]) return null;
    return {
      id: Number(rows[0].id),
      code: String(rows[0].code),
      accountType: rows[0].account_type as "ASSET" | "LIABILITY" | "EQUITY" | "REVENUE" | "EXPENSE",
      status: rows[0].status as "ACTIVE" | "INACTIVE",
    };
  }

  private async resolveAccountId(companyId: number, code: string | null, _expectedType: "REVENUE" | "EXPENSE"): Promise<number | null> {
    if (!code) return null;
    const account = await this.getGlAccount(companyId, code);
    if (!account) throw new DataError(`Unknown GL account ${code}`);
    return account.id;
  }

  private async resolveAccounts(companyId: number, row: Partial<Record<AccountCodeField, string | null>>): Promise<Record<string, number | null>> {
    const resolved: Record<string, number | null> = {};
    for (const [codeField, idField] of Object.entries(ACCOUNT_FIELDS) as [AccountCodeField, string][]) {
      if (codeField in row) {
        resolved[idField] = await this.resolveAccountId(companyId, row[codeField] ?? null, ACCOUNT_TYPES[codeField]);
      }
    }
    return resolved;
  }

  async insert(row: InsertItemPostingProfileRow): Promise<ItemPostingProfileRow> {
    const accountIds = await this.resolveAccounts(row.finance_company_id, row);
    await this.db.query(
      `INSERT INTO item_posting_profile (
        finance_company_id, code, name, description, is_sold, is_purchased, is_consumed, revenue_gl_account_id, cogs_gl_account_id, purchase_expense_gl_account_id,
        consumption_gl_account_id, adjustment_gain_gl_account_id, adjustment_loss_gl_account_id, status,
        creation_date, creation_actor_type, creation_user_id, creation_mutation_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`,
      [
        row.finance_company_id, row.code, row.name, row.description, row.is_sold, row.is_purchased, row.is_consumed,
        accountIds.revenue_gl_account_id, accountIds.cogs_gl_account_id,
        accountIds.purchase_expense_gl_account_id, accountIds.consumption_gl_account_id,
        accountIds.adjustment_gain_gl_account_id, accountIds.adjustment_loss_gl_account_id, row.status,
        row.creation_date, row.creation_actor_type, row.creation_user_id ?? null, row.creation_mutation_id ?? null,
      ],
    );
    const inserted = await this.get(row.finance_company_id, row.code);
    if (!inserted) throw new DataError(`Item posting profile ${row.code} not found after insert`);
    return inserted;
  }

  async listAll(companyId: number): Promise<ItemPostingProfileRow[]> {
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE ipp.finance_company_id = $1 ORDER BY ipp.code`, [companyId]);
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async get(companyId: number, code: string): Promise<ItemPostingProfileRow | null> {
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE ipp.finance_company_id = $1 AND ipp.code = $2`, [companyId, code]);
    return rows[0] ? mapRow(rows[0]) : null;
  }

  async batchGet(companyId: number, codes: string[]): Promise<ItemPostingProfileRow[]> {
    if (!codes.length) return [];
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE ipp.finance_company_id = $1 AND ipp.code = ANY($2::text[]) ORDER BY ipp.code`, [companyId, codes]);
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async filter(companyId: number, filters: Filter[], options?: ListOptions): Promise<ItemPostingProfileRow[]> {
    const { sql, params } = buildWhere(filters);
    const queryParams: unknown[] = [companyId, ...params];
    const tail = buildOrderLimitOffset(queryParams, options);
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE ipp.finance_company_id = $1${sql} ${tail}`, queryParams);
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async search(companyId: number, phrase: string, options?: ListOptions): Promise<ItemPostingProfileRow[]> {
    const params: unknown[] = [companyId];
    const pattern = `%${phrase}%`;
    const likeParts = SEARCHABLE_COLUMNS.map((column) => {
      params.push(pattern);
      return `ipp.${column}::text ILIKE $${params.length}`;
    });
    const tail = buildOrderLimitOffset(params, options);
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE ipp.finance_company_id = $1 AND (${likeParts.join(" OR ")}) ${tail}`, params);
    return rows.map((row: Record<string, unknown>) => mapRow(row));
  }

  async update(companyId: number, code: string, row: UpdateItemPostingProfileRow, audit: UpdateAuditStamp): Promise<ItemPostingProfileRow> {
    const accountIds = await this.resolveAccounts(companyId, row);
    await this.db.query(
      `UPDATE item_posting_profile
       SET code = $3, name = $4, description = $5, is_sold = $6, is_purchased = $7, is_consumed = $8,
           revenue_gl_account_id = $9, cogs_gl_account_id = $10,
           purchase_expense_gl_account_id = $11, consumption_gl_account_id = $12,
           adjustment_gain_gl_account_id = $13, adjustment_loss_gl_account_id = $14,
           updated_date = $15::timestamptz,
           updated_actor_type = $16::actor_type,
           updated_user_id = $17,
           updated_mutation_id = $18::uuid
       WHERE finance_company_id = $1 AND code = $2`,
      [
        companyId, code, row.code, row.name, row.description, row.is_sold, row.is_purchased, row.is_consumed,
        accountIds.revenue_gl_account_id, accountIds.cogs_gl_account_id,
        accountIds.purchase_expense_gl_account_id, accountIds.consumption_gl_account_id,
        accountIds.adjustment_gain_gl_account_id, accountIds.adjustment_loss_gl_account_id,
        audit.timestamp, audit.actorType, audit.userId, audit.mutationId,
      ],
    );
    const updated = await this.get(companyId, row.code);
    if (!updated) throw new DataError(`Item posting profile ${row.code} not found`);
    return updated;
  }

  async patch(companyId: number, code: string, updates: PatchItemPostingProfileRow): Promise<ItemPostingProfileRow> {
    const accountIds = await this.resolveAccounts(companyId, updates);
    const dbUpdates: Record<string, unknown> = {
      ...updates,
      ...accountIds,
    };
    for (const key of Object.keys(ACCOUNT_FIELDS)) delete dbUpdates[key];

    const sets: string[] = [];
    const vals: unknown[] = [];
    for (const [key, value] of Object.entries(dbUpdates)) {
      if (MUTABLE_COLUMNS.includes(key as (typeof MUTABLE_COLUMNS)[number])) {
        vals.push(value);
        sets.push(`${key} = $${vals.length}`);
      }
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
    if (sets.length) {
      vals.push(code);
      vals.push(companyId);
      await this.db.query(
        `UPDATE item_posting_profile
         SET ${sets.join(", ")}
         WHERE code = $${vals.length - 1} AND finance_company_id = $${vals.length}`,
        vals,
      );
    }
    const updatedCode = typeof updates.code === "string" ? updates.code : code;
    const updated = await this.get(companyId, updatedCode);
    if (!updated) throw new DataError(`Item posting profile ${updatedCode} not found`);
    return updated;
  }

  async delete(companyId: number, code: string): Promise<void> {
    const { rowCount } = await this.db.query(`DELETE FROM item_posting_profile WHERE finance_company_id = $1 AND code = $2`, [companyId, code]);
    if (!rowCount) throw new DataError(`Item posting profile ${code} not found`);
  }
}
