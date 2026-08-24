import "server-only";

import * as service from "./server/lib/ice-cream.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const listIceCreamFlavors = operation(service.listIceCreamFlavors);
export const createIceCream = operation(service.createIceCream);
export const getIceCream = operation(service.getIceCream);
export const listIceCreams = operation(service.listIceCreams);
export const filterIceCreams = operation(service.filterIceCreams);
export const searchIceCreams = operation(service.searchIceCreams);
export const updateIceCream = operation(service.updateIceCream);
export const patchIceCream = operation(service.patchIceCream);
export const batchCreateIceCreams = operation(service.batchCreateIceCreams);
export const batchGetIceCreams = operation(service.batchGetIceCreams);
export const batchUpdateIceCreams = operation(service.batchUpdateIceCreams);
export const batchPatchIceCreams = operation(service.batchPatchIceCreams);
export const deleteIceCream = operation(service.deleteIceCream);
export const batchDeleteIceCreams = operation(service.batchDeleteIceCreams);
export const activateIceCream = operation(service.activateIceCream);
export const deactivateIceCream = operation(service.deactivateIceCream);
export const activateIceCreams = operation(service.activateIceCreams);
export const deactivateIceCreams = operation(service.deactivateIceCreams);

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
