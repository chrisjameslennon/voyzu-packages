import { DataError } from "@voyzu/capability/errors";
import type { DbExecutor } from "@voyzu/capability/db";
import type { Filter, ListOptions } from "@voyzu/types/params";

import type { InsertTemplateRow, PatchTemplateRow, TemplateRow, UpdateTemplateRow } from "./template.row.types";

const FILTER_COLUMNS = new Set(["code", "description", "status"]);

const INSERTABLE_COLUMNS = new Set([
  "code",
  "description",
  "creation_date",
  "creation_actor_type",
  "creation_user_id",
  "creation_mutation_id",
]);
const MUTABLE_COLUMNS = new Set([
  "description",
  "status",
  "updated_date",
  "updated_actor_type",
  "updated_user_id",
  "updated_mutation_id",
]);

function normalizeRow(row: Record<string, unknown>): TemplateRow {
  return {
    ...row,
    id: Number(row.id),
    creation_date: row.creation_date instanceof Date ? row.creation_date.toISOString() : String(row.creation_date),
    updated_date: row.updated_date instanceof Date ? row.updated_date.toISOString() : String(row.updated_date),
  } as TemplateRow;
}

function orderAndPage(params: unknown[], options?: ListOptions): string {
  const requestedField = options?.orderBy?.[0]?.field ?? "code";
  const orderField = new Set(["code", "description", "status"]).has(requestedField)
    ? requestedField
    : "code";
  const direction = options?.orderBy?.[0]?.direction === "DESC" ? "DESC" : "ASC";
  let sql = ` ORDER BY ${orderField} ${direction}, code ASC`;
  const limit = options?.limit ?? options?.pagination?.pageSize;
  const offset = options?.offset ?? (options?.pagination
    ? (options.pagination.page - 1) * options.pagination.pageSize
    : undefined);
  if (limit !== undefined) {
    params.push(limit);
    sql += ` LIMIT $${params.length}`;
  }
  if (offset !== undefined) {
    params.push(offset);
    sql += ` OFFSET $${params.length}`;
  }
  return sql;
}

export class TemplateRepo {
  constructor(private readonly db: DbExecutor) {}

  async insert(row: InsertTemplateRow): Promise<TemplateRow> {
    const entries = Object.entries(row).filter(([, value]) => value !== undefined);
    const unsupported = entries.find(([column]) => !INSERTABLE_COLUMNS.has(column));
    if (unsupported) throw new DataError(`Unsupported insert column ${unsupported[0]}`);
    const columns = entries.map(([column]) => column);
    const values = entries.map(([, value]) => value);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
    const { rows } = await this.db.query(
      `INSERT INTO template (${columns.join(", ")})
       VALUES (${placeholders})
       RETURNING *`,
      values,
    );
    return normalizeRow(rows[0]);
  }

  async get(code: string): Promise<TemplateRow | null> {
    const { rows } = await this.db.query(
      `SELECT * FROM template WHERE code = $1`,
      [code.trim().toUpperCase()],
    );
    return rows[0] ? normalizeRow(rows[0]) : null;
  }

  async list(options?: ListOptions): Promise<TemplateRow[]> {
    const params: unknown[] = [];
    const { rows } = await this.db.query(
      `SELECT * FROM template${orderAndPage(params, options)}`,
      params,
    );
    return rows.map(normalizeRow);
  }

  async filter(filters: Filter[], options?: ListOptions): Promise<TemplateRow[]> {
    const params: unknown[] = [];
    const clauses = filters.map((filter) => {
      if (!FILTER_COLUMNS.has(filter.field)) throw new DataError(`Unsupported filter field ${filter.field}`);
      const column = filter.field;
      switch (filter.operator) {
        case "IS NULL":
        case "IS NOT NULL":
          return `${column} ${filter.operator}`;
        case "IN":
        case "NOT IN":
          if (!Array.isArray(filter.value)) throw new DataError(`${filter.operator} requires an array value`);
          params.push(filter.value.map(String));
          return filter.operator === "IN"
            ? `${column}::text = ANY($${params.length}::text[])`
            : `${column}::text != ALL($${params.length}::text[])`;
        case "BETWEEN":
          if (!Array.isArray(filter.value) || filter.value.length !== 2) throw new DataError("BETWEEN requires exactly two values");
          params.push(filter.value[0], filter.value[1]);
          return `${column} BETWEEN $${params.length - 1} AND $${params.length}`;
        default:
          if (filter.value === undefined || Array.isArray(filter.value)) throw new DataError(`${filter.operator} requires one scalar value`);
          params.push(filter.value);
          return `${column} ${filter.operator} $${params.length}`;
      }
    });
    const where = clauses.length ? ` WHERE ${clauses.join(" AND ")}` : "";
    const { rows } = await this.db.query(`SELECT * FROM template${where}${orderAndPage(params, options)}`, params);
    return rows.map(normalizeRow);
  }

  async search(phrase: string, options?: ListOptions): Promise<TemplateRow[]> {
    const params: unknown[] = [`%${phrase.trim()}%`];
    const { rows } = await this.db.query(
      `SELECT * FROM template
       WHERE code ILIKE $1 OR description ILIKE $1${orderAndPage(params, options)}`,
      params,
    );
    return rows.map(normalizeRow);
  }

  async update(code: string, row: UpdateTemplateRow): Promise<TemplateRow> {
    return this.patch(code, row);
  }

  async patch(code: string, row: PatchTemplateRow): Promise<TemplateRow> {
    const entries = Object.entries(row).filter(([, value]) => value !== undefined);
    if (!entries.length) {
      const current = await this.get(code);
      if (!current) throw new DataError(`Template ${code} not found`);
      return current;
    }
    const values: unknown[] = [];
    const sets = entries.map(([column, value]) => {
      if (!MUTABLE_COLUMNS.has(column)) throw new DataError(`Unsupported mutable column ${column}`);
      values.push(value);
      const cast = column === "updated_actor_type" ? "::actor_type"
        : column === "updated_date" ? "::timestamptz"
        : column === "updated_mutation_id" ? "::uuid"
        : "";
      return `${column} = $${values.length}${cast}`;
    });
    values.push(code.trim().toUpperCase());
    const { rows } = await this.db.query(
      `UPDATE template SET ${sets.join(", ")}
       WHERE code = $${values.length}
       RETURNING *`,
      values,
    );
    if (!rows[0]) throw new DataError(`Template ${code} not found`);
    return normalizeRow(rows[0]);
  }

  async batchGet(codes: string[]): Promise<TemplateRow[]> {
    if (!codes.length) return [];
    const { rows } = await this.db.query(
      `SELECT * FROM template
       WHERE code = ANY($1::text[])
       ORDER BY code`,
      [codes],
    );
    return rows.map(normalizeRow);
  }

  async stampDeletion(
    codes: string[],
    audit: { timestamp: string; actorType: string; userId: string | null; mutationId: string },
  ): Promise<void> {
    await this.db.query(
      `UPDATE template
       SET deletion_date = $2::timestamptz,
           deletion_actor_type = $3::actor_type,
           deletion_user_id = $4,
           deletion_mutation_id = $5::uuid
       WHERE code = ANY($1::text[])`,
      [codes, audit.timestamp, audit.actorType, audit.userId, audit.mutationId],
    );
  }

  async delete(codes: string[]): Promise<void> {
    await this.db.query("DELETE FROM template WHERE code = ANY($1::text[])", [codes]);
  }
}
