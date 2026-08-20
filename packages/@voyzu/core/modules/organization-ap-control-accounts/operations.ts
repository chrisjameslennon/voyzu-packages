import "server-only";

import * as service0 from "../common/control-accounts/server/lib/control-account.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const getControlAccount = operation(service0.getControlAccount);
export const listControlAccountSettings = operation(service0.listControlAccountSettings);
export const listControlAccountSettingsByLedger = operation(service0.listControlAccountSettingsByLedger);
export const getControlAccountByLedger = operation(service0.getControlAccountByLedger);
export const listControlAccounts = operation(service0.listControlAccounts);
export const filterControlAccounts = operation(service0.filterControlAccounts);
export const searchControlAccounts = operation(service0.searchControlAccounts);
export const patchControlAccount = operation(service0.patchControlAccount);

export const operations = {
  getControlAccount,
  listControlAccountSettings,
  listControlAccountSettingsByLedger,
  getControlAccountByLedger,
  listControlAccounts,
  filterControlAccounts,
  searchControlAccounts,
  patchControlAccount,
} as const;
