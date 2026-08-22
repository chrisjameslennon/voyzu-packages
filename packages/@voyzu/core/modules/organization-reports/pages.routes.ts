import { CompaniesReportPage, CountriesReportPage, CountryTaxSettingsReportPage, CurrenciesReportPage, DimensionsReportPage, FinancialDocumentTypesReportPage, GlAccountsReportPage, InventoryCategoriesReportPage, InventoryItemsReportPage, FinancialDocumentDefaultsReportPage, ReportingCategoriesReportPage, InventoryItemPostingCodesReportPage, LedgerBackedAccountCodesReportPage } from "@voyzu/core/organization-reports/server";

export const pageRoutes = {
  countryTaxSettings: {
    id: "voyzu.organizationReports.page.countryTaxSettings",
    pageTitle: "Country Tax Settings",
    path: "/finance/reports/lists/country-tax-settings",
    Page: CountryTaxSettingsReportPage,
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  dimensions: {
    id: "voyzu.organizationReports.page.dimensions",
    pageTitle: "Dimensions",
    helpPath: "modules-help/organization-financial-settings/reports/dimensions",
    path: "/finance/reports/lists/dimensions",
    Page: DimensionsReportPage,
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  financialDocumentTypes: {
    id: "voyzu.organizationReports.page.financialDocumentTypes",
    pageTitle: "Financial Document Types",
    helpPath: "modules-help/organization-financial-settings/reports/financial-document-types",
    path: "/finance/reports/lists/financial-document-types",
    Page: FinancialDocumentTypesReportPage,
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  glAccounts: {
    id: "voyzu.organizationReports.page.glAccounts",
    pageTitle: "General Ledger Accounts",
    helpPath: "modules-help/organization-financial-settings/reports/general-ledger-accounts",
    path: "/finance/reports/lists/general-ledger-accounts",
    Page: GlAccountsReportPage,
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  inventoryCategories: {
    id: "voyzu.organizationReports.page.inventoryCategories",
    pageTitle: "Inventory Categories",
    helpPath: "modules-help/organization-financial-settings/reports/inventory-categories",
    path: "/finance/reports/lists/inventory-categories",
    Page: InventoryCategoriesReportPage,
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  inventoryItems: {
    id: "voyzu.organizationReports.page.inventoryItems",
    pageTitle: "Inventory Items",
    helpPath: "modules-help/organization-financial-settings/reports/inventory-items",
    path: "/finance/reports/lists/inventory-items",
    Page: InventoryItemsReportPage,
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  financialDocumentDefaults: {
    id: "voyzu.organizationReports.page.financialDocumentDefaults",
    pageTitle: "Financial Document Defaults",
    helpPath: "modules-help/organization-financial-settings/reports/financial-document-defaults",
    path: "/finance/reports/lists/financial-document-defaults",
    Page: FinancialDocumentDefaultsReportPage,
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  glReportingCategories: {
    id: "voyzu.organizationReports.page.glReportingCategories",
    pageTitle: "General Ledger Reporting Categories",
    helpPath: "modules-help/organization-financial-settings/reports/general-ledger-reporting-categories",
    path: "/finance/reports/lists/general-ledger-reporting-categories",
    Page: ReportingCategoriesReportPage,
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  ledgerBackedAccountCodes: {
    id: "voyzu.organizationReports.page.ledgerBackedAccountCodes",
    pageTitle: "Ledger Backed Account Codes",
    helpPath: "modules-help/organization-financial-settings/reports/ledger-backed-account-codes",
    path: "/finance/reports/lists/ledger-backed-account-codes",
    Page: LedgerBackedAccountCodesReportPage,
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  inventoryItemPostingCodes: {
    id: "voyzu.organizationReports.page.inventoryItemPostingCodes",
    pageTitle: "Inventory Item Posting Codes",
    helpPath: "modules-help/organization-financial-settings/reports/inventory-item-posting-codes",
    path: "/finance/reports/lists/inventory-item-posting-codes",
    Page: InventoryItemPostingCodesReportPage,
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  dimensionsPrintable: {
    id: "voyzu.organizationReports.page.dimensions.printable",
    pageTitle: "Dimensions",
    path: "/finance/reports/lists/dimensions/printable",
    Page: DimensionsReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  financialDocumentTypesPrintable: {
    id: "voyzu.organizationReports.page.financialDocumentTypes.printable",
    pageTitle: "Financial Document Types",
    path: "/finance/reports/lists/financial-document-types/printable",
    Page: FinancialDocumentTypesReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  glAccountsPrintable: {
    id: "voyzu.organizationReports.page.glAccounts.printable",
    pageTitle: "General Ledger Accounts",
    path: "/finance/reports/lists/general-ledger-accounts/printable",
    Page: GlAccountsReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  inventoryCategoriesPrintable: {
    id: "voyzu.organizationReports.page.inventoryCategories.printable",
    pageTitle: "Inventory Categories",
    path: "/finance/reports/lists/inventory-categories/printable",
    Page: InventoryCategoriesReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  inventoryItemsPrintable: {
    id: "voyzu.organizationReports.page.inventoryItems.printable",
    pageTitle: "Inventory Items",
    path: "/finance/reports/lists/inventory-items/printable",
    Page: InventoryItemsReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  financialDocumentDefaultsPrintable: {
    id: "voyzu.organizationReports.page.financialDocumentDefaults.printable",
    pageTitle: "Financial Document Defaults",
    path: "/finance/reports/lists/financial-document-defaults/printable",
    Page: FinancialDocumentDefaultsReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  glReportingCategoriesPrintable: {
    id: "voyzu.organizationReports.page.glReportingCategories.printable",
    pageTitle: "General Ledger Reporting Categories",
    path: "/finance/reports/lists/general-ledger-reporting-categories/printable",
    Page: ReportingCategoriesReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  inventoryItemPostingCodesPrintable: {
    id: "voyzu.organizationReports.page.inventoryItemPostingCodes.printable",
    pageTitle: "Inventory Item Posting Codes",
    path: "/finance/reports/lists/inventory-item-posting-codes/printable",
    Page: InventoryItemPostingCodesReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  ledgerBackedAccountCodesPrintable: {
    id: "voyzu.organizationReports.page.ledgerBackedAccountCodes.printable",
    pageTitle: "Ledger Backed Account Codes",
    path: "/finance/reports/lists/ledger-backed-account-codes/printable",
    Page: LedgerBackedAccountCodesReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  },
  countryTaxSettingsPrintable: {
    id: "voyzu.organizationReports.page.countryTaxSettings.printable",
    pageTitle: "Country Tax Settings",
    path: "/finance/reports/lists/country-tax-settings/printable",
    Page: CountryTaxSettingsReportPage,
    unframed: true,
    auth: { required: true, minRole: "ORGANIZATION_USER" }
  }
} as const;
