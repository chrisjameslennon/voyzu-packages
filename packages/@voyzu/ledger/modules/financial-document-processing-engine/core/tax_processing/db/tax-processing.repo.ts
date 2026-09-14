import type { DbExecutor } from "@voyzu/capability/db";

type Lookup = "company" | "taxAuthority" | "period" | "taxControl" | "glAccount" | "documentDefault" | "bankOverride" | "glOverride" | "defaultAccount" | "taxRule" | "documentProcessor";

const SQL: Record<Lookup, string> = {
  company: `SELECT fc.id, c.code, c.name, c.country_code, c.base_currency_code, c.status FROM finance_organization fc JOIN organization c ON c.id = fc.organization_id WHERE c.code = $1`,
  taxAuthority: `SELECT id, code, name FROM tax_authority WHERE code = $1 AND country_code = $2 AND status = 'ACTIVE'`,
  period: `SELECT fy.id AS financial_year_id, fy.code AS financial_year_code, fp.id AS financial_period_id, fp.code AS financial_period_code FROM fiscal_period fp JOIN fiscal_year fy ON fy.id = fp.fiscal_year_id WHERE fp.finance_organization_id = $1 AND $2::date BETWEEN fp.start_date AND fp.end_date AND fp.status = 'OPEN' AND fy.status = 'OPEN' LIMIT 1`,
  taxControl: `SELECT tca.code AS tax_control_account_code, ga.id AS gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name FROM tax_control_account tca JOIN gl_account ga ON ga.finance_organization_id = tca.finance_organization_id AND ga.id = tca.gl_account_id WHERE tca.finance_organization_id = $1 AND tca.code = $2 AND tca.status = 'ACTIVE' AND ga.status = 'ACTIVE'`,
  glAccount: `SELECT id AS gl_account_id, code AS gl_account_code, name AS gl_account_name FROM gl_account WHERE finance_organization_id = $1 AND code = $2 AND status = 'ACTIVE' AND ($3::text[] IS NULL OR account_type = ANY($3::text[]))`,
  documentDefault: `SELECT target_type, allowed_account_types FROM financial_document_default WHERE finance_organization_id = $1 AND document_code = $2 AND code = $3 AND status = 'ACTIVE' LIMIT 1`,
  bankOverride: `SELECT $3::text AS code, bca.code AS bank_cash_control_account_code, bca.gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name FROM bank_cash_control_account bca JOIN gl_account ga ON ga.finance_organization_id = bca.finance_organization_id AND ga.id = bca.gl_account_id WHERE bca.finance_organization_id = $1 AND bca.code = $2 AND bca.status = 'ACTIVE' AND ga.status = 'ACTIVE' AND ga.account_type = ANY($4::text[]) LIMIT 1`,
  glOverride: `SELECT $3::text AS code, ga.id AS gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name FROM gl_account ga WHERE ga.finance_organization_id = $1 AND ga.code = $2 AND ga.status = 'ACTIVE' AND ga.account_type = ANY($4::text[]) LIMIT 1`,
  defaultAccount: `SELECT pc.code, bca.code AS bank_cash_control_account_code, COALESCE(pc.gl_account_id, bca.gl_account_id) AS gl_account_id, ga.code AS gl_account_code, ga.name AS gl_account_name FROM financial_document_default pc LEFT JOIN bank_cash_control_account bca ON bca.finance_organization_id = pc.finance_organization_id AND bca.id = pc.bank_cash_control_account_id JOIN gl_account ga ON ga.finance_organization_id = pc.finance_organization_id AND ga.id = COALESCE(pc.gl_account_id, bca.gl_account_id) WHERE pc.finance_organization_id = $1 AND pc.document_code = $2 AND pc.code = $3 AND pc.status = 'ACTIVE' AND (bca.id IS NULL OR bca.status = 'ACTIVE') AND ga.status = 'ACTIVE' LIMIT 1`,
  taxRule: `SELECT id FROM tax_rule WHERE country_code = $1 AND code = 'CALLER_SUPPLIED' AND status = 'ACTIVE' LIMIT 1`,
  documentProcessor: `SELECT d.code, d.status, d.supports_dimensions, d.cash_movement, d.supports_items FROM financial_document_type d WHERE d.code = $1`,
};

export class TaxProcessingRepo {
  constructor(private readonly db: DbExecutor) {}

  async one<T>(lookup: Lookup, params: unknown[], map: (row: Record<string, unknown>) => T): Promise<T | null> {
    const { rows } = await this.db.query(SQL[lookup], params);
    return rows[0] ? map(rows[0] as Record<string, unknown>) : null;
  }

  async insertHeader(params: unknown[]): Promise<number> {
    const { rows } = await this.db.query(`INSERT INTO tax_ledger_entry_header (code, finance_organization_id, journal_header_id, document_type_code, document_id, description, document_date, posting_date, financial_year_id, financial_period_id, base_currency_code, status, creation_date, creation_actor_type) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'POSTED',now(),'SYSTEM') RETURNING id`, params);
    return Number(rows[0].id);
  }

  async insertLine(params: unknown[]): Promise<number> {
    const { rows } = await this.db.query(`INSERT INTO tax_ledger_entry_line (tax_ledger_entry_header_id, line_number, tax_rule_id, tax_component_id, tax_authority_id, tax_movement_type_code, scheme_code, invoice_label, report_label, tax_rate, taxable_base_currency_amount, dr_cr, base_currency_amount, creation_date, creation_actor_type) VALUES ($1,$2,$3,NULL,$4,$5,NULL,$6,$6,$7,$8,$9,$10,now(),'SYSTEM') RETURNING id`, params);
    return Number(rows[0].id);
  }
}
