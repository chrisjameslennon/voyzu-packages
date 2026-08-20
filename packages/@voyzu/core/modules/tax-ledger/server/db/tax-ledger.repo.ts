import type { DbExecutor } from "@voyzu/capability/db";

import { resolveEffectiveSettingsCompanyId } from "../../../common/server/settings-scope";
import type { TaxSubledgerEntryRow } from "./tax-ledger.row.types";


export class TaxLedgerRepo {
  constructor(private readonly db: DbExecutor) { }
  async getEntry(companyId: number, code: string): Promise<TaxSubledgerEntryRow | null> {
    const settingsCompanyId = await resolveEffectiveSettingsCompanyId(companyId, this.db);
    const { rows } = await this.db.query(
      `SELECT
         e.id::int                         AS id,
         e.code                            AS code,
         e.journal_header_id::int          AS journal_header_id,
         h.code                            AS journal_code,
         (h.bank_cash_code IS NOT NULL)     AS has_bank_cash_details,
         ar_entry.code                     AS ar_subledger_entry_code,
         ap_entry.code                     AS ap_subledger_entry_code,
         e.posting_date::text              AS posting_date,
         e.document_date::text             AS document_date,
         e.base_currency_code,
         CASE
           WHEN SUM(CASE WHEN l.dr_cr = 'CR' THEN l.base_currency_amount ELSE -l.base_currency_amount END) >= 0
             THEN 'CREDIT'
           ELSE 'DEBIT'
         END AS entry_type,
         ABS(SUM(CASE WHEN l.dr_cr = 'CR' THEN l.base_currency_amount ELSE -l.base_currency_amount END))::float AS base_currency_amount,
         e.status,
         h.document_snapshot_json,
         h.detailed_document_snapshot_json,
         e.document_type_code,
         h.document_type_label,
         e.document_id,
         e.description                     AS description,
         string_agg(DISTINCT tr.code, ', ' ORDER BY tr.code) AS tax_rule_code,
         string_agg(DISTINCT l.tax_movement_type_code, ', ' ORDER BY l.tax_movement_type_code) AS tax_movement_type_code,
         string_agg(DISTINCT tmt.name, ', ' ORDER BY tmt.name) AS tax_movement_type_name,
         string_agg(DISTINCT ta.code, ', ' ORDER BY ta.code) AS tax_authority_code,
         string_agg(DISTINCT ta.name, ', ' ORDER BY ta.name) AS tax_authority_name,
         string_agg(DISTINCT l.scheme_code::text, ', ' ORDER BY l.scheme_code::text) AS scheme_label,
         CASE WHEN COUNT(DISTINCT l.tax_rate) = 1 THEN MAX(l.tax_rate)::float ELSE NULL END AS tax_rate,
         json_agg(json_build_object(
           'lineNumber', l.line_number,
           'taxRuleCode', tr.code,
           'taxControlAccountCode', l.tax_movement_type_code,
           'taxControlAccountName', tmt.name,
           'taxAuthorityCode', ta.code,
           'taxAuthorityName', ta.name,
           'schemeLabel', l.scheme_code::text,
           'taxRate', l.tax_rate::float,
           'taxableBaseCurrencyAmount', l.taxable_base_currency_amount::float,
           'drCr', l.dr_cr,
           'baseCurrencyAmount', l.base_currency_amount::float
         ) ORDER BY l.line_number)          AS tax_lines_json,
         e.creation_date::text             AS creation_date,
         e.updated_date::text              AS updated_date
       FROM tax_ledger_entry_header e
       JOIN tax_ledger_entry_line l ON l.tax_ledger_entry_header_id = e.id
       JOIN journal_header h ON h.id = e.journal_header_id
       JOIN tax_rule tr ON tr.id = l.tax_rule_id
       JOIN tax_authority ta ON ta.id = l.tax_authority_id
       LEFT JOIN tax_control_account tmt ON tmt.company_id = $3 AND tmt.code = l.tax_movement_type_code
       LEFT JOIN LATERAL (
         SELECT ar.code
         FROM ar_subledger_entry_header ar
         WHERE ar.journal_header_id = h.id
         ORDER BY ar.id ASC
         LIMIT 1
       ) ar_entry ON true
       LEFT JOIN LATERAL (
         SELECT ap.code
         FROM ap_subledger_entry_header ap
         WHERE ap.journal_header_id = h.id
         ORDER BY ap.id ASC
         LIMIT 1
       ) ap_entry ON true
       WHERE e.company_id = $1
         AND e.code = $2
       GROUP BY
         e.id,
         e.code,
         e.journal_header_id,
         h.code,
         h.bank_cash_code,
         ar_entry.code,
         ap_entry.code,
         e.posting_date,
         e.document_date,
         e.base_currency_code,
         e.status,
         h.document_snapshot_json,
         h.detailed_document_snapshot_json,
         e.document_type_code,
         h.document_type_label,
         e.document_id,
         e.description,
         e.creation_date,
         e.updated_date`,
      [companyId, code, settingsCompanyId],
    );
    return (rows[0] as unknown as TaxSubledgerEntryRow | undefined) ?? null;
  }

  async listEntries(companyId: number): Promise<TaxSubledgerEntryRow[]> {
    const settingsCompanyId = await resolveEffectiveSettingsCompanyId(companyId, this.db);
    const { rows } = await this.db.query(
      `SELECT
         e.id::int                         AS id,
         e.code                            AS code,
         e.journal_header_id::int          AS journal_header_id,
         h.code                            AS journal_code,
         (h.bank_cash_code IS NOT NULL)     AS has_bank_cash_details,
         ar_entry.code                     AS ar_subledger_entry_code,
         ap_entry.code                     AS ap_subledger_entry_code,
         e.posting_date::text              AS posting_date,
         e.document_date::text             AS document_date,
         e.base_currency_code,
         CASE
           WHEN SUM(CASE WHEN l.dr_cr = 'CR' THEN l.base_currency_amount ELSE -l.base_currency_amount END) >= 0
             THEN 'CREDIT'
           ELSE 'DEBIT'
         END AS entry_type,
         ABS(SUM(CASE WHEN l.dr_cr = 'CR' THEN l.base_currency_amount ELSE -l.base_currency_amount END))::float AS base_currency_amount,
         e.status,
         h.document_snapshot_json,
         h.detailed_document_snapshot_json,
         e.document_type_code,
         h.document_type_label,
         e.document_id,
         e.description                     AS description,
         string_agg(DISTINCT tr.code, ', ' ORDER BY tr.code) AS tax_rule_code,
         string_agg(DISTINCT l.tax_movement_type_code, ', ' ORDER BY l.tax_movement_type_code) AS tax_movement_type_code,
         string_agg(DISTINCT tmt.name, ', ' ORDER BY tmt.name) AS tax_movement_type_name,
         string_agg(DISTINCT ta.code, ', ' ORDER BY ta.code) AS tax_authority_code,
         string_agg(DISTINCT ta.name, ', ' ORDER BY ta.name) AS tax_authority_name,
         string_agg(DISTINCT l.scheme_code::text, ', ' ORDER BY l.scheme_code::text) AS scheme_label,
         CASE WHEN COUNT(DISTINCT l.tax_rate) = 1 THEN MAX(l.tax_rate)::float ELSE NULL END AS tax_rate,
         '[]'::json                        AS tax_lines_json,
         e.creation_date::text             AS creation_date,
         e.updated_date::text              AS updated_date
       FROM tax_ledger_entry_header e
       JOIN tax_ledger_entry_line l ON l.tax_ledger_entry_header_id = e.id
       JOIN journal_header h ON h.id = e.journal_header_id
       JOIN tax_rule tr ON tr.id = l.tax_rule_id
       JOIN tax_authority ta ON ta.id = l.tax_authority_id
       LEFT JOIN tax_control_account tmt ON tmt.company_id = $2 AND tmt.code = l.tax_movement_type_code
       LEFT JOIN LATERAL (
         SELECT ar.code
         FROM ar_subledger_entry_header ar
         WHERE ar.journal_header_id = h.id
         ORDER BY ar.id ASC
         LIMIT 1
       ) ar_entry ON true
       LEFT JOIN LATERAL (
         SELECT ap.code
         FROM ap_subledger_entry_header ap
         WHERE ap.journal_header_id = h.id
         ORDER BY ap.id ASC
         LIMIT 1
       ) ap_entry ON true
       WHERE e.company_id = $1
       GROUP BY
         e.id,
         e.code,
         e.journal_header_id,
         h.code,
         h.bank_cash_code,
         ar_entry.code,
         ap_entry.code,
         e.posting_date,
         e.document_date,
         e.base_currency_code,
         e.status,
         h.document_snapshot_json,
         h.detailed_document_snapshot_json,
         e.document_type_code,
         h.document_type_label,
         e.document_id,
         e.description,
         e.creation_date,
         e.updated_date
       ORDER BY e.posting_date DESC, e.id DESC`,
      [companyId, settingsCompanyId],
    );
    return rows as unknown as TaxSubledgerEntryRow[];
  }
}

