import Type from "typebox";
import { InputValidationErrorResponseDto, InternalServerErrorResponseDto } from "@voyzu/types";
import { TaxLedgerEntriesAuditResponseDto } from "./tax-ledger-entries-audit/types/tax-ledger-entries-audit.response.dto";
import { InventoryLedgerEntriesAuditResponseDto } from "./inventory-ledger-entries-audit/types/inventory-ledger-entries-audit.response.dto";
import { ApSubledgerEntriesAuditResponseDto } from "./ap-subledger-entries-audit/types/ap-subledger-entries-audit.response.dto";
import { ArSubledgerEntriesAuditResponseDto } from "./ar-subledger-entries-audit/types/ar-subledger-entries-audit.response.dto";
import { TaxActivityReconciliationResponseDto } from "./tax-activity-reconciliation/types/tax-activity-reconciliation.response.dto";
import { TaxActivityResponseDto } from "./tax-activity/types/tax-activity.response.dto";
import { ProfitLossAnalysisResponseDto } from "./profit-loss/types/profit-loss-analysis.response.dto";
import { ProfitLossResponseDto } from "./profit-loss/types/profit-loss.response.dto";
import { FinancialIntegrityResponseDto } from "./financial-integrity/types/financial-integrity.response.dto";
import { JournalEntriesResponseDto } from "./journal-entries/types/journal-entries.response.dto";
import { BankCashMovementResponseDto } from "./bank-cash-movement/types/bank-cash-movement.response.dto";
import { TaxPositionResponseDto } from "./tax-position/types/tax-position.response.dto";
import { TrialBalanceResponseDto } from "./trial-balance/types/trial-balance.response.dto";
import { FinancialYearResponseDto } from "../financial-years/types/financial-year.response.dto";
import { BalanceSheetResponseDto } from "./balance-sheet/types/balance-sheet.response.dto";



export const httpApiRoutes = {
  "ledger.reports.balanceSheet": {
    description: "Balance Sheet Company Reports.",
    method: "GET",
    path: "/ledger/[companyCode]/reports/balance-sheet",
    loadHandler: () => import("./balance-sheet/server/http-api/balance-sheet.http.handlers").then((module) => module.handleGetBalanceSheet),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "Balance Sheet",
    
    
    responses: { "200": { description: "Successful response.", body: BalanceSheetResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  "ledger.reports.balanceSheetPdf": {
    description: "Generates a balance sheet PDF for the selected company and reporting options.",
    method: "GET",
    path: "/ledger/[companyCode]/reports/balance-sheet/pdf",
    loadHandler: () => import("./balance-sheet/server/http-api/balance-sheet-pdf.http.handlers").then((module) => module.handleGetBalanceSheetPdf),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "Get balance sheet PDF",
    
    
    responses: { "200": { description: "Generated balance sheet PDF.", contentType: "application/pdf" }, "400": { description: "Required query parameters are missing or invalid.", body: InputValidationErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  "ledger.reports.financialYears": {
    description: "Financial Years Company Reports.",
    method: "GET",
    path: "/ledger/[companyCode]/reports/financial-years",
    loadHandler: () => import("./balance-sheet/server/http-api/balance-sheet.http.handlers").then((module) => module.handleListFinancialYears),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "Financial Years",
    
    
    responses: { "200": { description: "Successful response.", body: Type.Array(FinancialYearResponseDto) }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  "ledger.reports.trialBalance": {
    description: "Trial Balance Company Reports.",
    method: "GET",
    path: "/ledger/[companyCode]/reports/trial-balance",
    loadHandler: () => import("./trial-balance/server/http-api/trial-balance.http.handlers").then((module) => module.handleGetTrialBalance),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "Trial Balance",
    
    
    responses: { "200": { description: "Successful response.", body: TrialBalanceResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  "ledger.reports.taxPosition": {
    description: "Tax Position Company Reports.",
    method: "GET",
    path: "/ledger/[companyCode]/reports/tax-position",
    loadHandler: () => import("./tax-position/server/http-api/tax-position.http.handlers").then((module) => module.handleGetTaxPosition),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "Tax Position",
    
    
    responses: { "200": { description: "Successful response.", body: TaxPositionResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  "ledger.reports.bankCashMovement": {
    description: "Bank Cash Movement Company Reports.",
    method: "GET",
    path: "/ledger/[companyCode]/reports/bank-cash-movement",
    loadHandler: () => import("./bank-cash-movement/server/http-api/bank-cash-movement.http.handlers").then((module) => module.handleGetBankCashMovement),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "Bank Cash Movement",
    
    
    responses: { "200": { description: "Successful response.", body: BankCashMovementResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  "ledger.reports.journalEntries": {
    description: "Journal Entries Company Reports.",
    method: "GET",
    path: "/ledger/[companyCode]/reports/journal-entries",
    loadHandler: () => import("./journal-entries/server/http-api/journal-entries.http.handlers").then((module) => module.handleGetJournalEntries),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "Journal Entries",
    
    
    responses: { "200": { description: "Successful response.", body: JournalEntriesResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  "ledger.reports.financialIntegrity": {
    description: "Financial Integrity Company Reports.",
    method: "GET",
    path: "/ledger/[companyCode]/reports/financial-integrity",
    loadHandler: () => import("./financial-integrity/server/http-api/financial-integrity.http.handlers").then((module) => module.handleGetFinancialIntegrity),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "Financial Integrity",
    
    
    responses: { "200": { description: "Successful response.", body: FinancialIntegrityResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  "ledger.reports.profitLoss": {
    description: "Profit Loss Company Reports.",
    method: "GET",
    path: "/ledger/[companyCode]/reports/profit-loss",
    loadHandler: () => import("./profit-loss/server/http-api/profit-loss.http.handlers").then((module) => module.handleGetProfitLoss),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "Profit Loss",
    
    
    responses: { "200": { description: "Successful response.", body: ProfitLossResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  "ledger.reports.profitLossAnalysis": {
    description: "Profit Loss Analysis Company Reports.",
    method: "GET",
    path: "/ledger/[companyCode]/reports/profit-loss-analysis",
    loadHandler: () => import("./profit-loss/server/http-api/profit-loss-analysis.http.handlers").then((module) => module.handleGetProfitLossAnalysis),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "Profit Loss Analysis",
    
    
    responses: { "200": { description: "Successful response.", body: ProfitLossAnalysisResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  "ledger.reports.taxActivity": {
    description: "Tax Activity Company Reports.",
    method: "GET",
    path: "/ledger/[companyCode]/reports/tax-activity",
    loadHandler: () => import("./tax-activity/server/http-api/tax-activity.http.handlers").then((module) => module.handleGetTaxActivity),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "Tax Activity",
    
    
    responses: { "200": { description: "Successful response.", body: TaxActivityResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  "ledger.reports.taxActivityReconciliation": {
    description: "Tax Activity Reconciliation Company Reports.",
    method: "GET",
    path: "/ledger/[companyCode]/reports/tax-activity-reconciliation",
    loadHandler: () => import("./tax-activity-reconciliation/server/http-api/tax-activity-reconciliation.http.handlers").then((module) => module.handleGetTaxActivityReconciliation),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "Tax Activity Reconciliation",
    
    
    responses: { "200": { description: "Successful response.", body: TaxActivityReconciliationResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  "ledger.reports.arSubledgerEntriesAudit": {
    description: "AR Subledger Entries Audit Company Reports.",
    method: "GET",
    path: "/ledger/[companyCode]/reports/ar-subledger-entries-audit",
    loadHandler: () => import("./ar-subledger-entries-audit/server/http-api/ar-subledger-entries-audit.http.handlers").then((module) => module.handleGetArSubledgerEntriesAudit),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "AR Subledger Entries Audit",
    
    
    responses: { "200": { description: "Successful response.", body: ArSubledgerEntriesAuditResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  "ledger.reports.apSubledgerEntriesAudit": {
    description: "AP Subledger Entries Audit Company Reports.",
    method: "GET",
    path: "/ledger/[companyCode]/reports/ap-subledger-entries-audit",
    loadHandler: () => import("./ap-subledger-entries-audit/server/http-api/ap-subledger-entries-audit.http.handlers").then((module) => module.handleGetApSubledgerEntriesAudit),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "AP Subledger Entries Audit",
    
    
    responses: { "200": { description: "Successful response.", body: ApSubledgerEntriesAuditResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  "ledger.reports.inventoryLedgerEntriesAudit": {
    description: "Inventory Ledger Entries Audit Company Reports.",
    method: "GET",
    path: "/ledger/[companyCode]/reports/inventory-ledger-entries-audit",
    loadHandler: () => import("./inventory-ledger-entries-audit/server/http-api/inventory-ledger-entries-audit.http.handlers").then((module) => module.handleGetInventoryLedgerEntriesAudit),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "Inventory Ledger Entries Audit",
    
    
    responses: { "200": { description: "Successful response.", body: InventoryLedgerEntriesAuditResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  "ledger.reports.taxLedgerEntriesAudit": {
    description: "Tax Ledger Entries Audit Company Reports.",
    method: "GET",
    path: "/ledger/[companyCode]/reports/tax-ledger-entries-audit",
    loadHandler: () => import("./tax-ledger-entries-audit/server/http-api/tax-ledger-entries-audit.http.handlers").then((module) => module.handleGetTaxLedgerEntriesAudit),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance HTTP API call.", schema: { type: "string" } } } },
    summary: "Tax Ledger Entries Audit",
    
    
    responses: { "200": { description: "Successful response.", body: TaxLedgerEntriesAuditResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
} as const;
