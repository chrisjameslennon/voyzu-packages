import {
  OrganizationsReportPage,
  CountriesReportPage,
  CurrenciesReportPage,
} from "@voyzu/erp-core/organization-reports/server";

const breadcrumbBase = [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }] as const;
const auth = { required: true, minRole: "STANDARD" } as const;

export const pageRoutes = {
  organizations: { id: "voyzu.organizationReports.page.organizations", pageTitle: "Organizations", path: "/organization/reports/lists/organizations", Page: OrganizationsReportPage, breadcrumbBase, auth },
  countries: { id: "voyzu.organizationReports.page.countries", pageTitle: "Countries", path: "/organization/reports/lists/countries", Page: CountriesReportPage, breadcrumbBase, auth },
  currencies: { id: "voyzu.organizationReports.page.currencies", pageTitle: "Currencies", path: "/organization/reports/lists/currencies", Page: CurrenciesReportPage, breadcrumbBase, auth },
  organizationsPrintable: { id: "voyzu.organizationReports.page.organizations.printable", pageTitle: "Organizations", path: "/organization/reports/lists/organizations/printable", Page: OrganizationsReportPage, unframed: true, auth },
  countriesPrintable: { id: "voyzu.organizationReports.page.countries.printable", pageTitle: "Countries", path: "/organization/reports/lists/countries/printable", Page: CountriesReportPage, unframed: true, auth },
  currenciesPrintable: { id: "voyzu.organizationReports.page.currencies.printable", pageTitle: "Currencies", path: "/organization/reports/lists/currencies/printable", Page: CurrenciesReportPage, unframed: true, auth },
} as const;
