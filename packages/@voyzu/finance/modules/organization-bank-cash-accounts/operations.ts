import "server-only";

import * as service0 from "../common/bank-cash-accounts/server/lib/bank-cash-account.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const listBankCashAccounts = operation(service0.listBankCashAccounts);
export const filterBankCashAccounts = operation(service0.filterBankCashAccounts);
export const searchBankCashAccounts = operation(service0.searchBankCashAccounts);
export const getBankCashAccount = operation(service0.getBankCashAccount);
export const createBankCashAccount = operation(service0.createBankCashAccount);
export const patchBankCashAccount = operation(service0.patchBankCashAccount);
export const updateBankCashAccount = operation(service0.updateBankCashAccount);
export const deleteBankCashAccount = operation(service0.deleteBankCashAccount);
export const batchGetBankCashAccounts = operation(service0.batchGetBankCashAccounts);
export const batchCreateBankCashAccounts = operation(service0.batchCreateBankCashAccounts);
export const batchUpdateBankCashAccounts = operation(service0.batchUpdateBankCashAccounts);
export const batchPatchBankCashAccounts = operation(service0.batchPatchBankCashAccounts);
export const batchDeleteBankCashAccounts = operation(service0.batchDeleteBankCashAccounts);
export const activateBankCashAccount = operation(service0.activateBankCashAccount);
export const deactivateBankCashAccount = operation(service0.deactivateBankCashAccount);
export const activateBankCashAccounts = operation(service0.activateBankCashAccounts);
export const deactivateBankCashAccounts = operation(service0.deactivateBankCashAccounts);
export const resolveBankCashDetails = operation(service0.resolveBankCashDetails);
export const toJournalBankCashFields = operation(service0.toJournalBankCashFields);

export const operations = {
  listBankCashAccounts,
  filterBankCashAccounts,
  searchBankCashAccounts,
  getBankCashAccount,
  createBankCashAccount,
  patchBankCashAccount,
  updateBankCashAccount,
  deleteBankCashAccount,
  batchGetBankCashAccounts,
  batchCreateBankCashAccounts,
  batchUpdateBankCashAccounts,
  batchPatchBankCashAccounts,
  batchDeleteBankCashAccounts,
  activateBankCashAccount,
  deactivateBankCashAccount,
  activateBankCashAccounts,
  deactivateBankCashAccounts,
  resolveBankCashDetails,
  toJournalBankCashFields,
} as const;
