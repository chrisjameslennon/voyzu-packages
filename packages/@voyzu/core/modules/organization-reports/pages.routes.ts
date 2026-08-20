import { CompaniesReportPage, CountriesReportPage, CountryTaxSettingsReportPage, CurrenciesReportPage, DimensionsReportPage, FinancialDocumentTypesReportPage, GlAccountsReportPage, InventoryCategoriesReportPage, InventoryItemsReportPage, FinancialDocumentDefaultsReportPage, ReportingCategoriesReportPage, InventoryItemPostingCodesReportPage, LedgerBackedAccountCodesReportPage } from "@voyzu/core/organization-reports/server";

export const pageRoutes = {
  companies: {
    id: "voyzu.organizationReports.page.companies",
    pageTitle: "Companies",
    helpPath: "modules-help/organization-financial-settings/reports/companies",
    path: "/organization/reports/lists/companies",
    Page: CompaniesReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  countries: {
    id: "voyzu.organizationReports.page.countries",
    pageTitle: "Countries",
    helpPath: "modules-help/organization-financial-settings/reports/countries",
    path: "/organization/reports/lists/countries",
    Page: CountriesReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  currencies: {
    id: "voyzu.organizationReports.page.currencies",
    pageTitle: "Currencies",
    helpPath: "modules-help/organization-financial-settings/reports/currencies",
    path: "/organization/reports/lists/currencies",
    Page: CurrenciesReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  dimensions: {
    id: "voyzu.organizationReports.page.dimensions",
    pageTitle: "Dimensions",
    helpPath: "modules-help/organization-financial-settings/reports/dimensions",
    path: "/organization/reports/lists/dimensions",
    Page: DimensionsReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  financialDocumentTypes: {
    id: "voyzu.organizationReports.page.financialDocumentTypes",
    pageTitle: "Financial Document Types",
    helpPath: "modules-help/organization-financial-settings/reports/financial-document-types",
    path: "/organization/reports/lists/financial-document-types",
    Page: FinancialDocumentTypesReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  glAccounts: {
    id: "voyzu.organizationReports.page.glAccounts",
    pageTitle: "General Ledger Accounts",
    helpPath: "modules-help/organization-financial-settings/reports/general-ledger-accounts",
    path: "/organization/reports/lists/general-ledger-accounts",
    Page: GlAccountsReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  inventoryCategories: {
    id: "voyzu.organizationReports.page.inventoryCategories",
    pageTitle: "Inventory Categories",
    helpPath: "modules-help/organization-financial-settings/reports/inventory-categories",
    path: "/organization/reports/lists/inventory-categories",
    Page: InventoryCategoriesReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  countryTaxSettings: {
    id: "voyzu.organizationReports.page.countryTaxSettings",
    pageTitle: "Country Tax Settings",
    helpPath: "modules-help/organization-financial-settings/reports/country-tax-settings",
    path: "/organization/reports/lists/country-tax-settings",
    Page: CountryTaxSettingsReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  inventoryItems: {
    id: "voyzu.organizationReports.page.inventoryItems",
    pageTitle: "Inventory Items",
    helpPath: "modules-help/organization-financial-settings/reports/inventory-items",
    path: "/organization/reports/lists/inventory-items",
    Page: InventoryItemsReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  financialDocumentDefaults: {
    id: "voyzu.organizationReports.page.financialDocumentDefaults",
    pageTitle: "Financial Document Defaults",
    helpPath: "modules-help/organization-financial-settings/reports/financial-document-defaults",
    path: "/organization/reports/lists/financial-document-defaults",
    Page: FinancialDocumentDefaultsReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  glReportingCategories: {
    id: "voyzu.organizationReports.page.glReportingCategories",
    pageTitle: "General Ledger Reporting Categories",
    helpPath: "modules-help/organization-financial-settings/reports/general-ledger-reporting-categories",
    path: "/organization/reports/lists/general-ledger-reporting-categories",
    Page: ReportingCategoriesReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  ledgerBackedAccountCodes: {
    id: "voyzu.organizationReports.page.ledgerBackedAccountCodes",
    pageTitle: "Ledger Backed Account Codes",
    helpPath: "modules-help/organization-financial-settings/reports/ledger-backed-account-codes",
    path: "/organization/reports/lists/ledger-backed-account-codes",
    Page: LedgerBackedAccountCodesReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  inventoryItemPostingCodes: {
    id: "voyzu.organizationReports.page.inventoryItemPostingCodes",
    pageTitle: "Inventory Item Posting Codes",
    helpPath: "modules-help/organization-financial-settings/reports/inventory-item-posting-codes",
    path: "/organization/reports/lists/inventory-item-posting-codes",
    Page: InventoryItemPostingCodesReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  companiesPrintable: {
    id: "voyzu.organizationReports.page.companies.printable",
    pageTitle: "Companies",
    path: "/organization/reports/lists/companies/printable",
    Page: CompaniesReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  countriesPrintable: {
    id: "voyzu.organizationReports.page.countries.printable",
    pageTitle: "Countries",
    path: "/organization/reports/lists/countries/printable",
    Page: CountriesReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  currenciesPrintable: {
    id: "voyzu.organizationReports.page.currencies.printable",
    pageTitle: "Currencies",
    path: "/organization/reports/lists/currencies/printable",
    Page: CurrenciesReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  dimensionsPrintable: {
    id: "voyzu.organizationReports.page.dimensions.printable",
    pageTitle: "Dimensions",
    path: "/organization/reports/lists/dimensions/printable",
    Page: DimensionsReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  financialDocumentTypesPrintable: {
    id: "voyzu.organizationReports.page.financialDocumentTypes.printable",
    pageTitle: "Financial Document Types",
    path: "/organization/reports/lists/financial-document-types/printable",
    Page: FinancialDocumentTypesReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  glAccountsPrintable: {
    id: "voyzu.organizationReports.page.glAccounts.printable",
    pageTitle: "General Ledger Accounts",
    path: "/organization/reports/lists/general-ledger-accounts/printable",
    Page: GlAccountsReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  inventoryCategoriesPrintable: {
    id: "voyzu.organizationReports.page.inventoryCategories.printable",
    pageTitle: "Inventory Categories",
    path: "/organization/reports/lists/inventory-categories/printable",
    Page: InventoryCategoriesReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  countryTaxSettingsPrintable: {
    id: "voyzu.organizationReports.page.countryTaxSettings.printable",
    pageTitle: "Country Tax Settings",
    path: "/organization/reports/lists/country-tax-settings/printable",
    Page: CountryTaxSettingsReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  inventoryItemsPrintable: {
    id: "voyzu.organizationReports.page.inventoryItems.printable",
    pageTitle: "Inventory Items",
    path: "/organization/reports/lists/inventory-items/printable",
    Page: InventoryItemsReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  financialDocumentDefaultsPrintable: {
    id: "voyzu.organizationReports.page.financialDocumentDefaults.printable",
    pageTitle: "Financial Document Defaults",
    path: "/organization/reports/lists/financial-document-defaults/printable",
    Page: FinancialDocumentDefaultsReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  glReportingCategoriesPrintable: {
    id: "voyzu.organizationReports.page.glReportingCategories.printable",
    pageTitle: "General Ledger Reporting Categories",
    path: "/organization/reports/lists/general-ledger-reporting-categories/printable",
    Page: ReportingCategoriesReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  inventoryItemPostingCodesPrintable: {
    id: "voyzu.organizationReports.page.inventoryItemPostingCodes.printable",
    pageTitle: "Inventory Item Posting Codes",
    path: "/organization/reports/lists/inventory-item-posting-codes/printable",
    Page: InventoryItemPostingCodesReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  ledgerBackedAccountCodesPrintable: {
    id: "voyzu.organizationReports.page.ledgerBackedAccountCodes.printable",
    pageTitle: "Ledger Backed Account Codes",
    path: "/organization/reports/lists/ledger-backed-account-codes/printable",
    Page: LedgerBackedAccountCodesReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  }
} as const;
