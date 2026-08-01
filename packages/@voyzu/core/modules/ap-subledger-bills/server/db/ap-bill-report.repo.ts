import type { DbExecutor } from "@voyzu/capability/db";

export interface ApDocumentLineRow {
  line_number: number;
  line_type: string;
  description: string;
  quantity: number | null;
  unit_amount: number | null;
  net_amount: number | null;
  tax_amount: number | null;
  gross_amount: number;
}

export interface ApDocumentTaxSummaryRow {
  tax_authority_code: string;
  tax_authority_name: string;
  invoice_label: string | null;
  tax_rate: number;
  taxable_amount: number;
  tax_amount: number;
}

export interface ApDocumentApplicationRow {
  target_document_id: string;
  target_document_type_label: string;
  amount: number;
}

export interface ApDocumentAppliedTransactionRow {
  code: string;
  posting_date: string;
  document_date: string;
  document_type_label: string;
  document_id: string;
  amount: number;
}

export class ApBillReportRepo {
  constructor(private readonly db: DbExecutor) {}

  async listDocumentLines(entryId: number): Promise<ApDocumentLineRow[]> {
    const { rows } = await this.db.query(
      `SELECT
         l.line_number::int AS line_number,
         l.line_type,
         l.description,
         l.quantity::float AS quantity,
         l.unit_amount::float AS unit_amount,
         l.net_amount::float AS net_amount,
         l.tax_amount::float AS tax_amount,
         l.gross_amount::float AS gross_amount
       FROM ap_subledger_entry_line l
       WHERE l.ap_subledger_entry_header_id = $1
       ORDER BY l.line_number ASC, l.id ASC`,
      [entryId],
    );
    return rows as unknown as ApDocumentLineRow[];
  }

  async listDocumentTaxSummary(journalHeaderId: number): Promise<ApDocumentTaxSummaryRow[]> {
    const { rows } = await this.db.query(
      `SELECT
         ta.code AS tax_authority_code,
         ta.name AS tax_authority_name,
         l.invoice_label,
         l.tax_rate::float AS tax_rate,
         SUM(l.taxable_base_currency_amount)::float AS taxable_amount,
         SUM(l.base_currency_amount)::float AS tax_amount
       FROM tax_ledger_entry_header h
       JOIN tax_ledger_entry_line l ON l.tax_ledger_entry_header_id = h.id
       JOIN tax_authority ta ON ta.id = l.tax_authority_id
       WHERE h.journal_header_id = $1
       GROUP BY ta.code, ta.name, l.invoice_label, l.tax_rate
       ORDER BY MIN(l.line_number) ASC`,
      [journalHeaderId],
    );
    return rows as unknown as ApDocumentTaxSummaryRow[];
  }

  async listDocumentApplications(entryId: number): Promise<ApDocumentApplicationRow[]> {
    const { rows } = await this.db.query(
      `SELECT
         target_h.document_id AS target_document_id,
         target_jh.document_type_label AS target_document_type_label,
         SUM(l.base_currency_amount)::float AS amount
       FROM ap_subledger_entry_line l
       JOIN ap_subledger_entry_header target_h ON target_h.id = l.target_entry_header_id
       JOIN journal_header target_jh ON target_jh.id = target_h.journal_header_id
       WHERE l.ap_subledger_entry_header_id = $1
         AND l.target_entry_header_id IS NOT NULL
       GROUP BY target_h.id, target_h.document_id, target_jh.document_type_label
       ORDER BY MIN(l.line_number) ASC, MIN(l.id) ASC`,
      [entryId],
    );
    return rows as unknown as ApDocumentApplicationRow[];
  }

  async listAppliedTransactions(entryId: number): Promise<ApDocumentAppliedTransactionRow[]> {
    const { rows } = await this.db.query(
      `SELECT DISTINCT ON (source.id, l.id)
         source.code,
         source.posting_date::text AS posting_date,
         source.document_date::text AS document_date,
         source_jh.document_type_label,
         source.document_id,
         l.base_currency_amount::float AS amount
       FROM ap_subledger_entry_line l
       JOIN ap_subledger_entry_header source ON source.id = l.ap_subledger_entry_header_id
       JOIN journal_header source_jh ON source_jh.id = source.journal_header_id
       WHERE source.id <> $1
         AND (l.target_entry_header_id = $1 OR l.source_entry_header_id = $1)
       ORDER BY source.id, l.id, source.posting_date ASC, source.code ASC`,
      [entryId],
    );
    return rows as unknown as ApDocumentAppliedTransactionRow[];
  }
}
