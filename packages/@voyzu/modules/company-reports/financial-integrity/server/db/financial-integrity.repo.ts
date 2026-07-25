import type { DbExecutor } from "@voyzu/capability/db";
import type { AccountType, DrCr } from "@voyzu/types/modules/core";
import type {
  FinancialIntegrityDocumentTypeDto,
  FinancialIntegrityInventoryLedgerLineDto,
  FinancialIntegrityLedgerLineDto,
} from "@voyzu/types/modules/company-reports";

export interface FinancialIntegrityJournalRow {
  journal_id: number;
  journal_code: string;
  document_type_code: string;
  document_type_label: string;
  document_id: string;
  description: string;
  memo: string | null;
  document_snapshot_json: Record<string, unknown>;
  detailed_document_snapshot_json: Record<string, unknown>;
  posting_date: string;
  financial_period_code: string;
  base_currency_code: string;
  status: string;
  header_total_debit: number;
  header_total_credit: number;
  line_id: number | null;
  line_number: number | null;
  gl_account_id: number | null;
  gl_account_code: string | null;
  gl_account_name: string | null;
  dr_cr: DrCr | null;
  base_currency_amount: number | null;
  source_ledger: string | null;
  source_control_account: string | null;
  line_description: string | null;
  line_memo: string | null;
  dimensions: Record<string, string>;
}

export interface FinancialIntegrityInventoryLedgerHeaderRow {
  id: number;
  code: string;
  journal_header_id: number;
  parent_document_type_code: string;
  parent_document_id: string;
  source_document_id: string | null;
  source_document_type_code: string;
  document_id: string;
  description: string | null;
  memo: string | null;
  posting_date: string;
  base_currency_code: string;
  status: string;
  lines: FinancialIntegrityInventoryLedgerLineDto[];
}

export interface FinancialIntegritySubledgerEntryRow {
  id: number;
  code: string;
  ledger: "AR" | "AP" | "TAX";
  journal_header_id: number;
  document_type_code: string;
  document_id: string;
  description: string | null;
  memo: string | null;
  posting_date: string;
  base_currency_code: string;
  status: string;
  lines: Record<string, unknown>[];
}

export interface FinancialIntegrityDbChecks {
  orphanJournalLineCount: number;
  missingGlAccountReferenceCount: number;
  missingJournalHeaderForListedLineCount: number;
}

export class FinancialIntegrityRepo {
  constructor(private readonly db: DbExecutor) {}

  async getDocumentTypes(): Promise<FinancialIntegrityDocumentTypeDto[]> {
    const { rows } = await this.db.query(
      `SELECT code, name
       FROM financial_document_type
       WHERE status != 'DELETED'
       ORDER BY code ASC`,
    );
    return rows.map((row: Record<string, unknown>) => ({
      code: String(row.code),
      name: String(row.name),
    }));
  }

  async getLedgerLines(companyId: number, fromDate: string, toDate: string): Promise<FinancialIntegrityLedgerLineDto[]> {
    const { rows } = await this.db.query(
      `WITH source_lines AS (
         SELECT
           jl.gl_account_id,
           jl.gl_account_code,
           jl.gl_account_name,
           ga.account_type,
           CASE WHEN jl.dr_cr = 'DR' THEN jl.base_currency_amount ELSE -jl.base_currency_amount END AS signed_amount,
           CASE WHEN jl.dr_cr = 'DR' THEN jl.base_currency_amount ELSE 0 END AS debit_amount,
           CASE WHEN jl.dr_cr = 'CR' THEN jl.base_currency_amount ELSE 0 END AS credit_amount,
           jh.posting_date
         FROM journal_line jl
         JOIN journal_header jh ON jh.id = jl.journal_header_id
         JOIN gl_account ga ON ga.company_id = jh.company_id AND ga.id = jl.gl_account_id
         WHERE jh.company_id = $1
           AND jh.status = 'POSTED'
           AND jh.posting_date <= $3
       )
       SELECT
         gl_account_id,
         gl_account_code,
         gl_account_name,
         account_type,
         COALESCE(SUM(CASE WHEN posting_date < $2 THEN signed_amount ELSE 0 END), 0) AS opening_balance,
         COALESCE(SUM(CASE WHEN posting_date >= $2 AND posting_date <= $3 THEN debit_amount ELSE 0 END), 0) AS period_debits,
         COALESCE(SUM(CASE WHEN posting_date >= $2 AND posting_date <= $3 THEN credit_amount ELSE 0 END), 0) AS period_credits,
         COALESCE(SUM(CASE WHEN posting_date >= $2 AND posting_date <= $3 THEN signed_amount ELSE 0 END), 0) AS net_movement,
         COALESCE(SUM(CASE WHEN posting_date <= $3 THEN signed_amount ELSE 0 END), 0) AS closing_balance
       FROM source_lines
       GROUP BY gl_account_id, gl_account_code, gl_account_name, account_type
       HAVING
         COALESCE(SUM(CASE WHEN posting_date < $2 THEN signed_amount ELSE 0 END), 0) <> 0
         OR COALESCE(SUM(CASE WHEN posting_date >= $2 AND posting_date <= $3 THEN debit_amount ELSE 0 END), 0) <> 0
         OR COALESCE(SUM(CASE WHEN posting_date >= $2 AND posting_date <= $3 THEN credit_amount ELSE 0 END), 0) <> 0
         OR COALESCE(SUM(CASE WHEN posting_date <= $3 THEN signed_amount ELSE 0 END), 0) <> 0
       ORDER BY
         CASE account_type
           WHEN 'ASSET'     THEN 1
           WHEN 'LIABILITY' THEN 2
           WHEN 'EQUITY'    THEN 3
           WHEN 'REVENUE'   THEN 4
           WHEN 'EXPENSE'   THEN 5
           ELSE 6
         END,
         gl_account_code ASC`,
      [companyId, fromDate, toDate],
    );

    return rows.map((row: Record<string, unknown>) => ({
      glAccountId: Number(row.gl_account_id),
      glAccountCode: String(row.gl_account_code),
      glAccountName: String(row.gl_account_name),
      accountType: String(row.account_type) as AccountType,
      openingBalance: Number(row.opening_balance),
      periodDebits: Number(row.period_debits),
      periodCredits: Number(row.period_credits),
      netMovement: Number(row.net_movement),
      closingBalance: Number(row.closing_balance),
    }));
  }

  async getJournalRows(
    companyId: number,
    fromDate: string,
    toDate: string,
    documentTypeCode?: string | null,
  ): Promise<FinancialIntegrityJournalRow[]> {
    const params: unknown[] = [companyId, fromDate, toDate];
    const documentTypeClause = documentTypeCode ? `AND jh.document_type_code = $${params.push(documentTypeCode)}` : "";
    const { rows } = await this.db.query(
      `WITH line_dimensions AS (
         SELECT
           jl.id AS journal_line_id,
           jsonb_object_agg(jld.dimension_code, jld.dimension_value_name)
             FILTER (WHERE jld.dimension_code IS NOT NULL) AS dimensions
         FROM journal_line jl
         LEFT JOIN journal_line_dimension jld ON jld.journal_line_id = jl.id
         GROUP BY jl.id
       )
       SELECT
         jh.id::int AS journal_id,
         jh.code AS journal_code,
         jh.document_type_code,
         jh.document_type_label,
         jh.document_id,
         jh.description,
         jh.memo,
         jh.document_snapshot_json,
         jh.detailed_document_snapshot_json,
         jh.posting_date::text AS posting_date,
         jh.financial_period_code,
         jh.base_currency_code,
         jh.status,
         COALESCE(jh.total_debit_base_amount, 0)::float AS header_total_debit,
         COALESCE(jh.total_credit_base_amount, 0)::float AS header_total_credit,
         jl.id::int AS line_id,
         jl.line_number::int AS line_number,
         jl.gl_account_id::int AS gl_account_id,
         jl.gl_account_code,
         jl.gl_account_name,
          jl.dr_cr,
          jl.base_currency_amount::float AS base_currency_amount,
          jl.source_ledger,
          jl.source_control_account,
          jl.description AS line_description,
          jl.memo AS line_memo,
          COALESCE(ld.dimensions, '{}'::jsonb) AS dimensions
       FROM journal_header jh
       LEFT JOIN journal_line jl ON jl.journal_header_id = jh.id
       LEFT JOIN line_dimensions ld ON ld.journal_line_id = jl.id
       WHERE jh.company_id = $1
         AND jh.status = 'POSTED'
         AND jh.posting_date >= $2
         AND jh.posting_date <= $3
         ${documentTypeClause}
       ORDER BY jh.posting_date ASC, jh.id ASC, jl.line_number ASC`,
      params,
    );

    return rows.map((row: Record<string, unknown>) => ({
      journal_id: Number(row.journal_id),
      journal_code: String(row.journal_code),
      document_type_code: String(row.document_type_code),
      document_type_label: String(row.document_type_label),
      document_id: String(row.document_id),
      description: String(row.description),
      memo: row.memo == null ? null : String(row.memo),
      document_snapshot_json: (row.document_snapshot_json ?? {}) as Record<string, unknown>,
      detailed_document_snapshot_json: (row.detailed_document_snapshot_json ?? {}) as Record<string, unknown>,
      posting_date: String(row.posting_date),
      financial_period_code: String(row.financial_period_code),
      base_currency_code: String(row.base_currency_code),
      status: String(row.status),
      header_total_debit: Number(row.header_total_debit),
      header_total_credit: Number(row.header_total_credit),
      line_id: row.line_id == null ? null : Number(row.line_id),
      line_number: row.line_number == null ? null : Number(row.line_number),
      gl_account_id: row.gl_account_id == null ? null : Number(row.gl_account_id),
      gl_account_code: row.gl_account_code == null ? null : String(row.gl_account_code),
      gl_account_name: row.gl_account_name == null ? null : String(row.gl_account_name),
      dr_cr: row.dr_cr == null ? null : String(row.dr_cr) as DrCr,
      base_currency_amount: row.base_currency_amount == null ? null : Number(row.base_currency_amount),
      source_ledger: row.source_ledger == null ? null : String(row.source_ledger),
      source_control_account: row.source_control_account == null ? null : String(row.source_control_account),
      line_description: row.line_description == null ? null : String(row.line_description),
      line_memo: row.line_memo == null ? null : String(row.line_memo),
      dimensions: (row.dimensions ?? {}) as Record<string, string>,
    }));
  }

  async getLinkedInventoryDocuments(
    companyId: number,
    fromDate: string,
    toDate: string,
    documentTypeCode?: string | null,
  ): Promise<FinancialIntegrityInventoryLedgerHeaderRow[]> {
    const params: unknown[] = [companyId, fromDate, toDate];
    const documentTypeClause = documentTypeCode
      ? `AND (jh.document_type_code = $${params.push(documentTypeCode)} OR h.source_document_type_code = $${params.length})`
      : "";
    const { rows } = await this.db.query(
      `SELECT
         h.id::int AS id,
         h.code,
         h.journal_header_id::int AS journal_header_id,
         jh.document_type_code AS parent_document_type_code,
         jh.document_id AS parent_document_id,
         COALESCE(jh.detailed_document_snapshot_json->'source'->>'source_document_id', jh.document_id) AS source_document_id,
         h.source_document_type_code,
         h.document_id,
         h.description,
         h.memo,
         h.posting_date::text AS posting_date,
         h.base_currency_code,
         h.status,
         COALESCE(json_agg(json_build_object(
           'lineNumber', l.line_number,
           'movement', l.movement_type_code,
           'itemCode', item.code,
           'itemName', item.name,
           'qtyDelta', l.qty_delta::float,
           'unitValueSupplied', l.unit_value_supplied::float,
           'bookValueDelta', l.book_value_delta::float,
           'qtyBalance', l.qty_balance::float,
           'avgUnitValue', l.avg_unit_value::float,
           'bookValueBalance', l.book_value_balance::float
         ) ORDER BY l.line_number), '[]'::json) AS lines
       FROM inventory_ledger_entry_header h
       JOIN journal_header jh ON jh.id = h.journal_header_id
       JOIN inventory_ledger_entry_line l ON l.inventory_ledger_entry_header_id = h.id
       JOIN inventory_item item ON item.company_id = h.company_id AND item.id = l.item_id
       WHERE h.company_id = $1
         AND h.posting_date >= $2
         AND h.posting_date <= $3
         ${documentTypeClause}
       GROUP BY h.id, h.code, h.journal_header_id, jh.document_type_code, jh.document_id,
                jh.detailed_document_snapshot_json,
                h.source_document_type_code, h.document_id, h.description, h.memo,
                h.posting_date, h.base_currency_code, h.status
       ORDER BY h.posting_date ASC, h.id ASC`,
      params,
    );

    return rows.map((row: Record<string, unknown>) => ({
      id: Number(row.id),
      code: String(row.code),
      journal_header_id: Number(row.journal_header_id),
      parent_document_type_code: String(row.parent_document_type_code),
      parent_document_id: String(row.parent_document_id),
      source_document_id: row.source_document_id == null ? null : String(row.source_document_id),
      source_document_type_code: String(row.source_document_type_code),
      document_id: String(row.document_id),
      description: row.description == null ? null : String(row.description),
      memo: row.memo == null ? null : String(row.memo),
      posting_date: String(row.posting_date),
      base_currency_code: String(row.base_currency_code),
      status: String(row.status),
      lines: (row.lines ?? []) as FinancialIntegrityInventoryLedgerLineDto[],
    }));
  }

  async getSubledgerEntries(
    companyId: number,
    fromDate: string,
    toDate: string,
    documentTypeCode?: string | null,
  ): Promise<FinancialIntegritySubledgerEntryRow[]> {
    const [arEntries, apEntries, taxEntries] = await Promise.all([
      this.getArSubledgerEntries(companyId, fromDate, toDate, documentTypeCode),
      this.getApSubledgerEntries(companyId, fromDate, toDate, documentTypeCode),
      this.getTaxSubledgerEntries(companyId, fromDate, toDate, documentTypeCode),
    ]);
    return [...arEntries, ...apEntries, ...taxEntries].sort((a, b) =>
      a.posting_date.localeCompare(b.posting_date) || a.id - b.id,
    );
  }

  private async getArSubledgerEntries(
    companyId: number,
    fromDate: string,
    toDate: string,
    documentTypeCode?: string | null,
  ): Promise<FinancialIntegritySubledgerEntryRow[]> {
    const params: unknown[] = [companyId, fromDate, toDate];
    const documentTypeClause = documentTypeCode ? `AND h.document_type_code = $${params.push(documentTypeCode)}` : "";
    const { rows } = await this.db.query(
      `SELECT
         h.id::int AS id,
         h.code,
         'AR' AS ledger,
         h.journal_header_id::int AS journal_header_id,
         h.document_type_code,
         h.document_id,
         h.description,
         h.memo,
         h.posting_date::text AS posting_date,
         h.base_currency_code,
         h.status,
         COALESCE(json_agg(json_build_object(
           'line_number', l.line_number,
           'line_type', l.line_type,
           'description', l.description,
           'control_account_code', l.control_account_code,
           'dr_cr', l.dr_cr,
           'quantity', l.quantity::float,
           'unit_amount', l.unit_amount::float,
           'net_amount', l.net_amount::float,
           'tax_amount', l.tax_amount::float,
           'gross_amount', l.gross_amount::float,
           'revenue_posting_code', l.revenue_posting_code,
           'tax_rule_code', l.tax_rule_code,
           'base_currency_amount', l.base_currency_amount::float,
           'memo', l.memo
         ) ORDER BY l.line_number), '[]'::json) AS lines
       FROM ar_subledger_entry_header h
       JOIN ar_subledger_entry_line l ON l.ar_subledger_entry_header_id = h.id
       WHERE h.company_id = $1
         AND h.posting_date >= $2
         AND h.posting_date <= $3
         ${documentTypeClause}
       GROUP BY h.id, h.code, h.journal_header_id, h.document_type_code, h.document_id,
                h.description, h.memo, h.posting_date, h.base_currency_code, h.status
       ORDER BY h.posting_date ASC, h.id ASC`,
      params,
    );

    return rows.map((row: Record<string, unknown>) => ({
      id: Number(row.id),
      code: String(row.code),
      ledger: "AR",
      journal_header_id: Number(row.journal_header_id),
      document_type_code: String(row.document_type_code),
      document_id: String(row.document_id),
      description: row.description == null ? null : String(row.description),
      memo: row.memo == null ? null : String(row.memo),
      posting_date: String(row.posting_date),
      base_currency_code: String(row.base_currency_code),
      status: String(row.status),
      lines: (row.lines ?? []) as Record<string, unknown>[],
    }));
  }

  private async getApSubledgerEntries(
    companyId: number,
    fromDate: string,
    toDate: string,
    documentTypeCode?: string | null,
  ): Promise<FinancialIntegritySubledgerEntryRow[]> {
    const params: unknown[] = [companyId, fromDate, toDate];
    const documentTypeClause = documentTypeCode ? `AND h.document_type_code = $${params.push(documentTypeCode)}` : "";
    const { rows } = await this.db.query(
      `SELECT
         h.id::int AS id,
         h.code,
         'AP' AS ledger,
         h.journal_header_id::int AS journal_header_id,
         h.document_type_code,
         h.document_id,
         h.description,
         h.memo,
         h.posting_date::text AS posting_date,
         h.base_currency_code,
         h.status,
         COALESCE(json_agg(json_build_object(
           'line_number', l.line_number,
           'line_type', l.line_type,
           'description', l.description,
           'control_account_code', l.control_account_code,
           'dr_cr', l.dr_cr,
           'quantity', l.quantity::float,
           'unit_amount', l.unit_amount::float,
           'net_amount', l.net_amount::float,
           'tax_amount', l.tax_amount::float,
           'gross_amount', l.gross_amount::float,
           'purchase_posting_code', l.purchase_posting_code,
           'tax_authority_code', l.tax_authority_code,
           'base_currency_amount', l.base_currency_amount::float,
           'memo', l.memo
         ) ORDER BY l.line_number), '[]'::json) AS lines
       FROM ap_subledger_entry_header h
       JOIN ap_subledger_entry_line l ON l.ap_subledger_entry_header_id = h.id
       WHERE h.company_id = $1
         AND h.posting_date >= $2
         AND h.posting_date <= $3
         ${documentTypeClause}
       GROUP BY h.id, h.code, h.journal_header_id, h.document_type_code, h.document_id,
                h.description, h.memo, h.posting_date, h.base_currency_code, h.status
       ORDER BY h.posting_date ASC, h.id ASC`,
      params,
    );

    return rows.map((row: Record<string, unknown>) => ({
      id: Number(row.id),
      code: String(row.code),
      ledger: "AP",
      journal_header_id: Number(row.journal_header_id),
      document_type_code: String(row.document_type_code),
      document_id: String(row.document_id),
      description: row.description == null ? null : String(row.description),
      memo: row.memo == null ? null : String(row.memo),
      posting_date: String(row.posting_date),
      base_currency_code: String(row.base_currency_code),
      status: String(row.status),
      lines: (row.lines ?? []) as Record<string, unknown>[],
    }));
  }

  private async getTaxSubledgerEntries(
    companyId: number,
    fromDate: string,
    toDate: string,
    documentTypeCode?: string | null,
  ): Promise<FinancialIntegritySubledgerEntryRow[]> {
    const params: unknown[] = [companyId, fromDate, toDate];
    const documentTypeClause = documentTypeCode ? `AND h.document_type_code = $${params.push(documentTypeCode)}` : "";
    const { rows } = await this.db.query(
      `SELECT
         h.id::int AS id,
         h.code,
         'TAX' AS ledger,
         h.journal_header_id::int AS journal_header_id,
         h.document_type_code,
         h.document_id,
         h.description,
         NULL::text AS memo,
         h.posting_date::text AS posting_date,
         h.base_currency_code,
         h.status,
         COALESCE(json_agg(json_build_object(
           'line_number', l.line_number,
           'tax_movement_type_code', l.tax_movement_type_code,
           'scheme_code', l.scheme_code,
           'invoice_label', l.invoice_label,
           'report_label', l.report_label,
           'tax_rate', l.tax_rate::float,
           'taxable_base_currency_amount', l.taxable_base_currency_amount::float,
           'dr_cr', l.dr_cr,
           'base_currency_amount', l.base_currency_amount::float
         ) ORDER BY l.line_number), '[]'::json) AS lines
       FROM tax_ledger_entry_header h
       JOIN tax_ledger_entry_line l ON l.tax_ledger_entry_header_id = h.id
       WHERE h.company_id = $1
         AND h.posting_date >= $2
         AND h.posting_date <= $3
         ${documentTypeClause}
       GROUP BY h.id, h.code, h.journal_header_id, h.document_type_code, h.document_id,
                h.description, h.posting_date, h.base_currency_code, h.status
       ORDER BY h.posting_date ASC, h.id ASC`,
      params,
    );

    return rows.map((row: Record<string, unknown>) => ({
      id: Number(row.id),
      code: String(row.code),
      ledger: "TAX",
      journal_header_id: Number(row.journal_header_id),
      document_type_code: String(row.document_type_code),
      document_id: String(row.document_id),
      description: row.description == null ? null : String(row.description),
      memo: null,
      posting_date: String(row.posting_date),
      base_currency_code: String(row.base_currency_code),
      status: String(row.status),
      lines: (row.lines ?? []) as Record<string, unknown>[],
    }));
  }

  async getDbChecks(companyId: number, fromDate: string, toDate: string): Promise<FinancialIntegrityDbChecks> {
    const { rows } = await this.db.query(
      `SELECT
         (SELECT COUNT(*)::int
          FROM journal_line jl
          LEFT JOIN journal_header jh ON jh.id = jl.journal_header_id
          WHERE jh.id IS NULL) AS orphan_journal_line_count,
         (SELECT COUNT(*)::int
          FROM journal_line jl
          JOIN journal_header jh ON jh.id = jl.journal_header_id
          LEFT JOIN gl_account ga ON ga.company_id = jh.company_id AND ga.id = jl.gl_account_id
          WHERE jh.company_id = $1
            AND jh.posting_date >= $2
            AND jh.posting_date <= $3
            AND ga.id IS NULL) AS missing_gl_account_reference_count,
         (SELECT COUNT(*)::int
          FROM journal_line jl
          LEFT JOIN journal_header jh ON jh.id = jl.journal_header_id
          WHERE jl.journal_header_id IS NOT NULL
            AND jh.id IS NULL) AS missing_journal_header_for_listed_line_count`,
      [companyId, fromDate, toDate],
    );
    const row = rows[0] as Record<string, unknown>;
    return {
      orphanJournalLineCount: Number(row.orphan_journal_line_count),
      missingGlAccountReferenceCount: Number(row.missing_gl_account_reference_count),
      missingJournalHeaderForListedLineCount: Number(row.missing_journal_header_for_listed_line_count),
    };
  }
}
