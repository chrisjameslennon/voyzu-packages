import type { DbExecutor } from "@voyzu/capability/db";

import type { ArCounterpartyStatementRow, ArCounterpartySummaryRow } from "./ar-subledger-statement.row.types";

export class ArSubledgerStatementRepo {
  constructor(private readonly db: DbExecutor) { }

  async listCounterpartySummaries(companyId: number): Promise<ArCounterpartySummaryRow[]> {
    const { rows } = await this.db.query(
      `SELECT
         c.code                          AS counterparty_code,
         c.name                          AS counterparty_name,
         COALESCE(SUM(
           CASE
             WHEN l.control_account_code = 'AR_TRADE_RECEIVABLES' AND l.dr_cr = 'DR'
               THEN l.base_currency_amount
             WHEN l.control_account_code = 'AR_TRADE_RECEIVABLES' AND l.dr_cr = 'CR'
               THEN -l.base_currency_amount
             ELSE 0
           END
         ), 0)::float                    AS open_invoices_amount,
         COALESCE(SUM(
           CASE
             WHEN l.control_account_code = 'AR_UNAPPLIED_CASH' AND l.dr_cr = 'CR'
               THEN l.base_currency_amount
             WHEN l.control_account_code = 'AR_UNAPPLIED_CASH' AND l.dr_cr = 'DR'
               THEN -l.base_currency_amount
             ELSE 0
           END
         ), 0)::float                    AS unapplied_receipts_amount,
         COALESCE(SUM(
           CASE
             WHEN l.control_account_code = 'AR_TRADE_RECEIVABLES' AND l.dr_cr = 'DR'
               THEN l.base_currency_amount
             WHEN l.control_account_code = 'AR_TRADE_RECEIVABLES' AND l.dr_cr = 'CR'
               THEN -l.base_currency_amount
             WHEN l.control_account_code = 'AR_UNAPPLIED_CASH' AND l.dr_cr = 'CR'
               THEN -l.base_currency_amount
             WHEN l.control_account_code = 'AR_UNAPPLIED_CASH' AND l.dr_cr = 'DR'
               THEN l.base_currency_amount
             ELSE 0
           END
         ), 0)::float                    AS net_balance
       FROM ar_counterparty c
       JOIN ar_subledger_entry_header e ON e.ar_counterparty_id = c.id
       JOIN ar_subledger_entry_line l ON l.ar_subledger_entry_header_id = e.id
       WHERE c.finance_company_id = $1
       GROUP BY c.id, c.code, c.name
       ORDER BY c.code`,
      [companyId],
    );
    return rows as unknown as ArCounterpartySummaryRow[];
  }

  async listCounterpartyStatementRows(companyId: number, counterpartyCode: string): Promise<ArCounterpartyStatementRow[]> {
    const { rows } = await this.db.query(
      `WITH statement_lines AS (
         SELECT
           e.id::int AS entry_header_id,
           COALESCE(l.target_entry_header_id, l.source_entry_header_id, reverse_header.id)::int AS parent_entry_header_id,
           e.code,
           e.posting_date::text AS posting_date,
           h.document_type_code,
           h.document_type_label,
           h.document_id,
           COALESCE(l.memo, e.memo) AS memo,
           e.description,
           CASE WHEN l.dr_cr = 'DR' THEN 'DEBIT' ELSE 'CREDIT' END AS entry_type,
           l.base_currency_amount::float AS base_currency_amount,
           e.base_currency_code,
           c.code AS counterparty_code,
           c.name AS counterparty_name
         FROM ar_subledger_entry_header e
         JOIN journal_header h ON h.id = e.journal_header_id
         JOIN ar_counterparty c ON c.id = e.ar_counterparty_id
         JOIN ar_subledger_entry_line l ON l.ar_subledger_entry_header_id = e.id
         LEFT JOIN ar_subledger_entry_line reverse_line ON reverse_line.id = l.reverses_entry_line_id
         LEFT JOIN ar_subledger_entry_header reverse_header ON reverse_header.id = reverse_line.ar_subledger_entry_header_id
         WHERE e.finance_company_id = $1
           AND c.code = $2
       )
       SELECT
         entry_header_id,
         parent_entry_header_id,
         code,
         posting_date,
         document_type_code,
         document_type_label,
         document_id,
         memo,
         description,
         entry_type,
         SUM(base_currency_amount)::float AS base_currency_amount,
         base_currency_code,
         counterparty_code,
         counterparty_name
       FROM statement_lines
       GROUP BY
         entry_header_id,
         parent_entry_header_id,
         code,
         posting_date,
         document_type_code,
         document_type_label,
         document_id,
         memo,
         description,
         entry_type,
         base_currency_code,
         counterparty_code,
         counterparty_name
       ORDER BY posting_date ASC, entry_header_id ASC, parent_entry_header_id NULLS FIRST, entry_type ASC`,
      [companyId, counterpartyCode],
    );
    return rows as unknown as ArCounterpartyStatementRow[];
  }
}
