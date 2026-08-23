import { DataError } from "@voyzu/capability/errors";
import type { DbExecutor } from "@voyzu/capability/db";
import type { UpdateAuditStamp } from "../../../../common/server";
import type { FinancialPeriodRow } from "./financial-period.row.types";

const TABLE = "fiscal_period";

const MONTH_CODES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const SELECT_WITH_DERIVED = `
  SELECT fp.*,
         EXISTS (
           SELECT 1
           FROM journal_header jh
           WHERE jh.finance_organization_id = fp.finance_organization_id
             AND jh.status = 'POSTED'
             AND jh.posting_date BETWEEN fp.start_date AND fp.end_date
         ) AS has_postings
  FROM ${TABLE} fp
`;

function localDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function lastDayOfMonth(year: number, monthIndex: number): string {
  return localDateString(new Date(year, monthIndex + 1, 0));
}

export class FinancialPeriodRepo {
  constructor(private readonly db: DbExecutor) { }

  async listByYear(fiscalYearId: number): Promise<FinancialPeriodRow[]> {
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE fp.fiscal_year_id = $1 ORDER BY fp.start_date ASC`,
      [fiscalYearId],
    );
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async listByYearIds(yearIds: number[]): Promise<FinancialPeriodRow[]> {
    if (yearIds.length === 0) return [];
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE fp.fiscal_year_id = ANY($1) ORDER BY fp.start_date ASC`,
      [yearIds],
    );
    return rows.map((r: Record<string, unknown>) => this.mapRow(r));
  }

  async getByCode(fiscalYearId: number, code: string): Promise<FinancialPeriodRow | null> {
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE fp.fiscal_year_id = $1 AND fp.code = $2`,
      [fiscalYearId, code],
    );
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async getById(id: number): Promise<FinancialPeriodRow | null> {
    const { rows } = await this.db.query(
      `${SELECT_WITH_DERIVED} WHERE fp.id = $1`,
      [id],
    );
    return rows[0] ? this.mapRow(rows[0]) : null;
  }

  async updateStatus(id: number, status: string, audit: UpdateAuditStamp): Promise<FinancialPeriodRow> {
    const { rows } = await this.db.query(
      `UPDATE ${TABLE}
       SET status = $1, updated_date = $2::timestamptz, updated_actor_type = $3::actor_type, updated_user_id = $4, updated_mutation_id = $5::uuid
       WHERE id = $6 RETURNING id`,
      [status, audit.timestamp, audit.actorType, audit.userId, audit.mutationId, id],
    );
    if (!rows[0]) throw new DataError(`Financial period id ${id} not found`);
    const updated = await this.getById(id);
    if (!updated) throw new DataError(`Financial period id ${id} not found`);
    return updated;
  }

  async seedMonthlyPeriods(
    companyId: number,
    fiscalYearId: number,
    startDate: string,
    endDate: string,
  ): Promise<void> {
    const fyStart = new Date(startDate + "T00:00:00");
    const fyEnd = new Date(endDate + "T00:00:00");

    const sql = `
      INSERT INTO ${TABLE} (finance_organization_id, fiscal_year_id, code, name, start_date, end_date, status, creation_date, creation_actor_type)
      VALUES ($1, $2, $3, $4, $5, $6, 'OPEN', now(), 'SYSTEM')
      ON CONFLICT (fiscal_year_id, code) DO NOTHING
    `;

    let current = new Date(fyStart.getFullYear(), fyStart.getMonth(), 1);

    while (current <= fyEnd) {
      const monthIndex = current.getMonth();
      const year = current.getFullYear();
      const periodStart = localDateString(new Date(year, monthIndex, 1));
      const periodEnd = lastDayOfMonth(year, monthIndex);
      const code = MONTH_CODES[monthIndex];
      const name = MONTH_NAMES[monthIndex];

      await this.db.query(sql, [companyId, fiscalYearId, code, name, periodStart, periodEnd]);

      // Advance to next month
      current = new Date(year, monthIndex + 1, 1);
    }
  }

  private mapRow(row: Record<string, unknown>): FinancialPeriodRow {
    return {
      ...row,
      id: Number(row.id),
      finance_organization_id: Number(row.finance_organization_id),
      fiscal_year_id: Number(row.fiscal_year_id),
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
        : String(row.updated_date ?? ""),
    } as FinancialPeriodRow;
  }
}
