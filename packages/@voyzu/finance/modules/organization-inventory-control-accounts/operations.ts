import "server-only";

import * as service0 from "../common/inventory-control-accounts/server/lib/inventory-control-account.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const listInventoryControlAccountSettings = operation(service0.listInventoryControlAccountSettings);
export const getInventoryControlAccountSetting = operation(service0.getInventoryControlAccountSetting);
export const patchInventoryControlAccountSetting = operation(service0.patchInventoryControlAccountSetting);

export const operations = {
  listInventoryControlAccountSettings,
  getInventoryControlAccountSetting,
  patchInventoryControlAccountSetting,
} as const;
