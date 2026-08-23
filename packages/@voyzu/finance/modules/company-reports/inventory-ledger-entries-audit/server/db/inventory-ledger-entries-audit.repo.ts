import type { DbExecutor } from "@voyzu/capability/db";
import type { InventoryLedgerEntriesAuditEntryDto, InventoryLedgerEntriesAuditFieldDto } from "@voyzu/finance/types/modules/company-reports";

const ENTRY_FIELDS: Array<{ key: string; label: string }> = [
  { key: "id", label: "ID" },
  { key: "inventory_ledger_entry_code", label: "Inventory Ledger Entry Code" },
  { key: "line_number", label: "Line Number" },
  { key: "movement_type_code", label: "Movement Type Code" },
  { key: "finance_company_id", label: "Company ID" },
  { key: "journal_header_id", label: "Journal Header ID" },
  { key: "source_document_type_code", label: "Source Document Type Code" },
  { key: "document_id", label: "Document ID" },
  { key: "item_id", label: "Item ID" },
  { key: "item_code", label: "Item Code" },
  { key: "item_name", label: "Item Name" },
  { key: "inventory_control_account_code", label: "Inventory Control Account Code" },
  { key: "posting_date", label: "Posting Date" },
  { key: "document_date", label: "Document Date" },
  { key: "financial_year_id", label: "Financial Year ID" },
  { key: "financial_period_id", label: "Financial Period ID" },
  { key: "base_currency_code", label: "Base Currency" },
  { key: "qty_delta", label: "Qty Delta" },
  { key: "unit_value_supplied", label: "Unit Value Supplied" },
  { key: "book_value_delta", label: "Book Value Delta" },
  { key: "qty_balance", label: "Qty Balance" },
  { key: "avg_unit_value", label: "Avg Unit Value" },
  { key: "book_value_balance", label: "Book Value Balance" },
  { key: "description", label: "Description" },
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

function fieldsFromRow(row: Record<string, unknown>): InventoryLedgerEntriesAuditFieldDto[] {
  return ENTRY_FIELDS.map((field) => ({
    label: field.label,
    value: formatValue(row[field.key]),
  }));
}

export class InventoryLedgerEntriesAuditRepo {
  constructor(private readonly db: DbExecutor) { }

  async getEntries(companyId: number, fromDate: string, toDate: string): Promise<InventoryLedgerEntriesAuditEntryDto[]> {
    const { rows } = await this.db.query(
      `SELECT
         l.id,
         e.code AS inventory_ledger_entry_code,
         l.line_number,
         l.movement_type_code,
         e.finance_company_id,
         e.journal_header_id,
         e.source_document_type_code,
         e.document_id,
         l.item_id,
         item.code AS item_code,
         item.name AS item_name,
         l.inventory_control_account_code,
         e.posting_date,
         e.document_date,
         e.financial_year_id,
         e.financial_period_id,
         e.base_currency_code,
         l.qty_delta,
         l.unit_value_supplied,
         l.book_value_delta,
         l.qty_balance,
         l.avg_unit_value,
         l.book_value_balance,
         COALESCE(l.description, e.description) AS description,
         COALESCE(l.memo, e.memo) AS memo,
         e.status,
         h.document_snapshot_json,
         h.detailed_document_snapshot_json
       FROM inventory_ledger_entry_header e
       JOIN inventory_ledger_entry_line l ON l.inventory_ledger_entry_header_id = e.id
       JOIN inventory_item item ON item.id = l.item_id
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



