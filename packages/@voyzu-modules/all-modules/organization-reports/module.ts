export const organizationReportsModule = {
  id: "voyzu.organizationReports",
  name: "Organization Reports",
  pageRoutes: {
    companies: {
      id: "voyzu.organizationReports.page.companies",
      pageTitle: "Companies",
      helpUrl: "modules-help/organization-financial-settings/reports/companies",
    },
    countries: {
      id: "voyzu.organizationReports.page.countries",
      pageTitle: "Countries",
      helpUrl: "modules-help/organization-financial-settings/reports/countries",
    },
    currencies: {
      id: "voyzu.organizationReports.page.currencies",
      pageTitle: "Currencies",
      helpUrl: "modules-help/organization-financial-settings/reports/currencies",
    },
    dimensions: {
      id: "voyzu.organizationReports.page.dimensions",
      pageTitle: "Dimensions",
      helpUrl: "modules-help/organization-financial-settings/reports/dimensions",
    },
    financialDocumentTypes: {
      id: "voyzu.organizationReports.page.financialDocumentTypes",
      pageTitle: "Financial Document Types",
      helpUrl: "modules-help/organization-financial-settings/reports/financial-document-types",
    },
    glAccounts: {
      id: "voyzu.organizationReports.page.glAccounts",
      pageTitle: "General Ledger Accounts",
      helpUrl: "modules-help/organization-financial-settings/reports/general-ledger-accounts",
    },
    inventoryCategories: {
      id: "voyzu.organizationReports.page.inventoryCategories",
      pageTitle: "Inventory Categories",
      helpUrl: "modules-help/organization-financial-settings/reports/inventory-categories",
    },
    countryTaxSettings: {
      id: "voyzu.organizationReports.page.countryTaxSettings",
      pageTitle: "Country Tax Settings",
      helpUrl: "modules-help/organization-financial-settings/reports/country-tax-settings",
    },
    inventoryItems: {
      id: "voyzu.organizationReports.page.inventoryItems",
      pageTitle: "Inventory Items",
      helpUrl: "modules-help/organization-financial-settings/reports/inventory-items",
    },
    financialDocumentDefaults: {
      id: "voyzu.organizationReports.page.financialDocumentDefaults",
      pageTitle: "Financial Document Defaults",
      helpUrl: "modules-help/organization-financial-settings/reports/financial-document-defaults",
    },
    glReportingCategories: {
      id: "voyzu.organizationReports.page.glReportingCategories",
      pageTitle: "General Ledger Reporting Categories",
      helpUrl: "modules-help/organization-financial-settings/reports/general-ledger-reporting-categories",
    },
    ledgerBackedAccountCodes: {
      id: "voyzu.organizationReports.page.ledgerBackedAccountCodes",
      pageTitle: "Ledger Backed Account Codes",
      helpUrl: "modules-help/organization-financial-settings/reports/ledger-backed-account-codes",
    },
    inventoryItemPostingCodes: {
      id: "voyzu.organizationReports.page.inventoryItemPostingCodes",
      pageTitle: "Inventory Item Posting Codes",
      helpUrl: "modules-help/organization-financial-settings/reports/inventory-item-posting-codes",
    },
  },
} as const;
