import { DataError } from "@voyzu/capability/errors";
import { parsePostgresTextArray, type DbExecutor } from "@voyzu/capability/db";

import type { DimensionValueRow, InsertDimensionValueRow, PatchDimensionValueRow } from "./dimension-value.row.types";

const TABLE = "dimension_value";

const MUTABLE_COLUMNS: readonly string[] = ["name", "status"];

const COMPANIES_WITH_POSTINGS_SQL = `COALESCE(ARRAY(
  SELECT DISTINCT posting_company.code
  FROM finance_company source_finance_company
  JOIN finance_company posting_finance_company ON (
    (source_finance_company.is_template = true
      AND posting_finance_company.is_template = false
      AND posting_finance_company.use_organization_standard_settings = true)
    OR (source_finance_company.is_template = false AND posting_finance_company.id = source_finance_company.id)
  )
  JOIN company posting_company ON posting_company.id = posting_finance_company.company_id
    AND posting_company.status != 'DELETED'
  JOIN journal_line_dimension jld ON jld.dimension_value_id = dv.id
  JOIN journal_line jl ON jl.id = jld.journal_line_id
  JOIN journal_header jh ON jh.id = jl.journal_header_id
    AND jh.finance_company_id = posting_finance_company.id
    AND jh.status = 'POSTED'
  WHERE source_finance_company.id = dv.finance_company_id
  ORDER BY posting_company.code
), ARRAY[]::text[])`;

const SELECT_WITH_DERIVED = `SELECT dv.*, ${COMPANIES_WITH_POSTINGS_SQL} AS companies_with_postings FROM ${TABLE} dv`;

export class DimensionValueRepo {
  constructor(private readonly db: DbExecutor) { }

  async insert(row: InsertDimensionValueRow): Promise<DimensionValueRow> {
    const cols: string[] = [];
    const vals: unknown[] = [];

    for (const [key, value] of Object.entries(row)) {
      if (value !== undefined) {
        cols.push(key);
        vals.push(value);
      }
    }

    const placeholders = vals.map((_, i) => `$${i + 1}`).join(", ");
    const sql = `INSERT INTO ${TABLE} (${cols.join(", ")}) VALUES (${placeholders}) RETURNING *`;

    const { rows } = await this.db.query(sql, vals);
    const inserted = await this.getById(Number(rows[0].finance_company_id), Number(rows[0].id));
    return inserted ?? this.mapRow(rows[0]);
  }

  async getById(companyId: number, id: number): Promise<DimensionValueRow | null> {
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE dv.finance_company_id = $1 AND dv.id = $2 AND dv.status != 'DELETED'`,
      [companyId, id],
    );
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async listByDimensionId(companyId: number, dimensionId: number): Promise<DimensionValueRow[]> {
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE dv.finance_company_id = $1 AND dv.dimension_id = $2 AND dv.status != 'DELETED' ORDER BY dv.name ASC`,
      [companyId, dimensionId],
    );
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async nameExists(companyId: number, dimensionId: number, name: string, excludeId?: number): Promise<boolean> {
    const values: unknown[] = [companyId, dimensionId, name];
    let sql = `SELECT 1 FROM ${TABLE} WHERE finance_company_id = $1 AND dimension_id = $2 AND lower(name) = lower($3)`;
    if (excludeId !== undefined) {
      values.push(excludeId);
      sql += ` AND id != $4`;
    }
    sql += " LIMIT 1";
    const { rows } = await this.db.query(sql, values);
    return rows.length > 0;
  }

  async listAll(companyId: number): Promise<DimensionValueRow[]> {
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE dv.finance_company_id = $1 AND dv.status != 'DELETED' ORDER BY dv.dimension_id ASC, dv.name ASC`,
      [companyId],
    );
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async patchById(companyId: number, id: number, updates: PatchDimensionValueRow): Promise<DimensionValueRow> {
    const sets: string[] = [];
    const vals: unknown[] = [];

    for (const col of MUTABLE_COLUMNS) {
      const value = (updates as Record<string, unknown>)[col];
      if (value !== undefined) {
        vals.push(value);
        sets.push(`${col} = $${vals.length}`);
      }
    }

    if (updates.updated_user_id !== undefined) {
      vals.push(updates.updated_user_id);
      sets.push(`updated_user_id = $${vals.length}`);
    }
    if (updates.updated_actor_type !== undefined) {
      vals.push(updates.updated_actor_type);
      sets.push(`updated_actor_type = $${vals.length}::actor_type`);
    }
    if (updates.updated_date !== undefined) {
      vals.push(updates.updated_date);
      sets.push(`updated_date = $${vals.length}::timestamptz`);
    }
    if (updates.updated_mutation_id !== undefined) {
      vals.push(updates.updated_mutation_id);
      sets.push(`updated_mutation_id = $${vals.length}::uuid`);
    }

    if (sets.length === 0) {
      const existing = await this.getById(companyId, id);
      if (!existing) throw new DataError(`Dimension value ${id} not found`);
      return existing;
    }

    vals.push(companyId, id);
    const sql = `UPDATE ${TABLE} SET ${sets.join(", ")} WHERE finance_company_id = $${vals.length - 1} AND id = $${vals.length} RETURNING *`;

    const { rows } = await this.db.query(sql, vals);
    if (!rows[0]) throw new DataError(`Dimension value ${id} not found`);
    const updated = await this.getById(companyId, id);
    return updated ?? this.mapRow(rows[0]);
  }

  async deleteById(companyId: number, id: number): Promise<void> {
    await this.db.query(`DELETE FROM ${TABLE} WHERE finance_company_id = $1 AND id = $2`, [companyId, id]);
  }

  private mapRow(row: Record<string, unknown>): DimensionValueRow {
    const companiesWithPostings = parsePostgresTextArray(row.companies_with_postings);
    return {
      ...row,
      id: Number(row.id),
      finance_company_id: Number(row.finance_company_id),
      dimension_id: Number(row.dimension_id),
      companies_with_postings: companiesWithPostings,
      has_postings: companiesWithPostings.length > 0,
      creation_date: row.creation_date instanceof Date
        ? row.creation_date.toISOString()
        : String(row.creation_date),
      updated_date: row.updated_date instanceof Date
        ? row.updated_date.toISOString()
        : String(row.updated_date),
    } as DimensionValueRow;
  }
}
