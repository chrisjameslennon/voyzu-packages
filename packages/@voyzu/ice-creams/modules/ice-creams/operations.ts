import "server-only";

import * as iceCreamService from "./server/lib/ice-cream.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const listIceCreamFlavors = operation(iceCreamService.listIceCreamFlavors);
export const createIceCream = operation(iceCreamService.createIceCream);
export const getIceCream = operation(iceCreamService.getIceCream);
export const listIceCreams = operation(iceCreamService.listIceCreams);
export const filterIceCreams = operation(iceCreamService.filterIceCreams);
export const searchIceCreams = operation(iceCreamService.searchIceCreams);
export const updateIceCream = operation(iceCreamService.updateIceCream);
export const patchIceCream = operation(iceCreamService.patchIceCream);
export const batchCreateIceCreams = operation(iceCreamService.batchCreateIceCreams);
export const batchGetIceCreams = operation(iceCreamService.batchGetIceCreams);
export const batchUpdateIceCreams = operation(iceCreamService.batchUpdateIceCreams);
export const batchPatchIceCreams = operation(iceCreamService.batchPatchIceCreams);
export const deleteIceCream = operation(iceCreamService.deleteIceCream);
export const batchDeleteIceCreams = operation(iceCreamService.batchDeleteIceCreams);
export const activateIceCream = operation(iceCreamService.activateIceCream);
export const deactivateIceCream = operation(iceCreamService.deactivateIceCream);
export const activateIceCreams = operation(iceCreamService.activateIceCreams);
export const deactivateIceCreams = operation(iceCreamService.deactivateIceCreams);

export const operations = {
  listIceCreamFlavors,
  createIceCream,
  getIceCream,
  listIceCreams,
  filterIceCreams,
  searchIceCreams,
  updateIceCream,
  patchIceCream,
  batchCreateIceCreams,
  batchGetIceCreams,
  batchUpdateIceCreams,
  batchPatchIceCreams,
  deleteIceCream,
  batchDeleteIceCreams,
  activateIceCream,
  deactivateIceCream,
  activateIceCreams,
  deactivateIceCreams,
} as const;
