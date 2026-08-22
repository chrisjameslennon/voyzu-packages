import "server-only";

import { getDb } from "@voyzu/capability/db";
import type { CountryTaxSetting } from "@voyzu/core/types/modules/country-tax-settings";

type Row = Record<string, unknown>;

const COUNTRY_SQL = `
  SELECT c.code, c.name, c.currency_code, currency.name AS currency_name, c.status,
         fc.financial_period_start_month, fc.tax_filing_anchor_month,
         fc.tax_filing_interval_months
  FROM finance_country fc
  JOIN country c ON c.code = fc.code
  JOIN currency ON currency.code = c.currency_code
  WHERE c.status = 'ACTIVE'
`;

async function enrichCountry(row: Row): Promise<CountryTaxSetting> {
  const db = getDb();
  const code = String(row.code);
  const [authorities, rules, components] = await Promise.all([
    db.query(`SELECT id, code, name, region_code, jurisdiction_level, status FROM tax_authority WHERE country_code = $1 AND status != 'DELETED' ORDER BY code`, [code]),
    db.query(`SELECT id, code, name, region_code, invoice_label, calculation_method, component_count, status FROM tax_rule WHERE country_code = $1 AND status != 'DELETED' ORDER BY code`, [code]),
    db.query(`SELECT tc.id, tc.code, tc.tax_rule_code, tc.tax_authority_code, tc.scheme_code, tc.invoice_label, tc.rate, tc.status FROM tax_component tc JOIN tax_rule tr ON tr.country_code = tc.tax_rule_country_code AND tr.code = tc.tax_rule_code WHERE tr.country_code = $1 AND tc.status != 'DELETED' ORDER BY tc.tax_rule_code, tc.calculation_order, tc.code`, [code]),
  ]);

  return {
    id: code,
    code,
    name: String(row.name),
    currencyCode: String(row.currency_code),
    currencyName: String(row.currency_name),
    status: row.status as CountryTaxSetting["status"],
    financialPeriodStartMonth: row.financial_period_start_month == null ? null : String(row.financial_period_start_month).trim(),
    taxFilingAnchorMonth: Number(row.tax_filing_anchor_month),
    taxFilingIntervalMonths: Number(row.tax_filing_interval_months) as CountryTaxSetting["taxFilingIntervalMonths"],
    taxAuthorities: authorities.rows.map((item) => ({
      id: String(item.id), code: String(item.code), name: String(item.name),
      regionCode: item.region_code == null ? null : String(item.region_code),
      jurisdictionLevel: String(item.jurisdiction_level), status: item.status as "ACTIVE" | "INACTIVE",
    })),
    taxRules: rules.rows.map((item) => ({
      id: String(item.id), code: String(item.code), name: String(item.name),
      regionCode: item.region_code == null ? null : String(item.region_code),
      invoiceLabel: String(item.invoice_label), calculationMethod: String(item.calculation_method),
      componentCount: Number(item.component_count), status: item.status as "ACTIVE" | "INACTIVE",
    })),
    taxComponents: components.rows.map((item) => ({
      id: String(item.id), code: String(item.code), taxRuleCode: String(item.tax_rule_code),
      taxAuthorityCode: String(item.tax_authority_code), schemeCode: String(item.scheme_code),
      invoiceLabel: String(item.invoice_label), rate: Number(item.rate), status: item.status as "ACTIVE" | "INACTIVE",
    })),
  };
}

export async function listCountryTaxSettings(): Promise<CountryTaxSetting[]> {
  const { rows } = await getDb().query(`${COUNTRY_SQL} ORDER BY c.name`);
  return Promise.all(rows.map((row) => enrichCountry(row)));
}

export async function getCountryTaxSetting(code: string): Promise<CountryTaxSetting | null> {
  const { rows } = await getDb().query(`${COUNTRY_SQL} AND c.code = $1`, [code.trim().toUpperCase()]);
  return rows[0] ? enrichCountry(rows[0]) : null;
}
