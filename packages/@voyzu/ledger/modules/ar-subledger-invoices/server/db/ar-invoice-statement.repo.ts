import type { DbExecutor } from "@voyzu/capability/db";

import type { ArInvoiceDetailedInvoiceDto } from "../../../financial-document-processing-engine/types/ar-invoice.response.dto";

export interface ArInvoiceAppliedTransactionRow {
  code: string;
  journal_code: string;
  document_type_code: string;
  posting_date: string;
  document_date: string;
  document_type_label: string;
  document_id: string;
  amount: number;
}

export class ArInvoiceStatementRepo {
  constructor(private readonly db: DbExecutor) {}

  async getInvoiceSnapshot(entryId: number): Promise<ArInvoiceDetailedInvoiceDto | null> {
    const { rows } = await this.db.query(
      `SELECT h.detailed_document_snapshot_json
       FROM ar_subledger_entry_header e
       JOIN journal_header h ON h.id = e.journal_header_id
       WHERE e.id = $1 AND h.document_type_code = 'AR_INVOICE'`,
      [entryId],
    );
    return (rows[0]?.detailed_document_snapshot_json as ArInvoiceDetailedInvoiceDto | null) ?? null;
  }

  async listAppliedTransactions(entryId: number): Promise<ArInvoiceAppliedTransactionRow[]> {
    const { rows } = await this.db.query(
      `SELECT DISTINCT ON (source.id, l.id)
         source.code,
         source_jh.code AS journal_code,
         source_jh.document_type_code,
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
