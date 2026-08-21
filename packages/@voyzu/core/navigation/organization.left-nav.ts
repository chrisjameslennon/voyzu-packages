import type { VoyzuPackageNavigationGroup } from "@voyzu/types/framework";
import { organizationGlAccountsModule } from "@voyzu/core/organization-gl-accounts";
import { organizationGlAccountCategoriesModule } from "@voyzu/core/organization-gl-account-categories";
import { organizationApControlAccountsModule } from "@voyzu/core/organization-ap-control-accounts";
import { organizationArControlAccountsModule } from "@voyzu/core/organization-ar-control-accounts";
import { organizationBankCashAccountsModule } from "@voyzu/core/organization-bank-cash-accounts";
import { organizationTaxControlAccountsModule } from "@voyzu/core/organization-tax-control-accounts";
import { organizationInventoryControlAccountsModule } from "@voyzu/core/organization-inventory-control-accounts";
import { organizationFinancialDocumentTypesModule } from "@voyzu/core/organization-financial-document-types";
import { organizationFinancialDocumentDefaultsModule } from "@voyzu/core/organization-financial-document-defaults";
import { organizationInventoryItemPostingProfilesModule } from "@voyzu/core/organization-inventory-item-posting-profiles";
import { organizationDimensionsModule } from "@voyzu/core/organization-dimensions";
import { organizationInventoryCategoriesModule } from "@voyzu/core/organization-inventory-categories";
import { organizationInventoryItemsModule } from "@voyzu/core/organization-inventory-items";
import { organizationReportsModule } from "@voyzu/core/organization-reports";

export const financeTemplateLeftNav = [
  {
    label: "Finance Template",
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
    label: "Reports",
    items: [
      {
        label: "Lists",
        icon: "format_list_bulleted",
        path: "#lists",
        children: [
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
] as const satisfies readonly VoyzuPackageNavigationGroup[];

export default financeTemplateLeftNav;
