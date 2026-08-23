import "server-only";

import * as service0 from "./server/lib/ar-invoice-statement.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const getArInvoiceStatement = operation(service0.getArInvoiceStatement);

export const operations = {
  getArInvoiceStatement,
} as const;
