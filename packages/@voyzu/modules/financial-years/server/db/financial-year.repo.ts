import { DataError } from "@voyzu/capability/errors";
import type { UpdateAuditStamp } from "../../../common/server";

function localDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
import type { DbExecutor } from "@voyzu/capability/db";
import type { FinancialYearRow, InsertFinancialYearRow, PatchFinancialYearRow } from "./financial-year.row.types";

const TABLE = "fiscal_year";

const COLUMNS: readonly string[] = [
  "id", "company_id", "code", "name", "start_date", "end_date", "status",
  "creation_date", "creation_actor_type", "creation_user_id", "creation_mutation_id",
  "updated_date", "updated_actor_type", "updated_user_id", "updated_mutation_id",
];

const SELECT_WITH_DERIVED = `
  SELECT fy.*,
         EXISTS (
           SELECT 1
           FROM journal_header jh
           WHERE jh.company_id = fy.company_id
             AND jh.status = 'POSTED'
             AND jh.posting_date BETWEEN fy.start_date AND fy.end_date
         ) AS has_postings
  FROM ${TABLE} fy
`;

function assertColumn(field: string): void {
  if (!COLUMNS.includes(field)) {
    throw new Error(`Unknown column: ${field}`);
  }
}

export class FinancialYearRepo {
  constructor(private readonly db: DbExecutor) {}

  async insert(row: InsertFinancialYearRow): Promise<FinancialYearRow> {
    const { rows } = await this.db.query(
      `INSERT INTO ${TABLE} (company_id, code, name, start_date, end_date, status, creation_date, creation_actor_type, creation_user_id, creation_mutation_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        row.company_id,
        row.code,
        row.name,
        row.start_date,
        row.end_date,
        row.status,
        row.creation_date,
        row.creation_actor_type,
        row.creation_user_id ?? null,
        row.creation_mutation_id ?? null,
      ],
    );
    return this.mapRow(rows[0]);
  }

  async get(companyId: number, code: string): Promise<FinancialYearRow | null> {
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE fy.company_id = $1 AND fy.code = $2`,
      [companyId, code],
    );
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async getById(id: number): Promise<FinancialYearRow | null> {
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE fy.id = $1`,
      [id],
    );
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async patch(companyId: number, code: string, updates: PatchFinancialYearRow): Promise<FinancialYearRow> {
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
      if (!existing) throw new DataError(`Financial year ${code} not found`);
      return existing;
    }

    vals.push(companyId, code);

    const sql = `UPDATE ${TABLE} SET ${sets.join(", ")} WHERE company_id = $${vals.length - 1} AND code = $${vals.length} RETURNING *`;
    const { rows } = await this.db.query(sql, vals);
    if (!rows[0]) throw new DataError(`Financial year ${code} not found`);
    return (await this.get(companyId, String(rows[0].code))) ?? this.mapRow(rows[0]);
  }

  async updateStatus(id: number, status: string, audit: UpdateAuditStamp): Promise<FinancialYearRow> {
    const { rows } = await this.db.query(
      `UPDATE ${TABLE}
       SET status = $1, updated_date = $2::timestamptz, updated_actor_type = $3::actor_type, updated_user_id = $4, updated_mutation_id = $5::uuid
       WHERE id = $6 RETURNING id`,
      [status, audit.timestamp, audit.actorType, audit.userId, audit.mutationId, id],
    );
    if (!rows[0]) throw new DataError(`Financial year id ${id} not found`);
    const updated = await this.getById(id);
    if (!updated) throw new DataError(`Financial year id ${id} not found`);
    return updated;
  }

  async delete(companyId: number, code: string): Promise<void> {
    await this.db.query(
      `DELETE FROM ${TABLE} WHERE company_id = $1 AND code = $2`,
      [companyId, code],
    );
  }

  async listByCompany(companyId: number): Promise<FinancialYearRow[]> {
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE fy.company_id = $1 ORDER BY fy.start_date ASC`,
      [companyId],
    );
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async hasPeriods(id: number): Promise<boolean> {
    const { rows } = await this.db.query(
      `SELECT 1 FROM fiscal_period WHERE fiscal_year_id = $1 LIMIT 1`,
      [id],
    );
    return rows.length > 0;
  }

  async openPeriodsCount(id: number): Promise<number> {
    const { rows } = await this.db.query(
      `SELECT COUNT(*) AS cnt FROM fiscal_period WHERE fiscal_year_id = $1 AND status = 'OPEN'`,
      [id],
    );
    return Number(rows[0]?.cnt ?? 0);
  }

  private mapRow(row: Record<string, unknown>): FinancialYearRow {
    return {
      ...row,
      id: Number(row.id),
      company_id: Number(row.company_id),
      has_postings: Boolean(row.has_postings),
      start_date: row.start_date instanceof Date
        ? localDateString(row.start_date)
        : String(row.start_date),
      end_date: row.end_date instanceof Date
        ? localDateString(row.end_date)
        : String(row.end_date),
      creation_date: row.creation_date instanceof Date
        ? row.creation_date.toISOString()
        : String(row.creation_date),
      updated_date: row.updated_date instanceof Date
        ? row.updated_date.toISOString()
        : String(row.updated_date),
    } as FinancialYearRow;
  }
}
