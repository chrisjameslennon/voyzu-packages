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
import { arrayOf, dtoRef } from "@voyzu/types/api";
import type { VoyzuPackageModuleDefinition } from "@voyzu/types/framework";
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

export const companyReportsModule = {
  pageRoutes: {
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
          auth: { required: true, minRole: "COMPANY_USER" }
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
          auth: { required: true, minRole: "COMPANY_USER" }
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
          auth: { required: true, minRole: "COMPANY_USER" }
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
          auth: { required: true, minRole: "COMPANY_USER" }
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
          auth: { required: true, minRole: "COMPANY_USER" }
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
          auth: { required: true, minRole: "COMPANY_USER" }
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
          auth: { required: true, minRole: "COMPANY_USER" }
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
          auth: { required: true, minRole: "COMPANY_USER" }
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
          auth: { required: true, minRole: "COMPANY_USER" }
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
          auth: { required: true, minRole: "COMPANY_USER" }
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
          auth: { required: true, minRole: "COMPANY_USER" }
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
          auth: { required: true, minRole: "COMPANY_USER" }
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
          auth: { required: true, minRole: "COMPANY_USER" }
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
          auth: { required: true, minRole: "COMPANY_USER" }
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
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    apSubledgerEntriesAuditPrintable: {
          id: "voyzu.companyReports.page.apSubledgerEntriesAudit.printable",
          pageTitle: "AP Subledger Entries",
          path: "/finance/reports/ap-subledger-entries-audit/printable",
          Page: ApSubledgerEntriesAuditReportPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    arSubledgerEntriesAuditPrintable: {
          id: "voyzu.companyReports.page.arSubledgerEntriesAudit.printable",
          pageTitle: "AR Subledger Entries",
          path: "/finance/reports/ar-subledger-entries-audit/printable",
          Page: ArSubledgerEntriesAuditReportPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    balanceSheetPrintable: {
          id: "voyzu.companyReports.page.balanceSheet.printable",
          pageTitle: "Balance Sheet",
          path: "/finance/reports/balance-sheet/printable",
          Page: BalanceSheetReportPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    bankCashMovementPrintable: {
          id: "voyzu.companyReports.page.bankCashMovement.printable",
          pageTitle: "Bank / Cash Movement",
          path: "/finance/reports/bank-cash-movement/printable",
          Page: BankCashMovementReportPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    financialIntegrityPrintable: {
          id: "voyzu.companyReports.page.financialIntegrity.printable",
          pageTitle: "Financial Integrity",
          path: "/finance/reports/financial-integrity/printable",
          Page: FinancialIntegrityReportPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    inventoryLedgerEntriesAuditPrintable: {
          id: "voyzu.companyReports.page.inventoryLedgerEntriesAudit.printable",
          pageTitle: "Inventory Ledger Entries",
          path: "/finance/reports/inventory-ledger-entries-audit/printable",
          Page: InventoryLedgerEntriesAuditReportPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    journalEntriesPrintable: {
          id: "voyzu.companyReports.page.journalEntries.printable",
          pageTitle: "Journal Entries",
          path: "/finance/reports/journal-entries/printable",
          Page: JournalEntriesReportPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    profitLossPrintable: {
          id: "voyzu.companyReports.page.profitLoss.printable",
          pageTitle: "Profit & Loss",
          path: "/finance/reports/profit-loss/printable",
          Page: ProfitLossReportPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    profitLossAnalysisPrintable: {
          id: "voyzu.companyReports.page.profitLossAnalysis.printable",
          pageTitle: "Profit & Loss Analysis",
          path: "/finance/reports/profit-loss-analysis/printable",
          Page: ProfitLossAnalysisReportPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    taxActivityPrintable: {
          id: "voyzu.companyReports.page.taxActivity.printable",
          pageTitle: "Tax Return",
          path: "/finance/reports/tax-activity/printable",
          Page: TaxActivityReportPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    taxActivityReconciliationPrintable: {
          id: "voyzu.companyReports.page.taxActivityReconciliation.printable",
          pageTitle: "Tax Reconciliation",
          path: "/finance/reports/tax-activity-reconciliation/printable",
          Page: TaxActivityReconciliationReportPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    taxLedgerEntriesAuditPrintable: {
          id: "voyzu.companyReports.page.taxLedgerEntriesAudit.printable",
          pageTitle: "Tax Ledger Entries",
          path: "/finance/reports/tax-ledger-entries-audit/printable",
          Page: TaxLedgerEntriesAuditReportPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    taxPositionPrintable: {
          id: "voyzu.companyReports.page.taxPosition.printable",
          pageTitle: "Tax Position",
          path: "/finance/reports/tax-position/printable",
          Page: TaxPositionReportPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        },
    trialBalancePrintable: {
          id: "voyzu.companyReports.page.trialBalance.printable",
          pageTitle: "Trial Balance",
          path: "/finance/reports/trial-balance/printable",
          Page: TrialBalanceReportPage,
          unframed: true,
          auth: { required: true, minRole: "COMPANY_USER" }
        }
  },
  apiDefinitions: {
    balanceSheet: {
      method: "GET",
      path: "/finance/[companyCode]/reports/balance-sheet",
      handler: (request: any) => handleGetBalanceSheet(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Balance Sheet",
        description: "Balance Sheet Company Reports.",
        tags: ["Company Reports"],
        responses: { "200": { description: "Successful response.", schema: dtoRef("BalanceSheetResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    balanceSheetPdf: {
      method: "GET",
      path: "/finance/[companyCode]/reports/balance-sheet/pdf",
      handler: (request: any) => handleGetBalanceSheetPdf(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Get balance sheet PDF",
        description: "Generates a balance sheet PDF for the selected company and reporting options.",
        tags: ["Company Reports"],
        responses: { "200": { description: "Generated balance sheet PDF.", contentType: "application/pdf" }, "400": { description: "Required query parameters are missing or invalid.", schema: dtoRef("InputValidationErrorResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } }
      },
    },
    financialYears: {
      method: "GET",
      path: "/finance/[companyCode]/reports/financial-years",
      handler: (request: any) => handleListFinancialYears(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Financial Years",
        description: "Financial Years Company Reports.",
        tags: ["Company Reports"],
        responses: { "200": { description: "Successful response.", schema: arrayOf(dtoRef("FinancialYearResponseDto")) }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    trialBalance: {
      method: "GET",
      path: "/finance/[companyCode]/reports/trial-balance",
      handler: (request: any) => handleGetTrialBalance(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Trial Balance",
        description: "Trial Balance Company Reports.",
        tags: ["Company Reports"],
        responses: { "200": { description: "Successful response.", schema: dtoRef("TrialBalanceResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    taxPosition: {
      method: "GET",
      path: "/finance/[companyCode]/reports/tax-position",
      handler: (request: any) => handleGetTaxPosition(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Tax Position",
        description: "Tax Position Company Reports.",
        tags: ["Company Reports"],
        responses: { "200": { description: "Successful response.", schema: dtoRef("TaxPositionResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    bankCashMovement: {
      method: "GET",
      path: "/finance/[companyCode]/reports/bank-cash-movement",
      handler: (request: any) => handleGetBankCashMovement(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Bank Cash Movement",
        description: "Bank Cash Movement Company Reports.",
        tags: ["Company Reports"],
        responses: { "200": { description: "Successful response.", schema: dtoRef("BankCashMovementResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    journalEntries: {
      method: "GET",
      path: "/finance/[companyCode]/reports/journal-entries",
      handler: (request: any) => handleGetJournalEntries(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Journal Entries",
        description: "Journal Entries Company Reports.",
        tags: ["Company Reports"],
        responses: { "200": { description: "Successful response.", schema: dtoRef("JournalEntriesResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    financialIntegrity: {
      method: "GET",
      path: "/finance/[companyCode]/reports/financial-integrity",
      handler: (request: any) => handleGetFinancialIntegrity(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Financial Integrity",
        description: "Financial Integrity Company Reports.",
        tags: ["Company Reports"],
        responses: { "200": { description: "Successful response.", schema: dtoRef("FinancialIntegrityResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    profitLoss: {
      method: "GET",
      path: "/finance/[companyCode]/reports/profit-loss",
      handler: (request: any) => handleGetProfitLoss(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Profit Loss",
        description: "Profit Loss Company Reports.",
        tags: ["Company Reports"],
        responses: { "200": { description: "Successful response.", schema: dtoRef("ProfitLossResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    profitLossAnalysis: {
      method: "GET",
      path: "/finance/[companyCode]/reports/profit-loss-analysis",
      handler: (request: any) => handleGetProfitLossAnalysis(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Profit Loss Analysis",
        description: "Profit Loss Analysis Company Reports.",
        tags: ["Company Reports"],
        responses: { "200": { description: "Successful response.", schema: dtoRef("ProfitLossAnalysisResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    taxActivity: {
      method: "GET",
      path: "/finance/[companyCode]/reports/tax-activity",
      handler: (request: any) => handleGetTaxActivity(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Tax Activity",
        description: "Tax Activity Company Reports.",
        tags: ["Company Reports"],
        responses: { "200": { description: "Successful response.", schema: dtoRef("TaxActivityResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    taxActivityReconciliation: {
      method: "GET",
      path: "/finance/[companyCode]/reports/tax-activity-reconciliation",
      handler: (request: any) => handleGetTaxActivityReconciliation(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Tax Activity Reconciliation",
        description: "Tax Activity Reconciliation Company Reports.",
        tags: ["Company Reports"],
        responses: { "200": { description: "Successful response.", schema: dtoRef("TaxActivityReconciliationResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    arSubledgerEntriesAudit: {
      method: "GET",
      path: "/finance/[companyCode]/reports/ar-subledger-entries-audit",
      handler: (request: any) => handleGetArSubledgerEntriesAudit(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "AR Subledger Entries Audit",
        description: "AR Subledger Entries Audit Company Reports.",
        tags: ["Company Reports"],
        responses: { "200": { description: "Successful response.", schema: dtoRef("ArSubledgerEntriesAuditResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    apSubledgerEntriesAudit: {
      method: "GET",
      path: "/finance/[companyCode]/reports/ap-subledger-entries-audit",
      handler: (request: any) => handleGetApSubledgerEntriesAudit(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "AP Subledger Entries Audit",
        description: "AP Subledger Entries Audit Company Reports.",
        tags: ["Company Reports"],
        responses: { "200": { description: "Successful response.", schema: dtoRef("ApSubledgerEntriesAuditResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    inventoryLedgerEntriesAudit: {
      method: "GET",
      path: "/finance/[companyCode]/reports/inventory-ledger-entries-audit",
      handler: (request: any) => handleGetInventoryLedgerEntriesAudit(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Inventory Ledger Entries Audit",
        description: "Inventory Ledger Entries Audit Company Reports.",
        tags: ["Company Reports"],
        responses: { "200": { description: "Successful response.", schema: dtoRef("InventoryLedgerEntriesAuditResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
    taxLedgerEntriesAudit: {
      method: "GET",
      path: "/finance/[companyCode]/reports/tax-ledger-entries-audit",
      handler: (request: any) => handleGetTaxLedgerEntriesAudit(request),
      apiDoc: { requestPathParams: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } },
        summary: "Tax Ledger Entries Audit",
        description: "Tax Ledger Entries Audit Company Reports.",
        tags: ["Company Reports"],
        responses: { "200": { description: "Successful response.", schema: dtoRef("TaxLedgerEntriesAuditResponseDto") }, "500": { description: "An unexpected server error occurred.", schema: dtoRef("InternalServerErrorResponseDto") } },
      },
    },
  }
} as const satisfies VoyzuPackageModuleDefinition;
