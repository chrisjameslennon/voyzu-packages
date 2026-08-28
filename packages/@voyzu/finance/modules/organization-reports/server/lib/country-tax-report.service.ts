import { getDb } from "@voyzu/capability/db";
import { listCountries } from "@voyzu/localization/countries/server";

import { CountryTaxReportRepo } from "../db/country-tax-report.repo";

export async function listCountriesWithTaxConfiguration() {
  const [countries, configuration] = await Promise.all([
    listCountries(),
    new CountryTaxReportRepo(getDb()).listConfigurationRows(),
  ]);
  return countries.map((country) => ({
    ...country,
    taxAuthorities: configuration.authorities.filter((row) => row.country_code === country.code).map((row) => ({
      id: String(row.id), code: String(row.code), name: String(row.name), regionCode: row.region_code == null ? null : String(row.region_code), jurisdictionLevel: String(row.jurisdiction_level), status: String(row.status),
    })),
    taxRules: configuration.rules.filter((row) => row.country_code === country.code).map((row) => ({
      id: String(row.id), code: String(row.code), name: String(row.name), regionCode: row.region_code == null ? null : String(row.region_code), invoiceLabel: String(row.invoice_label), calculationMethod: String(row.calculation_method), componentCount: Number(row.component_count), status: String(row.status),
    })),
    taxComponents: configuration.components.filter((row) => row.country_code === country.code).map((row) => ({
      id: String(row.id), code: String(row.code), taxRuleCode: String(row.tax_rule_code), taxAuthorityCode: String(row.tax_authority_code), schemeCode: String(row.scheme_code), invoiceLabel: String(row.invoice_label), rate: Number(row.rate), status: String(row.status),
    })),
  }));
}
