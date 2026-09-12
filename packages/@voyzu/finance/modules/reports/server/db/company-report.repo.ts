import type { DbExecutor } from "@voyzu/capability/db";

export interface CompanyReportContext {
  name: string;
  reportLine1: string | null;
  reportLine2: string | null;
  reportFooter: string | null;
  baseCurrencyCode: string;
}

export interface FinanceCompanyFilingSettings {
  id: number;
  taxFilingAnchorMonth: number;
  taxFilingIntervalMonths: number;
}

export class CompanyReportRepo {
  constructor(private readonly db: DbExecutor) {}

  async getCompany(companyId: number): Promise<CompanyReportContext | null> {
    const { rows } = await this.db.query(
      `SELECT c.name, fc.report_line_1, fc.report_line_2, fc.report_footer,
              c.base_currency_code
       FROM organization c
       JOIN finance_organization fc ON fc.organization_id = c.id
       WHERE fc.id = $1`,
      [companyId],
    );
    const row = rows[0];
    if (!row) return null;
    return {
      name: String(row.name),
      reportLine1:
        row.report_line_1 == null ? null : String(row.report_line_1),
      reportLine2:
        row.report_line_2 == null ? null : String(row.report_line_2),
      reportFooter:
        row.report_footer == null ? null : String(row.report_footer),
      baseCurrencyCode: String(row.base_currency_code),
    };
  }

  async getFilingSettingsByOrganizationId(
    organizationId: number,
  ): Promise<FinanceCompanyFilingSettings | null> {
    const { rows } = await this.db.query(
      `SELECT tax_filing_anchor_month, tax_filing_interval_months
       FROM finance_organization
       WHERE organization_id = $1`,
      [organizationId],
    );
    const row = rows[0];
    if (!row) return null;
    return {
      id: organizationId,
      taxFilingAnchorMonth: Number(row.tax_filing_anchor_month),
      taxFilingIntervalMonths: Number(row.tax_filing_interval_months),
    };
  }
}
