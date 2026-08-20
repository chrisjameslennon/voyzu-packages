import "server-only";

import * as service0 from "../common/financial-document-defaults/server/lib/financial-document-default.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const encodeFinancialDocumentDefaultKey = operation(service0.encodeFinancialDocumentDefaultKey);
export const decodeFinancialDocumentDefaultKey = operation(service0.decodeFinancialDocumentDefaultKey);
export const createFinancialDocumentDefault = operation(service0.createFinancialDocumentDefault);
export const getFinancialDocumentDefault = operation(service0.getFinancialDocumentDefault);
export const updateFinancialDocumentDefault = operation(service0.updateFinancialDocumentDefault);
export const patchFinancialDocumentDefault = operation(service0.patchFinancialDocumentDefault);
export const deleteFinancialDocumentDefault = operation(service0.deleteFinancialDocumentDefault);
export const listFinancialDocumentDefaults = operation(service0.listFinancialDocumentDefaults);
export const listFinancialDocumentDefaultSlots = operation(service0.listFinancialDocumentDefaultSlots);
export const filterFinancialDocumentDefaults = operation(service0.filterFinancialDocumentDefaults);
export const searchFinancialDocumentDefaults = operation(service0.searchFinancialDocumentDefaults);
export const batchCreateFinancialDocumentDefaults = operation(service0.batchCreateFinancialDocumentDefaults);
export const batchGetFinancialDocumentDefaults = operation(service0.batchGetFinancialDocumentDefaults);
export const batchUpdateFinancialDocumentDefaults = operation(service0.batchUpdateFinancialDocumentDefaults);
export const batchPatchFinancialDocumentDefaults = operation(service0.batchPatchFinancialDocumentDefaults);
export const batchDeleteFinancialDocumentDefaults = operation(service0.batchDeleteFinancialDocumentDefaults);
export const activateFinancialDocumentDefault = operation(service0.activateFinancialDocumentDefault);
export const deactivateFinancialDocumentDefault = operation(service0.deactivateFinancialDocumentDefault);
export const activateFinancialDocumentDefaults = operation(service0.activateFinancialDocumentDefaults);
export const deactivateFinancialDocumentDefaults = operation(service0.deactivateFinancialDocumentDefaults);
export const normalizeFinancialDocumentDefaultKeys = operation(service0.normalizeFinancialDocumentDefaultKeys);

export const operations = {
  encodeFinancialDocumentDefaultKey,
  decodeFinancialDocumentDefaultKey,
  createFinancialDocumentDefault,
  getFinancialDocumentDefault,
  updateFinancialDocumentDefault,
  patchFinancialDocumentDefault,
  deleteFinancialDocumentDefault,
  listFinancialDocumentDefaults,
  listFinancialDocumentDefaultSlots,
  filterFinancialDocumentDefaults,
  searchFinancialDocumentDefaults,
  batchCreateFinancialDocumentDefaults,
  batchGetFinancialDocumentDefaults,
  batchUpdateFinancialDocumentDefaults,
  batchPatchFinancialDocumentDefaults,
  batchDeleteFinancialDocumentDefaults,
  activateFinancialDocumentDefault,
  deactivateFinancialDocumentDefault,
  activateFinancialDocumentDefaults,
  deactivateFinancialDocumentDefaults,
  normalizeFinancialDocumentDefaultKeys,
} as const;
