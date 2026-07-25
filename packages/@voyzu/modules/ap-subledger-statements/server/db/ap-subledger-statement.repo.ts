import type { DbExecutor } from "@voyzu/capability/db";

import type { ApCounterpartyStatementRow, ApCounterpartySummaryRow } from "./ap-subledger-statement.row.types";

export class ApSubledgerStatementRepo {
  constructor(private readonly db: DbExecutor) {}

  async listCounterpartySummaries(companyId: number): Promise<ApCounterpartySummaryRow[]> {
    const { rows } = await this.db.query(
      `SELECT
         c.code AS counterparty_code,
         c.name AS counterparty_name,
         COALESCE(SUM(
           CASE
             WHEN l.control_account_code = 'AP_TRADE_PAYABLES' AND l.dr_cr = 'CR' THEN l.base_currency_amount
             WHEN l.control_account_code = 'AP_TRADE_PAYABLES' AND l.dr_cr = 'DR' THEN -l.base_currency_amount
             ELSE 0
           END
         ), 0)::float AS open_bills_amount,
         COALESCE(SUM(
           CASE
             WHEN l.control_account_code = 'AP_UNAPPLIED_PAYMENTS' AND l.dr_cr = 'DR' THEN l.base_currency_amount
             WHEN l.control_account_code = 'AP_UNAPPLIED_PAYMENTS' AND l.dr_cr = 'CR' THEN -l.base_currency_amount
             ELSE 0
           END
         ), 0)::float AS unapplied_payments_amount,
         COALESCE(SUM(
           CASE
             WHEN l.control_account_code = 'AP_TRADE_PAYABLES' AND l.dr_cr = 'CR' THEN l.base_currency_amount
             WHEN l.control_account_code = 'AP_TRADE_PAYABLES' AND l.dr_cr = 'DR' THEN -l.base_currency_amount
             WHEN l.control_account_code = 'AP_UNAPPLIED_PAYMENTS' AND l.dr_cr = 'DR' THEN -l.base_currency_amount
             WHEN l.control_account_code = 'AP_UNAPPLIED_PAYMENTS' AND l.dr_cr = 'CR' THEN l.base_currency_amount
             ELSE 0
           END
         ), 0)::float AS net_balance
       FROM ap_counterparty c
       JOIN ap_subledger_entry_header e ON e.ap_counterparty_id = c.id
       JOIN ap_subledger_entry_line l ON l.ap_subledger_entry_header_id = e.id
       WHERE c.company_id = $1
       GROUP BY c.id, c.code, c.name
       ORDER BY c.code`,
      [companyId],
    );
    return rows as unknown as ApCounterpartySummaryRow[];
  }

  async listCounterpartyStatementRows(companyId: number, counterpartyCode: string): Promise<ApCounterpartyStatementRow[]> {
    const { rows } = await this.db.query(
      `SELECT
         e.id::int AS entry_header_id,
         NULL::int AS parent_entry_header_id,
         e.code,
         e.posting_date::text AS posting_date,
         h.document_type_code,
         h.document_type_label,
         h.document_id,
         COALESCE(target_h.document_id, source_h.document_id) AS applied_to_document_id,
         COALESCE(l.memo, e.memo) AS memo,
         e.description,
         CASE WHEN l.dr_cr = 'DR' THEN 'DEBIT' ELSE 'CREDIT' END AS entry_type,
         SUM(l.base_currency_amount)::float AS base_currency_amount,
         e.base_currency_code,
         c.code AS counterparty_code,
         c.name AS counterparty_name
       FROM ap_subledger_entry_header e
       JOIN journal_header h ON h.id = e.journal_header_id
       JOIN ap_counterparty c ON c.id = e.ap_counterparty_id
       JOIN ap_subledger_entry_line l ON l.ap_subledger_entry_header_id = e.id
       LEFT JOIN ap_subledger_entry_header target_h ON target_h.id = l.target_entry_header_id
       LEFT JOIN ap_subledger_entry_header source_h ON source_h.id = l.source_entry_header_id
       WHERE e.company_id = $1
         AND c.code = $2
       GROUP BY e.id, e.code, e.posting_date, h.document_type_code, h.document_type_label, h.document_id,
         COALESCE(target_h.document_id, source_h.document_id),
         COALESCE(l.memo, e.memo), e.description, l.dr_cr, e.base_currency_code, c.code, c.name
       ORDER BY e.posting_date ASC, e.id ASC`,
      [companyId, counterpartyCode],
    );
    return rows as unknown as ApCounterpartyStatementRow[];
  }
}
