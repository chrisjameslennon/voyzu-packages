import Type from "typebox";
import { InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { TaxLedgerEntriesAuditResponseDto } from "../../types/modules/company-reports/tax-ledger-entries-audit.response.dto";
import { InventoryLedgerEntriesAuditResponseDto } from "../../types/modules/company-reports/inventory-ledger-entries-audit.response.dto";
import { ApSubledgerEntriesAuditResponseDto } from "../../types/modules/company-reports/ap-subledger-entries-audit.response.dto";
import { ArSubledgerEntriesAuditResponseDto } from "../../types/modules/company-reports/ar-subledger-entries-audit.response.dto";
import { TaxActivityReconciliationResponseDto } from "../../types/modules/company-reports/tax-activity-reconciliation.response.dto";
import { TaxActivityResponseDto } from "../../types/modules/company-reports/tax-activity.response.dto";
import { ProfitLossAnalysisResponseDto } from "../../types/modules/company-reports/profit-loss-analysis.response.dto";
import { ProfitLossResponseDto } from "../../types/modules/company-reports/profit-loss.response.dto";
import { FinancialIntegrityResponseDto } from "../../types/modules/company-reports/financial-integrity.response.dto";
import { JournalEntriesResponseDto } from "../../types/modules/company-reports/journal-entries.response.dto";
import { BankCashMovementResponseDto } from "../../types/modules/company-reports/bank-cash-movement.response.dto";
import { TaxPositionResponseDto } from "../../types/modules/company-reports/tax-position.response.dto";
import { TrialBalanceResponseDto } from "../../types/modules/company-reports/trial-balance.response.dto";
import { FinancialYearResponseDto } from "../../types/modules/company-reports/financial-year.response.dto";
import { BalanceSheetResponseDto } from "../../types/modules/company-reports/balance-sheet/balance-sheet.response.dto";



export const apiDefinitions = {
  balanceSheet: {
    method: "GET",
    path: "/finance/[companyCode]/reports/balance-sheet",
    loadHandler: () => import("./balance-sheet/server/api/balance-sheet.http.handlers").then((module) => module.handleGetBalanceSheet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Balance Sheet",
    description: "Balance Sheet Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: BalanceSheetResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  balanceSheetPdf: {
    method: "GET",
    path: "/finance/[companyCode]/reports/balance-sheet/pdf",
    loadHandler: () => import("./balance-sheet/server/api/balance-sheet-pdf.http.handlers").then((module) => module.handleGetBalanceSheetPdf),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Get balance sheet PDF",
    description: "Generates a balance sheet PDF for the selected company and reporting options.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Generated balance sheet PDF.", contentType: "application/pdf" }, "400": { description: "Required query parameters are missing or invalid.", body: InputValidationErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  financialYears: {
    method: "GET",
    path: "/finance/[companyCode]/reports/financial-years",
    loadHandler: () => import("./balance-sheet/server/api/balance-sheet.http.handlers").then((module) => module.handleListFinancialYears),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Financial Years",
    description: "Financial Years Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: Type.Array(FinancialYearResponseDto) }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  trialBalance: {
    method: "GET",
    path: "/finance/[companyCode]/reports/trial-balance",
    loadHandler: () => import("./trial-balance/server/api/trial-balance.http.handlers").then((module) => module.handleGetTrialBalance),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Trial Balance",
    description: "Trial Balance Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: TrialBalanceResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  taxPosition: {
    method: "GET",
    path: "/finance/[companyCode]/reports/tax-position",
    loadHandler: () => import("./tax-position/server/api/tax-position.http.handlers").then((module) => module.handleGetTaxPosition),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Tax Position",
    description: "Tax Position Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: TaxPositionResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  bankCashMovement: {
    method: "GET",
    path: "/finance/[companyCode]/reports/bank-cash-movement",
    loadHandler: () => import("./bank-cash-movement/server/api/bank-cash-movement.http.handlers").then((module) => module.handleGetBankCashMovement),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Bank Cash Movement",
    description: "Bank Cash Movement Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: BankCashMovementResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  journalEntries: {
    method: "GET",
    path: "/finance/[companyCode]/reports/journal-entries",
    loadHandler: () => import("./journal-entries/server/api/journal-entries.http.handlers").then((module) => module.handleGetJournalEntries),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Journal Entries",
    description: "Journal Entries Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: JournalEntriesResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  financialIntegrity: {
    method: "GET",
    path: "/finance/[companyCode]/reports/financial-integrity",
    loadHandler: () => import("./financial-integrity/server/api/financial-integrity.http.handlers").then((module) => module.handleGetFinancialIntegrity),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Financial Integrity",
    description: "Financial Integrity Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: FinancialIntegrityResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  profitLoss: {
    method: "GET",
    path: "/finance/[companyCode]/reports/profit-loss",
    loadHandler: () => import("./profit-loss/server/api/profit-loss.http.handlers").then((module) => module.handleGetProfitLoss),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Profit Loss",
    description: "Profit Loss Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: ProfitLossResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  profitLossAnalysis: {
    method: "GET",
    path: "/finance/[companyCode]/reports/profit-loss-analysis",
    loadHandler: () => import("./profit-loss/server/api/profit-loss-analysis.http.handlers").then((module) => module.handleGetProfitLossAnalysis),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Profit Loss Analysis",
    description: "Profit Loss Analysis Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: ProfitLossAnalysisResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  taxActivity: {
    method: "GET",
    path: "/finance/[companyCode]/reports/tax-activity",
    loadHandler: () => import("./tax-activity/server/api/tax-activity.http.handlers").then((module) => module.handleGetTaxActivity),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Tax Activity",
    description: "Tax Activity Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: TaxActivityResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  taxActivityReconciliation: {
    method: "GET",
    path: "/finance/[companyCode]/reports/tax-activity-reconciliation",
    loadHandler: () => import("./tax-activity-reconciliation/server/api/tax-activity-reconciliation.http.handlers").then((module) => module.handleGetTaxActivityReconciliation),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Tax Activity Reconciliation",
    description: "Tax Activity Reconciliation Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: TaxActivityReconciliationResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  arSubledgerEntriesAudit: {
    method: "GET",
    path: "/finance/[companyCode]/reports/ar-subledger-entries-audit",
    loadHandler: () => import("./ar-subledger-entries-audit/server/api/ar-subledger-entries-audit.http.handlers").then((module) => module.handleGetArSubledgerEntriesAudit),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "AR Subledger Entries Audit",
    description: "AR Subledger Entries Audit Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: ArSubledgerEntriesAuditResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  apSubledgerEntriesAudit: {
    method: "GET",
    path: "/finance/[companyCode]/reports/ap-subledger-entries-audit",
    loadHandler: () => import("./ap-subledger-entries-audit/server/api/ap-subledger-entries-audit.http.handlers").then((module) => module.handleGetApSubledgerEntriesAudit),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "AP Subledger Entries Audit",
    description: "AP Subledger Entries Audit Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: ApSubledgerEntriesAuditResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  inventoryLedgerEntriesAudit: {
    method: "GET",
    path: "/finance/[companyCode]/reports/inventory-ledger-entries-audit",
    loadHandler: () => import("./inventory-ledger-entries-audit/server/api/inventory-ledger-entries-audit.http.handlers").then((module) => module.handleGetInventoryLedgerEntriesAudit),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Inventory Ledger Entries Audit",
    description: "Inventory Ledger Entries Audit Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: InventoryLedgerEntriesAuditResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  taxLedgerEntriesAudit: {
    method: "GET",
    path: "/finance/[companyCode]/reports/tax-ledger-entries-audit",
    loadHandler: () => import("./tax-ledger-entries-audit/server/api/tax-ledger-entries-audit.http.handlers").then((module) => module.handleGetTaxLedgerEntriesAudit),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Tax Ledger Entries Audit",
    description: "Tax Ledger Entries Audit Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: TaxLedgerEntriesAuditResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
} as const;
