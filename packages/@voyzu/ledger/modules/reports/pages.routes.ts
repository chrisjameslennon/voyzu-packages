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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Balance Sheet",
    helpPath: "modules-help/company-ledger/balance-sheet",
    path: "/ledger/reports/balance-sheet",
    loadPage: () => import("./balance-sheet/server/pages/BalanceSheetReportPage").then((module) => module.BalanceSheetReportPage),
    breadcrumbBase: [
      { label: "Ledger" },
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Trial Balance",
    helpPath: "modules-help/company-ledger/trial-balance",
    path: "/ledger/reports/trial-balance",
    loadPage: () => import("./trial-balance/server/pages/TrialBalanceReportPage").then((module) => module.TrialBalanceReportPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Reports" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.companyReports.page.taxPosition": {
    queryParams: {
      asAtDate: { type: "string" },
      companyId: { type: "integer" },
    },
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Tax Position",
    helpPath: "modules-help/company-ledger/tax-position",
    path: "/ledger/reports/tax-position",
    loadPage: () => import("./tax-position/server/pages/TaxPositionReportPage").then((module) => module.TaxPositionReportPage),
    breadcrumbBase: [
      { label: "Ledger" },
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Bank / Cash Movement",
    helpPath: "modules-help/company-ledger/bank-cash-movement",
    path: "/ledger/reports/bank-cash-movement",
    loadPage: () => import("./bank-cash-movement/server/pages/BankCashMovementReportPage").then((module) => module.BankCashMovementReportPage),
    breadcrumbBase: [
      { label: "Ledger" },
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Journal Entries",
    helpPath: "modules-help/company-ledger/journal-entries-report",
    path: "/ledger/reports/journal-entries",
    loadPage: () => import("./journal-entries/server/pages/JournalEntriesReportPage").then((module) => module.JournalEntriesReportPage),
    breadcrumbBase: [
      { label: "Ledger" },
      { label: "Reports" },
      { label: "Audit" },
    ],
    auth: companyFinancePageAuth
  },
  "voyzu.companyReports.page.accountActivity": {

    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Account Activity",
    helpPath: "modules-help/company-ledger/account-activity",
    path: "/ledger/general-ledger/account-activity",
    loadPage: () => import("./account-activity/server/pages/AccountActivityReportPage").then((module) => module.AccountActivityReportPage),
    breadcrumbBase: [
      { label: "Ledger" },
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Financial Integrity",
    helpPath: "modules-help/company-ledger/financial-integrity",
    path: "/ledger/reports/financial-integrity",
    loadPage: () => import("./financial-integrity/server/pages/FinancialIntegrityReportPage").then((module) => module.FinancialIntegrityReportPage),
    breadcrumbBase: [
      { label: "Ledger" },
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Profit & Loss",
    helpPath: "modules-help/company-ledger/profit-loss",
    path: "/ledger/reports/profit-loss",
    loadPage: () => import("./profit-loss/server/pages/ProfitLossReportPage").then((module) => module.ProfitLossReportPage),
    breadcrumbBase: [
      { label: "Ledger" },
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Profit & Loss Analysis",
    helpPath: "modules-help/company-ledger/profit-loss-analysis",
    path: "/ledger/reports/profit-loss-analysis",
    loadPage: () => import("./profit-loss/server/pages/ProfitLossAnalysisReportPage").then((module) => module.ProfitLossAnalysisReportPage),
    breadcrumbBase: [
      { label: "Ledger" },
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Tax Return",
    helpPath: "modules-help/company-ledger/tax-return",
    path: "/ledger/reports/tax-activity",
    loadPage: () => import("./tax-activity/server/pages/TaxActivityReportPage").then((module) => module.TaxActivityReportPage),
    breadcrumbBase: [
      { label: "Ledger" },
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Tax Reconciliation",
    helpPath: "modules-help/company-ledger/tax-reconciliation",
    path: "/ledger/reports/tax-activity-reconciliation",
    loadPage: () => import("./tax-activity-reconciliation/server/pages/TaxActivityReconciliationReportPage").then((module) => module.TaxActivityReconciliationReportPage),
    breadcrumbBase: [
      { label: "Ledger" },
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "AR Subledger Entries",
    helpPath: "modules-help/company-ledger/ar-subledger-entries-report",
    path: "/ledger/reports/ar-subledger-entries-audit",
    loadPage: () => import("./ar-subledger-entries-audit/server/pages/ArSubledgerEntriesAuditReportPage").then((module) => module.ArSubledgerEntriesAuditReportPage),
    breadcrumbBase: [
      { label: "Ledger" },
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "AP Subledger Entries",
    helpPath: "modules-help/company-ledger/ap-subledger-entries-report",
    path: "/ledger/reports/ap-subledger-entries-audit",
    loadPage: () => import("./ap-subledger-entries-audit/server/pages/ApSubledgerEntriesAuditReportPage").then((module) => module.ApSubledgerEntriesAuditReportPage),
    breadcrumbBase: [
      { label: "Ledger" },
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Inventory Ledger Entries",
    helpPath: "modules-help/company-ledger/inventory-ledger-entries-report",
    path: "/ledger/reports/inventory-ledger-entries-audit",
    loadPage: () => import("./inventory-ledger-entries-audit/server/pages/InventoryLedgerEntriesAuditReportPage").then((module) => module.InventoryLedgerEntriesAuditReportPage),
    breadcrumbBase: [
      { label: "Ledger" },
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Tax Ledger Entries",
    helpPath: "modules-help/company-ledger/tax-ledger-entries-report",
    path: "/ledger/reports/tax-ledger-entries-audit",
    loadPage: () => import("./tax-ledger-entries-audit/server/pages/TaxLedgerEntriesAuditReportPage").then((module) => module.TaxLedgerEntriesAuditReportPage),
    breadcrumbBase: [
      { label: "Ledger" },
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "AP Subledger Entries",
    path: "/ledger/reports/ap-subledger-entries-audit/printable",
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "AR Subledger Entries",
    path: "/ledger/reports/ar-subledger-entries-audit/printable",
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Balance Sheet",
    path: "/ledger/reports/balance-sheet/printable",
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Bank / Cash Movement",
    path: "/ledger/reports/bank-cash-movement/printable",
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Financial Integrity",
    path: "/ledger/reports/financial-integrity/printable",
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Inventory Ledger Entries",
    path: "/ledger/reports/inventory-ledger-entries-audit/printable",
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Journal Entries",
    path: "/ledger/reports/journal-entries/printable",
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Profit & Loss",
    path: "/ledger/reports/profit-loss/printable",
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Profit & Loss Analysis",
    path: "/ledger/reports/profit-loss-analysis/printable",
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Tax Return",
    path: "/ledger/reports/tax-activity/printable",
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Tax Reconciliation",
    path: "/ledger/reports/tax-activity-reconciliation/printable",
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Tax Ledger Entries",
    path: "/ledger/reports/tax-ledger-entries-audit/printable",
    loadPage: () => import("./tax-ledger-entries-audit/server/pages/TaxLedgerEntriesAuditReportPage").then((module) => module.TaxLedgerEntriesAuditReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  },
  "voyzu.companyReports.page.taxPosition.printable": {
    queryParams: {
      asAtDate: { type: "string" },
      companyId: { type: "integer" },
    },
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Tax Position",
    path: "/ledger/reports/tax-position/printable",
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
    httpApiDocumentationGroupId: "ledger.reports",
    pageTitle: "Trial Balance",
    path: "/ledger/reports/trial-balance/printable",
    loadPage: () => import("./trial-balance/server/pages/TrialBalanceReportPage").then((module) => module.TrialBalanceReportPage),
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
