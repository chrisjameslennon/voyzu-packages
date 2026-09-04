import type { DbExecutor } from "@voyzu/capability/db";

export interface CompanyRow { id: number; code: string; name: string; country_code: string; base_currency_code: string; status: string }
export interface CounterpartyRow { id: number; finance_organization_id: number; code: string; name: string; status: "ACTIVE" | "INACTIVE"; country_code: string; tax_region_or_province: string | null; country_currency_code: string }
export interface PeriodRow { financial_year_id: number; financial_year_code: string; financial_period_id: number; financial_period_code: string }
export interface AccountRow { gl_account_id: number; gl_account_code: string; gl_account_name: string; code?: string; bank_cash_control_account_code?: string; control_account_code?: string; control_account_name?: string }
export interface OpenItemRow { ar_subledger_entry_id: number; ar_subledger_entry_code: string; document_id: string; journal_code: string; open_amount: number }
export interface DocumentProcessorRow { code: string; status: string; supports_dimensions: boolean; cash_movement: boolean; supports_items: boolean }

function companyRow(row: Record<string, unknown>): CompanyRow { return { id: Number(row.id), code: String(row.code), name: String(row.name), country_code: String(row.country_code), base_currency_code: String(row.base_currency_code), status: String(row.status) }; }
function counterpartyRow(row: Record<string, unknown>): CounterpartyRow { return { id: Number(row.id), finance_organization_id: Number(row.finance_organization_id), code: String(row.code), name: String(row.name), status: row.status as "ACTIVE" | "INACTIVE", country_code: String(row.country_code), tax_region_or_province: row.tax_region_or_province == null ? null : String(row.tax_region_or_province), country_currency_code: String(row.country_currency_code) }; }
function periodRow(row: Record<string, unknown>): PeriodRow { return { financial_year_id: Number(row.financial_year_id), financial_year_code: String(row.financial_year_code), financial_period_id: Number(row.financial_period_id), financial_period_code: String(row.financial_period_code) }; }
function accountRow(row: Record<string, unknown>): AccountRow { return { gl_account_id: Number(row.gl_account_id), gl_account_code: String(row.gl_account_code), gl_account_name: String(row.gl_account_name), code: row.code == null ? undefined : String(row.code), bank_cash_control_account_code: row.bank_cash_control_account_code == null ? undefined : String(row.bank_cash_control_account_code), control_account_code: row.control_account_code == null ? undefined : String(row.control_account_code), control_account_name: row.control_account_name == null ? undefined : String(row.control_account_name) }; }
function openItemRow(row: Record<string, unknown>): OpenItemRow { return { ar_subledger_entry_id: Number(row.ar_subledger_entry_id), ar_subledger_entry_code: String(row.ar_subledger_entry_code), document_id: String(row.document_id), journal_code: String(row.journal_code), open_amount: Number(row.open_amount) }; }
function documentProcessorRow(row: Record<string, unknown>): DocumentProcessorRow { return { code: String(row.code), status: String(row.status), supports_dimensions: Boolean(row.supports_dimensions), cash_movement: Boolean(row.cash_movement), supports_items: Boolean(row.supports_items) }; }

export class ArReceiptPostingRepo {
  constructor(readonly db: DbExecutor) {}

  private async one<T>(sql: string, params: unknown[], map: (row: Record<string, unknown>) => T): Promise<T | null> {
    const { rows } = await this.db.query(sql, params);
    return rows[0] ? map(rows[0] as Record<string, unknown>) : null;
  }

  getCompany(code: string) { return this.one(`SELECT fc.id, c.code, c.name, c.country_code, c.base_currency_code, c.status FROM finance_organization fc JOIN organization c ON c.id = fc.organization_id WHERE c.code = $1`, [code], companyRow); }
  getDocumentProcessor(code: string) { return this.one(`SELECT code, status, supports_dimensions, cash_movement, supports_items FROM financial_document_type WHERE code = $1`, [code], documentProcessorRow); }
  getCounterparty(companyId: number, code: string) { return this.one(`SELECT cp.*, c.currency_code AS country_currency_code FROM ar_counterparty cp JOIN country c ON c.code = cp.country_code WHERE cp.finance_organization_id = $1 AND cp.code = $2`, [companyId, code], counterpartyRow); }

  async upsertCounterparty(companyId: number, input: { code?: string | null; name: string; status: "ACTIVE" | "INACTIVE"; country_code: string; state_or_province_code?: string | null }): Promise<CounterpartyRow & { was_created: boolean }> {
    const { rows } = await this.db.query(`WITH upserted AS (
      INSERT INTO ar_counterparty (finance_organization_id, code, name, status, country_code, tax_region_or_province, creation_date, creation_actor_type, updated_date, updated_actor_type)
      VALUES ($1,$2,$3,$4,$5,$6,now(),'SYSTEM',now(),'SYSTEM') ON CONFLICT (finance_organization_id, code) DO UPDATE
      SET name = EXCLUDED.name, status = EXCLUDED.status, country_code = EXCLUDED.country_code, tax_region_or_province = EXCLUDED.tax_region_or_province, updated_date = now(), updated_actor_type = 'SYSTEM'
      RETURNING *, (xmax = 0) AS was_created)
      SELECT u.*, c.currency_code AS country_currency_code FROM upserted u JOIN country c ON c.code = u.country_code`, [companyId, input.code, input.name, input.status, input.country_code, input.state_or_province_code ?? null]);
    return { ...counterpartyRow(rows[0] as Record<string, unknown>), was_created: Boolean(rows[0].was_created) };
  }

  getPeriod(companyId: number, postingDate: string) { return this.one(`SELECT fy.id AS financial_year_id, fy.code AS financial_year_code, fp.id AS financial_period_id, fp.code AS financial_period_code FROM fiscal_period fp JOIN fiscal_year fy ON fy.id = fp.fiscal_year_id WHERE fp.finance_organization_id = $1 AND $2::date BETWEEN fp.start_date AND fp.end_date AND fy.status = 'OPEN' AND fp.status = 'OPEN' LIMIT 1`, [companyId, postingDate], periodRow); }

  async getCashAccount(companyId: number, code: string | null | undefined, documentCode: string, defaultCode: string): Promise<(AccountRow & { code: string }) | null> {
    const row = await this.one(code
      ? `SELECT $3::text AS code, bca.code AS bank_cash_control_account_code, bca.gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name FROM bank_cash_control_account bca JOIN gl_account ga ON ga.finance_organization_id = bca.finance_organization_id AND ga.id = bca.gl_account_id WHERE bca.finance_organization_id = $1 AND bca.code = $2 AND bca.status = 'ACTIVE' AND ga.status = 'ACTIVE' AND ga.account_type = 'ASSET' LIMIT 1`
      : `SELECT pc.code, bca.code AS bank_cash_control_account_code, bca.gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name FROM financial_document_default pc JOIN bank_cash_control_account bca ON bca.finance_organization_id = pc.finance_organization_id AND bca.id = pc.bank_cash_control_account_id JOIN gl_account ga ON ga.finance_organization_id = bca.finance_organization_id AND ga.id = bca.gl_account_id WHERE pc.finance_organization_id = $1 AND pc.document_code = $2 AND pc.code = $3 AND pc.status = 'ACTIVE' AND bca.status = 'ACTIVE' AND ga.status = 'ACTIVE' AND ga.account_type = 'ASSET' LIMIT 1`,
      code ? [companyId, code, defaultCode] : [companyId, documentCode, defaultCode], accountRow);
    return row?.code ? row as AccountRow & { code: string } : null;
  }

  getControlAccount(companyId: number, code: string) { return this.one(`SELECT ca.code AS control_account_code, ca.name AS control_account_name, ca.gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name FROM ar_control_account ca JOIN gl_account ga ON ga.finance_organization_id = ca.finance_organization_id AND ga.id = ca.gl_account_id WHERE ca.finance_organization_id = $1 AND ca.code = $2 AND ca.status = 'ACTIVE' AND ga.status = 'ACTIVE'`, [companyId, code], accountRow); }
  findOpenInvoice(companyId: number, counterpartyId: number, documentId: string, controlCode: string) { return this.one(`SELECT e.id AS ar_subledger_entry_id, e.code AS ar_subledger_entry_code, h.document_id, h.code AS journal_code, GREATEST(COALESCE(invoice_lines.amount, 0) - COALESCE(applied_lines.amount, 0), 0)::float AS open_amount FROM ar_subledger_entry_header e JOIN journal_header h ON h.id = e.journal_header_id LEFT JOIN LATERAL (SELECT SUM(l.base_currency_amount) AS amount FROM ar_subledger_entry_line l WHERE l.ar_subledger_entry_header_id = e.id AND l.control_account_code = $4 AND l.dr_cr = 'DR') invoice_lines ON true LEFT JOIN LATERAL (SELECT SUM(l.base_currency_amount) AS amount FROM ar_subledger_entry_line l WHERE l.target_entry_header_id = e.id AND l.control_account_code = $4 AND l.dr_cr = 'CR') applied_lines ON true WHERE e.finance_organization_id = $1 AND e.ar_counterparty_id = $2 AND h.document_type_code = 'AR_INVOICE' AND h.document_id = $3 LIMIT 1`, [companyId, counterpartyId, documentId, controlCode], openItemRow); }
  findOpenReceipt(companyId: number, counterpartyId: number, documentId: string, controlCode: string) { return this.one(`SELECT e.id AS ar_subledger_entry_id, e.code AS ar_subledger_entry_code, h.document_id, h.code AS journal_code, GREATEST(COALESCE(unapplied_lines.amount, 0) - COALESCE(application_lines.amount, 0), 0)::float AS open_amount FROM ar_subledger_entry_header e JOIN journal_header h ON h.id = e.journal_header_id LEFT JOIN LATERAL (SELECT SUM(l.base_currency_amount) AS amount FROM ar_subledger_entry_line l WHERE l.ar_subledger_entry_header_id = e.id AND l.control_account_code = $4 AND l.dr_cr = 'CR') unapplied_lines ON true LEFT JOIN LATERAL (SELECT SUM(l.base_currency_amount) AS amount FROM ar_subledger_entry_line l WHERE l.source_entry_header_id = e.id AND l.control_account_code = $4 AND l.dr_cr = 'DR') application_lines ON true WHERE e.finance_organization_id = $1 AND e.ar_counterparty_id = $2 AND h.document_type_code = 'AR_RECEIPT' AND h.document_id = $3 LIMIT 1`, [companyId, counterpartyId, documentId, controlCode], openItemRow); }

  async insertEntryLine(input: { headerId: number; sequence: number; lineType: string; description: string; control: string; amount: number; appliedTo: number | null; memo: string | null }): Promise<number> {
    const { rows } = await this.db.query(`INSERT INTO ar_subledger_entry_line (ar_subledger_entry_header_id, line_number, line_type, description, control_account_code, dr_cr, gross_amount, target_entry_header_id, base_currency_amount, memo, creation_date, creation_actor_type) VALUES ($1,$2,$3,$4,$5,'CR',$6,$7,$8,$9,now(),'SYSTEM') RETURNING id`, [input.headerId, input.sequence, input.lineType, input.description, input.control, input.amount, input.appliedTo, input.amount, input.memo]);
    return Number(rows[0].id);
  }

  async insertHeader(input: { code: string; companyId: number; journalHeaderId: number; counterpartyId: number; documentType: string; documentId: string; description: string; memo: string | null; documentDate: string; postingDate: string; financialYearId: number; financialPeriodId: number; baseCurrencyCode: string }): Promise<number> {
    const { rows } = await this.db.query(`INSERT INTO ar_subledger_entry_header (code, finance_organization_id, journal_header_id, ar_counterparty_id, document_type_code, document_id, description, memo, document_date, posting_date, financial_year_id, financial_period_id, base_currency_code, status, creation_date, creation_actor_type) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'POSTED',now(),'SYSTEM') RETURNING id`, [input.code, input.companyId, input.journalHeaderId, input.counterpartyId, input.documentType, input.documentId, input.description, input.memo, input.documentDate, input.postingDate, input.financialYearId, input.financialPeriodId, input.baseCurrencyCode]);
    return Number(rows[0].id);
  }
}
