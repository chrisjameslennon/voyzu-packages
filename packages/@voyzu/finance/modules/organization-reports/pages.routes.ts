
export const pageRoutes = {
  countryTaxSettings: {
    id: "voyzu.organizationReports.page.countryTaxSettings",
    pageTitle: "Country Tax Settings",
    path: "/finance/reports/lists/country-tax-settings",
    loadPage: () => import("./server/pages/OrganizationListReportPages").then((module) => module.CountryTaxSettingsReportPage),
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "STANDARD" }
  },
  dimensions: {
    id: "voyzu.organizationReports.page.dimensions",
    pageTitle: "Dimensions",
    helpPath: "modules-help/organization-financial-settings/reports/dimensions",
    path: "/finance/reports/lists/dimensions",
    loadPage: () => import("./server/pages/OrganizationListReportPages").then((module) => module.DimensionsReportPage),
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "STANDARD" }
  },
  financialDocumentTypes: {
    id: "voyzu.organizationReports.page.financialDocumentTypes",
    pageTitle: "Financial Document Types",
    helpPath: "modules-help/organization-financial-settings/reports/financial-document-types",
    path: "/finance/reports/lists/financial-document-types",
    loadPage: () => import("./server/pages/OrganizationListReportPages").then((module) => module.FinancialDocumentTypesReportPage),
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "STANDARD" }
  },
  glAccounts: {
    id: "voyzu.organizationReports.page.glAccounts",
    pageTitle: "General Ledger Accounts",
    helpPath: "modules-help/organization-financial-settings/reports/general-ledger-accounts",
    path: "/finance/reports/lists/general-ledger-accounts",
    loadPage: () => import("./server/pages/OrganizationListReportPages").then((module) => module.GlAccountsReportPage),
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "STANDARD" }
  },
  financialDocumentDefaults: {
    id: "voyzu.organizationReports.page.financialDocumentDefaults",
    pageTitle: "Financial Document Defaults",
    helpPath: "modules-help/organization-financial-settings/reports/financial-document-defaults",
    path: "/finance/reports/lists/financial-document-defaults",
    loadPage: () => import("./server/pages/OrganizationListReportPages").then((module) => module.FinancialDocumentDefaultsReportPage),
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "STANDARD" }
  },
  glReportingCategories: {
    id: "voyzu.organizationReports.page.glReportingCategories",
    pageTitle: "General Ledger Reporting Categories",
    helpPath: "modules-help/organization-financial-settings/reports/general-ledger-reporting-categories",
    path: "/finance/reports/lists/general-ledger-reporting-categories",
    loadPage: () => import("./server/pages/OrganizationListReportPages").then((module) => module.ReportingCategoriesReportPage),
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "STANDARD" }
  },
  ledgerBackedAccountCodes: {
    id: "voyzu.organizationReports.page.ledgerBackedAccountCodes",
    pageTitle: "Ledger Backed Account Codes",
    helpPath: "modules-help/organization-financial-settings/reports/ledger-backed-account-codes",
    path: "/finance/reports/lists/ledger-backed-account-codes",
    loadPage: () => import("./server/pages/OrganizationListReportPages").then((module) => module.LedgerBackedAccountCodesReportPage),
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "STANDARD" }
  },
  inventoryItemPostingCodes: {
    id: "voyzu.organizationReports.page.inventoryItemPostingCodes",
    pageTitle: "Inventory Item Posting Codes",
    helpPath: "modules-help/organization-financial-settings/reports/inventory-item-posting-codes",
    path: "/finance/reports/lists/inventory-item-posting-codes",
    loadPage: () => import("./server/pages/OrganizationListReportPages").then((module) => module.InventoryItemPostingCodesReportPage),
    breadcrumbBase: [{ label: "Finance Admin" }, { label: "Reports" }, { label: "Lists" }],
    auth: { required: true, minRole: "STANDARD" }
  },
  dimensionsPrintable: {
    id: "voyzu.organizationReports.page.dimensions.printable",
    pageTitle: "Dimensions",
    path: "/finance/reports/lists/dimensions/printable",
    loadPage: () => import("./server/pages/OrganizationListReportPages").then((module) => module.DimensionsReportPage),
    unframed: true,
    auth: { required: true, minRole: "STANDARD" }
  },
  financialDocumentTypesPrintable: {
    id: "voyzu.organizationReports.page.financialDocumentTypes.printable",
    pageTitle: "Financial Document Types",
    path: "/finance/reports/lists/financial-document-types/printable",
    loadPage: () => import("./server/pages/OrganizationListReportPages").then((module) => module.FinancialDocumentTypesReportPage),
    unframed: true,
    auth: { required: true, minRole: "STANDARD" }
  },
  glAccountsPrintable: {
    id: "voyzu.organizationReports.page.glAccounts.printable",
    pageTitle: "General Ledger Accounts",
    path: "/finance/reports/lists/general-ledger-accounts/printable",
    loadPage: () => import("./server/pages/OrganizationListReportPages").then((module) => module.GlAccountsReportPage),
    unframed: true,
    auth: { required: true, minRole: "STANDARD" }
  },
  financialDocumentDefaultsPrintable: {
    id: "voyzu.organizationReports.page.financialDocumentDefaults.printable",
    pageTitle: "Financial Document Defaults",
    path: "/finance/reports/lists/financial-document-defaults/printable",
    loadPage: () => import("./server/pages/OrganizationListReportPages").then((module) => module.FinancialDocumentDefaultsReportPage),
    unframed: true,
    auth: { required: true, minRole: "STANDARD" }
  },
  glReportingCategoriesPrintable: {
    id: "voyzu.organizationReports.page.glReportingCategories.printable",
    pageTitle: "General Ledger Reporting Categories",
    path: "/finance/reports/lists/general-ledger-reporting-categories/printable",
    loadPage: () => import("./server/pages/OrganizationListReportPages").then((module) => module.ReportingCategoriesReportPage),
    unframed: true,
    auth: { required: true, minRole: "STANDARD" }
  },
  inventoryItemPostingCodesPrintable: {
    id: "voyzu.organizationReports.page.inventoryItemPostingCodes.printable",
    pageTitle: "Inventory Item Posting Codes",
    path: "/finance/reports/lists/inventory-item-posting-codes/printable",
    loadPage: () => import("./server/pages/OrganizationListReportPages").then((module) => module.InventoryItemPostingCodesReportPage),
    unframed: true,
    auth: { required: true, minRole: "STANDARD" }
  },
  ledgerBackedAccountCodesPrintable: {
    id: "voyzu.organizationReports.page.ledgerBackedAccountCodes.printable",
    pageTitle: "Ledger Backed Account Codes",
    path: "/finance/reports/lists/ledger-backed-account-codes/printable",
    loadPage: () => import("./server/pages/OrganizationListReportPages").then((module) => module.LedgerBackedAccountCodesReportPage),
    unframed: true,
    auth: { required: true, minRole: "STANDARD" }
  },
  countryTaxSettingsPrintable: {
    id: "voyzu.organizationReports.page.countryTaxSettings.printable",
    pageTitle: "Country Tax Settings",
    path: "/finance/reports/lists/country-tax-settings/printable",
    loadPage: () => import("./server/pages/OrganizationListReportPages").then((module) => module.CountryTaxSettingsReportPage),
    unframed: true,
    auth: { required: true, minRole: "STANDARD" }
  }
} as const;
