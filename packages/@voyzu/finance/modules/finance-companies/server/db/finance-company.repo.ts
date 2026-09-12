import type { DbExecutor } from "@voyzu/capability/db";
import type { FinanceCompanyResponseDto, FinanceCompanyUpdateRequestDto } from "../../types/index";

export interface FinanceCompanyRow {
  id: number; code: string; name: string; country_code: string; country_name: string; base_currency_code: string; currency_name: string; status: FinanceCompanyResponseDto["status"];
  creation_date: string; creation_actor_type: FinanceCompanyResponseDto["audit"]["created"]["actorType"]; creation_user_id: string | null; creation_mutation_id: string | null;
  updated_date: string; updated_actor_type: FinanceCompanyResponseDto["audit"]["updated"]["actorType"]; updated_user_id: string | null; updated_mutation_id: string | null;
  finance_organization_id: number | null; tax_filing_anchor_month: number; tax_filing_interval_months: 1 | 2 | 3 | 6 | 12;
  report_line_1: string | null; report_line_2: string | null; report_footer: string | null; has_postings: boolean;
}

const SELECT_SQL = `SELECT c.id::int, c.code, c.name, c.country_code, country.name AS country_name, c.base_currency_code, currency.name AS currency_name, c.status, c.creation_date, c.creation_actor_type, c.creation_user_id, c.creation_mutation_id, c.updated_date, c.updated_actor_type, c.updated_user_id, c.updated_mutation_id, fc.id::int AS finance_organization_id, COALESCE(fc.tax_filing_anchor_month, finance_country.tax_filing_anchor_month, 3)::int AS tax_filing_anchor_month, COALESCE(fc.tax_filing_interval_months, finance_country.tax_filing_interval_months, 3)::int AS tax_filing_interval_months, fc.report_line_1, fc.report_line_2, fc.report_footer, EXISTS (SELECT 1 FROM journal_header j WHERE j.finance_organization_id = fc.id) AS has_postings FROM organization c JOIN country ON country.code = c.country_code JOIN currency ON currency.code = c.base_currency_code LEFT JOIN finance_country ON finance_country.code = c.country_code LEFT JOIN finance_organization fc ON fc.organization_id = c.id`;

export class FinanceCompanyRepo {
  constructor(private readonly db: DbExecutor) {}

  async getByOrganizationId(id: number): Promise<FinanceCompanyRow | null> {
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE c.id = $1 AND c.status != 'DELETED'`, [id]);
    return (rows[0] as unknown as FinanceCompanyRow | undefined) ?? null;
  }

  async getByCode(code: string): Promise<FinanceCompanyRow | null> {
    const { rows } = await this.db.query(`${SELECT_SQL} WHERE c.code = $1 AND c.status != 'DELETED'`, [code]);
    return (rows[0] as unknown as FinanceCompanyRow | undefined) ?? null;
  }

  async listOrganizationIds(): Promise<number[]> {
    const { rows } = await this.db.query("SELECT organization_id::int FROM finance_organization");
    return rows.map((row) => Number(row.organization_id));
  }

  lock(code: string): Promise<unknown> {
    return this.db.query("SELECT pg_advisory_xact_lock(hashtext($1))", [`voyzu.finance-company.${code}`]);
  }

  async getActivationContext(code: string): Promise<Record<string, unknown> | null> {
    const { rows } = await this.db.query(`SELECT c.id::int, c.status, fc.financial_period_start_month, fc.tax_filing_anchor_month::int, fc.tax_filing_interval_months::int FROM organization c LEFT JOIN finance_country fc ON fc.code = c.country_code WHERE c.code = $1 AND c.status != 'DELETED' FOR UPDATE OF c`, [code]);
    return (rows[0] as Record<string, unknown> | undefined) ?? null;
  }

  async getProvisioningContext(organizationId: number): Promise<Record<string, unknown> | null> {
    const { rows } = await this.db.query(
      `SELECT c.id::int, c.status, fc.financial_period_start_month,
              fc.tax_filing_anchor_month::int, fc.tax_filing_interval_months::int
       FROM organization c
       LEFT JOIN finance_country fc ON fc.code = c.country_code
       WHERE c.id = $1 AND c.status != 'DELETED'`,
      [organizationId],
    );
    return (rows[0] as Record<string, unknown> | undefined) ?? null;
  }

  async ensureFinanceOrganization(organizationId: number, anchorMonth: unknown, intervalMonths: unknown): Promise<{ id: number; created: boolean } | null> {
    const inserted = await this.db.query(`INSERT INTO finance_organization (organization_id, tax_filing_anchor_month, tax_filing_interval_months) VALUES ($1, $2, $3) ON CONFLICT (organization_id) DO NOTHING RETURNING id::int`, [organizationId, anchorMonth, intervalMonths]);
    if (inserted.rows[0]?.id != null) return { id: Number(inserted.rows[0].id), created: true };
    const existing = await this.db.query("SELECT id::int FROM finance_organization WHERE organization_id = $1", [organizationId]);
    return existing.rows[0]?.id == null ? null : { id: Number(existing.rows[0].id), created: false };
  }

  async updateSettings(id: number, input: FinanceCompanyUpdateRequestDto): Promise<void> {
    await this.db.query(`UPDATE finance_organization SET tax_filing_anchor_month = $2, tax_filing_interval_months = $3, report_line_1 = NULLIF($4, ''), report_line_2 = NULLIF($5, ''), report_footer = NULLIF($6, '') WHERE id = $1`, [id, input.taxFilingAnchorMonth, input.taxFilingIntervalMonths, input.reportLine1 ?? "", input.reportLine2 ?? "", input.reportFooter ?? ""]);
  }

  async deleteByOrganizationId(organizationId: number): Promise<void> {
    await this.db.query("DELETE FROM finance_organization WHERE organization_id = $1", [organizationId]);
  }
}
