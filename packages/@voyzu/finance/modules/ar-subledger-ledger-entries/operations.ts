import "server-only";

import * as service0 from "./server/lib/ar-subledger-ledger-entries.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const getArSubledgerEntry = operation(service0.getArSubledgerEntry);
export const listArSubledgerEntries = operation(service0.listArSubledgerEntries);
export const getArLedgerEntryDocumentReport = operation(service0.getArLedgerEntryDocumentReport);

export const operations = {
  getArSubledgerEntry,
  listArSubledgerEntries,
  getArLedgerEntryDocumentReport,
} as const;
