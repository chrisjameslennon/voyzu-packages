import { companyFinancePageAuth } from "../organization-finance/server/lib/company-finance-page-auth";
export const pageRoutes = {
  "voyzu.companyReports.page.balanceSheet": {
    queryParams: {
      asAtDate: { type: "string" },
      companyId: { type: "integer" },
      showAccountCode: { type: "boolean" },
      showCompanyFooter: { type: "boolean" },
      showCompanyHeader: { type: "boolean" },
      showDecimals: { type: "boolean" },
      showReportingCategories: { type: "boolean" },
    },
    httpApiDocumentationGroupId: "finance.reports",
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
  "voyzu.companyReports.page.trialBalance": {
    queryParams: {
      asAtDate: { type: "string" },
      companyId: { type: "integer" },
      showAccountCode: { type: "boolean" },
    },
    httpApiDocumentationGroupId: "finance.reports",
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
  "voyzu.companyReports.page.taxPosition": {
    queryParams: {
      asAtDate: { type: "string" },
      companyId: { type: "integer" },
    },
    httpApiDocumentationGroupId: "finance.reports",
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
  "voyzu.companyReports.page.bankCashMovement": {
    queryParams: {
      companyId: { type: "integer" },
      fromDate: { type: "string" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
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
  "voyzu.companyReports.page.journalEntries": {
    queryParams: {
      companyId: { type: "integer" },
      fromDate: { type: "string" },
      showSnapshotData: { type: "boolean" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
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
  "voyzu.companyReports.page.accountActivity": {

    httpApiDocumentationGroupId: "finance.reports",
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
  "voyzu.companyReports.page.financialIntegrity": {
    queryParams: {
      companyId: { type: "integer" },
      documentTypeCode: { type: "string" },
      fromDate: { type: "string" },
      showSourceDocument: { type: "boolean" },
      showSubledgerEntries: { type: "boolean" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
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
  "voyzu.companyReports.page.profitLoss": {
    queryParams: {
      companyId: { type: "integer" },
      fromDate: { type: "string" },
      showAccountCode: { type: "boolean" },
      showCompanyFooter: { type: "boolean" },
      showCompanyHeader: { type: "boolean" },
      showDecimals: { type: "boolean" },
      showReportingCategories: { type: "boolean" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
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
  "voyzu.companyReports.page.profitLossAnalysis": {
    queryParams: {
      breakdown: { type: "string" },
      companyId: { type: "integer" },
      dimensionFilters: { type: "string" },
      fromDate: { type: "string" },
      showAccountCode: { type: "boolean" },
      showCompanyFooter: { type: "boolean" },
      showCompanyHeader: { type: "boolean" },
      showDecimals: { type: "boolean" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
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
  "voyzu.companyReports.page.taxActivity": {
    queryParams: {
      companyId: { type: "integer" },
      periodEndDate: { type: "string" },
      periodLabel: { type: "string" },
      periodStartDate: { type: "string" },
      showCompanyFooter: { type: "boolean" },
      showCompanyHeader: { type: "boolean" },
      showDecimals: { type: "boolean" },
    },
    httpApiDocumentationGroupId: "finance.reports",
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
  "voyzu.companyReports.page.taxActivityReconciliation": {
    queryParams: {
      companyId: { type: "integer" },
      periodEndDate: { type: "string" },
      periodLabel: { type: "string" },
      periodStartDate: { type: "string" },
      showCompanyFooter: { type: "boolean" },
      showCompanyHeader: { type: "boolean" },
      showDecimals: { type: "boolean" },
      taxAuthorityCode: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
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
  "voyzu.companyReports.page.arSubledgerEntriesAudit": {
    queryParams: {
      companyId: { type: "integer" },
      fromDate: { type: "string" },
      showSnapshotData: { type: "boolean" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
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
  "voyzu.companyReports.page.apSubledgerEntriesAudit": {
    queryParams: {
      companyId: { type: "integer" },
      fromDate: { type: "string" },
      showSnapshotData: { type: "boolean" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
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
  "voyzu.companyReports.page.inventoryLedgerEntriesAudit": {
    queryParams: {
      companyId: { type: "integer" },
      fromDate: { type: "string" },
      showSnapshotData: { type: "boolean" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
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
  "voyzu.companyReports.page.taxLedgerEntriesAudit": {
    queryParams: {
      companyId: { type: "integer" },
      fromDate: { type: "string" },
      showSnapshotData: { type: "boolean" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
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
  "voyzu.companyReports.page.apSubledgerEntriesAudit.printable": {
    queryParams: {
      companyId: { type: "integer" },
      fromDate: { type: "string" },
      showSnapshotData: { type: "boolean" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
    pageTitle: "AP Subledger Entries",
    path: "/finance/reports/ap-subledger-entries-audit/printable",
    loadPage: () => import("./ap-subledger-entries-audit/server/pages/ApSubledgerEntriesAuditReportPage").then((module) => module.ApSubledgerEntriesAuditReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  "voyzu.companyReports.page.arSubledgerEntriesAudit.printable": {
    queryParams: {
      companyId: { type: "integer" },
      fromDate: { type: "string" },
      showSnapshotData: { type: "boolean" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
    pageTitle: "AR Subledger Entries",
    path: "/finance/reports/ar-subledger-entries-audit/printable",
    loadPage: () => import("./ar-subledger-entries-audit/server/pages/ArSubledgerEntriesAuditReportPage").then((module) => module.ArSubledgerEntriesAuditReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  "voyzu.companyReports.page.balanceSheet.printable": {
    queryParams: {
      asAtDate: { type: "string" },
      companyId: { type: "integer" },
      showAccountCode: { type: "boolean" },
      showCompanyFooter: { type: "boolean" },
      showCompanyHeader: { type: "boolean" },
      showDecimals: { type: "boolean" },
      showReportingCategories: { type: "boolean" },
    },
    httpApiDocumentationGroupId: "finance.reports",
    pageTitle: "Balance Sheet",
    path: "/finance/reports/balance-sheet/printable",
    loadPage: () => import("./balance-sheet/server/pages/BalanceSheetReportPage").then((module) => module.BalanceSheetReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  "voyzu.companyReports.page.bankCashMovement.printable": {
    queryParams: {
      companyId: { type: "integer" },
      fromDate: { type: "string" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
    pageTitle: "Bank / Cash Movement",
    path: "/finance/reports/bank-cash-movement/printable",
    loadPage: () => import("./bank-cash-movement/server/pages/BankCashMovementReportPage").then((module) => module.BankCashMovementReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  "voyzu.companyReports.page.financialIntegrity.printable": {
    queryParams: {
      companyId: { type: "integer" },
      documentTypeCode: { type: "string" },
      fromDate: { type: "string" },
      showSourceDocument: { type: "boolean" },
      showSubledgerEntries: { type: "boolean" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
    pageTitle: "Financial Integrity",
    path: "/finance/reports/financial-integrity/printable",
    loadPage: () => import("./financial-integrity/server/pages/FinancialIntegrityReportPage").then((module) => module.FinancialIntegrityReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  "voyzu.companyReports.page.inventoryLedgerEntriesAudit.printable": {
    queryParams: {
      companyId: { type: "integer" },
      fromDate: { type: "string" },
      showSnapshotData: { type: "boolean" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
    pageTitle: "Inventory Ledger Entries",
    path: "/finance/reports/inventory-ledger-entries-audit/printable",
    loadPage: () => import("./inventory-ledger-entries-audit/server/pages/InventoryLedgerEntriesAuditReportPage").then((module) => module.InventoryLedgerEntriesAuditReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  "voyzu.companyReports.page.journalEntries.printable": {
    queryParams: {
      companyId: { type: "integer" },
      fromDate: { type: "string" },
      showSnapshotData: { type: "boolean" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
    pageTitle: "Journal Entries",
    path: "/finance/reports/journal-entries/printable",
    loadPage: () => import("./journal-entries/server/pages/JournalEntriesReportPage").then((module) => module.JournalEntriesReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  "voyzu.companyReports.page.profitLoss.printable": {
    queryParams: {
      companyId: { type: "integer" },
      fromDate: { type: "string" },
      showAccountCode: { type: "boolean" },
      showCompanyFooter: { type: "boolean" },
      showCompanyHeader: { type: "boolean" },
      showDecimals: { type: "boolean" },
      showReportingCategories: { type: "boolean" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
    pageTitle: "Profit & Loss",
    path: "/finance/reports/profit-loss/printable",
    loadPage: () => import("./profit-loss/server/pages/ProfitLossReportPage").then((module) => module.ProfitLossReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  "voyzu.companyReports.page.profitLossAnalysis.printable": {
    queryParams: {
      breakdown: { type: "string" },
      companyId: { type: "integer" },
      dimensionFilters: { type: "string" },
      fromDate: { type: "string" },
      showAccountCode: { type: "boolean" },
      showCompanyFooter: { type: "boolean" },
      showCompanyHeader: { type: "boolean" },
      showDecimals: { type: "boolean" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
    pageTitle: "Profit & Loss Analysis",
    path: "/finance/reports/profit-loss-analysis/printable",
    loadPage: () => import("./profit-loss/server/pages/ProfitLossAnalysisReportPage").then((module) => module.ProfitLossAnalysisReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  "voyzu.companyReports.page.taxActivity.printable": {
    queryParams: {
      companyId: { type: "integer" },
      periodEndDate: { type: "string" },
      periodLabel: { type: "string" },
      periodStartDate: { type: "string" },
      showCompanyFooter: { type: "boolean" },
      showCompanyHeader: { type: "boolean" },
      showDecimals: { type: "boolean" },
    },
    httpApiDocumentationGroupId: "finance.reports",
    pageTitle: "Tax Return",
    path: "/finance/reports/tax-activity/printable",
    loadPage: () => import("./tax-activity/server/pages/TaxActivityReportPage").then((module) => module.TaxActivityReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  "voyzu.companyReports.page.taxActivityReconciliation.printable": {
    queryParams: {
      companyId: { type: "integer" },
      periodEndDate: { type: "string" },
      periodLabel: { type: "string" },
      periodStartDate: { type: "string" },
      showCompanyFooter: { type: "boolean" },
      showCompanyHeader: { type: "boolean" },
      showDecimals: { type: "boolean" },
      taxAuthorityCode: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
    pageTitle: "Tax Reconciliation",
    path: "/finance/reports/tax-activity-reconciliation/printable",
    loadPage: () => import("./tax-activity-reconciliation/server/pages/TaxActivityReconciliationReportPage").then((module) => module.TaxActivityReconciliationReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  "voyzu.companyReports.page.taxLedgerEntriesAudit.printable": {
    queryParams: {
      companyId: { type: "integer" },
      fromDate: { type: "string" },
      showSnapshotData: { type: "boolean" },
      toDate: { type: "string" },
    },
    httpApiDocumentationGroupId: "finance.reports",
    pageTitle: "Tax Ledger Entries",
    path: "/finance/reports/tax-ledger-entries-audit/printable",
    loadPage: () => import("./tax-ledger-entries-audit/server/pages/TaxLedgerEntriesAuditReportPage").then((module) => module.TaxLedgerEntriesAuditReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  "voyzu.companyReports.page.taxPosition.printable": {
    queryParams: {
      asAtDate: { type: "string" },
      companyId: { type: "integer" },
    },
    httpApiDocumentationGroupId: "finance.reports",
    pageTitle: "Tax Position",
    path: "/finance/reports/tax-position/printable",
    loadPage: () => import("./tax-position/server/pages/TaxPositionReportPage").then((module) => module.TaxPositionReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  "voyzu.companyReports.page.trialBalance.printable": {
    queryParams: {
      asAtDate: { type: "string" },
      companyId: { type: "integer" },
      showAccountCode: { type: "boolean" },
    },
    httpApiDocumentationGroupId: "finance.reports",
    pageTitle: "Trial Balance",
    path: "/finance/reports/trial-balance/printable",
    loadPage: () => import("./trial-balance/server/pages/TrialBalanceReportPage").then((module) => module.TrialBalanceReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
