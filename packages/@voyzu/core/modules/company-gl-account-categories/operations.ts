import "server-only";

import * as service0 from "../common/gl-account-categories/server/lib/gl-account-category.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const createGlAccountCategory = operation(service0.createGlAccountCategory);
export const getGlAccountCategory = operation(service0.getGlAccountCategory);
export const updateGlAccountCategory = operation(service0.updateGlAccountCategory);
export const patchGlAccountCategory = operation(service0.patchGlAccountCategory);
export const deleteGlAccountCategory = operation(service0.deleteGlAccountCategory);
export const listGlAccountCategories = operation(service0.listGlAccountCategories);
export const filterGlAccountCategories = operation(service0.filterGlAccountCategories);
export const searchGlAccountCategories = operation(service0.searchGlAccountCategories);
export const batchCreateGlAccountCategories = operation(service0.batchCreateGlAccountCategories);
export const batchGetGlAccountCategories = operation(service0.batchGetGlAccountCategories);
export const batchUpdateGlAccountCategories = operation(service0.batchUpdateGlAccountCategories);
export const batchPatchGlAccountCategories = operation(service0.batchPatchGlAccountCategories);
export const batchDeleteGlAccountCategories = operation(service0.batchDeleteGlAccountCategories);
export const activateGlAccountCategories = operation(service0.activateGlAccountCategories);
export const activateGlAccountCategory = operation(service0.activateGlAccountCategory);
export const deactivateGlAccountCategories = operation(service0.deactivateGlAccountCategories);
export const deactivateGlAccountCategory = operation(service0.deactivateGlAccountCategory);

export const operations = {
  createGlAccountCategory,
  getGlAccountCategory,
  updateGlAccountCategory,
  patchGlAccountCategory,
  deleteGlAccountCategory,
  listGlAccountCategories,
  filterGlAccountCategories,
  searchGlAccountCategories,
  batchCreateGlAccountCategories,
  batchGetGlAccountCategories,
  batchUpdateGlAccountCategories,
  batchPatchGlAccountCategories,
  batchDeleteGlAccountCategories,
  activateGlAccountCategories,
  activateGlAccountCategory,
  deactivateGlAccountCategories,
  deactivateGlAccountCategory,
} as const;
