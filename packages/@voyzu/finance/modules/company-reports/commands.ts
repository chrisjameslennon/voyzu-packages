import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { ApSubledgerEntriesAuditResponseDto, ArSubledgerEntriesAuditResponseDto, BankCashMovementResponseDto, FinancialIntegrityResponseDto, InventoryLedgerEntriesAuditResponseDto, JournalEntriesResponseDto, ProfitLossAnalysisResponseDto, ProfitLossBreakdownDto, ProfitLossDimensionSelectionDto, ProfitLossResponseDto, TaxActivityReconciliationResponseDto, TaxActivityResponseDto, TaxLedgerEntriesAuditResponseDto, TaxPositionResponseDto, TrialBalanceResponseDto } from "@voyzu/finance/types/modules/company-reports";
import { BalanceSheetResponseDto } from "@voyzu/finance/types/modules/company-reports/balance-sheet";
import { FinancialYearResponseDto } from "@voyzu/finance/types/modules/financial-years";



export const getApSubledgerEntriesAudit = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String(), Type.String()]), result: ApSubledgerEntriesAuditResponseDto },
  () => import("./ap-subledger-entries-audit/server/lib/ap-subledger-entries-audit.service").then((module) => module.getApSubledgerEntriesAudit),
);
export const getArSubledgerEntriesAudit = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String(), Type.String()]), result: ArSubledgerEntriesAuditResponseDto },
  () => import("./ar-subledger-entries-audit/server/lib/ar-subledger-entries-audit.service").then((module) => module.getArSubledgerEntriesAudit),
);
export const listFinancialYearsWithPostings = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(FinancialYearResponseDto) },
  () => import("./balance-sheet/server/lib/balance-sheet.service").then((module) => module.listFinancialYearsWithPostings),
);
export const getBalanceSheet = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Number()]), Type.Tuple([Type.Number(), Type.Union([Type.String(), Type.Null()])])]), result: BalanceSheetResponseDto },
  () => import("./balance-sheet/server/lib/balance-sheet.service").then((module) => module.getBalanceSheet),
);
export const getBankCashMovement = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Number(), Type.String(), Type.String()]), Type.Tuple([Type.Number(), Type.String(), Type.String(), Type.Union([Type.String(), Type.Null()])])]), result: BankCashMovementResponseDto },
  () => import("./bank-cash-movement/server/lib/bank-cash-movement.service").then((module) => module.getBankCashMovement),
);
export const getFinancialIntegrity = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Number(), Type.String(), Type.String()]), Type.Tuple([Type.Number(), Type.String(), Type.String(), Type.Union([Type.String(), Type.Null()])])]), result: FinancialIntegrityResponseDto },
  () => import("./financial-integrity/server/lib/financial-integrity.service").then((module) => module.getFinancialIntegrity),
);
export const getInventoryLedgerEntriesAudit = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String(), Type.String()]), result: InventoryLedgerEntriesAuditResponseDto },
  () => import("./inventory-ledger-entries-audit/server/lib/inventory-ledger-entries-audit.service").then((module) => module.getInventoryLedgerEntriesAudit),
);
export const getJournalEntries = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String(), Type.String()]), result: JournalEntriesResponseDto },
  () => import("./journal-entries/server/lib/journal-entries.service").then((module) => module.getJournalEntries),
);
export const getProfitLoss = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String(), Type.String()]), result: ProfitLossResponseDto },
  () => import("./profit-loss/server/lib/profit-loss.service").then((module) => module.getProfitLoss),
);
export const getProfitLossAnalysis = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String(), Type.String(), Type.Array(ProfitLossDimensionSelectionDto), Type.Union([ProfitLossBreakdownDto, Type.Null()])]), result: ProfitLossAnalysisResponseDto },
  () => import("./profit-loss/server/lib/profit-loss.service").then((module) => module.getProfitLossAnalysis),
);
export const getTaxActivity = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String(), Type.String(), Type.String()]), result: TaxActivityResponseDto },
  () => import("./tax-activity/server/lib/tax-activity.service").then((module) => module.getTaxActivity),
);
export const getTaxActivityReconciliation = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Number(), Type.String(), Type.String(), Type.String()]), Type.Tuple([Type.Number(), Type.String(), Type.String(), Type.String(), Type.Union([Type.String(), Type.Null()])])]), result: TaxActivityReconciliationResponseDto },
  () => import("./tax-activity-reconciliation/server/lib/tax-activity-reconciliation.service").then((module) => module.getTaxActivityReconciliation),
);
export const getTaxLedgerEntriesAudit = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String(), Type.String()]), result: TaxLedgerEntriesAuditResponseDto },
  () => import("./tax-ledger-entries-audit/server/lib/tax-ledger-entries-audit.service").then((module) => module.getTaxLedgerEntriesAudit),
);
export const getTaxPosition = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: TaxPositionResponseDto },
  () => import("./tax-position/server/lib/tax-position.service").then((module) => module.getTaxPosition),
);
export const getTrialBalance = platformCommand.defineLazy(
  { parameters: Type.Union([Type.Tuple([Type.Number()]), Type.Tuple([Type.Number(), Type.Union([Type.String(), Type.Null()])])]), result: TrialBalanceResponseDto },
  () => import("./trial-balance/server/lib/trial-balance.service").then((module) => module.getTrialBalance),
);

export const commands = {
  getApSubledgerEntriesAudit,
  getArSubledgerEntriesAudit,
  listFinancialYearsWithPostings,
  getBalanceSheet,
  getBankCashMovement,
  getFinancialIntegrity,
  getInventoryLedgerEntriesAudit,
  getJournalEntries,
  getProfitLoss,
  getProfitLossAnalysis,
  getTaxActivity,
  getTaxActivityReconciliation,
  getTaxLedgerEntriesAudit,
  getTaxPosition,
  getTrialBalance,
} as const;
