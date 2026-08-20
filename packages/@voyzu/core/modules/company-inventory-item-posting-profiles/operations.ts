import "server-only";

import * as service0 from "../common/inventory-item-posting-profiles/server/lib/item-posting-profile.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const listItemPostingProfiles = operation(service0.listItemPostingProfiles);
export const filterItemPostingProfiles = operation(service0.filterItemPostingProfiles);
export const searchItemPostingProfiles = operation(service0.searchItemPostingProfiles);
export const getItemPostingProfile = operation(service0.getItemPostingProfile);
export const createItemPostingProfile = operation(service0.createItemPostingProfile);
export const updateItemPostingProfile = operation(service0.updateItemPostingProfile);
export const patchItemPostingProfile = operation(service0.patchItemPostingProfile);
export const deleteItemPostingProfile = operation(service0.deleteItemPostingProfile);
export const batchGetItemPostingProfiles = operation(service0.batchGetItemPostingProfiles);
export const batchCreateItemPostingProfiles = operation(service0.batchCreateItemPostingProfiles);
export const batchUpdateItemPostingProfiles = operation(service0.batchUpdateItemPostingProfiles);
export const batchPatchItemPostingProfiles = operation(service0.batchPatchItemPostingProfiles);
export const batchDeleteItemPostingProfiles = operation(service0.batchDeleteItemPostingProfiles);
export const activateItemPostingProfile = operation(service0.activateItemPostingProfile);
export const deactivateItemPostingProfile = operation(service0.deactivateItemPostingProfile);
export const activateItemPostingProfiles = operation(service0.activateItemPostingProfiles);
export const deactivateItemPostingProfiles = operation(service0.deactivateItemPostingProfiles);

export const operations = {
  listItemPostingProfiles,
  filterItemPostingProfiles,
  searchItemPostingProfiles,
  getItemPostingProfile,
  createItemPostingProfile,
  updateItemPostingProfile,
  patchItemPostingProfile,
  deleteItemPostingProfile,
  batchGetItemPostingProfiles,
  batchCreateItemPostingProfiles,
  batchUpdateItemPostingProfiles,
  batchPatchItemPostingProfiles,
  batchDeleteItemPostingProfiles,
  activateItemPostingProfile,
  deactivateItemPostingProfile,
  activateItemPostingProfiles,
  deactivateItemPostingProfiles,
} as const;
