import { companyFinancePageAuth } from "@voyzu/finance/common/page-auth";

export const pageRoutes = {
  balanceSheet: {
    id: "voyzu.companyReports.page.balanceSheet",
    pageTitle: "Balance Sheet",
    helpPath: "modules-help/company-ledger/balance-sheet",
    path: "/finance/reports/balance-sheet",
    loadPage: () => import("./balance-sheet/server/pages/BalanceSheetReportPage").then((module) => module.BalanceSheetReportPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Reports" },
    ],
    auth: companyFinancePageAuth
  },
  trialBalance: {
    id: "voyzu.companyReports.page.trialBalance",
    pageTitle: "Trial Balance",
    helpPath: "modules-help/company-ledger/trial-balance",
    path: "/finance/reports/trial-balance",
    loadPage: () => import("./trial-balance/server/pages/TrialBalanceReportPage").then((module) => module.TrialBalanceReportPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Reports" },
    ],
    auth: companyFinancePageAuth
  },
  taxPosition: {
    id: "voyzu.companyReports.page.taxPosition",
    pageTitle: "Tax Position",
    helpPath: "modules-help/company-ledger/tax-position",
    path: "/finance/reports/tax-position",
    loadPage: () => import("./tax-position/server/pages/TaxPositionReportPage").then((module) => module.TaxPositionReportPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Reports" },
    ],
    auth: companyFinancePageAuth
  },
  bankCashMovement: {
    id: "voyzu.companyReports.page.bankCashMovement",
    pageTitle: "Bank / Cash Movement",
    helpPath: "modules-help/company-ledger/bank-cash-movement",
    path: "/finance/reports/bank-cash-movement",
    loadPage: () => import("./bank-cash-movement/server/pages/BankCashMovementReportPage").then((module) => module.BankCashMovementReportPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Reports" },
    ],
    auth: companyFinancePageAuth
  },
  journalEntries: {
    id: "voyzu.companyReports.page.journalEntries",
    pageTitle: "Journal Entries",
    helpPath: "modules-help/company-ledger/journal-entries-report",
    path: "/finance/reports/journal-entries",
    loadPage: () => import("./journal-entries/server/pages/JournalEntriesReportPage").then((module) => module.JournalEntriesReportPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Reports" },
      { label: "Audit" },
    ],
    auth: companyFinancePageAuth
  },
  accountActivity: {
    id: "voyzu.companyReports.page.accountActivity",
    pageTitle: "Account Activity",
    helpPath: "modules-help/company-ledger/account-activity",
    path: "/finance/general-ledger/account-activity",
    loadPage: () => import("./account-activity/server/pages/AccountActivityReportPage").then((module) => module.AccountActivityReportPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Company General Ledger" },
    ],
    auth: companyFinancePageAuth
  },
  financialIntegrity: {
    id: "voyzu.companyReports.page.financialIntegrity",
    pageTitle: "Financial Integrity",
    helpPath: "modules-help/company-ledger/financial-integrity",
    path: "/finance/reports/financial-integrity",
    loadPage: () => import("./financial-integrity/server/pages/FinancialIntegrityReportPage").then((module) => module.FinancialIntegrityReportPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Reports" },
      { label: "Audit" },
    ],
    auth: companyFinancePageAuth
  },
  profitLoss: {
    id: "voyzu.companyReports.page.profitLoss",
    pageTitle: "Profit & Loss",
    helpPath: "modules-help/company-ledger/profit-loss",
    path: "/finance/reports/profit-loss",
    loadPage: () => import("./profit-loss/server/pages/ProfitLossReportPage").then((module) => module.ProfitLossReportPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Reports" },
      { label: "Movement" },
    ],
    auth: companyFinancePageAuth
  },
  profitLossAnalysis: {
    id: "voyzu.companyReports.page.profitLossAnalysis",
    pageTitle: "Profit & Loss Analysis",
    helpPath: "modules-help/company-ledger/profit-loss-analysis",
    path: "/finance/reports/profit-loss-analysis",
    loadPage: () => import("./profit-loss/server/pages/ProfitLossAnalysisReportPage").then((module) => module.ProfitLossAnalysisReportPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Reports" },
      { label: "Movement" },
    ],
    auth: companyFinancePageAuth
  },
  taxActivity: {
    id: "voyzu.companyReports.page.taxActivity",
    pageTitle: "Tax Return",
    helpPath: "modules-help/company-ledger/tax-return",
    path: "/finance/reports/tax-activity",
    loadPage: () => import("./tax-activity/server/pages/TaxActivityReportPage").then((module) => module.TaxActivityReportPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Reports" },
      { label: "Movement" },
    ],
    auth: companyFinancePageAuth
  },
  taxActivityReconciliation: {
    id: "voyzu.companyReports.page.taxActivityReconciliation",
    pageTitle: "Tax Reconciliation",
    helpPath: "modules-help/company-ledger/tax-reconciliation",
    path: "/finance/reports/tax-activity-reconciliation",
    loadPage: () => import("./tax-activity-reconciliation/server/pages/TaxActivityReconciliationReportPage").then((module) => module.TaxActivityReconciliationReportPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Reports" },
      { label: "Reconciliation" },
    ],
    auth: companyFinancePageAuth
  },
  arSubledgerEntriesAudit: {
    id: "voyzu.companyReports.page.arSubledgerEntriesAudit",
    pageTitle: "AR Subledger Entries",
    helpPath: "modules-help/company-ledger/ar-subledger-entries-report",
    path: "/finance/reports/ar-subledger-entries-audit",
    loadPage: () => import("./ar-subledger-entries-audit/server/pages/ArSubledgerEntriesAuditReportPage").then((module) => module.ArSubledgerEntriesAuditReportPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Reports" },
      { label: "Audit" },
    ],
    auth: companyFinancePageAuth
  },
  apSubledgerEntriesAudit: {
    id: "voyzu.companyReports.page.apSubledgerEntriesAudit",
    pageTitle: "AP Subledger Entries",
    helpPath: "modules-help/company-ledger/ap-subledger-entries-report",
    path: "/finance/reports/ap-subledger-entries-audit",
    loadPage: () => import("./ap-subledger-entries-audit/server/pages/ApSubledgerEntriesAuditReportPage").then((module) => module.ApSubledgerEntriesAuditReportPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Reports" },
      { label: "Audit" },
    ],
    auth: companyFinancePageAuth
  },
  inventoryLedgerEntriesAudit: {
    id: "voyzu.companyReports.page.inventoryLedgerEntriesAudit",
    pageTitle: "Inventory Ledger Entries",
    helpPath: "modules-help/company-ledger/inventory-ledger-entries-report",
    path: "/finance/reports/inventory-ledger-entries-audit",
    loadPage: () => import("./inventory-ledger-entries-audit/server/pages/InventoryLedgerEntriesAuditReportPage").then((module) => module.InventoryLedgerEntriesAuditReportPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Reports" },
      { label: "Audit" },
    ],
    auth: companyFinancePageAuth
  },
  taxLedgerEntriesAudit: {
    id: "voyzu.companyReports.page.taxLedgerEntriesAudit",
    pageTitle: "Tax Ledger Entries",
    helpPath: "modules-help/company-ledger/tax-ledger-entries-report",
    path: "/finance/reports/tax-ledger-entries-audit",
    loadPage: () => import("./tax-ledger-entries-audit/server/pages/TaxLedgerEntriesAuditReportPage").then((module) => module.TaxLedgerEntriesAuditReportPage),
    breadcrumbBase: [
      { label: "Finance" },
      { label: "Reports" },
      { label: "Audit" },
    ],
    auth: companyFinancePageAuth
  },
  apSubledgerEntriesAuditPrintable: {
    id: "voyzu.companyReports.page.apSubledgerEntriesAudit.printable",
    pageTitle: "AP Subledger Entries",
    path: "/finance/reports/ap-subledger-entries-audit/printable",
    loadPage: () => import("./ap-subledger-entries-audit/server/pages/ApSubledgerEntriesAuditReportPage").then((module) => module.ApSubledgerEntriesAuditReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  arSubledgerEntriesAuditPrintable: {
    id: "voyzu.companyReports.page.arSubledgerEntriesAudit.printable",
    pageTitle: "AR Subledger Entries",
    path: "/finance/reports/ar-subledger-entries-audit/printable",
    loadPage: () => import("./ar-subledger-entries-audit/server/pages/ArSubledgerEntriesAuditReportPage").then((module) => module.ArSubledgerEntriesAuditReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  balanceSheetPrintable: {
    id: "voyzu.companyReports.page.balanceSheet.printable",
    pageTitle: "Balance Sheet",
    path: "/finance/reports/balance-sheet/printable",
    loadPage: () => import("./balance-sheet/server/pages/BalanceSheetReportPage").then((module) => module.BalanceSheetReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  bankCashMovementPrintable: {
    id: "voyzu.companyReports.page.bankCashMovement.printable",
    pageTitle: "Bank / Cash Movement",
    path: "/finance/reports/bank-cash-movement/printable",
    loadPage: () => import("./bank-cash-movement/server/pages/BankCashMovementReportPage").then((module) => module.BankCashMovementReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  financialIntegrityPrintable: {
    id: "voyzu.companyReports.page.financialIntegrity.printable",
    pageTitle: "Financial Integrity",
    path: "/finance/reports/financial-integrity/printable",
    loadPage: () => import("./financial-integrity/server/pages/FinancialIntegrityReportPage").then((module) => module.FinancialIntegrityReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  inventoryLedgerEntriesAuditPrintable: {
    id: "voyzu.companyReports.page.inventoryLedgerEntriesAudit.printable",
    pageTitle: "Inventory Ledger Entries",
    path: "/finance/reports/inventory-ledger-entries-audit/printable",
    loadPage: () => import("./inventory-ledger-entries-audit/server/pages/InventoryLedgerEntriesAuditReportPage").then((module) => module.InventoryLedgerEntriesAuditReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  journalEntriesPrintable: {
    id: "voyzu.companyReports.page.journalEntries.printable",
    pageTitle: "Journal Entries",
    path: "/finance/reports/journal-entries/printable",
    loadPage: () => import("./journal-entries/server/pages/JournalEntriesReportPage").then((module) => module.JournalEntriesReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  profitLossPrintable: {
    id: "voyzu.companyReports.page.profitLoss.printable",
    pageTitle: "Profit & Loss",
    path: "/finance/reports/profit-loss/printable",
    loadPage: () => import("./profit-loss/server/pages/ProfitLossReportPage").then((module) => module.ProfitLossReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  profitLossAnalysisPrintable: {
    id: "voyzu.companyReports.page.profitLossAnalysis.printable",
    pageTitle: "Profit & Loss Analysis",
    path: "/finance/reports/profit-loss-analysis/printable",
    loadPage: () => import("./profit-loss/server/pages/ProfitLossAnalysisReportPage").then((module) => module.ProfitLossAnalysisReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  taxActivityPrintable: {
    id: "voyzu.companyReports.page.taxActivity.printable",
    pageTitle: "Tax Return",
    path: "/finance/reports/tax-activity/printable",
    loadPage: () => import("./tax-activity/server/pages/TaxActivityReportPage").then((module) => module.TaxActivityReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  taxActivityReconciliationPrintable: {
    id: "voyzu.companyReports.page.taxActivityReconciliation.printable",
    pageTitle: "Tax Reconciliation",
    path: "/finance/reports/tax-activity-reconciliation/printable",
    loadPage: () => import("./tax-activity-reconciliation/server/pages/TaxActivityReconciliationReportPage").then((module) => module.TaxActivityReconciliationReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  taxLedgerEntriesAuditPrintable: {
    id: "voyzu.companyReports.page.taxLedgerEntriesAudit.printable",
    pageTitle: "Tax Ledger Entries",
    path: "/finance/reports/tax-ledger-entries-audit/printable",
    loadPage: () => import("./tax-ledger-entries-audit/server/pages/TaxLedgerEntriesAuditReportPage").then((module) => module.TaxLedgerEntriesAuditReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  taxPositionPrintable: {
    id: "voyzu.companyReports.page.taxPosition.printable",
    pageTitle: "Tax Position",
    path: "/finance/reports/tax-position/printable",
    loadPage: () => import("./tax-position/server/pages/TaxPositionReportPage").then((module) => module.TaxPositionReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  trialBalancePrintable: {
    id: "voyzu.companyReports.page.trialBalance.printable",
    pageTitle: "Trial Balance",
    path: "/finance/reports/trial-balance/printable",
    loadPage: () => import("./trial-balance/server/pages/TrialBalanceReportPage").then((module) => module.TrialBalanceReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
