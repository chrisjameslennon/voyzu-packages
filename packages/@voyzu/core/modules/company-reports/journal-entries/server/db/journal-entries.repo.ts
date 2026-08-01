import type { DbExecutor } from "@voyzu/capability/db";
import type { JournalEntriesFieldDto, JournalEntriesLineDto } from "@voyzu/core/types/modules/company-reports";

const HEADER_FIELDS: Array<{ key: string; label: string }> = [
  { key: "journal_id", label: "Journal ID" },
  { key: "journal_code", label: "Journal Code" },
  { key: "company_id", label: "Company ID" },
  { key: "company_code", label: "Company Code" },
  { key: "company_name", label: "Company Name" },
  { key: "document_type_code", label: "Document Type Code" },
  { key: "document_type_label", label: "Document Type" },
  { key: "document_id", label: "Document ID" },
  { key: "posting_engine_code", label: "Posting Engine" },
  { key: "document_date", label: "Document Date" },
  { key: "posting_date", label: "Posting Date" },
  { key: "financial_year_id", label: "Financial Year ID" },
  { key: "financial_year_code", label: "Financial Year" },
  { key: "financial_period_id", label: "Financial Period ID" },
  { key: "financial_period_code", label: "Financial Period" },
  { key: "base_currency_code", label: "Base Currency" },
  { key: "total_debit_base_amount", label: "Total Debit Base Amount" },
  { key: "total_credit_base_amount", label: "Total Credit Base Amount" },
  { key: "header_memo", label: "Journal Memo" },
  { key: "status", label: "Status" },
  { key: "reversal_of_journal_id", label: "Reversal Of Journal ID" },
  { key: "reversed_by_journal_id", label: "Reversed By Journal ID" },
  { key: "document_snapshot_json", label: "Document Snapshot JSON" },
  { key: "detailed_document_snapshot_json", label: "Detailed Document Snapshot JSON" },
];

const LINE_FIELDS: Array<{ key: string; label: string }> = [
  { key: "journal_line_id", label: "Journal Line ID" },
  { key: "journal_header_id", label: "Journal Header ID" },
  { key: "line_number", label: "Line Number" },
  { key: "gl_account_id", label: "GL Account ID" },
  { key: "gl_account_code", label: "GL Account Code" },
  { key: "gl_account_name", label: "GL Account Name" },
  { key: "source_ledger", label: "Source Ledger" },
  { key: "source_control_account", label: "Source Control Account" },
  { key: "dr_cr", label: "DR/CR" },
  { key: "base_currency_amount", label: "Base Currency Amount" },
  { key: "description", label: "Description" },
  { key: "line_memo", label: "Line Memo" },
];

function formatValue(value: unknown): string | null {
  if (value == null) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function fieldsFromRow(row: Record<string, unknown>, fields: Array<{ key: string; label: string }>): JournalEntriesFieldDto[] {
  return fields.map((field) => ({
    label: field.label,
    value: formatValue(row[field.key]),
  }));
}

export class JournalEntriesRepo {
  constructor(private readonly db: DbExecutor) {}

  async getLines(companyId: number, fromDate: string, toDate: string): Promise<JournalEntriesLineDto[]> {
    const { rows } = await this.db.query(
      `SELECT
         jh.id AS journal_id,
         jh.code AS journal_code,
         jh.company_id,
         jh.company_code,
         jh.company_name,
         jh.document_type_code,
         jh.document_type_label,
         jh.document_id,
         jh.posting_engine_code,
         jh.document_date,
         jh.posting_date,
         jh.financial_year_id,
         jh.financial_year_code,
         jh.financial_period_id,
         jh.financial_period_code,
         jh.base_currency_code,
         jh.total_debit_base_amount,
         jh.total_credit_base_amount,
         jh.memo AS header_memo,
         jh.status,
         jh.reversal_of_journal_id,
         jh.reversed_by_journal_id,
         jh.document_snapshot_json,
         jh.detailed_document_snapshot_json,
         jl.id AS journal_line_id,
         jl.journal_header_id,
         jl.line_number,
         jl.gl_account_id,
         jl.gl_account_code,
         jl.gl_account_name,
         jl.source_ledger,
         jl.source_control_account,
         jl.dr_cr,
         jl.base_currency_amount,
         jl.description,
         jl.memo AS line_memo
       FROM journal_header jh
       JOIN journal_line jl ON jl.journal_header_id = jh.id
       WHERE jh.company_id = $1
         AND jh.posting_date BETWEEN $2 AND $3
       ORDER BY jh.posting_date ASC, jh.code ASC, jl.line_number ASC`,
      [companyId, fromDate, toDate],
    );

    return rows.map((row: Record<string, unknown>) => ({
      id: `${String(row.journal_id)}-${String(row.journal_line_id)}`,
      headerFields: fieldsFromRow(row, HEADER_FIELDS),
      lineFields: fieldsFromRow(row, LINE_FIELDS),
    }));
  }
}
