import "server-only";

import * as service0 from "../common/financial-document-types/server/lib/financial-document-type.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const createFinancialDocumentType = operation(service0.createFinancialDocumentType);
export const getFinancialDocumentType = operation(service0.getFinancialDocumentType);
export const updateFinancialDocumentType = operation(service0.updateFinancialDocumentType);
export const patchFinancialDocumentType = operation(service0.patchFinancialDocumentType);
export const deleteFinancialDocumentType = operation(service0.deleteFinancialDocumentType);
export const listFinancialDocumentTypes = operation(service0.listFinancialDocumentTypes);
export const filterFinancialDocumentTypes = operation(service0.filterFinancialDocumentTypes);
export const searchFinancialDocumentTypes = operation(service0.searchFinancialDocumentTypes);
export const batchGetFinancialDocumentTypes = operation(service0.batchGetFinancialDocumentTypes);
export const batchDeleteFinancialDocumentTypes = operation(service0.batchDeleteFinancialDocumentTypes);
export const batchCreateFinancialDocumentTypes = operation(service0.batchCreateFinancialDocumentTypes);
export const batchUpdateFinancialDocumentTypes = operation(service0.batchUpdateFinancialDocumentTypes);
export const batchPatchFinancialDocumentTypes = operation(service0.batchPatchFinancialDocumentTypes);
export const activateFinancialDocumentType = operation(service0.activateFinancialDocumentType);
export const deactivateFinancialDocumentType = operation(service0.deactivateFinancialDocumentType);
export const activateFinancialDocumentTypes = operation(service0.activateFinancialDocumentTypes);
export const deactivateFinancialDocumentTypes = operation(service0.deactivateFinancialDocumentTypes);

export const operations = {
  createFinancialDocumentType,
  getFinancialDocumentType,
  updateFinancialDocumentType,
  patchFinancialDocumentType,
  deleteFinancialDocumentType,
  listFinancialDocumentTypes,
  filterFinancialDocumentTypes,
  searchFinancialDocumentTypes,
  batchGetFinancialDocumentTypes,
  batchDeleteFinancialDocumentTypes,
  batchCreateFinancialDocumentTypes,
  batchUpdateFinancialDocumentTypes,
  batchPatchFinancialDocumentTypes,
  activateFinancialDocumentType,
  deactivateFinancialDocumentType,
  activateFinancialDocumentTypes,
  deactivateFinancialDocumentTypes,
} as const;
