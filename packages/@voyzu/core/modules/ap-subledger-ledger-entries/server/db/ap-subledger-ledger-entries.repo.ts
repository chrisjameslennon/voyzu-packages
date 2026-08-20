import type { DbExecutor } from "@voyzu/capability/db";

import { resolveEffectiveSettingsCompanyId } from "../../../common/server/settings-scope";
import type {
  ApSubledgerEntryRow,
} from "./ap-subledger-ledger-entries.row.types";

const AP_HEADER_AMOUNT_SUBQUERY = `
  SELECT COALESCE(SUM(line.base_currency_amount), 0)::float AS amount
  FROM ap_subledger_entry_line line
  WHERE line.ap_subledger_entry_header_id = e.id
`;

const AP_ENTRY_COLUMNS = `
  e.id::int                         AS id,
  e.code                            AS code,
  e.journal_header_id::int          AS journal_header_id,
  h.code                            AS journal_code,
  (h.bank_cash_code IS NOT NULL)     AS has_bank_cash_details,
  h.bank_cash_code                   AS bank_cash_code,
  tax_entry.code                    AS tax_ledger_entry_code,
  e.posting_date::text              AS posting_date,
  h.document_date::text             AS document_date,
  e.base_currency_code,
  CASE
    WHEN first_line.dr_cr = 'DR' THEN 'DEBIT'
    ELSE 'CREDIT'
  END AS entry_type,
  header_amount.amount              AS base_currency_amount,
  COALESCE(first_line.memo, e.memo) AS memo,
  e.status,
  h.document_snapshot_json,
  h.detailed_document_snapshot_json,
  h.document_type_code,
  h.document_type_label,
  h.document_id,
  e.description                     AS description,
  related_docs.applied_to_document_id AS applied_to_document_id,
  c.code                            AS counterparty_code,
  c.name                            AS counterparty_name,
  first_line.control_account_code   AS control_account_code,
  ca.name                           AS control_account_name,
  ga.code                           AS gl_account_code,
  ga.name                           AS gl_account_name,
  CASE
    WHEN h.document_type_code = 'AP_BILL'
      AND header_amount.amount - COALESCE(applied_totals.applied_amount, 0) <= 0.005 THEN 'SETTLED'
    WHEN h.document_type_code = 'AP_BILL'
      AND COALESCE(applied_totals.applied_amount, 0) > 0 THEN 'PART_PAID'
    WHEN h.document_type_code = 'AP_BILL' THEN 'UNPAID'
    ELSE NULL
  END                               AS payment_status,
  CASE
    WHEN h.document_type_code = 'AP_BILL' THEN COALESCE(applied_totals.applied_amount, 0)::float
    ELSE NULL
  END                               AS applied_amount,
  CASE
    WHEN h.document_type_code = 'AP_BILL' THEN COALESCE(applied_totals.payment_amount, 0)::float
    ELSE NULL
  END                               AS payment_applied_amount,
  CASE
    WHEN h.document_type_code = 'AP_BILL' THEN COALESCE(applied_totals.other_credit_amount, 0)::float
    ELSE NULL
  END                               AS other_credit_applied_amount,
  CASE
    WHEN h.document_type_code = 'AP_BILL' THEN (header_amount.amount - COALESCE(applied_totals.applied_amount, 0))::float
    ELSE NULL
  END                               AS open_balance,
  COALESCE(control_balances.items, '[]'::json) AS control_account_balances_json,
  e.creation_date::text             AS creation_date,
  e.updated_date::text              AS updated_date
`;

export class ApSubledgerRepo {
  constructor(private readonly db: DbExecutor) { }

  async listEntries(companyId: number): Promise<ApSubledgerEntryRow[]> {
    const settingsCompanyId = await resolveEffectiveSettingsCompanyId(companyId, this.db);
    const { rows } = await this.db.query(
      `SELECT ${AP_ENTRY_COLUMNS}
       FROM ap_subledger_entry_header e
       JOIN journal_header h ON h.id = e.journal_header_id
       JOIN ap_counterparty c ON c.id = e.ap_counterparty_id
       JOIN LATERAL (
         SELECT line.control_account_code, line.dr_cr, line.memo
         FROM ap_subledger_entry_line line
         WHERE line.ap_subledger_entry_header_id = e.id
         ORDER BY line.line_number ASC
         LIMIT 1
       ) first_line ON true
       JOIN ap_control_account ca ON ca.company_id = $2 AND ca.code = first_line.control_account_code
       JOIN gl_account ga ON ga.company_id = $2 AND ga.id = ca.gl_account_id
       LEFT JOIN LATERAL (${AP_HEADER_AMOUNT_SUBQUERY}) header_amount ON true
       LEFT JOIN LATERAL (
         SELECT json_agg(json_build_object(
           'controlAccountCode', grouped.control_account_code,
           'controlAccountName', grouped.control_account_name,
           'glAccountCode', grouped.gl_account_code,
           'glAccountName', grouped.gl_account_name,
           'balance', grouped.balance
         ) ORDER BY grouped.control_account_code) AS items
         FROM (
           SELECT line.control_account_code,
                  balance_ca.name AS control_account_name,
                  balance_ga.code AS gl_account_code,
                  balance_ga.name AS gl_account_name,
                  SUM(CASE WHEN line.dr_cr = 'CR' THEN line.base_currency_amount ELSE -line.base_currency_amount END)::float AS balance
           FROM ap_subledger_entry_line line
           JOIN ap_control_account balance_ca ON balance_ca.company_id = $2 AND balance_ca.code = line.control_account_code
           JOIN gl_account balance_ga ON balance_ga.company_id = $2 AND balance_ga.id = balance_ca.gl_account_id
           WHERE line.ap_subledger_entry_header_id = e.id
           GROUP BY line.control_account_code, balance_ca.name, balance_ga.code, balance_ga.name
         ) grouped
       ) control_balances ON true
       LEFT JOIN LATERAL (
         SELECT
           COALESCE(SUM(line.base_currency_amount), 0)::float AS applied_amount,
           COALESCE(SUM(CASE
             WHEN source_jh.document_type_code IN ('AP_PAYMENT', 'AP_PAYMENT_APPLICATION') THEN line.base_currency_amount
             ELSE 0
           END), 0)::float AS payment_amount,
           COALESCE(SUM(CASE
             WHEN source_jh.document_type_code NOT IN ('AP_PAYMENT', 'AP_PAYMENT_APPLICATION') THEN line.base_currency_amount
             ELSE 0
           END), 0)::float AS other_credit_amount
         FROM ap_subledger_entry_line line
         JOIN ap_subledger_entry_header source ON source.id = line.ap_subledger_entry_header_id
         JOIN journal_header source_jh ON source_jh.id = source.journal_header_id
         WHERE line.target_entry_header_id = e.id
           AND line.control_account_code = 'AP_TRADE_PAYABLES'
           AND line.dr_cr = 'DR'
       ) applied_totals ON true
       LEFT JOIN LATERAL (
         SELECT string_agg(DISTINCT related.document_id, ', ' ORDER BY related.document_id) AS applied_to_document_id
         FROM (
           SELECT target_h.document_id
           FROM ap_subledger_entry_line line
           JOIN ap_subledger_entry_header target ON target.id = line.target_entry_header_id
           JOIN journal_header target_h ON target_h.id = target.journal_header_id
           WHERE line.ap_subledger_entry_header_id = e.id
           UNION
           SELECT source_h.document_id
           FROM ap_subledger_entry_line line
           JOIN ap_subledger_entry_header source ON source.id = line.source_entry_header_id
           JOIN journal_header source_h ON source_h.id = source.journal_header_id
           WHERE line.ap_subledger_entry_header_id = e.id
         ) related
       ) related_docs ON true
       LEFT JOIN LATERAL (
         SELECT tax.code
         FROM tax_ledger_entry_header tax
         WHERE tax.journal_header_id = h.id
         ORDER BY tax.id ASC
         LIMIT 1
       ) tax_entry ON true
       WHERE e.company_id = $1
       ORDER BY e.posting_date DESC, e.id DESC`,
      [companyId, settingsCompanyId],
    );
    return rows as unknown as ApSubledgerEntryRow[];
  }

  async getEntry(companyId: number, code: string): Promise<ApSubledgerEntryRow | null> {
    const settingsCompanyId = await resolveEffectiveSettingsCompanyId(companyId, this.db);
    const { rows } = await this.db.query(
      `SELECT ${AP_ENTRY_COLUMNS}
       FROM ap_subledger_entry_header e
       JOIN journal_header h ON h.id = e.journal_header_id
       JOIN ap_counterparty c ON c.id = e.ap_counterparty_id
       JOIN LATERAL (
         SELECT line.control_account_code, line.dr_cr, line.memo
         FROM ap_subledger_entry_line line
         WHERE line.ap_subledger_entry_header_id = e.id
         ORDER BY line.line_number ASC
         LIMIT 1
       ) first_line ON true
       JOIN ap_control_account ca ON ca.company_id = $3 AND ca.code = first_line.control_account_code
       JOIN gl_account ga ON ga.company_id = $3 AND ga.id = ca.gl_account_id
       LEFT JOIN LATERAL (${AP_HEADER_AMOUNT_SUBQUERY}) header_amount ON true
       LEFT JOIN LATERAL (
         SELECT json_agg(json_build_object(
           'controlAccountCode', grouped.control_account_code,
           'controlAccountName', grouped.control_account_name,
           'glAccountCode', grouped.gl_account_code,
           'glAccountName', grouped.gl_account_name,
           'balance', grouped.balance
         ) ORDER BY grouped.control_account_code) AS items
         FROM (
           SELECT line.control_account_code,
                  balance_ca.name AS control_account_name,
                  balance_ga.code AS gl_account_code,
                  balance_ga.name AS gl_account_name,
                  SUM(CASE WHEN line.dr_cr = 'CR' THEN line.base_currency_amount ELSE -line.base_currency_amount END)::float AS balance
           FROM ap_subledger_entry_line line
           JOIN ap_control_account balance_ca ON balance_ca.company_id = $3 AND balance_ca.code = line.control_account_code
           JOIN gl_account balance_ga ON balance_ga.company_id = $3 AND balance_ga.id = balance_ca.gl_account_id
           WHERE line.ap_subledger_entry_header_id = e.id
           GROUP BY line.control_account_code, balance_ca.name, balance_ga.code, balance_ga.name
         ) grouped
       ) control_balances ON true
       LEFT JOIN LATERAL (
         SELECT
           COALESCE(SUM(line.base_currency_amount), 0)::float AS applied_amount,
           COALESCE(SUM(CASE
             WHEN source_jh.document_type_code IN ('AP_PAYMENT', 'AP_PAYMENT_APPLICATION') THEN line.base_currency_amount
             ELSE 0
           END), 0)::float AS payment_amount,
           COALESCE(SUM(CASE
             WHEN source_jh.document_type_code NOT IN ('AP_PAYMENT', 'AP_PAYMENT_APPLICATION') THEN line.base_currency_amount
             ELSE 0
           END), 0)::float AS other_credit_amount
         FROM ap_subledger_entry_line line
         JOIN ap_subledger_entry_header source ON source.id = line.ap_subledger_entry_header_id
         JOIN journal_header source_jh ON source_jh.id = source.journal_header_id
         WHERE line.target_entry_header_id = e.id
           AND line.control_account_code = 'AP_TRADE_PAYABLES'
           AND line.dr_cr = 'DR'
       ) applied_totals ON true
       LEFT JOIN LATERAL (
         SELECT string_agg(DISTINCT related.document_id, ', ' ORDER BY related.document_id) AS applied_to_document_id
         FROM (
           SELECT target_h.document_id
           FROM ap_subledger_entry_line line
           JOIN ap_subledger_entry_header target ON target.id = line.target_entry_header_id
           JOIN journal_header target_h ON target_h.id = target.journal_header_id
           WHERE line.ap_subledger_entry_header_id = e.id
           UNION
           SELECT source_h.document_id
           FROM ap_subledger_entry_line line
           JOIN ap_subledger_entry_header source ON source.id = line.source_entry_header_id
           JOIN journal_header source_h ON source_h.id = source.journal_header_id
           WHERE line.ap_subledger_entry_header_id = e.id
         ) related
       ) related_docs ON true
       LEFT JOIN LATERAL (
         SELECT tax.code
         FROM tax_ledger_entry_header tax
         WHERE tax.journal_header_id = h.id
         ORDER BY tax.id ASC
         LIMIT 1
       ) tax_entry ON true
       WHERE e.company_id = $1
         AND e.code = $2
       LIMIT 1`,
      [companyId, code, settingsCompanyId],
    );
    return (rows[0] as unknown as ApSubledgerEntryRow | undefined) ?? null;
  }

}


