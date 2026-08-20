import "server-only";

import * as service0 from "./server/lib/tax-ledger.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const getTaxSubledgerEntry = operation(service0.getTaxSubledgerEntry);
export const listTaxSubledgerEntries = operation(service0.listTaxSubledgerEntries);

export const operations = {
  getTaxSubledgerEntry,
  listTaxSubledgerEntries,
} as const;
