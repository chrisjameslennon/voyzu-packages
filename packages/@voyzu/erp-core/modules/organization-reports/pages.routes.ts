import {
  CompaniesReportPage,
  CountriesReportPage,
  CurrenciesReportPage,
} from "@voyzu/erp-core/organization-reports/server";

const breadcrumbBase = [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }] as const;
const auth = { required: true, minRole: "ORGANIZATION_USER" } as const;

export const pageRoutes = {
  companies: { id: "voyzu.organizationReports.page.companies", pageTitle: "Companies", path: "/organization/reports/lists/companies", Page: CompaniesReportPage, breadcrumbBase, auth },
  countries: { id: "voyzu.organizationReports.page.countries", pageTitle: "Countries", path: "/organization/reports/lists/countries", Page: CountriesReportPage, breadcrumbBase, auth },
  currencies: { id: "voyzu.organizationReports.page.currencies", pageTitle: "Currencies", path: "/organization/reports/lists/currencies", Page: CurrenciesReportPage, breadcrumbBase, auth },
  companiesPrintable: { id: "voyzu.organizationReports.page.companies.printable", pageTitle: "Companies", path: "/organization/reports/lists/companies/printable", Page: CompaniesReportPage, unframed: true, auth },
  countriesPrintable: { id: "voyzu.organizationReports.page.countries.printable", pageTitle: "Countries", path: "/organization/reports/lists/countries/printable", Page: CountriesReportPage, unframed: true, auth },
  currenciesPrintable: { id: "voyzu.organizationReports.page.currencies.printable", pageTitle: "Currencies", path: "/organization/reports/lists/currencies/printable", Page: CurrenciesReportPage, unframed: true, auth },
} as const;
