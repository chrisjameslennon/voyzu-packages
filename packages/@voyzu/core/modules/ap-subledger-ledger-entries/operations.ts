import "server-only";

import * as service0 from "./server/lib/ap-subledger-ledger-entries.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const listApSubledgerEntries = operation(service0.listApSubledgerEntries);
export const getApSubledgerEntry = operation(service0.getApSubledgerEntry);

export const operations = {
  listApSubledgerEntries,
  getApSubledgerEntry,
} as const;
