import type { DbExecutor } from "@voyzu/capability/db";
import type { ApSubledgerEntriesAuditEntryDto, ApSubledgerEntriesAuditFieldDto } from "@voyzu/core/types/modules/company-reports";

const ENTRY_FIELDS: Array<{ key: string; label: string }> = [
  { key: "id", label: "ID" },
  { key: "ap_subledger_entry_code", label: "AP Subledger Entry Code" },
  { key: "line_number", label: "Line Number" },
  { key: "line_type", label: "Line Type" },
  { key: "finance_company_id", label: "Company ID" },
  { key: "journal_header_id", label: "Journal Header ID" },
  { key: "document_id", label: "Document ID" },
  { key: "ap_counterparty_id", label: "AP Counterparty ID" },
  { key: "control_account_code", label: "Control Account Code" },
  { key: "source_entry_header_id", label: "Source Entry Header ID" },
  { key: "target_entry_header_id", label: "Target Entry Header ID" },
  { key: "reverses_entry_line_id", label: "Reverses Entry Line ID" },
  { key: "posting_date", label: "Posting Date" },
  { key: "financial_year_id", label: "Financial Year ID" },
  { key: "financial_period_id", label: "Financial Period ID" },
  { key: "base_currency_code", label: "Base Currency" },
  { key: "dr_cr", label: "DR/CR" },
  { key: "base_currency_amount", label: "Base Currency Amount" },
  { key: "memo", label: "Memo" },
  { key: "status", label: "Status" },
  { key: "document_snapshot_json", label: "Document Snapshot JSON" },
  { key: "detailed_document_snapshot_json", label: "Detailed Document Snapshot JSON" },
];

function formatValue(value: unknown): string | null {
  if (value == null) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function fieldsFromRow(row: Record<string, unknown>): ApSubledgerEntriesAuditFieldDto[] {
  return ENTRY_FIELDS.map((field) => ({
    label: field.label,
    value: formatValue(row[field.key]),
  }));
}

export class ApSubledgerEntriesAuditRepo {
  constructor(private readonly db: DbExecutor) { }

  async getEntries(companyId: number, fromDate: string, toDate: string): Promise<ApSubledgerEntriesAuditEntryDto[]> {
    const { rows } = await this.db.query(
      `SELECT
         l.id,
         e.code AS ap_subledger_entry_code,
         l.line_number,
         l.line_type,
         e.finance_company_id,
         e.journal_header_id,
         e.document_id,
         e.ap_counterparty_id,
         l.control_account_code,
         l.source_entry_header_id,
         l.target_entry_header_id,
         l.reverses_entry_line_id,
         e.posting_date,
         e.financial_year_id,
         e.financial_period_id,
         e.base_currency_code,
         l.dr_cr,
         l.base_currency_amount,
         COALESCE(l.memo, e.memo) AS memo,
         e.status,
         h.document_snapshot_json,
         h.detailed_document_snapshot_json
       FROM ap_subledger_entry_header e
       JOIN ap_subledger_entry_line l ON l.ap_subledger_entry_header_id = e.id
       JOIN journal_header h ON h.id = e.journal_header_id
       WHERE e.finance_company_id = $1
         AND e.posting_date BETWEEN $2 AND $3
       ORDER BY e.posting_date ASC, e.code ASC, l.line_number ASC`,
      [companyId, fromDate, toDate],
    );

    return rows.map((row: Record<string, unknown>) => ({
      id: String(row.id),
      fields: fieldsFromRow(row),
    }));
  }
}



