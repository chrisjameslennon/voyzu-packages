import type { DbExecutor } from "@voyzu/capability/db";

export interface CountryTaxAuthorityReportRow {
  country_code: string;
  id: string | number;
  code: string;
  name: string;
  region_code: string | null;
  jurisdiction_level: string;
  status: string;
}

export interface CountryTaxRuleReportRow {
  country_code: string;
  id: string | number;
  code: string;
  name: string;
  region_code: string | null;
  invoice_label: string;
  calculation_method: string;
  component_count: number;
  status: string;
}

export interface CountryTaxComponentReportRow {
  country_code: string;
  id: string | number;
  code: string;
  tax_rule_code: string;
  tax_authority_code: string;
  scheme_code: string;
  invoice_label: string;
  rate: number;
  status: string;
}

export class CountryTaxReportRepo {
  constructor(private readonly db: DbExecutor) {}

  async listConfigurationRows() {
    const [authorities, rules, components] = await Promise.all([
      this.db.query(`SELECT country_code, id, code, name, region_code, jurisdiction_level, status FROM tax_authority WHERE status != 'DELETED' ORDER BY country_code, code`),
      this.db.query(`SELECT country_code, id, code, name, region_code, invoice_label, calculation_method, component_count, status FROM tax_rule WHERE status != 'DELETED' ORDER BY country_code, code`),
      this.db.query(`SELECT tr.country_code, tc.id, tc.code, tc.tax_rule_code, tc.tax_authority_code, tc.scheme_code, tc.invoice_label, tc.rate, tc.status FROM tax_component tc JOIN tax_rule tr ON tr.country_code = tc.tax_rule_country_code AND tr.code = tc.tax_rule_code WHERE tc.status != 'DELETED' ORDER BY tr.country_code, tc.tax_rule_code, tc.calculation_order, tc.code`),
    ]);
    return {
      authorities: authorities.rows as unknown as CountryTaxAuthorityReportRow[],
      rules: rules.rows as unknown as CountryTaxRuleReportRow[],
      components: components.rows as unknown as CountryTaxComponentReportRow[],
    };
  }
}
