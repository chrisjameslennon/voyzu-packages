import "server-only";

import * as service0 from "./server/lib/ar-subledger-statement.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const listArCounterpartySummaries = operation(service0.listArCounterpartySummaries);
export const getArCounterpartyStatement = operation(service0.getArCounterpartyStatement);

export const operations = {
  listArCounterpartySummaries,
  getArCounterpartyStatement,
} as const;
