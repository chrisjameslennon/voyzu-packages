import type { Ledger } from "@voyzu/finance/types/modules/core";

const LEDGER_NAMES: Record<Ledger, string> = {
  ACCOUNTS_PAYABLE: "Accounts Payable",
  ACCOUNTS_RECEIVABLE: "Accounts Receivable",
  GENERAL: "General Ledger",
  TAX: "Tax",
  INVENTORY: "Inventory",
  BANK_CASH: "Bank / Cash",
};

export function ledgerName(ledger: Ledger): string {
  return LEDGER_NAMES[ledger];
}
