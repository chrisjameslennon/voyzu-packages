import "server-only";

import * as service0 from "../common/gl-accounts/server/lib/gl-account.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const createGlAccount = operation(service0.createGlAccount);
export const getGlAccount = operation(service0.getGlAccount);
export const updateGlAccount = operation(service0.updateGlAccount);
export const patchGlAccount = operation(service0.patchGlAccount);
export const deleteGlAccount = operation(service0.deleteGlAccount);
export const listGlAccounts = operation(service0.listGlAccounts);
export const filterGlAccounts = operation(service0.filterGlAccounts);
export const searchGlAccounts = operation(service0.searchGlAccounts);
export const batchCreateGlAccounts = operation(service0.batchCreateGlAccounts);
export const batchGetGlAccounts = operation(service0.batchGetGlAccounts);
export const batchUpdateGlAccounts = operation(service0.batchUpdateGlAccounts);
export const batchPatchGlAccounts = operation(service0.batchPatchGlAccounts);
export const batchDeleteGlAccounts = operation(service0.batchDeleteGlAccounts);
export const activateGlAccounts = operation(service0.activateGlAccounts);
export const activateGlAccount = operation(service0.activateGlAccount);
export const deactivateGlAccounts = operation(service0.deactivateGlAccounts);
export const deactivateGlAccount = operation(service0.deactivateGlAccount);

export const operations = {
  createGlAccount,
  getGlAccount,
  updateGlAccount,
  patchGlAccount,
  deleteGlAccount,
  listGlAccounts,
  filterGlAccounts,
  searchGlAccounts,
  batchCreateGlAccounts,
  batchGetGlAccounts,
  batchUpdateGlAccounts,
  batchPatchGlAccounts,
  batchDeleteGlAccounts,
  activateGlAccounts,
  activateGlAccount,
  deactivateGlAccounts,
  deactivateGlAccount,
} as const;
