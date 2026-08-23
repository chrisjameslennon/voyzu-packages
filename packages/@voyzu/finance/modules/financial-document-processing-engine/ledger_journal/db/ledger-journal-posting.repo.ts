import type { DbExecutor } from "@voyzu/capability/db";

import type {
  CompanyPostingContextRow,
  DimensionValueLookupRow,
  DocumentProcessorValidationRow,
  FiscalPostingPeriodRow,
  GlAccountPostingRow,
  ProtectedGlAccountLinkRow,
  SourceJournalHeaderRow,
} from "./ledger-journal-posting.row.types";

function dateString(value: unknown): string {
  if (value instanceof Date) {
    const y = value.getFullYear();
    const m = String(value.getMonth() + 1).padStart(2, "0");
    const d = String(value.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(value);
}

function companyRow(row: Record<string, unknown>): CompanyPostingContextRow {
  return {
    id: Number(row.id),
    code: String(row.code),
    name: String(row.name),
    base_currency_code: String(row.base_currency_code),
    status: row.status as "ACTIVE" | "INACTIVE",
  };
}

function documentProcessorRow(row: Record<string, unknown>): DocumentProcessorValidationRow {
  return {
    code: row.code as "LEDGER_JOURNAL" | "LEDGER_JOURNAL_REVERSAL",
    status: row.status as "ACTIVE" | "INACTIVE",
    supports_dimensions: Boolean(row.supports_dimensions),
    cash_movement: Boolean(row.cash_movement),
    supports_items: Boolean(row.supports_items),
  };
}

function fiscalPeriodRow(row: Record<string, unknown>): FiscalPostingPeriodRow {
  return {
    financial_year_id: Number(row.financial_year_id),
    financial_year_code: String(row.financial_year_code),
    financial_year_status: row.financial_year_status as "OPEN" | "CLOSED",
    financial_period_id: Number(row.financial_period_id),
    financial_period_code: String(row.financial_period_code),
    financial_period_status: row.financial_period_status as "OPEN" | "CLOSED",
    period_start_date: dateString(row.period_start_date),
    period_end_date: dateString(row.period_end_date),
  };
}

function glAccountRow(row: Record<string, unknown>): GlAccountPostingRow {
  return {
    id: Number(row.id),
    code: String(row.code),
    name: String(row.name),
    status: row.status as "ACTIVE" | "INACTIVE",
  };
}

function protectedLinkRow(row: Record<string, unknown>): ProtectedGlAccountLinkRow {
  return {
    gl_account_code: String(row.gl_account_code),
    source: row.source as ProtectedGlAccountLinkRow["source"],
    source_code: String(row.source_code),
    source_status: row.source_status as "ACTIVE" | "INACTIVE",
  };
}

function dimensionValueRow(row: Record<string, unknown>): DimensionValueLookupRow {
  return {
    dimension_id: Number(row.dimension_id),
    dimension_code: String(row.dimension_code),
    dimension_name: String(row.dimension_name),
    dimension_status: row.dimension_status as "ACTIVE" | "INACTIVE",
    dimension_value_id: Number(row.dimension_value_id),
    dimension_value_name: String(row.dimension_value_name),
    dimension_value_status: row.dimension_value_status as "ACTIVE" | "INACTIVE",
  };
}

function sourceJournalHeaderRow(row: Record<string, unknown>): SourceJournalHeaderRow {
  return {
    id: Number(row.id),
    code: String(row.code),
    finance_company_id: Number(row.finance_company_id),
    company_code: String(row.company_code),
    company_name: String(row.company_name),
    document_type_code: String(row.document_type_code),
    document_type_label: String(row.document_type_label),
    document_id: String(row.document_id),
    document_memo: row.memo == null ? null : String(row.memo),
    generated_description: String(row.description),
    document_snapshot_json: row.document_snapshot_json as Record<string, unknown>,
    detailed_document_snapshot_json: row.detailed_document_snapshot_json as Record<string, unknown>,
    posting_engine_code: String(row.posting_engine_code),
    document_date: dateString(row.document_date),
    posting_date: dateString(row.posting_date),
    financial_year_id: Number(row.financial_year_id),
    financial_year_code: String(row.financial_year_code),
    financial_period_id: Number(row.financial_period_id),
    financial_period_code: String(row.financial_period_code),
    base_currency_code: String(row.base_currency_code),
    status: String(row.status),
    reversal_of_journal_id: row.reversal_of_journal_id == null ? null : Number(row.reversal_of_journal_id),
    reversed_by_journal_id: row.reversed_by_journal_id == null ? null : Number(row.reversed_by_journal_id),
  };
}

export class LedgerJournalPostingRepo {
  constructor(private readonly db: DbExecutor) { }

  async getCompanyByCode(code: string): Promise<CompanyPostingContextRow | null> {
    const { rows } = await this.db.query(
      `SELECT fc.id, c.code, c.name, c.base_currency_code, c.status
       FROM finance_company fc JOIN company c ON c.id = fc.company_id
       WHERE c.code = $1 AND fc.is_template = false`,
      [code],
    );
    return rows[0] ? companyRow(rows[0] as Record<string, unknown>) : null;
  }

  async getDocumentProcessor(): Promise<DocumentProcessorValidationRow | null> {
    const { rows } = await this.db.query(
      `SELECT code, status, supports_dimensions, cash_movement, supports_items
       FROM financial_document_type
       WHERE code = 'LEDGER_JOURNAL'`,
    );
    return rows[0] ? documentProcessorRow(rows[0] as Record<string, unknown>) : null;
  }

  async getDocumentProcessorByCode(code: "LEDGER_JOURNAL" | "LEDGER_JOURNAL_REVERSAL"): Promise<DocumentProcessorValidationRow | null> {
    const { rows } = await this.db.query(
      `SELECT code, status, supports_dimensions, cash_movement, supports_items
       FROM financial_document_type
       WHERE code = $1`,
      [code],
    );
    return rows[0] ? documentProcessorRow(rows[0] as Record<string, unknown>) : null;
  }

  async getOpenFiscalPeriod(companyId: number, postingDate: string): Promise<FiscalPostingPeriodRow | null> {
    const { rows } = await this.db.query(
      `SELECT
         fy.id AS financial_year_id,
         fy.code AS financial_year_code,
         fy.status AS financial_year_status,
         fp.id AS financial_period_id,
         fp.code AS financial_period_code,
         fp.status AS financial_period_status,
         fp.start_date AS period_start_date,
         fp.end_date AS period_end_date
       FROM fiscal_period fp
       JOIN fiscal_year fy ON fy.id = fp.fiscal_year_id
       WHERE fp.finance_company_id = $1
         AND $2::date BETWEEN fp.start_date AND fp.end_date
       ORDER BY CASE WHEN fy.status = 'OPEN' AND fp.status = 'OPEN' THEN 0 ELSE 1 END, fp.start_date ASC
       LIMIT 1`,
      [companyId, postingDate],
    );
    return rows[0] ? fiscalPeriodRow(rows[0] as Record<string, unknown>) : null;
  }

  async listGlAccounts(companyId: number, codes: string[]): Promise<GlAccountPostingRow[]> {
    if (codes.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT id, code, name, status
       FROM gl_account
       WHERE finance_company_id = $1
         AND code = ANY($2::text[])`,
      [companyId, codes],
    );
    return rows.map((row: Record<string, unknown>) => glAccountRow(row));
  }

  async listProtectedGlAccountLinks(companyId: number, codes: string[]): Promise<ProtectedGlAccountLinkRow[]> {
    if (codes.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT ga.code AS gl_account_code,
              'POSTING_CODE'::text AS source,
              pc.code AS source_code,
              pc.status AS source_status
       FROM financial_document_default pc
       LEFT JOIN bank_cash_control_account bca ON bca.finance_company_id = pc.finance_company_id AND bca.id = pc.bank_cash_control_account_id
       JOIN gl_account ga ON ga.finance_company_id = pc.finance_company_id AND ga.id = COALESCE(pc.gl_account_id, bca.gl_account_id)
       WHERE pc.finance_company_id = $1 AND ga.code = ANY($2::text[])
       UNION ALL
       SELECT ga.code AS gl_account_code,
              'CONTROL_ACCOUNT'::text AS source,
              ca.code AS source_code,
              ca.status AS source_status
       FROM ar_control_account ca
       JOIN gl_account ga ON ga.finance_company_id = ca.finance_company_id AND ga.id = ca.gl_account_id
       WHERE ca.finance_company_id = $1 AND ga.code = ANY($2::text[])
       UNION ALL
       SELECT ga.code AS gl_account_code,
              'CONTROL_ACCOUNT'::text AS source,
              ca.code AS source_code,
              ca.status AS source_status
       FROM ap_control_account ca
       JOIN gl_account ga ON ga.finance_company_id = ca.finance_company_id AND ga.id = ca.gl_account_id
       WHERE ca.finance_company_id = $1 AND ga.code = ANY($2::text[])
       UNION ALL
        SELECT ga.code AS gl_account_code,
               'TAX_CONTROL_ACCOUNT'::text AS source,
               tmt.code AS source_code,
               tmt.status AS source_status
        FROM tax_control_account tmt
        JOIN gl_account ga ON ga.finance_company_id = tmt.finance_company_id AND ga.id = tmt.gl_account_id
        WHERE tmt.finance_company_id = $1 AND ga.code = ANY($2::text[])
        UNION ALL
        SELECT ga.code AS gl_account_code,
               'BANK_CASH'::text AS source,
               bca.code AS source_code,
               bca.status AS source_status
        FROM bank_cash_control_account bca
        JOIN gl_account ga ON ga.finance_company_id = bca.finance_company_id AND ga.id = bca.gl_account_id
        WHERE bca.finance_company_id = $1 AND ga.code = ANY($2::text[])`,
      [companyId, codes],
    );
    return rows.map((row: Record<string, unknown>) => protectedLinkRow(row));
  }

  async listDimensionValues(companyId: number, pairs: Array<{ dimensionCode: string; valueName: string }>): Promise<DimensionValueLookupRow[]> {
    if (pairs.length === 0) return [];
    const { rows } = await this.db.query(
      `SELECT
         d.id AS dimension_id,
         d.code AS dimension_code,
         d.name AS dimension_name,
         d.status AS dimension_status,
         dv.id AS dimension_value_id,
         dv.name AS dimension_value_name,
         dv.status AS dimension_value_status
       FROM dimension_value dv
       JOIN dimension d ON d.finance_company_id = dv.finance_company_id AND d.id = dv.dimension_id
       WHERE dv.finance_company_id = $1
         AND (d.code, dv.name) IN (
         SELECT * FROM unnest($2::text[], $3::text[])
       )`,
      [companyId, pairs.map((pair) => pair.dimensionCode), pairs.map((pair) => pair.valueName)],
    );
    return rows.map((row: Record<string, unknown>) => dimensionValueRow(row));
  }

  async getSourceJournal(companyId: number, code: string): Promise<SourceJournalHeaderRow | null> {
    const { rows } = await this.db.query(
      `SELECT *
       FROM journal_header
       WHERE finance_company_id = $1
         AND code = $2`,
      [companyId, code],
    );
    return rows[0] ? sourceJournalHeaderRow(rows[0] as Record<string, unknown>) : null;
  }

  async countJournalsByDocumentId(documentId: string): Promise<number> {
    const { rows } = await this.db.query(
      `SELECT COUNT(*)::text AS count
       FROM journal_header
       WHERE document_id = $1`,
      [documentId],
    );
    return Number(rows[0].count);
  }

  async countJournalArtifactsByDocumentPrefix(documentPrefix: string): Promise<{ journals: number }> {
    const { rows } = await this.db.query(
      `SELECT COUNT(*)::text AS count
       FROM journal_header
       WHERE document_id LIKE $1`,
      [`${documentPrefix}%`],
    );
    return {
      journals: Number(rows[0].count),
    };
  }

  async deleteJournalArtifactsByDocumentIds(documentIds: string[]): Promise<void> {
    if (documentIds.length === 0) return;
    const journalIds = await this.db.query(
      `SELECT id
       FROM journal_header
       WHERE document_id = ANY($1::text[])`,
      [documentIds],
    );
    const ids = journalIds.rows.map((row) => Number(row.id));
    if (ids.length) {
      await this.db.query(`SET session_replication_role = replica`);
      try {
        await this.db.query(
          `DELETE FROM journal_line_dimension
           WHERE journal_line_id IN (
             SELECT id
             FROM journal_line
             WHERE journal_header_id = ANY($1::bigint[])
           )`,
          [ids],
        );
        await this.db.query(
          `DELETE FROM journal_line
           WHERE journal_header_id = ANY($1::bigint[])`,
          [ids],
        );
        await this.db.query(
          `DELETE FROM journal_header
           WHERE id = ANY($1::bigint[])`,
          [ids],
        );
      } finally {
        await this.db.query(`SET session_replication_role = DEFAULT`);
      }
    }
  }
}
