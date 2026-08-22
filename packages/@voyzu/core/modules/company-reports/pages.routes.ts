import { companyFinancePageAuth } from "@voyzu/core/common/server";
import { handleGetTaxLedgerEntriesAudit } from "@voyzu/core/company-reports/tax-ledger-entries-audit/server";
import { handleGetInventoryLedgerEntriesAudit } from "@voyzu/core/company-reports/inventory-ledger-entries-audit/server";
import { handleGetApSubledgerEntriesAudit } from "@voyzu/core/company-reports/ap-subledger-entries-audit/server";
import { handleGetArSubledgerEntriesAudit } from "@voyzu/core/company-reports/ar-subledger-entries-audit/server";
import { handleGetTaxActivityReconciliation } from "@voyzu/core/company-reports/tax-activity-reconciliation/server";
import { handleGetTaxActivity } from "@voyzu/core/company-reports/tax-activity/server";
import { handleGetProfitLoss, handleGetProfitLossAnalysis } from "@voyzu/core/company-reports/profit-loss/server";
import { handleGetFinancialIntegrity } from "@voyzu/core/company-reports/financial-integrity/server";
import { handleGetJournalEntries } from "@voyzu/core/company-reports/journal-entries/server";
import { handleGetBankCashMovement } from "@voyzu/core/company-reports/bank-cash-movement/server";
import { handleGetTaxPosition } from "@voyzu/core/company-reports/tax-position/server";
import { handleGetTrialBalance } from "@voyzu/core/company-reports/trial-balance/server";
import { handleGetBalanceSheet, handleListFinancialYears, handleGetBalanceSheetPdf } from "@voyzu/core/company-reports/balance-sheet/server";
import { BalanceSheetReportPage } from "@voyzu/core/company-reports/balance-sheet/server";
import { TrialBalanceReportPage } from "@voyzu/core/company-reports/trial-balance/server";
import { TaxPositionReportPage } from "@voyzu/core/company-reports/tax-position/server";
import { BankCashMovementReportPage } from "@voyzu/core/company-reports/bank-cash-movement/server";
import { JournalEntriesReportPage } from "@voyzu/core/company-reports/journal-entries/server";
import { AccountActivityReportPage } from "@voyzu/core/company-reports/account-activity/server";
import { FinancialIntegrityReportPage } from "@voyzu/core/company-reports/financial-integrity/server";
import { ProfitLossReportPage, ProfitLossAnalysisReportPage } from "@voyzu/core/company-reports/profit-loss/server";
import { TaxActivityReportPage } from "@voyzu/core/company-reports/tax-activity/server";
import { TaxActivityReconciliationReportPage } from "@voyzu/core/company-reports/tax-activity-reconciliation/server";
import { ArSubledgerEntriesAuditReportPage } from "@voyzu/core/company-reports/ar-subledger-entries-audit/server";
import { ApSubledgerEntriesAuditReportPage } from "@voyzu/core/company-reports/ap-subledger-entries-audit/server";
import { InventoryLedgerEntriesAuditReportPage } from "@voyzu/core/company-reports/inventory-ledger-entries-audit/server";
import { TaxLedgerEntriesAuditReportPage } from "@voyzu/core/company-reports/tax-ledger-entries-audit/server";

export const pageRoutes = {
  balanceSheet: {
    id: "voyzu.companyReports.page.balanceSheet",
    pageTitle: "Balance Sheet",
    helpPath: "modules-help/company-ledger/balance-sheet",
    path: "/finance/reports/balance-sheet",
    Page: BalanceSheetReportPage,
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
    Page: TrialBalanceReportPage,
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
    Page: TaxPositionReportPage,
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
    Page: BankCashMovementReportPage,
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
    Page: JournalEntriesReportPage,
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
    Page: AccountActivityReportPage,
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
    Page: FinancialIntegrityReportPage,
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
    Page: ProfitLossReportPage,
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
    Page: ProfitLossAnalysisReportPage,
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
    Page: TaxActivityReportPage,
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
    Page: TaxActivityReconciliationReportPage,
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
    Page: ArSubledgerEntriesAuditReportPage,
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
    Page: ApSubledgerEntriesAuditReportPage,
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
    Page: InventoryLedgerEntriesAuditReportPage,
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
    Page: TaxLedgerEntriesAuditReportPage,
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
    Page: ApSubledgerEntriesAuditReportPage,
    unframed: true,
    auth: companyFinancePageAuth
  },
  arSubledgerEntriesAuditPrintable: {
    id: "voyzu.companyReports.page.arSubledgerEntriesAudit.printable",
    pageTitle: "AR Subledger Entries",
    path: "/finance/reports/ar-subledger-entries-audit/printable",
    Page: ArSubledgerEntriesAuditReportPage,
    unframed: true,
    auth: companyFinancePageAuth
  },
  balanceSheetPrintable: {
    id: "voyzu.companyReports.page.balanceSheet.printable",
    pageTitle: "Balance Sheet",
    path: "/finance/reports/balance-sheet/printable",
    Page: BalanceSheetReportPage,
    unframed: true,
    auth: companyFinancePageAuth
  },
  bankCashMovementPrintable: {
    id: "voyzu.companyReports.page.bankCashMovement.printable",
    pageTitle: "Bank / Cash Movement",
    path: "/finance/reports/bank-cash-movement/printable",
    Page: BankCashMovementReportPage,
    unframed: true,
    auth: companyFinancePageAuth
  },
  financialIntegrityPrintable: {
    id: "voyzu.companyReports.page.financialIntegrity.printable",
    pageTitle: "Financial Integrity",
    path: "/finance/reports/financial-integrity/printable",
    Page: FinancialIntegrityReportPage,
    unframed: true,
    auth: companyFinancePageAuth
  },
  inventoryLedgerEntriesAuditPrintable: {
    id: "voyzu.companyReports.page.inventoryLedgerEntriesAudit.printable",
    pageTitle: "Inventory Ledger Entries",
    path: "/finance/reports/inventory-ledger-entries-audit/printable",
    Page: InventoryLedgerEntriesAuditReportPage,
    unframed: true,
    auth: companyFinancePageAuth
  },
  journalEntriesPrintable: {
    id: "voyzu.companyReports.page.journalEntries.printable",
    pageTitle: "Journal Entries",
    path: "/finance/reports/journal-entries/printable",
    Page: JournalEntriesReportPage,
    unframed: true,
    auth: companyFinancePageAuth
  },
  profitLossPrintable: {
    id: "voyzu.companyReports.page.profitLoss.printable",
    pageTitle: "Profit & Loss",
    path: "/finance/reports/profit-loss/printable",
    Page: ProfitLossReportPage,
    unframed: true,
    auth: companyFinancePageAuth
  },
  profitLossAnalysisPrintable: {
    id: "voyzu.companyReports.page.profitLossAnalysis.printable",
    pageTitle: "Profit & Loss Analysis",
    path: "/finance/reports/profit-loss-analysis/printable",
    Page: ProfitLossAnalysisReportPage,
    unframed: true,
    auth: companyFinancePageAuth
  },
  taxActivityPrintable: {
    id: "voyzu.companyReports.page.taxActivity.printable",
    pageTitle: "Tax Return",
    path: "/finance/reports/tax-activity/printable",
    Page: TaxActivityReportPage,
    unframed: true,
    auth: companyFinancePageAuth
  },
  taxActivityReconciliationPrintable: {
    id: "voyzu.companyReports.page.taxActivityReconciliation.printable",
    pageTitle: "Tax Reconciliation",
    path: "/finance/reports/tax-activity-reconciliation/printable",
    Page: TaxActivityReconciliationReportPage,
    unframed: true,
    auth: companyFinancePageAuth
  },
  taxLedgerEntriesAuditPrintable: {
    id: "voyzu.companyReports.page.taxLedgerEntriesAudit.printable",
    pageTitle: "Tax Ledger Entries",
    path: "/finance/reports/tax-ledger-entries-audit/printable",
    Page: TaxLedgerEntriesAuditReportPage,
    unframed: true,
    auth: companyFinancePageAuth
  },
  taxPositionPrintable: {
    id: "voyzu.companyReports.page.taxPosition.printable",
    pageTitle: "Tax Position",
    path: "/finance/reports/tax-position/printable",
    Page: TaxPositionReportPage,
    unframed: true,
    auth: companyFinancePageAuth
  },
  trialBalancePrintable: {
    id: "voyzu.companyReports.page.trialBalance.printable",
    pageTitle: "Trial Balance",
    path: "/finance/reports/trial-balance/printable",
    Page: TrialBalanceReportPage,
    unframed: true,
    auth: companyFinancePageAuth
  }
} as const;
