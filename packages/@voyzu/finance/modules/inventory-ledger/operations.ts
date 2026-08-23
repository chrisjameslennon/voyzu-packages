import "server-only";

import * as service0 from "./server/lib/inventory-ledger.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const listInventoryLedgerEntries = operation(service0.listInventoryLedgerEntries);
export const getInventoryLedgerEntry = operation(service0.getInventoryLedgerEntry);

export const operations = {
  listInventoryLedgerEntries,
  getInventoryLedgerEntry,
} as const;
