import "server-only";

import * as service0 from "../common/dimensions/server/lib/dimension.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const createDimension = operation(service0.createDimension);
export const getDimension = operation(service0.getDimension);
export const updateDimension = operation(service0.updateDimension);
export const patchDimension = operation(service0.patchDimension);
export const deleteDimension = operation(service0.deleteDimension);
export const listDimensions = operation(service0.listDimensions);
export const filterDimensions = operation(service0.filterDimensions);
export const searchDimensions = operation(service0.searchDimensions);
export const batchCreateDimensions = operation(service0.batchCreateDimensions);
export const batchGetDimensions = operation(service0.batchGetDimensions);
export const batchUpdateDimensions = operation(service0.batchUpdateDimensions);
export const batchPatchDimensions = operation(service0.batchPatchDimensions);
export const batchDeleteDimensions = operation(service0.batchDeleteDimensions);
export const activateDimensions = operation(service0.activateDimensions);
export const activateDimension = operation(service0.activateDimension);
export const deactivateDimensions = operation(service0.deactivateDimensions);
export const deactivateDimension = operation(service0.deactivateDimension);
export const createDimensionValue = operation(service0.createDimensionValue);
export const listDimensionValues = operation(service0.listDimensionValues);
export const patchDimensionValue = operation(service0.patchDimensionValue);
export const deleteDimensionValue = operation(service0.deleteDimensionValue);

export const operations = {
  createDimension,
  getDimension,
  updateDimension,
  patchDimension,
  deleteDimension,
  listDimensions,
  filterDimensions,
  searchDimensions,
  batchCreateDimensions,
  batchGetDimensions,
  batchUpdateDimensions,
  batchPatchDimensions,
  batchDeleteDimensions,
  activateDimensions,
  activateDimension,
  deactivateDimensions,
  deactivateDimension,
  createDimensionValue,
  listDimensionValues,
  patchDimensionValue,
  deleteDimensionValue,
} as const;
