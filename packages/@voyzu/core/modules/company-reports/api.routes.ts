import Type from "typebox";
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
    handler: (request: any) => handleGetBalanceSheet(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Balance Sheet",
    description: "Balance Sheet Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: BalanceSheetResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  balanceSheetPdf: {
    method: "GET",
    path: "/finance/[companyCode]/reports/balance-sheet/pdf",
    handler: (request: any) => handleGetBalanceSheetPdf(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Get balance sheet PDF",
    description: "Generates a balance sheet PDF for the selected company and reporting options.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Generated balance sheet PDF.", contentType: "application/pdf" }, "400": { description: "Required query parameters are missing or invalid.", body: InputValidationErrorResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  financialYears: {
    method: "GET",
    path: "/finance/[companyCode]/reports/financial-years",
    handler: (request: any) => handleListFinancialYears(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Financial Years",
    description: "Financial Years Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: Type.Array(FinancialYearResponseDto) }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  trialBalance: {
    method: "GET",
    path: "/finance/[companyCode]/reports/trial-balance",
    handler: (request: any) => handleGetTrialBalance(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Trial Balance",
    description: "Trial Balance Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: TrialBalanceResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  taxPosition: {
    method: "GET",
    path: "/finance/[companyCode]/reports/tax-position",
    handler: (request: any) => handleGetTaxPosition(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Tax Position",
    description: "Tax Position Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: TaxPositionResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  bankCashMovement: {
    method: "GET",
    path: "/finance/[companyCode]/reports/bank-cash-movement",
    handler: (request: any) => handleGetBankCashMovement(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Bank Cash Movement",
    description: "Bank Cash Movement Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: BankCashMovementResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  journalEntries: {
    method: "GET",
    path: "/finance/[companyCode]/reports/journal-entries",
    handler: (request: any) => handleGetJournalEntries(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Journal Entries",
    description: "Journal Entries Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: JournalEntriesResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  financialIntegrity: {
    method: "GET",
    path: "/finance/[companyCode]/reports/financial-integrity",
    handler: (request: any) => handleGetFinancialIntegrity(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Financial Integrity",
    description: "Financial Integrity Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: FinancialIntegrityResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  profitLoss: {
    method: "GET",
    path: "/finance/[companyCode]/reports/profit-loss",
    handler: (request: any) => handleGetProfitLoss(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Profit Loss",
    description: "Profit Loss Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: ProfitLossResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  profitLossAnalysis: {
    method: "GET",
    path: "/finance/[companyCode]/reports/profit-loss-analysis",
    handler: (request: any) => handleGetProfitLossAnalysis(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Profit Loss Analysis",
    description: "Profit Loss Analysis Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: ProfitLossAnalysisResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  taxActivity: {
    method: "GET",
    path: "/finance/[companyCode]/reports/tax-activity",
    handler: (request: any) => handleGetTaxActivity(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Tax Activity",
    description: "Tax Activity Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: TaxActivityResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  taxActivityReconciliation: {
    method: "GET",
    path: "/finance/[companyCode]/reports/tax-activity-reconciliation",
    handler: (request: any) => handleGetTaxActivityReconciliation(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Tax Activity Reconciliation",
    description: "Tax Activity Reconciliation Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: TaxActivityReconciliationResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  arSubledgerEntriesAudit: {
    method: "GET",
    path: "/finance/[companyCode]/reports/ar-subledger-entries-audit",
    handler: (request: any) => handleGetArSubledgerEntriesAudit(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "AR Subledger Entries Audit",
    description: "AR Subledger Entries Audit Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: ArSubledgerEntriesAuditResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  apSubledgerEntriesAudit: {
    method: "GET",
    path: "/finance/[companyCode]/reports/ap-subledger-entries-audit",
    handler: (request: any) => handleGetApSubledgerEntriesAudit(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "AP Subledger Entries Audit",
    description: "AP Subledger Entries Audit Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: ApSubledgerEntriesAuditResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  inventoryLedgerEntriesAudit: {
    method: "GET",
    path: "/finance/[companyCode]/reports/inventory-ledger-entries-audit",
    handler: (request: any) => handleGetInventoryLedgerEntriesAudit(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Inventory Ledger Entries Audit",
    description: "Inventory Ledger Entries Audit Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: InventoryLedgerEntriesAuditResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
  taxLedgerEntriesAudit: {
    method: "GET",
    path: "/finance/[companyCode]/reports/tax-ledger-entries-audit",
    handler: (request: any) => handleGetTaxLedgerEntriesAudit(request),
    request: { path: { companyCode: { description: "Company code that identifies the company scope for this finance API call.", schema: { type: "string" } } } },
    summary: "Tax Ledger Entries Audit",
    description: "Tax Ledger Entries Audit Company Reports.",
    tags: ["Company Reports"],
    responses: { "200": { description: "Successful response.", body: TaxLedgerEntriesAuditResponseDto }, "500": { description: "An unexpected server error occurred.", body: InternalServerErrorResponseDto } }
  },
} as const;
