import type { VoyzuPackageNavigationGroup } from "@voyzu/types/framework";
import { pageRoutes as journalsPageRoutes } from "@voyzu/finance/journals/pages.routes";
import { pageRoutes as companyReportsPageRoutes } from "@voyzu/finance/company-reports/pages.routes";
import { pageRoutes as arSubledgerLedgerEntriesPageRoutes } from "@voyzu/finance/ar-subledger-ledger-entries/pages.routes";
import { pageRoutes as arSubledgerLedgerEntryEnquiryPageRoutes } from "@voyzu/finance/ar-subledger-ledger-entry-enquiry/pages.routes";
import { pageRoutes as arSubledgerCounterpartiesPageRoutes } from "@voyzu/finance/ar-subledger-counterparties/pages.routes";
import { pageRoutes as arSubledgerStatementsPageRoutes } from "@voyzu/finance/ar-subledger-statements/pages.routes";
import { pageRoutes as arSubledgerInvoicesPageRoutes } from "@voyzu/finance/ar-subledger-invoices/pages.routes";
import { pageRoutes as apSubledgerLedgerEntriesPageRoutes } from "@voyzu/finance/ap-subledger-ledger-entries/pages.routes";
import { pageRoutes as apSubledgerLedgerEntryEnquiryPageRoutes } from "@voyzu/finance/ap-subledger-ledger-entry-enquiry/pages.routes";
import { pageRoutes as apSubledgerCounterpartiesPageRoutes } from "@voyzu/finance/ap-subledger-counterparties/pages.routes";
import { pageRoutes as apSubledgerStatementsPageRoutes } from "@voyzu/finance/ap-subledger-statements/pages.routes";
import { pageRoutes as apSubledgerBillsPageRoutes } from "@voyzu/finance/ap-subledger-bills/pages.routes";
import { pageRoutes as taxLedgerPageRoutes } from "@voyzu/finance/tax-ledger/pages.routes";
import { pageRoutes as inventoryLedgerPageRoutes } from "@voyzu/finance/inventory-ledger/pages.routes";
import { pageRoutes as financialYearsPageRoutes } from "@voyzu/finance/financial-years/pages.routes";
import { pageRoutes as companyGlAccountsPageRoutes } from "@voyzu/finance/company-gl-accounts/pages.routes";
import { pageRoutes as companyGlAccountCategoriesPageRoutes } from "@voyzu/finance/company-gl-account-categories/pages.routes";
import { pageRoutes as companyApControlAccountsPageRoutes } from "@voyzu/finance/company-ap-control-accounts/pages.routes";
import { pageRoutes as companyArControlAccountsPageRoutes } from "@voyzu/finance/company-ar-control-accounts/pages.routes";
import { pageRoutes as companyBankCashAccountsPageRoutes } from "@voyzu/finance/company-bank-cash-accounts/pages.routes";
import { pageRoutes as companyTaxControlAccountsPageRoutes } from "@voyzu/finance/company-tax-control-accounts/pages.routes";
import { pageRoutes as companyInventoryControlAccountsPageRoutes } from "@voyzu/finance/company-inventory-control-accounts/pages.routes";
import { pageRoutes as companyFinancialDocumentTypesPageRoutes } from "@voyzu/finance/company-financial-document-types/pages.routes";
import { pageRoutes as companyFinancialDocumentDefaultsPageRoutes } from "@voyzu/finance/company-financial-document-defaults/pages.routes";
import { pageRoutes as companyInventoryItemPostingProfilesPageRoutes } from "@voyzu/finance/company-inventory-item-posting-profiles/pages.routes";
import { pageRoutes as companyInventoryItemPostingProfileAssignmentsPageRoutes } from "@voyzu/finance/company-inventory-item-posting-profile-assignments/pages.routes";
import { pageRoutes as companyDimensionsPageRoutes } from "@voyzu/finance/company-dimensions/pages.routes";

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
            routeId: journalsPageRoutes.list.id,
          },
          {
            label: "Account Activity",
            routeId: companyReportsPageRoutes.accountActivity.id,
          },
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
              { label: "Ledger Entries", routeId: arSubledgerLedgerEntriesPageRoutes.list.id },
              { label: "Ledger Entry Enquiry", routeId: arSubledgerLedgerEntryEnquiryPageRoutes.list.id },
              { label: "Counterparties", routeId: arSubledgerCounterpartiesPageRoutes.list.id },
              { label: "Statements", routeId: arSubledgerStatementsPageRoutes.list.id },
              { label: "Invoices", routeId: arSubledgerInvoicesPageRoutes.list.id },
            ],
          },
          {
            label: "Accounts Payable",
            path: "/finance/subledgers/ap/ledger-entries",
            children: [
              { label: "Ledger Entries", routeId: apSubledgerLedgerEntriesPageRoutes.list.id },
              { label: "Ledger Entry Enquiry", routeId: apSubledgerLedgerEntryEnquiryPageRoutes.list.id },
              { label: "Counterparties", routeId: apSubledgerCounterpartiesPageRoutes.list.id },
              { label: "Statements", routeId: apSubledgerStatementsPageRoutes.list.id },
              { label: "Bills", routeId: apSubledgerBillsPageRoutes.list.id },
            ],
          },
          {
            label: "Tax Ledger",
            path: "/finance/subledgers/tax/ledger-entries",
            children: [
              { label: "Ledger Entries", routeId: taxLedgerPageRoutes.list.id },
            ],
          },
          {
            label: "Inventory Ledger",
            path: "/finance/inventory/ledger",
            children: [
              { label: "Ledger Entries", routeId: inventoryLedgerPageRoutes.list.id },
            ],
          },
        ],
      },
      {
        label: "Financial Periods",
        icon: "calendar_month",
        routeId: financialYearsPageRoutes.list.id,
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
              { label: "General Ledger Accounts", routeId: companyGlAccountsPageRoutes.list.id },
              { label: "Reporting Categories", routeId: companyGlAccountCategoriesPageRoutes.list.id },
            ],
          },
          {
            label: "Control Accounts",
            path: "#finance-settings-control-accounts",
            children: [
              { label: "Accounts Payable Control Accounts", routeId: companyApControlAccountsPageRoutes.list.id },
              { label: "Accounts Receivable Control Accounts", routeId: companyArControlAccountsPageRoutes.list.id },
              { label: "Bank / Cash Accounts", routeId: companyBankCashAccountsPageRoutes.list.id },
              { label: "Tax Control Accounts", routeId: companyTaxControlAccountsPageRoutes.list.id },
              { label: "Inventory Control Accounts", routeId: companyInventoryControlAccountsPageRoutes.list.id },
            ],
          },
          {
            label: "Integration",
            path: "#finance-settings-integration",
            children: [
              { label: "Financial Document Types", routeId: companyFinancialDocumentTypesPageRoutes.list.id },
              { label: "Financial Document Defaults", routeId: companyFinancialDocumentDefaultsPageRoutes.list.id },
              { label: "Item Posting Profiles", routeId: companyInventoryItemPostingProfilesPageRoutes.list.id },
              { label: "Posting Profile Assignments", routeId: companyInventoryItemPostingProfileAssignmentsPageRoutes.list.id },
            ],
          },
          { label: "Dimensions", routeId: companyDimensionsPageRoutes.list.id },
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
            routeId: companyReportsPageRoutes.balanceSheet.id,
          },
          { label: "Tax Position", routeId: companyReportsPageRoutes.taxPosition.id },
        ],
      },
      {
        label: "Movement",
        icon: "trending_up",
        path: "#finance-reports-movement",
        children: [
          { label: "Profit & Loss", routeId: companyReportsPageRoutes.profitLoss.id },
          { label: "Profit & Loss Analysis", routeId: companyReportsPageRoutes.profitLossAnalysis.id },
          { label: "Bank / Cash Movement", routeId: companyReportsPageRoutes.bankCashMovement.id },
          { label: "Tax Return", routeId: companyReportsPageRoutes.taxActivity.id },
        ],
      },
      {
        label: "Reconciliation",
        icon: "rule",
        path: "#finance-reports-reconciliation",
        children: [
          { label: "Trial Balance", routeId: companyReportsPageRoutes.trialBalance.id },
          { label: "Tax Reconciliation", routeId: companyReportsPageRoutes.taxActivityReconciliation.id },
        ],
      },
      {
        label: "Audit",
        icon: "manage_search",
        path: "#finance-reports-audit",
        children: [
          { label: "Financial Integrity", routeId: companyReportsPageRoutes.financialIntegrity.id },
          { label: "Journal Entries", routeId: companyReportsPageRoutes.journalEntries.id },
          { label: "AR Subledger Entries", routeId: companyReportsPageRoutes.arSubledgerEntriesAudit.id },
          { label: "AP Subledger Entries", routeId: companyReportsPageRoutes.apSubledgerEntriesAudit.id },
          { label: "Inventory Ledger Entries", routeId: companyReportsPageRoutes.inventoryLedgerEntriesAudit.id },
          { label: "Tax Ledger Entries", routeId: companyReportsPageRoutes.taxLedgerEntriesAudit.id },
        ],
      },
    ],
  },
] as const satisfies readonly VoyzuPackageNavigationGroup[];

export default financeLeftNav;
