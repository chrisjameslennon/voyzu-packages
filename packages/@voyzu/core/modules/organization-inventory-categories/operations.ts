import "server-only";

import * as service0 from "../common/inventory-categories/server/lib/inventory-category.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const listInventoryCategories = operation(service0.listInventoryCategories);
export const filterInventoryCategories = operation(service0.filterInventoryCategories);
export const searchInventoryCategories = operation(service0.searchInventoryCategories);
export const getInventoryCategory = operation(service0.getInventoryCategory);
export const createInventoryCategory = operation(service0.createInventoryCategory);
export const updateInventoryCategory = operation(service0.updateInventoryCategory);
export const patchInventoryCategory = operation(service0.patchInventoryCategory);
export const deleteInventoryCategory = operation(service0.deleteInventoryCategory);
export const batchGetInventoryCategories = operation(service0.batchGetInventoryCategories);
export const batchCreateInventoryCategories = operation(service0.batchCreateInventoryCategories);
export const batchUpdateInventoryCategories = operation(service0.batchUpdateInventoryCategories);
export const batchPatchInventoryCategories = operation(service0.batchPatchInventoryCategories);
export const batchDeleteInventoryCategories = operation(service0.batchDeleteInventoryCategories);
export const activateInventoryCategory = operation(service0.activateInventoryCategory);
export const deactivateInventoryCategory = operation(service0.deactivateInventoryCategory);
export const activateInventoryCategories = operation(service0.activateInventoryCategories);
export const deactivateInventoryCategories = operation(service0.deactivateInventoryCategories);

export const operations = {
  listInventoryCategories,
  filterInventoryCategories,
  searchInventoryCategories,
  getInventoryCategory,
  createInventoryCategory,
  updateInventoryCategory,
  patchInventoryCategory,
  deleteInventoryCategory,
  batchGetInventoryCategories,
  batchCreateInventoryCategories,
  batchUpdateInventoryCategories,
  batchPatchInventoryCategories,
  batchDeleteInventoryCategories,
  activateInventoryCategory,
  deactivateInventoryCategory,
  activateInventoryCategories,
  deactivateInventoryCategories,
} as const;
