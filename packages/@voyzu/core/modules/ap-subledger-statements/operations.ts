import "server-only";

import * as service0 from "./server/lib/ap-subledger-statement.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const listApCounterpartySummaries = operation(service0.listApCounterpartySummaries);
export const getApCounterpartyStatement = operation(service0.getApCounterpartyStatement);

export const operations = {
  listApCounterpartySummaries,
  getApCounterpartyStatement,
} as const;
