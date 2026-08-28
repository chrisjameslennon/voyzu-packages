import type { VoyzuPackageNavigationGroup } from "@voyzu/types/framework";
import { pageRoutes as organizationGlAccountsPageRoutes } from "@voyzu/finance/organization-gl-accounts/pages.routes";
import { pageRoutes as organizationGlAccountCategoriesPageRoutes } from "@voyzu/finance/organization-gl-account-categories/pages.routes";
import { pageRoutes as organizationApControlAccountsPageRoutes } from "@voyzu/finance/organization-ap-control-accounts/pages.routes";
import { pageRoutes as organizationArControlAccountsPageRoutes } from "@voyzu/finance/organization-ar-control-accounts/pages.routes";
import { pageRoutes as organizationBankCashAccountsPageRoutes } from "@voyzu/finance/organization-bank-cash-accounts/pages.routes";
import { pageRoutes as organizationTaxControlAccountsPageRoutes } from "@voyzu/finance/organization-tax-control-accounts/pages.routes";
import { pageRoutes as organizationInventoryControlAccountsPageRoutes } from "@voyzu/finance/organization-inventory-control-accounts/pages.routes";
import { pageRoutes as organizationFinancialDocumentTypesPageRoutes } from "@voyzu/finance/organization-financial-document-types/pages.routes";
import { pageRoutes as organizationFinancialDocumentDefaultsPageRoutes } from "@voyzu/finance/organization-financial-document-defaults/pages.routes";
import { pageRoutes as organizationInventoryItemPostingProfilesPageRoutes } from "@voyzu/finance/organization-inventory-item-posting-profiles/pages.routes";
import { pageRoutes as organizationDimensionsPageRoutes } from "@voyzu/finance/organization-dimensions/pages.routes";
import { pageRoutes as organizationReportsPageRoutes } from "@voyzu/finance/organization-reports/pages.routes";
import { pageRoutes as financeCompaniesPageRoutes } from "@voyzu/finance/finance-companies/pages.routes";
import { pageRoutes as countryTaxSettingsPageRoutes } from "@voyzu/finance/country-tax-settings/pages.routes";

export const financeTemplateLeftNav = [
  {
    label: "Finance Admin",
    items: [
      { label: "Financial Entities", icon: "domain", routeId: financeCompaniesPageRoutes.list.id },
      { label: "Country Tax Settings", icon: "public", routeId: countryTaxSettingsPageRoutes.list.id },
    ],
  },
  {
    label: "Finance Template",
    items: [
      {
        label: "General Ledger",
        icon: "account_balance",
        path: "#organization-settings-general-ledger",
        children: [
          { label: "General Ledger Accounts", routeId: organizationGlAccountsPageRoutes.list.id },
          { label: "Reporting Categories", routeId: organizationGlAccountCategoriesPageRoutes.list.id },
        ],
      },
      {
        label: "Control Accounts",
        icon: "account_tree",
        path: "#organization-settings-control-accounts",
        children: [
          { label: "Accounts Payable Control Accounts", routeId: organizationApControlAccountsPageRoutes.list.id },
          { label: "Accounts Receivable Control Accounts", routeId: organizationArControlAccountsPageRoutes.list.id },
          { label: "Bank / Cash Accounts", routeId: organizationBankCashAccountsPageRoutes.list.id },
          { label: "Tax Control Accounts", routeId: organizationTaxControlAccountsPageRoutes.list.id },
          { label: "Inventory Control Accounts", routeId: organizationInventoryControlAccountsPageRoutes.list.id },
        ],
      },
      { label: "Dimensions", icon: "category", routeId: organizationDimensionsPageRoutes.list.id },
    ],
  },
  {
    label: "Integration",
    items: [
      {
        label: "Inventory",
        icon: "package_2",
        path: "#integration-inventory",
        children: [
          { label: "Item Posting Profiles", routeId: organizationInventoryItemPostingProfilesPageRoutes.list.id },
        ],
      },
      {
        label: "Advanced",
        icon: "tune",
        path: "#integration-advanced",
        children: [
          { label: "Financial Document Types", routeId: organizationFinancialDocumentTypesPageRoutes.list.id },
          { label: "Financial Document Defaults", routeId: organizationFinancialDocumentDefaultsPageRoutes.list.id },
        ],
      },
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
          { label: "Country Tax Settings", routeId: organizationReportsPageRoutes.countryTaxSettings.id },
          { label: "Dimensions", routeId: organizationReportsPageRoutes.dimensions.id },
          { label: "Financial Document Defaults", routeId: organizationReportsPageRoutes.financialDocumentDefaults.id },
          { label: "Financial Document Types", routeId: organizationReportsPageRoutes.financialDocumentTypes.id },
          { label: "General Ledger Accounts", routeId: organizationReportsPageRoutes.glAccounts.id },
          { label: "General Ledger Reporting Categories", routeId: organizationReportsPageRoutes.glReportingCategories.id },
          { label: "Inventory Item Posting Codes", routeId: organizationReportsPageRoutes.inventoryItemPostingCodes.id },
          { label: "Ledger Backed Account Codes", routeId: organizationReportsPageRoutes.ledgerBackedAccountCodes.id },
        ],
      },
    ],
  },
] as const satisfies readonly VoyzuPackageNavigationGroup[];

export default financeTemplateLeftNav;
