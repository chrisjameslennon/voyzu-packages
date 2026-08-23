import "server-only";

import * as service0 from "./server/lib/ap-bill-report.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const getApLedgerEntryDocumentReport = operation(service0.getApLedgerEntryDocumentReport);

export const operations = {
  getApLedgerEntryDocumentReport,
} as const;
