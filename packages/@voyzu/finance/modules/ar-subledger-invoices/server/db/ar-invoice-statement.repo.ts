import type { DbExecutor } from "@voyzu/capability/db";

export interface ArInvoiceDocumentLineRow {
  line_number: number;
  description: string;
  quantity: number | null;
  unit_amount: number | null;
  net_amount: number | null;
  tax_amount: number | null;
  gross_amount: number;
}

export interface ArInvoiceAppliedTransactionRow {
  code: string;
  posting_date: string;
  document_date: string;
  document_type_label: string;
  document_id: string;
  amount: number;
}

export class ArInvoiceStatementRepo {
  constructor(private readonly db: DbExecutor) {}

  async listInvoiceLines(entryId: number): Promise<ArInvoiceDocumentLineRow[]> {
    const { rows } = await this.db.query(
      `SELECT
         l.line_number::int AS line_number,
         l.description,
         l.quantity::float AS quantity,
         l.unit_amount::float AS unit_amount,
         l.net_amount::float AS net_amount,
         l.tax_amount::float AS tax_amount,
         l.gross_amount::float AS gross_amount
       FROM ar_subledger_entry_line l
       WHERE l.ar_subledger_entry_header_id = $1
         AND l.line_type = 'INVOICE_LINE'
       ORDER BY l.line_number ASC, l.id ASC`,
      [entryId],
    );
    return rows as unknown as ArInvoiceDocumentLineRow[];
  }

  async listAppliedTransactions(entryId: number): Promise<ArInvoiceAppliedTransactionRow[]> {
    const { rows } = await this.db.query(
      `SELECT DISTINCT ON (source.id, l.id)
         source.code,
         source.posting_date::text AS posting_date,
         source.document_date::text AS document_date,
         source_jh.document_type_label,
         source.document_id,
         l.base_currency_amount::float AS amount
       FROM ar_subledger_entry_line l
       JOIN ar_subledger_entry_header source ON source.id = l.ar_subledger_entry_header_id
       JOIN journal_header source_jh ON source_jh.id = source.journal_header_id
       WHERE source.id <> $1
         AND (l.target_entry_header_id = $1 OR l.source_entry_header_id = $1)
       ORDER BY source.id, l.id, source.posting_date ASC, source.code ASC`,
      [entryId],
    );
    return (rows as unknown as ArInvoiceAppliedTransactionRow[])
      .sort((a, b) => a.posting_date.localeCompare(b.posting_date) || a.code.localeCompare(b.code));
  }
}
