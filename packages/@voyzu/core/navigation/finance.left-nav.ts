import type { VoyzuPackageNavigationGroup } from "@voyzu/types/framework";
import { journalsModule } from "@voyzu/core/journals";
import { companyReportsModule } from "@voyzu/core/company-reports";
import { companyInventoryItemsModule } from "@voyzu/core/company-inventory-items";
import { companyInventoryCategoriesModule } from "@voyzu/core/company-inventory-categories";
import { arSubledgerLedgerEntriesModule } from "@voyzu/core/ar-subledger-ledger-entries";
import { arSubledgerLedgerEntryEnquiryModule } from "@voyzu/core/ar-subledger-ledger-entry-enquiry";
import { arSubledgerCounterpartiesModule } from "@voyzu/core/ar-subledger-counterparties";
import { arSubledgerStatementsModule } from "@voyzu/core/ar-subledger-statements";
import { arSubledgerInvoicesModule } from "@voyzu/core/ar-subledger-invoices";
import { apSubledgerLedgerEntriesModule } from "@voyzu/core/ap-subledger-ledger-entries";
import { apSubledgerLedgerEntryEnquiryModule } from "@voyzu/core/ap-subledger-ledger-entry-enquiry";
import { apSubledgerCounterpartiesModule } from "@voyzu/core/ap-subledger-counterparties";
import { apSubledgerStatementsModule } from "@voyzu/core/ap-subledger-statements";
import { apSubledgerBillsModule } from "@voyzu/core/ap-subledger-bills";
import { taxLedgerModule } from "@voyzu/core/tax-ledger";
import { inventoryLedgerModule } from "@voyzu/core/inventory-ledger";
import { financialYearsModule } from "@voyzu/core/financial-years";
import { companyGlAccountsModule } from "@voyzu/core/company-gl-accounts";
import { companyGlAccountCategoriesModule } from "@voyzu/core/company-gl-account-categories";
import { companyApControlAccountsModule } from "@voyzu/core/company-ap-control-accounts";
import { companyArControlAccountsModule } from "@voyzu/core/company-ar-control-accounts";
import { companyBankCashAccountsModule } from "@voyzu/core/company-bank-cash-accounts";
import { companyTaxControlAccountsModule } from "@voyzu/core/company-tax-control-accounts";
import { companyInventoryControlAccountsModule } from "@voyzu/core/company-inventory-control-accounts";
import { companyFinancialDocumentTypesModule } from "@voyzu/core/company-financial-document-types";
import { companyFinancialDocumentDefaultsModule } from "@voyzu/core/company-financial-document-defaults";
import { companyInventoryItemPostingProfilesModule } from "@voyzu/core/company-inventory-item-posting-profiles";
import { companyDimensionsModule } from "@voyzu/core/company-dimensions";

export const financeLeftNav = [
  {
    items: [
      {
        label: "Company General Ledger",
        icon: "account_balance",
        path: "/finance/journals",
        children: [
          {
            label: "Journal Entries",
            routeId: journalsModule.pageRoutes.list.id,
          },
          {
            label: "Account Activity",
            routeId: companyReportsModule.pageRoutes.accountActivity.id,
          },
        ],
      },
      {
        label: "Inventory",
        icon: "package_2",
        path: "#finance-inventory",
        children: [
          { label: "Items", routeId: companyInventoryItemsModule.pageRoutes.list.id },
          { label: "Categories", routeId: companyInventoryCategoriesModule.pageRoutes.list.id },
        ],
      },
      {
        label: "Supporting Ledgers",
        icon: "receipt_long",
        path: "#finance-subledgers",
        children: [
          {
            label: "Accounts Receivable",
            path: "/finance/subledgers/ar/ledger-entries",
            children: [
              { label: "Ledger Entries", routeId: arSubledgerLedgerEntriesModule.pageRoutes.list.id },
              { label: "Ledger Entry Enquiry", routeId: arSubledgerLedgerEntryEnquiryModule.pageRoutes.list.id },
              { label: "Counterparties", routeId: arSubledgerCounterpartiesModule.pageRoutes.list.id },
              { label: "Statements", routeId: arSubledgerStatementsModule.pageRoutes.list.id },
              { label: "Invoices", routeId: arSubledgerInvoicesModule.pageRoutes.list.id },
            ],
          },
          {
            label: "Accounts Payable",
            path: "/finance/subledgers/ap/ledger-entries",
            children: [
              { label: "Ledger Entries", routeId: apSubledgerLedgerEntriesModule.pageRoutes.list.id },
              { label: "Ledger Entry Enquiry", routeId: apSubledgerLedgerEntryEnquiryModule.pageRoutes.list.id },
              { label: "Counterparties", routeId: apSubledgerCounterpartiesModule.pageRoutes.list.id },
              { label: "Statements", routeId: apSubledgerStatementsModule.pageRoutes.list.id },
              { label: "Bills", routeId: apSubledgerBillsModule.pageRoutes.list.id },
            ],
          },
          {
            label: "Tax Ledger",
            path: "/finance/subledgers/tax/ledger-entries",
            children: [
              { label: "Ledger Entries", routeId: taxLedgerModule.pageRoutes.list.id },
            ],
          },
          {
            label: "Inventory Ledger",
            path: "/finance/inventory/ledger",
            children: [
              { label: "Ledger Entries", routeId: inventoryLedgerModule.pageRoutes.list.id },
            ],
          },
        ],
      },
      {
        label: "Financial Periods",
        icon: "calendar_month",
        routeId: financialYearsModule.pageRoutes.list.id,
      },
      {
        label: "Settings",
        icon: "settings",
        path: "#finance-settings",
        children: [
          {
            label: "General Ledger",
            path: "#finance-settings-general-ledger",
            children: [
              { label: "General Ledger Accounts", routeId: companyGlAccountsModule.pageRoutes.list.id },
              { label: "Reporting Categories", routeId: companyGlAccountCategoriesModule.pageRoutes.list.id },
            ],
          },
          {
            label: "Control Accounts",
            path: "#finance-settings-control-accounts",
            children: [
              { label: "Accounts Payable Control Accounts", routeId: companyApControlAccountsModule.pageRoutes.list.id },
              { label: "Accounts Receivable Control Accounts", routeId: companyArControlAccountsModule.pageRoutes.list.id },
              { label: "Bank / Cash Accounts", routeId: companyBankCashAccountsModule.pageRoutes.list.id },
              { label: "Tax Control Accounts", routeId: companyTaxControlAccountsModule.pageRoutes.list.id },
              { label: "Inventory Control Accounts", routeId: companyInventoryControlAccountsModule.pageRoutes.list.id },
            ],
          },
          {
            label: "Integration",
            path: "#finance-settings-integration",
            children: [
              { label: "Financial Document Types", routeId: companyFinancialDocumentTypesModule.pageRoutes.list.id },
              { label: "Financial Document Defaults", routeId: companyFinancialDocumentDefaultsModule.pageRoutes.list.id },
              { label: "Item Posting Profiles", routeId: companyInventoryItemPostingProfilesModule.pageRoutes.list.id },
            ],
          },
          { label: "Dimensions", routeId: companyDimensionsModule.pageRoutes.list.id },
        ],
      },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        label: "Position",
        icon: "account_balance_wallet",
        path: "#finance-reports-position",
        children: [
          {
            label: "Balance Sheet",
            routeId: companyReportsModule.pageRoutes.balanceSheet.id,
          },
          { label: "Tax Position", routeId: companyReportsModule.pageRoutes.taxPosition.id },
        ],
      },
      {
        label: "Movement",
        icon: "trending_up",
        path: "#finance-reports-movement",
        children: [
          { label: "Profit & Loss", routeId: companyReportsModule.pageRoutes.profitLoss.id },
          { label: "Profit & Loss Analysis", routeId: companyReportsModule.pageRoutes.profitLossAnalysis.id },
          { label: "Bank / Cash Movement", routeId: companyReportsModule.pageRoutes.bankCashMovement.id },
          { label: "Tax Return", routeId: companyReportsModule.pageRoutes.taxActivity.id },
        ],
      },
      {
        label: "Reconciliation",
        icon: "rule",
        path: "#finance-reports-reconciliation",
        children: [
          { label: "Trial Balance", routeId: companyReportsModule.pageRoutes.trialBalance.id },
          { label: "Tax Reconciliation", routeId: companyReportsModule.pageRoutes.taxActivityReconciliation.id },
        ],
      },
      {
        label: "Audit",
        icon: "manage_search",
        path: "#finance-reports-audit",
        children: [
          { label: "Financial Integrity", routeId: companyReportsModule.pageRoutes.financialIntegrity.id },
          { label: "Journal Entries", routeId: companyReportsModule.pageRoutes.journalEntries.id },
          { label: "AR Subledger Entries", routeId: companyReportsModule.pageRoutes.arSubledgerEntriesAudit.id },
          { label: "AP Subledger Entries", routeId: companyReportsModule.pageRoutes.apSubledgerEntriesAudit.id },
          { label: "Inventory Ledger Entries", routeId: companyReportsModule.pageRoutes.inventoryLedgerEntriesAudit.id },
          { label: "Tax Ledger Entries", routeId: companyReportsModule.pageRoutes.taxLedgerEntriesAudit.id },
        ],
      },
    ],
  },
] as const satisfies readonly VoyzuPackageNavigationGroup[];

export default financeLeftNav;
