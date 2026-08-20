import "server-only";

import * as service0 from "../common/tax-control-accounts/server/lib/tax-control-account.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const listTaxControlAccounts = operation(service0.listTaxControlAccounts);
export const getTaxControlAccount = operation(service0.getTaxControlAccount);
export const patchTaxControlAccount = operation(service0.patchTaxControlAccount);

export const operations = {
  listTaxControlAccounts,
  getTaxControlAccount,
  patchTaxControlAccount,
} as const;
