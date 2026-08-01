import { DataError } from "@voyzu/capability/errors";
import type { DbExecutor } from "@voyzu/capability/db";
import type { ActorType } from "@voyzu/core/types/modules/core";
import type {
  JournalHeaderRow,
  InsertJournalHeaderRow,
  PatchJournalHeaderRow,
  JournalLineRow,
  InsertJournalLineRow,
  JournalLineDimensionRow,
  InsertJournalLineDimensionRow,
} from "./journal.row.types";

const JOURNAL_TABLE = "journal_header";
const LINE_TABLE = "journal_line";
const LINE_DIM_TABLE = "journal_line_dimension";

const PATCH_COLUMNS: readonly string[] = [
  "financial_year_id", "financial_year_code",
  "financial_period_id", "financial_period_code",
  "posting_date", "memo",
  "updated_user_id",
];

function assertPatchColumn(field: string): void {
  if (!PATCH_COLUMNS.includes(field)) {
    throw new Error(`Unknown journal patch column: ${field}`);
  }
}

function localDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function mapJournalRow(row: Record<string, unknown>): JournalHeaderRow {
  return {
    ...row,
    id: Number(row.id),
    company_id: Number(row.company_id),
    financial_year_id: Number(row.financial_year_id),
    financial_period_id: Number(row.financial_period_id),
    number_lines: Number(row.number_lines ?? 0),
    total_debit_base_amount: row.total_debit_base_amount != null ? Number(row.total_debit_base_amount) : null,
    total_credit_base_amount: row.total_credit_base_amount != null ? Number(row.total_credit_base_amount) : null,
    reversal_of_journal_id: row.reversal_of_journal_id != null ? Number(row.reversal_of_journal_id) : null,
    reversal_of_journal_code: row.reversal_of_journal_code != null ? String(row.reversal_of_journal_code) : null,
    reversed_by_journal_id: row.reversed_by_journal_id != null ? Number(row.reversed_by_journal_id) : null,
    reversed_by_journal_code: row.reversed_by_journal_code != null ? String(row.reversed_by_journal_code) : null,
    bank_cash_account_id: row.bank_cash_account_id != null ? Number(row.bank_cash_account_id) : null,
    bank_cash_gl_account_id: row.bank_cash_gl_account_id != null ? Number(row.bank_cash_gl_account_id) : null,
    document_date: row.document_date instanceof Date ? localDateString(row.document_date) : String(row.document_date),
    posting_date: row.posting_date instanceof Date ? localDateString(row.posting_date) : String(row.posting_date),
    creation_date: row.creation_date instanceof Date ? row.creation_date.toISOString() : String(row.creation_date),
    updated_date: row.updated_date instanceof Date ? row.updated_date.toISOString() : String(row.updated_date),
  } as JournalHeaderRow;
}

const JOURNAL_SELECT = `
  SELECT j.*,
    COALESCE(line_counts.number_lines, 0)::int AS number_lines,
    ar_entry.code AS ar_subledger_entry_code,
    ap_entry.code AS ap_subledger_entry_code,
    tax_entry.code AS tax_ledger_entry_code,
    j_rev.code AS reversal_of_journal_code,
    j_revby.code AS reversed_by_journal_code
  FROM ${JOURNAL_TABLE} j
  LEFT JOIN (
    SELECT journal_header_id, COUNT(*)::int AS number_lines
    FROM ${LINE_TABLE}
    GROUP BY journal_header_id
  ) line_counts ON line_counts.journal_header_id = j.id
  LEFT JOIN LATERAL (
    SELECT ar.code
    FROM ar_subledger_entry_header ar
    WHERE ar.journal_header_id = j.id
    ORDER BY ar.id ASC
    LIMIT 1
  ) ar_entry ON true
  LEFT JOIN LATERAL (
    SELECT ap.code
    FROM ap_subledger_entry_header ap
    WHERE ap.journal_header_id = j.id
    ORDER BY ap.id ASC
    LIMIT 1
  ) ap_entry ON true
  LEFT JOIN LATERAL (
    SELECT tax.code
    FROM tax_ledger_entry_header tax
    WHERE tax.journal_header_id = j.id
    ORDER BY tax.id ASC
    LIMIT 1
  ) tax_entry ON true
  LEFT JOIN ${JOURNAL_TABLE} j_rev ON j_rev.id = j.reversal_of_journal_id
  LEFT JOIN ${JOURNAL_TABLE} j_revby ON j_revby.id = j.reversed_by_journal_id
`;

function mapLineRow(row: Record<string, unknown>): JournalLineRow {
  return {
    ...row,
    id: Number(row.id),
    journal_header_id: Number(row.journal_header_id),
    line_number: Number(row.line_number),
    gl_account_id: Number(row.gl_account_id),
    base_currency_amount: Number(row.base_currency_amount),
    creation_date: row.creation_date instanceof Date ? row.creation_date.toISOString() : String(row.creation_date),
    updated_date: row.updated_date instanceof Date ? row.updated_date.toISOString() : String(row.updated_date),
  } as JournalLineRow;
}

export class JournalRepo {
  constructor(private readonly db: DbExecutor) {}

  async reserveHeaderId(): Promise<number> {
    const { rows } = await this.db.query(
      `SELECT nextval(pg_get_serial_sequence('${JOURNAL_TABLE}', 'id')) AS id`,
    );
    return Number(rows[0].id);
  }

  async listByCompany(companyId: number): Promise<JournalHeaderRow[]> {
    const { rows } = await this.db.query(
      `${JOURNAL_SELECT} WHERE j.company_id = $1 ORDER BY j.id DESC`,
      [companyId],
    );
    return rows.map((r: Record<string, unknown>) => mapJournalRow(r));
  }

  async get(companyId: number, code: string): Promise<JournalHeaderRow | null> {
    const { rows } = await this.db.query(
      `${JOURNAL_SELECT} WHERE j.company_id = $1 AND j.code = $2`,
      [companyId, code],
    );
    return rows[0] ? mapJournalRow(rows[0]) : null;
  }

  async getById(id: number): Promise<JournalHeaderRow | null> {
    const { rows } = await this.db.query(
      `${JOURNAL_SELECT} WHERE j.id = $1`,
      [id],
    );
    return rows[0] ? mapJournalRow(rows[0]) : null;
  }

  async insert(row: InsertJournalHeaderRow): Promise<JournalHeaderRow> {
    const tempCode = `TEMP-${Date.now()}`;
    const idColumn = row.id != null ? "id, " : "";
    const idPlaceholder = row.id != null ? "$1," : "";
    const offset = row.id != null ? 1 : 0;
    const param = (index: number) => `$${index + offset}`;
    const { rows } = await this.db.query(
      `INSERT INTO ${JOURNAL_TABLE}
         (${idColumn}code, company_id, company_code, company_name,
          document_type_code, document_type_label,
          document_id, description,
          document_snapshot_json, detailed_document_snapshot_json,
          posting_engine_code,
          document_date, posting_date,
          financial_year_id, financial_year_code, financial_period_id, financial_period_code,
          base_currency_code,
          memo, status, reversal_of_journal_id,
          bank_cash_account_id, bank_cash_code, bank_cash_type,
          bank_cash_gl_account_id, bank_cash_gl_account_code, bank_cash_gl_account_name,
          bank_cash_bank_name, bank_cash_bank_branch_name, bank_cash_account_identifier, bank_cash_cash_account_identifier,
          bank_cash_tx_id, bank_cash_tx_code, bank_cash_tx_ref, bank_cash_tx_details, bank_cash_payment_ref,
          creation_date, creation_actor_type, creation_user_id)
       VALUES (${idPlaceholder}${param(1)},${param(2)},${param(3)},${param(4)},${param(5)},${param(6)},${param(7)},${param(8)},${param(9)},${param(10)},${param(11)},${param(12)},${param(13)},${param(14)},${param(15)},${param(16)},${param(17)},${param(18)},${param(19)},'DRAFT',${param(20)},${param(21)},${param(22)},${param(23)},${param(24)},${param(25)},${param(26)},${param(27)},${param(28)},${param(29)},${param(30)},${param(31)},${param(32)},${param(33)},${param(34)},${param(35)},now(),'SYSTEM',${param(36)})
       RETURNING *`,
      [
        ...(row.id != null ? [row.id] : []),
        tempCode,
        row.company_id, row.company_code, row.company_name,
        row.document_type_code, row.document_type_label,
        row.document_id, row.description,
        row.document_snapshot_json ?? {}, row.detailed_document_snapshot_json ?? {},
        row.posting_engine_code,
        row.document_date, row.posting_date,
        row.financial_year_id, row.financial_year_code, row.financial_period_id, row.financial_period_code,
        row.base_currency_code,
        row.memo ?? null,
        row.reversal_of_journal_id ?? null,
        row.bank_cash_account_id ?? null,
        row.bank_cash_code ?? null,
        row.bank_cash_type ?? null,
        row.bank_cash_gl_account_id ?? null,
        row.bank_cash_gl_account_code ?? null,
        row.bank_cash_gl_account_name ?? null,
        row.bank_cash_bank_name ?? null,
        row.bank_cash_bank_branch_name ?? null,
        row.bank_cash_account_identifier ?? null,
        row.bank_cash_cash_account_identifier ?? null,
        row.bank_cash_tx_id ?? null,
        row.bank_cash_tx_code ?? null,
        row.bank_cash_tx_ref ?? null,
        row.bank_cash_tx_details ?? null,
        row.bank_cash_payment_ref ?? null,
        row.creation_user_id ?? null,
      ],
    );

    const inserted = rows[0] as Record<string, unknown>;
    const newId = Number(inserted.id);
    const year = new Date().getFullYear();
    const generatedCode = `JRN-${year}-${String(newId).padStart(6, "0")}`;

    const { rows: updated } = await this.db.query(
      `UPDATE ${JOURNAL_TABLE} SET code = $1, updated_date = now(), updated_actor_type = 'SYSTEM' WHERE id = $2 RETURNING *`,
      [generatedCode, newId],
    );

    return mapJournalRow({ ...inserted, ...updated[0] as Record<string, unknown>, reversal_of_journal_code: null, reversed_by_journal_code: null });
  }

  async patch(companyId: number, code: string, updates: PatchJournalHeaderRow): Promise<JournalHeaderRow> {
    const sets: string[] = [];
    const vals: unknown[] = [];

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        assertPatchColumn(key);
        vals.push(value);
        sets.push(`${key} = $${vals.length}`);
      }
    }

    if (sets.length === 0) {
      const existing = await this.get(companyId, code);
      if (!existing) throw new DataError(`Journal ${code} not found`);
      return existing;
    }

    sets.push(`updated_date = now()`, `updated_actor_type = 'SYSTEM'`);
    vals.push(companyId, code);

    const sql = `UPDATE ${JOURNAL_TABLE} SET ${sets.join(", ")} WHERE company_id = $${vals.length - 1} AND code = $${vals.length} RETURNING *`;
    const { rows } = await this.db.query(sql, vals);
    if (!rows[0]) throw new DataError(`Journal ${code} not found`);
    return this.get(companyId, code).then((r) => {
      if (!r) throw new DataError(`Journal ${code} not found after update`);
      return r;
    });
  }

  async setPosted(id: number, totalDr: number, totalCr: number): Promise<JournalHeaderRow> {
    const { rows } = await this.db.query(
      `UPDATE ${JOURNAL_TABLE}
       SET status = 'POSTED',
           total_debit_base_amount = $1,
           total_credit_base_amount = $2,
           updated_date = now(),
           updated_actor_type = 'SYSTEM'
       WHERE id = $3 RETURNING id, company_id, code`,
      [totalDr, totalCr, id],
    );
    if (!rows[0]) throw new DataError(`Journal id ${id} not found`);
    const r = rows[0] as Record<string, unknown>;
    const updated = await this.get(Number(r.company_id), String(r.code));
    if (!updated) throw new DataError(`Journal id ${id} not found after post`);
    return updated;
  }

  async setReversedBy(id: number, reversalJournalId: number): Promise<void> {
    await this.db.query(
      `UPDATE ${JOURNAL_TABLE}
       SET reversed_by_journal_id = $1, updated_date = now(), updated_actor_type = 'SYSTEM'
       WHERE id = $2`,
      [reversalJournalId, id],
    );
  }

  async delete(companyId: number, code: string): Promise<void> {
    await this.db.query(
      `DELETE FROM ${JOURNAL_TABLE} WHERE company_id = $1 AND code = $2`,
      [companyId, code],
    );
  }

  // ── Lines ──────────────────────────────────────────────────────

  async listLines(journalHeaderId: number): Promise<JournalLineRow[]> {
    const { rows } = await this.db.query(
      `SELECT * FROM ${LINE_TABLE} WHERE journal_header_id = $1 ORDER BY line_number ASC`,
      [journalHeaderId],
    );
    return rows.map((r: Record<string, unknown>) => mapLineRow(r));
  }

  async listLinesByJournalIds(journalHeaderIds: number[]): Promise<JournalLineRow[]> {
    if (journalHeaderIds.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT * FROM ${LINE_TABLE} WHERE journal_header_id = ANY($1) ORDER BY journal_header_id ASC, line_number ASC`,
      [journalHeaderIds],
    );
    return rows.map((r: Record<string, unknown>) => mapLineRow(r));
  }

  async insertLine(row: InsertJournalLineRow): Promise<JournalLineRow> {
    const { rows } = await this.db.query(
      `INSERT INTO ${LINE_TABLE}
         (journal_header_id, line_number,
          gl_account_id, gl_account_code, gl_account_name,
          source_ledger, source_control_account,
          description, memo, dr_cr,
          base_currency_amount,
          creation_date, creation_actor_type, creation_user_id)
       VALUES
         ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,now(),'SYSTEM',$12)
       RETURNING *`,
      [
        row.journal_header_id, row.line_number,
        row.gl_account_id, row.gl_account_code, row.gl_account_name,
        row.source_ledger ?? null, row.source_control_account ?? null,
        row.description, row.memo ?? null, row.dr_cr,
        row.base_currency_amount,
        row.creation_user_id ?? null,
      ],
    );
    return mapLineRow(rows[0]);
  }

  async deleteLines(journalHeaderId: number): Promise<void> {
    await this.db.query(`DELETE FROM ${LINE_TABLE} WHERE journal_header_id = $1`, [journalHeaderId]);
  }

  async deleteLine(lineId: number): Promise<void> {
    await this.db.query(`DELETE FROM ${LINE_TABLE} WHERE id = $1`, [lineId]);
  }

  // ── Line Dimensions ────────────────────────────────────────────

  async listLineDimensions(journalLineId: number): Promise<JournalLineDimensionRow[]> {
    const { rows } = await this.db.query(
      `SELECT * FROM ${LINE_DIM_TABLE} WHERE journal_line_id = $1 ORDER BY dimension_code ASC`,
      [journalLineId],
    );
    return rows.map((r: Record<string, unknown>) => ({
      id: Number(r.id),
      journal_line_id: Number(r.journal_line_id),
      dimension_id: Number(r.dimension_id),
      dimension_value_id: Number(r.dimension_value_id),
      dimension_code: String(r.dimension_code),
      dimension_name: String(r.dimension_name),
      dimension_value_name: String(r.dimension_value_name),
      creation_date: r.creation_date instanceof Date ? r.creation_date.toISOString() : String(r.creation_date),
      creation_actor_type: String(r.creation_actor_type),
      creation_user_id: r.creation_user_id != null ? String(r.creation_user_id) : null,
    } as JournalLineDimensionRow));
  }

  async insertLineDimension(row: InsertJournalLineDimensionRow): Promise<JournalLineDimensionRow> {
    const { rows } = await this.db.query(
      `INSERT INTO ${LINE_DIM_TABLE}
         (journal_line_id, dimension_id, dimension_value_id,
          dimension_code, dimension_name, dimension_value_name,
          creation_date, creation_actor_type, creation_user_id)
       VALUES ($1,$2,$3,$4,$5,$6,now(),'SYSTEM',$7)
       RETURNING *`,
      [
        row.journal_line_id, row.dimension_id, row.dimension_value_id,
        row.dimension_code, row.dimension_name, row.dimension_value_name,
        row.creation_user_id ?? null,
      ],
    );
    return {
      id: Number(rows[0].id),
      journal_line_id: Number(rows[0].journal_line_id),
      dimension_id: Number(rows[0].dimension_id),
      dimension_value_id: Number(rows[0].dimension_value_id),
      dimension_code: String(rows[0].dimension_code),
      dimension_name: String(rows[0].dimension_name),
      dimension_value_name: String(rows[0].dimension_value_name),
      creation_date: rows[0].creation_date instanceof Date ? rows[0].creation_date.toISOString() : String(rows[0].creation_date),
      creation_actor_type: String(rows[0].creation_actor_type) as ActorType,
      creation_user_id: rows[0].creation_user_id != null ? String(rows[0].creation_user_id) : null,
    };
  }

  async deleteLineDimensions(journalLineId: number): Promise<void> {
    await this.db.query(`DELETE FROM ${LINE_DIM_TABLE} WHERE journal_line_id = $1`, [journalLineId]);
  }
}
