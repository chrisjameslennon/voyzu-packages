import type { VoyzuPackageNavigationGroup } from "@voyzu/types/framework";

export const financeLeftNav = [
  {
    label: "Operations",
    items: [
      {
        label: "Accounts Receivable",
        icon: "receipt_long",
        path: "/finance/operations/accounts-receivable/invoices",
        children: [
          { label: "Invoices", path: "/finance/operations/accounts-receivable/invoices" },
          { label: "Sales Items", path: "/finance/operations/accounts-receivable/sales-items" },
          { label: "Statements", path: "/finance/operations/accounts-receivable/statements" },
          { label: "Counterparties", path: "/finance/operations/accounts-receivable/counterparties" },
        ],
      },
      {
        label: "Accounts Payable",
        icon: "payments",
        path: "/finance/operations/accounts-payable/bills",
        children: [
          { label: "Bills", path: "/finance/operations/accounts-payable/bills" },
          { label: "Purchase Items", path: "/finance/operations/accounts-payable/purchase-items" },
          { label: "Statements", path: "/finance/operations/accounts-payable/statements" },
          { label: "Counterparties", path: "/finance/operations/accounts-payable/counterparties" },
        ],
      },
    ],
  },
  {
    label: "Integration",
    items: [
      {
        label: "Financial Document Types",
        icon: "description",
        routeId: "voyzu.company-financial-document-types.page.list",
      },
      {
        label: "Inventory",
        icon: "inventory_2",
        path: "/finance/integration/inventory-processing/rules",
        children: [
          { label: "Item Valuation", path: "/finance/inventory/item-valuation" },
          { label: "Movement Processing Rules", routeId: "voyzu.inventory-processing.page.rules" },
          { label: "Inventory Transactions", routeId: "voyzu.inventory-processing.page.inventory-transactions" },
        ],
      },
    ],
  },
  {
    label: "Accounting",
    items: [
      {
        label: "Company General Ledger",
        icon: "account_balance",
        path: "/finance/journals",
        children: [
          {
            label: "Journal Entries",
            routeId: "voyzu.journals.page.list",
          },
          {
            label: "Account Activity",
            routeId: "voyzu.companyReports.page.accountActivity",
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
              { label: "Ledger Entries", routeId: "voyzu.ar-subledger-ledger-entries.page.list" },
              { label: "Ledger Entry Enquiry", routeId: "voyzu.ar-subledger-ledger-entry-enquiry.page.list" },
              { label: "Counterparties", routeId: "voyzu.ar-subledger-counterparties.page.list" },
              { label: "Statements", routeId: "voyzu.ar-subledger-statements.page.list" },
              { label: "Invoices", routeId: "voyzu.ar-subledger-invoices.page.list" },
            ],
          },
          {
            label: "Accounts Payable",
            path: "/finance/subledgers/ap/ledger-entries",
            children: [
              { label: "Ledger Entries", routeId: "voyzu.ap-subledger-ledger-entries.page.list" },
              { label: "Ledger Entry Enquiry", routeId: "voyzu.ap-subledger-ledger-entry-enquiry.page.list" },
              { label: "Counterparties", routeId: "voyzu.ap-subledger-counterparties.page.list" },
              { label: "Statements", routeId: "voyzu.ap-subledger-statements.page.list" },
              { label: "Bills", routeId: "voyzu.ap-subledger-bills.page.list" },
            ],
          },
          {
            label: "Tax Ledger",
            path: "/finance/subledgers/tax/ledger-entries",
            children: [
              { label: "Ledger Entries", routeId: "voyzu.tax-ledger.page.list" },
            ],
          },
          {
            label: "Inventory Ledger",
            path: "/finance/inventory/ledger",
            children: [
              { label: "Ledger Entries", routeId: "voyzu.inventory-ledger.page.list" },
              { label: "Stock Valuation", routeId: "voyzu.inventory-ledger.page.valuation" },
            ],
          },
        ],
      },
      {
        label: "Financial Periods",
        icon: "calendar_month",
        routeId: "voyzu.financial-years.page.list",
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
              { label: "General Ledger Accounts", routeId: "voyzu.company-gl-accounts.page.list" },
              { label: "Reporting Categories", routeId: "voyzu.company-gl-account-categories.page.list" },
            ],
          },
          {
            label: "Control Accounts",
            path: "#finance-settings-control-accounts",
            children: [
              { label: "Accounts Payable Control Accounts", routeId: "voyzu.company-ap-control-accounts.page.list" },
              { label: "Accounts Receivable Control Accounts", routeId: "voyzu.company-ar-control-accounts.page.list" },
              { label: "Bank / Cash Accounts", routeId: "voyzu.company-bank-cash-accounts.page.list" },
              { label: "Tax Control Accounts", routeId: "voyzu.company-tax-control-accounts.page.list" },
              { label: "Inventory Control Accounts", routeId: "voyzu.company-inventory-control-accounts.page.list" },
            ],
          },
          {
            label: "Integration",
            path: "#finance-settings-integration",
            children: [
              { label: "Financial Document Defaults", routeId: "voyzu.company-financial-document-defaults.page.list" },
              { label: "Item Posting Profiles", routeId: "voyzu.company-inventory-item-posting-profiles.page.list" },
              { label: "Posting Profile Assignments", routeId: "voyzu.company-inventory-item-posting-profile-assignments.page.list" },
            ],
          },
          { label: "Dimensions", routeId: "voyzu.company-dimensions.page.list" },
        ],
      },
      {
        label: "Global Settings",
        icon: "public",
        path: "#finance-global-settings",
        children: [{ label: "Country Tax Settings", routeId: "voyzu.countryTaxSettings.page.list" }],
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
            routeId: "voyzu.companyReports.page.balanceSheet",
          },
          { label: "Tax Position", routeId: "voyzu.companyReports.page.taxPosition" },
        ],
      },
      {
        label: "Movement",
        icon: "trending_up",
        path: "#finance-reports-movement",
        children: [
          { label: "Profit & Loss", routeId: "voyzu.companyReports.page.profitLoss" },
          { label: "Profit & Loss Analysis", routeId: "voyzu.companyReports.page.profitLossAnalysis" },
          { label: "Bank / Cash Movement", routeId: "voyzu.companyReports.page.bankCashMovement" },
          { label: "Tax Return", routeId: "voyzu.companyReports.page.taxActivity" },
        ],
      },
      {
        label: "Reconciliation",
        icon: "rule",
        path: "#finance-reports-reconciliation",
        children: [
          { label: "Trial Balance", routeId: "voyzu.companyReports.page.trialBalance" },
          { label: "Tax Reconciliation", routeId: "voyzu.companyReports.page.taxActivityReconciliation" },
        ],
      },
      {
        label: "Audit",
        icon: "manage_search",
        path: "#finance-reports-audit",
        children: [
          { label: "Financial Integrity", routeId: "voyzu.companyReports.page.financialIntegrity" },
          { label: "Journal Entries", routeId: "voyzu.companyReports.page.journalEntries" },
          { label: "AR Subledger Entries", routeId: "voyzu.companyReports.page.arSubledgerEntriesAudit" },
          { label: "AP Subledger Entries", routeId: "voyzu.companyReports.page.apSubledgerEntriesAudit" },
          { label: "Inventory Ledger Entries", routeId: "voyzu.companyReports.page.inventoryLedgerEntriesAudit" },
          { label: "Tax Ledger Entries", routeId: "voyzu.companyReports.page.taxLedgerEntriesAudit" },
        ],
      },
    ],
  },
] as const satisfies readonly VoyzuPackageNavigationGroup[];

export default financeLeftNav;
