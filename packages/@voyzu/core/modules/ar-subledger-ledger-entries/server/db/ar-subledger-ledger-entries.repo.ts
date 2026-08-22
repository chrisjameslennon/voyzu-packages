import type { DbExecutor } from "@voyzu/capability/db";

import { resolveEffectiveSettingsCompanyId } from "../../../common/server/settings-scope";
import type { ArSubledgerEntryRow } from "./ar-subledger-ledger-entries.row.types";

/* payment_status is derived for AR invoice rows only:
   - UNPAID    → no CREDITs have been applied
   - PART_PAID → some applied, but less than the invoice total
   - SETTLED   → applied total ≥ invoice total (within rounding)
   For non-invoice rows (applications, receipts, etc.) the value is NULL.
   The 0.005 tolerance swallows two-decimal rounding noise. */
const PAYMENT_STATUS_EPSILON = "0.005";

const INVOICE_APPLIED_SUBQUERY = `
  SELECT
    COALESCE(SUM(line.base_currency_amount), 0)::float AS applied_total,
    COALESCE(SUM(CASE
      WHEN source_jh.document_type_code IN ('AR_RECEIPT', 'AR_RECEIPT_APPLICATION') THEN line.base_currency_amount
      ELSE 0
    END), 0)::float AS payment_amount,
    COALESCE(SUM(CASE
      WHEN source_jh.document_type_code NOT IN ('AR_RECEIPT', 'AR_RECEIPT_APPLICATION') THEN line.base_currency_amount
      ELSE 0
    END), 0)::float AS other_credit_amount
  FROM ar_subledger_entry_line line
  JOIN ar_subledger_entry_header source ON source.id = line.ar_subledger_entry_header_id
  JOIN journal_header source_jh ON source_jh.id = source.journal_header_id
  WHERE line.target_entry_header_id = e.id
    AND line.control_account_code = 'AR_TRADE_RECEIVABLES'
    AND line.dr_cr = 'CR'
`;

const HEADER_AMOUNT_SUBQUERY = `
  SELECT COALESCE(SUM(
    CASE
      WHEN h.document_type_code = 'AR_RECEIPT_APPLICATION'
        AND line.control_account_code = 'AR_UNAPPLIED_CASH'
        AND line.dr_cr = 'DR'
        THEN line.base_currency_amount
      WHEN h.document_type_code <> 'AR_RECEIPT_APPLICATION'
        THEN line.base_currency_amount
      ELSE 0
    END
  ), 0)::float AS amount
  FROM ar_subledger_entry_line line
  WHERE line.ar_subledger_entry_header_id = e.id
`;

const PAYMENT_STATUS_EXPR = `
  CASE
    WHEN h.document_type_code = 'AR_INVOICE' THEN
      CASE
        WHEN applied_sum.applied_total <= ${PAYMENT_STATUS_EPSILON} THEN 'UNPAID'
        WHEN applied_sum.applied_total >= header_amount.amount - ${PAYMENT_STATUS_EPSILON} THEN 'SETTLED'
        ELSE 'PART_PAID'
      END
    ELSE NULL
  END
`;

const APPLIED_AMOUNT_EXPR = `
  CASE
    WHEN h.document_type_code = 'AR_INVOICE'
      THEN applied_sum.applied_total::float
    ELSE NULL
  END
`;

const PAYMENT_APPLIED_AMOUNT_EXPR = `
  CASE
    WHEN h.document_type_code = 'AR_INVOICE'
      THEN applied_sum.payment_amount::float
    ELSE NULL
  END
`;

const OTHER_CREDIT_APPLIED_AMOUNT_EXPR = `
  CASE
    WHEN h.document_type_code = 'AR_INVOICE'
      THEN applied_sum.other_credit_amount::float
    ELSE NULL
  END
`;

const OPEN_BALANCE_EXPR = `
  CASE
    WHEN h.document_type_code = 'AR_INVOICE'
      THEN (header_amount.amount - applied_sum.applied_total)::float
    ELSE NULL
  END
`;

const AR_ENTRY_COLUMNS = `
  e.id::int                         AS id,
  e.code                            AS code,
  e.journal_header_id::int         AS journal_header_id,
  h.code                           AS journal_code,
  (h.bank_cash_code IS NOT NULL)    AS has_bank_cash_details,
  h.bank_cash_code                  AS bank_cash_code,
  tax_entry.code                    AS tax_ledger_entry_code,
  e.posting_date::text             AS posting_date,
  h.document_date::text            AS document_date,
  e.base_currency_code,
  CASE
    WHEN h.document_type_code = 'AR_INVOICE' THEN 'DEBIT'
    WHEN h.document_type_code IN ('AR_RECEIPT', 'AR_INVOICE_CANCELLATION') THEN 'CREDIT'
    WHEN first_line.dr_cr = 'DR' THEN 'DEBIT'
    ELSE 'CREDIT'
  END AS entry_type,
  header_amount.amount             AS base_currency_amount,
  COALESCE(first_line.memo, e.memo) AS memo,
  e.status,
  h.document_snapshot_json,
  h.detailed_document_snapshot_json,
  h.document_type_code,
  h.document_type_label,
  h.document_id,
  e.description                     AS description,
  related_docs.applied_to_document_id AS applied_to_document_id,
  c.code                           AS counterparty_code,
  c.name                           AS counterparty_name,
  first_line.control_account_code   AS control_account_code,
  ca.name                          AS control_account_name,
  ga.code                          AS gl_account_code,
  ga.name                          AS gl_account_name,
  ${PAYMENT_STATUS_EXPR}           AS payment_status,
  ${APPLIED_AMOUNT_EXPR}           AS applied_amount,
  ${PAYMENT_APPLIED_AMOUNT_EXPR}   AS payment_applied_amount,
  ${OTHER_CREDIT_APPLIED_AMOUNT_EXPR} AS other_credit_applied_amount,
  ${OPEN_BALANCE_EXPR}             AS open_balance,
  COALESCE(control_balances.items, '[]'::json) AS control_account_balances_json,
  e.creation_date::text            AS creation_date,
  e.creation_actor_type            AS creation_actor_type,
  e.creation_user_id               AS creation_user_id,
  e.creation_mutation_id::text      AS creation_mutation_id,
  e.updated_date::text              AS updated_date,
  e.updated_actor_type              AS updated_actor_type,
  e.updated_user_id                 AS updated_user_id,
  e.updated_mutation_id::text       AS updated_mutation_id
`;


export class ArSubledgerRepo {
  constructor(private readonly db: DbExecutor) { }
  async listEntries(companyId: number): Promise<ArSubledgerEntryRow[]> {
    const settingsCompanyId = await resolveEffectiveSettingsCompanyId(companyId, this.db);
    const { rows } = await this.db.query(
      `SELECT ${AR_ENTRY_COLUMNS}
       FROM ar_subledger_entry_header e
       JOIN journal_header h ON h.id = e.journal_header_id
       JOIN ar_counterparty c ON c.id = e.ar_counterparty_id
       JOIN LATERAL (
         SELECT line.control_account_code, line.dr_cr, line.memo
         FROM ar_subledger_entry_line line
         WHERE line.ar_subledger_entry_header_id = e.id
         ORDER BY line.line_number ASC
         LIMIT 1
       ) first_line ON true
       JOIN ar_control_account ca ON ca.finance_company_id = $2 AND ca.code = first_line.control_account_code
       JOIN gl_account ga ON ga.finance_company_id = $2 AND ga.id = ca.gl_account_id
       LEFT JOIN LATERAL (${HEADER_AMOUNT_SUBQUERY}) header_amount ON true
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
                  SUM(CASE WHEN line.dr_cr = 'DR' THEN line.base_currency_amount ELSE -line.base_currency_amount END)::float AS balance
           FROM ar_subledger_entry_line line
           JOIN ar_control_account balance_ca ON balance_ca.finance_company_id = $2 AND balance_ca.code = line.control_account_code
           JOIN gl_account balance_ga ON balance_ga.finance_company_id = $2 AND balance_ga.id = balance_ca.gl_account_id
           WHERE line.ar_subledger_entry_header_id = e.id
           GROUP BY line.control_account_code, balance_ca.name, balance_ga.code, balance_ga.name
         ) grouped
       ) control_balances ON true
       LEFT JOIN LATERAL (
         SELECT string_agg(DISTINCT related.document_id, ', ' ORDER BY related.document_id) AS applied_to_document_id
         FROM (
           SELECT target_h.document_id
           FROM ar_subledger_entry_line line
           JOIN ar_subledger_entry_header target ON target.id = line.target_entry_header_id
           JOIN journal_header target_h ON target_h.id = target.journal_header_id
           WHERE line.ar_subledger_entry_header_id = e.id
           UNION
           SELECT source_h.document_id
           FROM ar_subledger_entry_line line
           JOIN ar_subledger_entry_header source ON source.id = line.source_entry_header_id
           JOIN journal_header source_h ON source_h.id = source.journal_header_id
           WHERE line.ar_subledger_entry_header_id = e.id
           UNION
           SELECT reverse_h.document_id
           FROM ar_subledger_entry_line line
           JOIN ar_subledger_entry_line reverse_line ON reverse_line.id = line.reverses_entry_line_id
           JOIN ar_subledger_entry_header reverse_header ON reverse_header.id = reverse_line.ar_subledger_entry_header_id
           JOIN journal_header reverse_h ON reverse_h.id = reverse_header.journal_header_id
           WHERE line.ar_subledger_entry_header_id = e.id
         ) related
       ) related_docs ON true
       LEFT JOIN LATERAL (${INVOICE_APPLIED_SUBQUERY}) applied_sum ON true
       LEFT JOIN LATERAL (
         SELECT tax.code
         FROM tax_ledger_entry_header tax
         WHERE tax.journal_header_id = h.id
         ORDER BY tax.id ASC
         LIMIT 1
       ) tax_entry ON true
       WHERE e.finance_company_id = $1
       ORDER BY e.posting_date DESC, e.id DESC`,
      [companyId, settingsCompanyId],
    );
    return rows as unknown as ArSubledgerEntryRow[];
  }

  async getEntry(companyId: number, code: string): Promise<ArSubledgerEntryRow | null> {
    const settingsCompanyId = await resolveEffectiveSettingsCompanyId(companyId, this.db);
    const { rows } = await this.db.query(
      `SELECT ${AR_ENTRY_COLUMNS}
       FROM ar_subledger_entry_header e
       JOIN journal_header h ON h.id = e.journal_header_id
       JOIN ar_counterparty c ON c.id = e.ar_counterparty_id
       JOIN LATERAL (
         SELECT line.control_account_code, line.dr_cr, line.memo
         FROM ar_subledger_entry_line line
         WHERE line.ar_subledger_entry_header_id = e.id
         ORDER BY line.line_number ASC
         LIMIT 1
       ) first_line ON true
       JOIN ar_control_account ca ON ca.finance_company_id = $3 AND ca.code = first_line.control_account_code
       JOIN gl_account ga ON ga.finance_company_id = $3 AND ga.id = ca.gl_account_id
       LEFT JOIN LATERAL (${HEADER_AMOUNT_SUBQUERY}) header_amount ON true
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
                  SUM(CASE WHEN line.dr_cr = 'DR' THEN line.base_currency_amount ELSE -line.base_currency_amount END)::float AS balance
           FROM ar_subledger_entry_line line
           JOIN ar_control_account balance_ca ON balance_ca.finance_company_id = $3 AND balance_ca.code = line.control_account_code
           JOIN gl_account balance_ga ON balance_ga.finance_company_id = $3 AND balance_ga.id = balance_ca.gl_account_id
           WHERE line.ar_subledger_entry_header_id = e.id
           GROUP BY line.control_account_code, balance_ca.name, balance_ga.code, balance_ga.name
         ) grouped
       ) control_balances ON true
       LEFT JOIN LATERAL (
         SELECT string_agg(DISTINCT related.document_id, ', ' ORDER BY related.document_id) AS applied_to_document_id
         FROM (
           SELECT target_h.document_id
           FROM ar_subledger_entry_line line
           JOIN ar_subledger_entry_header target ON target.id = line.target_entry_header_id
           JOIN journal_header target_h ON target_h.id = target.journal_header_id
           WHERE line.ar_subledger_entry_header_id = e.id
           UNION
           SELECT source_h.document_id
           FROM ar_subledger_entry_line line
           JOIN ar_subledger_entry_header source ON source.id = line.source_entry_header_id
           JOIN journal_header source_h ON source_h.id = source.journal_header_id
           WHERE line.ar_subledger_entry_header_id = e.id
           UNION
           SELECT reverse_h.document_id
           FROM ar_subledger_entry_line line
           JOIN ar_subledger_entry_line reverse_line ON reverse_line.id = line.reverses_entry_line_id
           JOIN ar_subledger_entry_header reverse_header ON reverse_header.id = reverse_line.ar_subledger_entry_header_id
           JOIN journal_header reverse_h ON reverse_h.id = reverse_header.journal_header_id
           WHERE line.ar_subledger_entry_header_id = e.id
         ) related
       ) related_docs ON true
       LEFT JOIN LATERAL (${INVOICE_APPLIED_SUBQUERY}) applied_sum ON true
       LEFT JOIN LATERAL (
         SELECT tax.code
         FROM tax_ledger_entry_header tax
         WHERE tax.journal_header_id = h.id
         ORDER BY tax.id ASC
         LIMIT 1
       ) tax_entry ON true
       WHERE e.finance_company_id = $1
         AND e.code = $2
       LIMIT 1`,
      [companyId, code, settingsCompanyId],
    );
    return (rows[0] as unknown as ArSubledgerEntryRow | undefined) ?? null;
  }
}
