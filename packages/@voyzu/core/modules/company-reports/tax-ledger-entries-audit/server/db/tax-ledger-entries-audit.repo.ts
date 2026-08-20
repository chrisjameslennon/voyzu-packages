import type { DbExecutor } from "@voyzu/capability/db";
import type { TaxLedgerEntriesAuditEntryDto, TaxLedgerEntriesAuditFieldDto } from "@voyzu/core/types/modules/company-reports";

const ENTRY_FIELDS: Array<{ key: string; label: string }> = [
  { key: "id", label: "ID" },
  { key: "tax_ledger_entry_code", label: "Tax Ledger Entry Code" },
  { key: "line_number", label: "Line Number" },
  { key: "company_id", label: "Company ID" },
  { key: "journal_header_id", label: "Journal Header ID" },
  { key: "document_id", label: "Document ID" },
  { key: "description", label: "Description" },
  { key: "posting_date", label: "Posting Date" },
  { key: "financial_year_id", label: "Financial Year ID" },
  { key: "financial_period_id", label: "Financial Period ID" },
  { key: "tax_rule_id", label: "Tax Rule ID" },
  { key: "tax_component_id", label: "Tax Component ID" },
  { key: "tax_authority_id", label: "Tax Authority ID" },
  { key: "tax_movement_type_code", label: "Tax control account" },
  { key: "scheme_code", label: "Scheme" },
  { key: "invoice_label", label: "Invoice Label" },
  { key: "report_label", label: "Report Label" },
  { key: "tax_rate", label: "Tax Rate" },
  { key: "taxable_base_currency_amount", label: "Taxable Base Amount" },
  { key: "base_currency_code", label: "Base Currency" },
  { key: "dr_cr", label: "DR/CR" },
  { key: "base_currency_amount", label: "Base Currency Amount" },
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

function fieldsFromRow(row: Record<string, unknown>): TaxLedgerEntriesAuditFieldDto[] {
  return ENTRY_FIELDS.map((field) => ({
    label: field.label,
    value: formatValue(row[field.key]),
  }));
}

export class TaxLedgerEntriesAuditRepo {
  constructor(private readonly db: DbExecutor) { }

  async getEntries(companyId: number, fromDate: string, toDate: string): Promise<TaxLedgerEntriesAuditEntryDto[]> {
    const { rows } = await this.db.query(
      `SELECT
         l.id,
         e.code AS tax_ledger_entry_code,
         l.line_number,
         e.company_id,
         e.journal_header_id,
         e.document_id,
         e.description,
         e.posting_date,
         e.financial_year_id,
         e.financial_period_id,
         l.tax_rule_id,
         l.tax_component_id,
         l.tax_authority_id,
         l.tax_movement_type_code,
         l.scheme_code,
         l.invoice_label,
         l.report_label,
         l.tax_rate,
         l.taxable_base_currency_amount,
         e.base_currency_code,
         l.dr_cr,
         l.base_currency_amount,
         e.status,
         h.document_snapshot_json,
         h.detailed_document_snapshot_json
       FROM tax_ledger_entry_header e
       JOIN tax_ledger_entry_line l ON l.tax_ledger_entry_header_id = e.id
       JOIN journal_header h ON h.id = e.journal_header_id
       WHERE e.company_id = $1
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


