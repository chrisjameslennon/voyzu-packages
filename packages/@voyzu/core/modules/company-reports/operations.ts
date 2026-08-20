import "server-only";

import * as service0 from "./ap-subledger-entries-audit/server/lib/ap-subledger-entries-audit.service";
import * as service1 from "./ar-subledger-entries-audit/server/lib/ar-subledger-entries-audit.service";
import * as service2 from "./balance-sheet/server/lib/balance-sheet.service";
import * as service3 from "./bank-cash-movement/server/lib/bank-cash-movement.service";
import * as service4 from "./financial-integrity/server/lib/financial-integrity.service";
import * as service5 from "./inventory-ledger-entries-audit/server/lib/inventory-ledger-entries-audit.service";
import * as service6 from "./journal-entries/server/lib/journal-entries.service";
import * as service7 from "./profit-loss/server/lib/profit-loss.service";
import * as service8 from "./tax-activity/server/lib/tax-activity.service";
import * as service9 from "./tax-activity-reconciliation/server/lib/tax-activity-reconciliation.service";
import * as service10 from "./tax-ledger-entries-audit/server/lib/tax-ledger-entries-audit.service";
import * as service11 from "./tax-position/server/lib/tax-position.service";
import * as service12 from "./trial-balance/server/lib/trial-balance.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const getApSubledgerEntriesAudit = operation(service0.getApSubledgerEntriesAudit);
export const getArSubledgerEntriesAudit = operation(service1.getArSubledgerEntriesAudit);
export const getOrganizationName = operation(service2.getOrganizationName);
export const listFinancialYearsWithPostings = operation(service2.listFinancialYearsWithPostings);
export const getBalanceSheet = operation(service2.getBalanceSheet);
export const getBankCashMovement = operation(service3.getBankCashMovement);
export const getFinancialIntegrity = operation(service4.getFinancialIntegrity);
export const getInventoryLedgerEntriesAudit = operation(service5.getInventoryLedgerEntriesAudit);
export const getJournalEntries = operation(service6.getJournalEntries);
export const getProfitLoss = operation(service7.getProfitLoss);
export const getProfitLossAnalysis = operation(service7.getProfitLossAnalysis);
export const getTaxActivity = operation(service8.getTaxActivity);
export const getTaxActivityReconciliation = operation(service9.getTaxActivityReconciliation);
export const getTaxLedgerEntriesAudit = operation(service10.getTaxLedgerEntriesAudit);
export const getTaxPosition = operation(service11.getTaxPosition);
export const getTrialBalance = operation(service12.getTrialBalance);

export const operations = {
  getApSubledgerEntriesAudit,
  getArSubledgerEntriesAudit,
  getOrganizationName,
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
