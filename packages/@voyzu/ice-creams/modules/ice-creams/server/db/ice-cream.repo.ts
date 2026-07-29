import { DataError } from "@voyzu/capability/errors";
import type { DbExecutor } from "@voyzu/capability/db";
import type { Filter, ListOptions } from "@voyzu/types/params";

import type {
  IceCreamFlavorRow,
  IceCreamRow,
  InsertIceCreamRow,
  PatchIceCreamRow,
  UpdateIceCreamRow,
} from "./ice-cream.row.types";

const SELECT_SQL = `
  SELECT ice_cream.*,
         flavor.code AS flavor_code,
         flavor.name AS flavor_name,
         flavor.status AS flavor_status
    FROM ice_cream
    JOIN ice_cream_flavor flavor ON flavor.id = ice_cream.flavor_id
`;

const FILTER_COLUMNS = new Set(["code", "name", "supplier", "status", "flavor_code"]);
const MUTABLE_COLUMNS = new Set([
  "name",
  "flavor_id",
  "supplier",
  "status",
  "updated_date",
  "updated_actor_type",
  "updated_user_id",
  "updated_mutation_id",
]);

function normalizeRow(row: Record<string, unknown>): IceCreamRow {
  return {
    ...row,
    id: Number(row.id),
    flavor_id: Number(row.flavor_id),
    creation_date: row.creation_date instanceof Date ? row.creation_date.toISOString() : String(row.creation_date),
    updated_date: row.updated_date instanceof Date ? row.updated_date.toISOString() : String(row.updated_date),
  } as IceCreamRow;
}

function orderAndPage(params: unknown[], options?: ListOptions): string {
  const requestedOrder = options?.orderBy?.[0];
  const field = requestedOrder && FILTER_COLUMNS.has(requestedOrder.field)
    ? requestedOrder.field
    : "code";
  const direction = requestedOrder?.direction === "DESC" ? "DESC" : "ASC";
  let sql = ` ORDER BY ${field} ${direction}`;
  const limit = options?.limit ?? options?.pagination?.pageSize;
  const offset = options?.offset ?? (
    options?.pagination
      ? (options.pagination.page - 1) * options.pagination.pageSize
      : undefined
  );
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

export class IceCreamRepo {
  constructor(private readonly db: DbExecutor) {}

  async listFlavors(): Promise<IceCreamFlavorRow[]> {
    const { rows } = await this.db.query(
      `SELECT id, code, name, status
         FROM ice_cream_flavor
        WHERE status != 'DELETED'
        ORDER BY name`,
    );
    return rows.map((row: Record<string, unknown>) => ({
      id: Number(row.id),
      code: String(row.code),
      name: String(row.name),
      status: row.status as IceCreamFlavorRow["status"],
    }));
  }

  async getFlavor(code: string): Promise<IceCreamFlavorRow | null> {
    const { rows } = await this.db.query(
      `SELECT id, code, name, status
         FROM ice_cream_flavor
        WHERE code = $1 AND status != 'DELETED'`,
      [code.trim().toUpperCase()],
    );
    if (!rows[0]) return null;
    return {
      id: Number(rows[0].id),
      code: String(rows[0].code),
      name: String(rows[0].name),
      status: rows[0].status as IceCreamFlavorRow["status"],
    };
  }

  async insert(row: InsertIceCreamRow): Promise<IceCreamRow> {
    const entries = Object.entries(row).filter(([, value]) => value !== undefined);
    const columns = entries.map(([column]) => column);
    const values = entries.map(([, value]) => value);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");
    const { rows } = await this.db.query(
      `WITH inserted AS (
         INSERT INTO ice_cream (${columns.join(", ")})
         VALUES (${placeholders})
         RETURNING *
       )
       SELECT inserted.*, flavor.code AS flavor_code,
              flavor.name AS flavor_name, flavor.status AS flavor_status
         FROM inserted
         JOIN ice_cream_flavor flavor ON flavor.id = inserted.flavor_id`,
      values,
    );
    return normalizeRow(rows[0]);
  }

  async get(code: string): Promise<IceCreamRow | null> {
    const { rows } = await this.db.query(
      `${SELECT_SQL}
       WHERE ice_cream.code = $1 AND ice_cream.status != 'DELETED'`,
      [code.trim().toUpperCase()],
    );
    return rows[0] ? normalizeRow(rows[0]) : null;
  }

  async list(options?: ListOptions): Promise<IceCreamRow[]> {
    const params: unknown[] = [];
    const { rows } = await this.db.query(
      `${SELECT_SQL}
       WHERE ice_cream.status != 'DELETED'${orderAndPage(params, options)}`,
      params,
    );
    return rows.map(normalizeRow);
  }

  async filter(filters: Filter[], options?: ListOptions): Promise<IceCreamRow[]> {
    const params: unknown[] = [];
    const clauses = filters.map((filter) => {
      if (!FILTER_COLUMNS.has(filter.field)) throw new DataError(`Unsupported filter field ${filter.field}`);
      const column = filter.field === "flavor_code" ? "flavor.code" : `ice_cream.${filter.field}`;
      switch (filter.operator) {
        case "IS NULL":
        case "IS NOT NULL":
          return `${column} ${filter.operator}`;
        case "IN":
        case "NOT IN": {
          if (!Array.isArray(filter.value)) {
            throw new DataError(`${filter.operator} requires an array value`);
          }
          params.push(filter.value.map(String));
          return filter.operator === "IN"
            ? `${column}::text = ANY($${params.length}::text[])`
            : `${column}::text != ALL($${params.length}::text[])`;
        }
        case "BETWEEN": {
          if (!Array.isArray(filter.value) || filter.value.length !== 2) {
            throw new DataError("BETWEEN requires exactly two values");
          }
          params.push(filter.value[0], filter.value[1]);
          return `${column} BETWEEN $${params.length - 1} AND $${params.length}`;
        }
        default:
          if (filter.value === undefined || Array.isArray(filter.value)) {
            throw new DataError(`${filter.operator} requires one scalar value`);
          }
          params.push(filter.value);
          return `${column} ${filter.operator} $${params.length}`;
      }
    });
    const where = [
      "ice_cream.status != 'DELETED'",
      ...clauses,
    ].join(" AND ");
    const { rows } = await this.db.query(
      `${SELECT_SQL} WHERE ${where}${orderAndPage(params, options)}`,
      params,
    );
    return rows.map(normalizeRow);
  }

  async search(phrase: string, options?: ListOptions): Promise<IceCreamRow[]> {
    const params: unknown[] = [`%${phrase.trim()}%`];
    const { rows } = await this.db.query(
      `${SELECT_SQL}
       WHERE ice_cream.status != 'DELETED'
         AND (
           ice_cream.code ILIKE $1 OR ice_cream.name ILIKE $1 OR
           ice_cream.supplier ILIKE $1 OR flavor.name ILIKE $1
         )${orderAndPage(params, options)}`,
      params,
    );
    return rows.map(normalizeRow);
  }

  async update(code: string, row: UpdateIceCreamRow): Promise<IceCreamRow> {
    return this.patch(code, row);
  }

  async patch(code: string, row: PatchIceCreamRow): Promise<IceCreamRow> {
    const entries = Object.entries(row).filter(([, value]) => value !== undefined);
    if (!entries.length) {
      const current = await this.get(code);
      if (!current) throw new DataError(`Ice cream ${code} not found`);
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
      `WITH updated AS (
         UPDATE ice_cream SET ${sets.join(", ")}
          WHERE code = $${values.length} AND status != 'DELETED'
          RETURNING *
       )
       SELECT updated.*, flavor.code AS flavor_code,
              flavor.name AS flavor_name, flavor.status AS flavor_status
         FROM updated
         JOIN ice_cream_flavor flavor ON flavor.id = updated.flavor_id`,
      values,
    );
    if (!rows[0]) throw new DataError(`Ice cream ${code} not found`);
    return normalizeRow(rows[0]);
  }

  async batchGet(codes: string[]): Promise<IceCreamRow[]> {
    if (!codes.length) return [];
    const { rows } = await this.db.query(
      `${SELECT_SQL}
       WHERE ice_cream.code = ANY($1::text[]) AND ice_cream.status != 'DELETED'
       ORDER BY ice_cream.code`,
      [codes],
    );
    return rows.map(normalizeRow);
  }

  async stampDeletion(
    codes: string[],
    audit: {
      timestamp: string;
      actorType: string;
      userId: string | null;
      mutationId: string;
    },
  ): Promise<void> {
    await this.db.query(
      `UPDATE ice_cream
          SET deletion_date = $2::timestamptz,
              deletion_actor_type = $3::actor_type,
              deletion_user_id = $4,
              deletion_mutation_id = $5::uuid
        WHERE code = ANY($1::text[])`,
      [codes, audit.timestamp, audit.actorType, audit.userId, audit.mutationId],
    );
  }

  async delete(codes: string[]): Promise<void> {
    await this.db.query(
      "DELETE FROM ice_cream WHERE code = ANY($1::text[])",
      [codes],
    );
  }
}
