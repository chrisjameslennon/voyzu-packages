import "server-only";

import * as service0 from "./server/lib/ap-subledger-counterparty.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const listApCounterparties = operation(service0.listApCounterparties);
export const getApCounterparty = operation(service0.getApCounterparty);

export const operations = {
  listApCounterparties,
  getApCounterparty,
} as const;
