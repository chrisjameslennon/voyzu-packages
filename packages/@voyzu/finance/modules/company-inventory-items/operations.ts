import "server-only";

import * as service0 from "../common/inventory-items/server/lib/inventory-item.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const listInventoryItems = operation(service0.listInventoryItems);
export const filterInventoryItems = operation(service0.filterInventoryItems);
export const searchInventoryItems = operation(service0.searchInventoryItems);
export const getInventoryItem = operation(service0.getInventoryItem);
export const createInventoryItem = operation(service0.createInventoryItem);
export const updateInventoryItem = operation(service0.updateInventoryItem);
export const patchInventoryItem = operation(service0.patchInventoryItem);
export const deleteInventoryItem = operation(service0.deleteInventoryItem);
export const batchGetInventoryItems = operation(service0.batchGetInventoryItems);
export const batchCreateInventoryItems = operation(service0.batchCreateInventoryItems);
export const batchUpdateInventoryItems = operation(service0.batchUpdateInventoryItems);
export const batchPatchInventoryItems = operation(service0.batchPatchInventoryItems);
export const batchDeleteInventoryItems = operation(service0.batchDeleteInventoryItems);
export const activateInventoryItem = operation(service0.activateInventoryItem);
export const deactivateInventoryItem = operation(service0.deactivateInventoryItem);
export const activateInventoryItems = operation(service0.activateInventoryItems);
export const deactivateInventoryItems = operation(service0.deactivateInventoryItems);

export const operations = {
  listInventoryItems,
  filterInventoryItems,
  searchInventoryItems,
  getInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  patchInventoryItem,
  deleteInventoryItem,
  batchGetInventoryItems,
  batchCreateInventoryItems,
  batchUpdateInventoryItems,
  batchPatchInventoryItems,
  batchDeleteInventoryItems,
  activateInventoryItem,
  deactivateInventoryItem,
  activateInventoryItems,
  deactivateInventoryItems,
} as const;
