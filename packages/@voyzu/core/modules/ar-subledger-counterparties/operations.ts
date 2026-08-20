import "server-only";

import * as service0 from "./server/lib/ar-subledger-counterparty.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const listArCounterparties = operation(service0.listArCounterparties);
export const getArCounterparty = operation(service0.getArCounterparty);

export const operations = {
  listArCounterparties,
  getArCounterparty,
} as const;
