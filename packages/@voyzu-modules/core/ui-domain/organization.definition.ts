import { organizationBankCashAccountsModule } from "@voyzu-modules/core/organization-bank-cash-accounts";
import {
  OrganizationBankCashAccountDetailPage,
  OrganizationBankCashAccountsListPage,
} from "@voyzu-modules/core/organization-bank-cash-accounts/server";
import { companiesModule } from "@voyzu-modules/core/companies";
import { CompanyDetailPage } from "@voyzu-modules/core/companies/server";
import { CompaniesListPage } from "@voyzu-modules/core/companies/server";
import { organizationApControlAccountsModule } from "@voyzu-modules/core/organization-ap-control-accounts";
import {
  OrganizationApControlAccountDetailPage,
  OrganizationApControlAccountsListPage,
} from "@voyzu-modules/core/organization-ap-control-accounts/server";
import { organizationArControlAccountsModule } from "@voyzu-modules/core/organization-ar-control-accounts";
import {
  OrganizationArControlAccountDetailPage,
  OrganizationArControlAccountsListPage,
} from "@voyzu-modules/core/organization-ar-control-accounts/server";
import { countriesModule } from "@voyzu-modules/core/countries";
import { CountriesListPage, CountryDetailPage } from "@voyzu-modules/core/countries/server";
import { currenciesModule } from "@voyzu-modules/core/currencies";
import { CurrenciesListPage, CurrencyDetailPage } from "@voyzu-modules/core/currencies/server";
import { organizationDimensionsModule } from "@voyzu-modules/core/organization-dimensions";
import { OrganizationDimensionDetailPage, OrganizationDimensionsListPage } from "@voyzu-modules/core/organization-dimensions/server";
import { organizationFinancialDocumentTypesModule } from "@voyzu-modules/core/organization-financial-document-types";
import { OrganizationFinancialDocumentTypeDetailPage, OrganizationFinancialDocumentTypesListPage } from "@voyzu-modules/core/organization-financial-document-types/server";
import { organizationGlAccountCategoriesModule } from "@voyzu-modules/core/organization-gl-account-categories";
import {
  OrganizationGlAccountCategoriesListPage,
  OrganizationGlAccountCategoryDetailPage,
} from "@voyzu-modules/core/organization-gl-account-categories/server";
import { organizationGlAccountsModule } from "@voyzu-modules/core/organization-gl-accounts";
import {
  OrganizationGlAccountDetailPage,
  OrganizationGlAccountsListPage,
} from "@voyzu-modules/core/organization-gl-accounts/server";
import { organizationInventoryCategoriesModule } from "@voyzu-modules/core/organization-inventory-categories";
import { OrganizationInventoryCategoriesListPage, OrganizationInventoryCategoryDetailPage } from "@voyzu-modules/core/organization-inventory-categories/server";
import { organizationInventoryControlAccountsModule } from "@voyzu-modules/core/organization-inventory-control-accounts";
import { OrganizationInventoryControlAccountDetailPage, OrganizationInventoryControlAccountsPage } from "@voyzu-modules/core/organization-inventory-control-accounts/server";
import { organizationInventoryItemsModule } from "@voyzu-modules/core/organization-inventory-items";
import { OrganizationInventoryItemDetailPage, OrganizationInventoryItemsListPage } from "@voyzu-modules/core/organization-inventory-items/server";
import { organizationInventoryItemPostingProfilesModule } from "@voyzu-modules/core/organization-inventory-item-posting-profiles";
import { OrganizationInventoryItemPostingProfileDetailPage, OrganizationInventoryItemPostingProfilesListPage } from "@voyzu-modules/core/organization-inventory-item-posting-profiles/server";
import { organizationFinancialDocumentDefaultsModule } from "@voyzu-modules/core/organization-financial-document-defaults";
import { OrganizationFinancialDocumentDefaultDetailPage, OrganizationFinancialDocumentDefaultsListPage } from "@voyzu-modules/core/organization-financial-document-defaults/server";
import { organizationTaxControlAccountsModule } from "@voyzu-modules/core/organization-tax-control-accounts";
import { OrganizationTaxControlAccountDetailPage, OrganizationTaxControlAccountsPage } from "@voyzu-modules/core/organization-tax-control-accounts/server";
import { organizationAuditModule } from "@voyzu-modules/core/organization-audit";
import {
  OrganizationAuditEventDetailPage,
  OrganizationAuditEventsPage,
} from "@voyzu-modules/core/organization-audit/server";
import { organizationModule } from "@voyzu-modules/core/organization";
import { organizationReportsModule } from "@voyzu-modules/core/organization-reports";
import {
  CompaniesReportPage,
  CountriesReportPage,
  CountryTaxSettingsReportPage,
  CurrenciesReportPage,
  DimensionsReportPage,
  FinancialDocumentTypesReportPage,
  GlAccountsReportPage,
  InventoryCategoriesReportPage,
  InventoryItemsReportPage,
  InventoryItemPostingCodesReportPage,
  FinancialDocumentDefaultsReportPage,
  ReportingCategoriesReportPage,
  LedgerBackedAccountCodesReportPage,
} from "@voyzu-modules/core/organization-reports/server";
import { OrganizationPage } from "@voyzu-modules/core/organization/server";
import type { VoyzuSurfaceNavGroup, VoyzuSurfaceRoute } from "@voyzu/ui-surface/types";

const organizationAuth = { required: true, minRole: "ORGANIZATION_USER" } as const;


const organizationPageRouteDefinitions = [
  {
    ...organizationModule.pageRoutes.detail,
    path: "/organization",
    Page: OrganizationPage,
    breadcrumbBase: [],
  },
  {
    ...companiesModule.pageRoutes.list,
    path: "/organization/companies",
    Page: CompaniesListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
    ],
  },
  {
    ...companiesModule.pageRoutes.detail,
    path: "/organization/companies/[code]",
    Page: CompanyDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Companies",
        href: "/organization/companies",
      },
    ],
  },
  {
    ...organizationBankCashAccountsModule.pageRoutes.list,
    path: "/organization/bank-cash-accounts",
    Page: OrganizationBankCashAccountsListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Control Accounts",
      },
    ],
  },
  {
    ...organizationBankCashAccountsModule.pageRoutes.detail,
    path: "/organization/bank-cash-accounts/[code]",
    Page: OrganizationBankCashAccountDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Control Accounts",
      },
      {
        label: "Bank / Cash Accounts",
        href: "/organization/bank-cash-accounts",
      },
    ],
  },
  {
    ...organizationApControlAccountsModule.pageRoutes.list,
    path: "/organization/control-accounts/ap",
    Page: OrganizationApControlAccountsListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Control Accounts",
      },
    ],
  },
  {
    ...organizationApControlAccountsModule.pageRoutes.detail,
    path: "/organization/control-accounts/ap/[code]",
    Page: OrganizationApControlAccountDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Control Accounts",
      },
      {
        label: "Accounts Payable Control Accounts",
        href: "/organization/control-accounts/ap",
      },
    ],
  },
  {
    ...organizationArControlAccountsModule.pageRoutes.list,
    path: "/organization/control-accounts/ar",
    Page: OrganizationArControlAccountsListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Control Accounts",
      },
    ],
  },
  {
    ...organizationArControlAccountsModule.pageRoutes.detail,
    path: "/organization/control-accounts/ar/[code]",
    Page: OrganizationArControlAccountDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Control Accounts",
      },
      {
        label: "Accounts Receivable Control Accounts",
        href: "/organization/control-accounts/ar",
      },
    ],
  },
  {
    ...organizationGlAccountsModule.pageRoutes.list,
    path: "/organization/general-ledger-accounts",
    Page: OrganizationGlAccountsListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "General Ledger",
      },
    ],
  },
  {
    ...organizationGlAccountsModule.pageRoutes.detail,
    path: "/organization/general-ledger-accounts/[code]",
    Page: OrganizationGlAccountDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "General Ledger",
      },
      {
        label: "General Ledger Accounts",
        href: "/organization/general-ledger-accounts",
      },
    ],
  },
  {
    ...organizationGlAccountCategoriesModule.pageRoutes.list,
    path: "/organization/chart-of-accounts/reporting-categories",
    Page: OrganizationGlAccountCategoriesListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "General Ledger",
      },
    ],
  },
  {
    ...organizationGlAccountCategoriesModule.pageRoutes.detail,
    path: "/organization/chart-of-accounts/reporting-categories/[code]",
    Page: OrganizationGlAccountCategoryDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "General Ledger",
      },
      {
        label: "Reporting Categories",
        href: "/organization/chart-of-accounts/reporting-categories",
      },
    ],
  },
  {
    ...organizationFinancialDocumentTypesModule.pageRoutes.list,
    path: "/organization/financial-document-types",
    Page: OrganizationFinancialDocumentTypesListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Integration",
      },
    ],
  },
  {
    ...organizationFinancialDocumentTypesModule.pageRoutes.detail,
    path: "/organization/financial-document-types/[code]",
    Page: OrganizationFinancialDocumentTypeDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Integration",
      },
      {
        label: "Financial Document Types",
        href: "/organization/financial-document-types",
      },
    ],
  },
  {
    ...organizationFinancialDocumentDefaultsModule.pageRoutes.list,
    path: "/organization/financial-document-defaults",
    Page: OrganizationFinancialDocumentDefaultsListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Integration",
      },
    ],
  },
  {
    ...organizationFinancialDocumentDefaultsModule.pageRoutes.detail,
    path: "/organization/financial-document-defaults/[code]",
    Page: OrganizationFinancialDocumentDefaultDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Integration",
      },
      {
        label: "Financial Document Defaults",
        href: "/organization/financial-document-defaults",
      },
    ],
  },
  {
    ...organizationDimensionsModule.pageRoutes.list,
    path: "/organization/dimensions",
    Page: OrganizationDimensionsListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
    ],
  },
  {
    ...organizationDimensionsModule.pageRoutes.detail,
    path: "/organization/dimensions/[code]",
    Page: OrganizationDimensionDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Dimensions",
        href: "/organization/dimensions",
      },
    ],
  },
  {
    ...countriesModule.pageRoutes.list,
    path: "/organization/countries",
    Page: CountriesListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Localization",
      },
    ],
  },
  {
    ...countriesModule.pageRoutes.detail,
    path: "/organization/countries/[code]",
    Page: CountryDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Localization",
      },
      {
        label: "Countries",
        href: "/organization/countries",
      },
    ],
  },
  {
    ...currenciesModule.pageRoutes.list,
    path: "/organization/currencies",
    Page: CurrenciesListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Localization",
      },
    ],
  },
  {
    ...currenciesModule.pageRoutes.detail,
    path: "/organization/currencies/[code]",
    Page: CurrencyDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Localization",
      },
      {
        label: "Currencies",
        href: "/organization/currencies",
      },
    ],
  },
  {
    ...organizationTaxControlAccountsModule.pageRoutes.list,
    path: "/organization/control-accounts/tax",
    Page: OrganizationTaxControlAccountsPage,
    breadcrumbBase: [
      { label: "Organization" },
      { label: "Standard Settings" },
      { label: "Control Accounts" },
    ],
  },
  {
    ...organizationTaxControlAccountsModule.pageRoutes.detail,
    path: "/organization/control-accounts/tax/[code]",
    Page: OrganizationTaxControlAccountDetailPage,
    breadcrumbBase: [
      { label: "Organization" },
      { label: "Standard Settings" },
      { label: "Control Accounts" },
      { label: "Tax Control Accounts", href: "/organization/control-accounts/tax" },
    ],
  },
  {
    ...organizationInventoryControlAccountsModule.pageRoutes.list,
    path: "/organization/control-accounts/inventory",
    Page: OrganizationInventoryControlAccountsPage,
    breadcrumbBase: [
      { label: "Organization" },
      { label: "Standard Settings" },
      { label: "Control Accounts" },
    ],
  },
  {
    ...organizationInventoryControlAccountsModule.pageRoutes.detail,
    path: "/organization/control-accounts/inventory/[code]",
    Page: OrganizationInventoryControlAccountDetailPage,
    breadcrumbBase: [
      { label: "Organization" },
      { label: "Standard Settings" },
      { label: "Control Accounts" },
      { label: "Inventory Control Accounts", href: "/organization/control-accounts/inventory" },
    ],
  },
  {
    ...organizationInventoryCategoriesModule.pageRoutes.list,
    path: "/organization/inventory/categories",
    Page: OrganizationInventoryCategoriesListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "New Company Defaults",
      },
      {
        label: "Inventory",
      },
    ],
  },
  {
    ...organizationInventoryCategoriesModule.pageRoutes.detail,
    path: "/organization/inventory/categories/[code]",
    Page: OrganizationInventoryCategoryDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "New Company Defaults",
      },
      {
        label: "Inventory",
      },
      {
        label: "Categories",
        href: "/organization/inventory/categories",
      },
    ],
  },
  {
    ...organizationInventoryItemsModule.pageRoutes.list,
    path: "/organization/inventory/items",
    Page: OrganizationInventoryItemsListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "New Company Defaults",
      },
      {
        label: "Inventory",
      },
    ],
  },
  {
    ...organizationInventoryItemsModule.pageRoutes.detail,
    path: "/organization/inventory/items/[code]",
    Page: OrganizationInventoryItemDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "New Company Defaults",
      },
      {
        label: "Inventory",
      },
      {
        label: "Items",
      },
    ],
  },
  {
    ...organizationInventoryItemPostingProfilesModule.pageRoutes.list,
    path: "/organization/inventory/item-posting-profiles",
    Page: OrganizationInventoryItemPostingProfilesListPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Integration",
      },
    ],
  },
  {
    ...organizationInventoryItemPostingProfilesModule.pageRoutes.detail,
    path: "/organization/inventory/item-posting-profiles/[code]",
    Page: OrganizationInventoryItemPostingProfileDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Standard Settings",
      },
      {
        label: "Integration",
      },
      {
        label: "Item Posting Profiles",
        href: "/organization/inventory/item-posting-profiles",
      },
    ],
  },
  {
    ...organizationAuditModule.pageRoutes.list,
    path: "/organization/audit",
    Page: OrganizationAuditEventsPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
    ],
  },
  {
    ...organizationAuditModule.pageRoutes.detail,
    path: "/organization/audit/[id]",
    Page: OrganizationAuditEventDetailPage,
    breadcrumbBase: [
      {
        label: "Organization",
      },
      {
        label: "Audit Log",
        href: "/organization/audit",
      },
    ],
  },
  {
    ...organizationReportsModule.pageRoutes.companies,
    path: "/organization/reports/lists/companies",
    Page: CompaniesReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
  },
  {
    ...organizationReportsModule.pageRoutes.countries,
    path: "/organization/reports/lists/countries",
    Page: CountriesReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
  },
  {
    ...organizationReportsModule.pageRoutes.countryTaxSettings,
    path: "/organization/reports/lists/country-tax-settings",
    Page: CountryTaxSettingsReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
  },
  {
    ...organizationReportsModule.pageRoutes.currencies,
    path: "/organization/reports/lists/currencies",
    Page: CurrenciesReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
  },
  {
    ...organizationReportsModule.pageRoutes.dimensions,
    path: "/organization/reports/lists/dimensions",
    Page: DimensionsReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
  },
  {
    ...organizationReportsModule.pageRoutes.financialDocumentTypes,
    path: "/organization/reports/lists/financial-document-types",
    Page: FinancialDocumentTypesReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
  },
  {
    ...organizationReportsModule.pageRoutes.glAccounts,
    path: "/organization/reports/lists/general-ledger-accounts",
    Page: GlAccountsReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
  },
  {
    ...organizationReportsModule.pageRoutes.inventoryCategories,
    path: "/organization/reports/lists/inventory-categories",
    Page: InventoryCategoriesReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
  },
  {
    ...organizationReportsModule.pageRoutes.inventoryItems,
    path: "/organization/reports/lists/inventory-items",
    Page: InventoryItemsReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
  },
  {
    ...organizationReportsModule.pageRoutes.financialDocumentDefaults,
    path: "/organization/reports/lists/financial-document-defaults",
    Page: FinancialDocumentDefaultsReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
  },
  {
    ...organizationReportsModule.pageRoutes.glReportingCategories,
    path: "/organization/reports/lists/general-ledger-reporting-categories",
    Page: ReportingCategoriesReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
  },
  {
    ...organizationReportsModule.pageRoutes.inventoryItemPostingCodes,
    path: "/organization/reports/lists/inventory-item-posting-codes",
    Page: InventoryItemPostingCodesReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
  },
  {
    ...organizationReportsModule.pageRoutes.ledgerBackedAccountCodes,
    path: "/organization/reports/lists/ledger-backed-account-codes",
    Page: LedgerBackedAccountCodesReportPage,
    breadcrumbBase: [{ label: "Organization" }, { label: "Reports" }, { label: "Lists" }],
  },
  {
    id: `${organizationReportsModule.pageRoutes.companies.id}.printable`,
    pageTitle: organizationReportsModule.pageRoutes.companies.pageTitle,
    path: "/organization/reports/lists/companies/printable",
    Page: CompaniesReportPage,
    unframed: true,
  },
  {
    id: `${organizationReportsModule.pageRoutes.countries.id}.printable`,
    pageTitle: organizationReportsModule.pageRoutes.countries.pageTitle,
    path: "/organization/reports/lists/countries/printable",
    Page: CountriesReportPage,
    unframed: true,
  },
  {
    id: `${organizationReportsModule.pageRoutes.currencies.id}.printable`,
    pageTitle: organizationReportsModule.pageRoutes.currencies.pageTitle,
    path: "/organization/reports/lists/currencies/printable",
    Page: CurrenciesReportPage,
    unframed: true,
  },
  {
    id: `${organizationReportsModule.pageRoutes.dimensions.id}.printable`,
    pageTitle: organizationReportsModule.pageRoutes.dimensions.pageTitle,
    path: "/organization/reports/lists/dimensions/printable",
    Page: DimensionsReportPage,
    unframed: true,
  },
  {
    id: `${organizationReportsModule.pageRoutes.financialDocumentTypes.id}.printable`,
    pageTitle: organizationReportsModule.pageRoutes.financialDocumentTypes.pageTitle,
    path: "/organization/reports/lists/financial-document-types/printable",
    Page: FinancialDocumentTypesReportPage,
    unframed: true,
  },
  {
    id: `${organizationReportsModule.pageRoutes.glAccounts.id}.printable`,
    pageTitle: organizationReportsModule.pageRoutes.glAccounts.pageTitle,
    path: "/organization/reports/lists/general-ledger-accounts/printable",
    Page: GlAccountsReportPage,
    unframed: true,
  },
  {
    id: `${organizationReportsModule.pageRoutes.inventoryCategories.id}.printable`,
    pageTitle: organizationReportsModule.pageRoutes.inventoryCategories.pageTitle,
    path: "/organization/reports/lists/inventory-categories/printable",
    Page: InventoryCategoriesReportPage,
    unframed: true,
  },
  {
    id: `${organizationReportsModule.pageRoutes.countryTaxSettings.id}.printable`,
    pageTitle: organizationReportsModule.pageRoutes.countryTaxSettings.pageTitle,
    path: "/organization/reports/lists/country-tax-settings/printable",
    Page: CountryTaxSettingsReportPage,
    unframed: true,
  },
  {
    id: `${organizationReportsModule.pageRoutes.inventoryItems.id}.printable`,
    pageTitle: organizationReportsModule.pageRoutes.inventoryItems.pageTitle,
    path: "/organization/reports/lists/inventory-items/printable",
    Page: InventoryItemsReportPage,
    unframed: true,
  },
  {
    id: `${organizationReportsModule.pageRoutes.financialDocumentDefaults.id}.printable`,
    pageTitle: organizationReportsModule.pageRoutes.financialDocumentDefaults.pageTitle,
    path: "/organization/reports/lists/financial-document-defaults/printable",
    Page: FinancialDocumentDefaultsReportPage,
    unframed: true,
  },
  {
    id: `${organizationReportsModule.pageRoutes.glReportingCategories.id}.printable`,
    pageTitle: organizationReportsModule.pageRoutes.glReportingCategories.pageTitle,
    path: "/organization/reports/lists/general-ledger-reporting-categories/printable",
    Page: ReportingCategoriesReportPage,
    unframed: true,
  },
  {
    id: `${organizationReportsModule.pageRoutes.inventoryItemPostingCodes.id}.printable`,
    pageTitle: organizationReportsModule.pageRoutes.inventoryItemPostingCodes.pageTitle,
    path: "/organization/reports/lists/inventory-item-posting-codes/printable",
    Page: InventoryItemPostingCodesReportPage,
    unframed: true,
  },
  {
    id: `${organizationReportsModule.pageRoutes.ledgerBackedAccountCodes.id}.printable`,
    pageTitle: organizationReportsModule.pageRoutes.ledgerBackedAccountCodes.pageTitle,
    path: "/organization/reports/lists/ledger-backed-account-codes/printable",
    Page: LedgerBackedAccountCodesReportPage,
    unframed: true,
  },
] satisfies VoyzuSurfaceRoute[];

export const organizationPageRoutes = organizationPageRouteDefinitions.map((route) => ({
  ...route,
  auth: organizationAuth,
})) satisfies VoyzuSurfaceRoute[];

export const organizationLeftNav = [
  {
    items: [
      {
        label: "Organization",
        icon: "hub",
        path: "/organization",
        exactMatch: true,
      },
      {
        label: "Companies",
        icon: "domain",
        routeId: companiesModule.pageRoutes.list.id,
      },
      {
        label: "Localization",
        icon: "globe",
        path: "#localization",
        children: [
          { label: "Countries", routeId: countriesModule.pageRoutes.list.id },
          { label: "Currencies", routeId: currenciesModule.pageRoutes.list.id },
        ],
      },
    ],
  },
  {
    label: "Organization Standard Settings",
    items: [
      {
        label: "General Ledger",
        icon: "account_balance",
        path: "#organization-settings-general-ledger",
        children: [
          { label: "General Ledger Accounts", routeId: organizationGlAccountsModule.pageRoutes.list.id },
          { label: "Reporting Categories", routeId: organizationGlAccountCategoriesModule.pageRoutes.list.id },
        ],
      },
      {
        label: "Control Accounts",
        icon: "account_tree",
        path: "#organization-settings-control-accounts",
        children: [
          { label: "Accounts Payable Control Accounts", routeId: organizationApControlAccountsModule.pageRoutes.list.id },
          { label: "Accounts Receivable Control Accounts", routeId: organizationArControlAccountsModule.pageRoutes.list.id },
          { label: "Bank / Cash Accounts", routeId: organizationBankCashAccountsModule.pageRoutes.list.id },
          { label: "Tax Control Accounts", routeId: organizationTaxControlAccountsModule.pageRoutes.list.id },
          { label: "Inventory Control Accounts", routeId: organizationInventoryControlAccountsModule.pageRoutes.list.id },
        ],
      },
      {
        label: "Integration",
        icon: "webhook",
        path: "#organization-settings-integration",
        children: [
          { label: "Financial Document Types", routeId: organizationFinancialDocumentTypesModule.pageRoutes.list.id },
          { label: "Financial Document Defaults", routeId: organizationFinancialDocumentDefaultsModule.pageRoutes.list.id },
          { label: "Item Posting Profiles", routeId: organizationInventoryItemPostingProfilesModule.pageRoutes.list.id },
        ],
      },
      { label: "Dimensions", icon: "category", routeId: organizationDimensionsModule.pageRoutes.list.id },
    ],
  },
  {
    label: "New Company Defaults",
    items: [
      {
        label: "Inventory",
        icon: "package_2",
        path: "#new-company-defaults-inventory",
        children: [
          { label: "Categories", routeId: organizationInventoryCategoriesModule.pageRoutes.list.id },
          { label: "Items", routeId: organizationInventoryItemsModule.pageRoutes.list.id },
        ],
      },
    ],
  },
  {
    label: "Audit",
    items: [
      { label: "Audit Log", icon: "history", routeId: organizationAuditModule.pageRoutes.list.id },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        label: "Lists",
        icon: "format_list_bulleted",
        path: "#lists",
        children: [
          { label: "Companies", routeId: organizationReportsModule.pageRoutes.companies.id },
          { label: "Countries", routeId: organizationReportsModule.pageRoutes.countries.id },
          { label: "Country Tax Settings", routeId: organizationReportsModule.pageRoutes.countryTaxSettings.id },
          { label: "Currencies", routeId: organizationReportsModule.pageRoutes.currencies.id },
          { label: "Dimensions", routeId: organizationReportsModule.pageRoutes.dimensions.id },
          { label: "Financial Document Defaults", routeId: organizationReportsModule.pageRoutes.financialDocumentDefaults.id },
          { label: "Financial Document Types", routeId: organizationReportsModule.pageRoutes.financialDocumentTypes.id },
          { label: "General Ledger Accounts", routeId: organizationReportsModule.pageRoutes.glAccounts.id },
          { label: "General Ledger Reporting Categories", routeId: organizationReportsModule.pageRoutes.glReportingCategories.id },
          { label: "Inventory Categories", routeId: organizationReportsModule.pageRoutes.inventoryCategories.id },
          { label: "Inventory Items", routeId: organizationReportsModule.pageRoutes.inventoryItems.id },
          { label: "Inventory Item Posting Codes", routeId: organizationReportsModule.pageRoutes.inventoryItemPostingCodes.id },
          { label: "Ledger Backed Account Codes", routeId: organizationReportsModule.pageRoutes.ledgerBackedAccountCodes.id },
        ],
      },
    ],
  },
] satisfies VoyzuSurfaceNavGroup[];

