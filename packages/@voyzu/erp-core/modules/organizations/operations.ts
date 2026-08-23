import "server-only";

import * as service from "./server/lib/organization.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const createOrganization = operation(service.createOrganization);
export const getOrganization = operation(service.getOrganization);
export const updateOrganization = operation(service.updateOrganization);
export const patchOrganization = operation(service.patchOrganization);
export const deleteOrganization = operation(service.deleteOrganization);
export const listOrganizations = operation(service.listOrganizations);
export const filterOrganizations = operation(service.filterOrganizations);
export const searchOrganizations = operation(service.searchOrganizations);
export const batchCreateOrganizations = operation(service.batchCreateOrganizations);
export const batchGetOrganizations = operation(service.batchGetOrganizations);
export const batchUpdateOrganizations = operation(service.batchUpdateOrganizations);
export const batchPatchOrganizations = operation(service.batchPatchOrganizations);
export const batchDeleteOrganizations = operation(service.batchDeleteOrganizations);
export const activateOrganizations = operation(service.activateOrganizations);
export const deactivateOrganizations = operation(service.deactivateOrganizations);
export const activateOrganization = operation(service.activateOrganization);
export const deactivateOrganization = operation(service.deactivateOrganization);

export const operations = {
  createOrganization,
  getOrganization,
  updateOrganization,
  patchOrganization,
  deleteOrganization,
  listOrganizations,
  filterOrganizations,
  searchOrganizations,
  batchCreateOrganizations,
  batchGetOrganizations,
  batchUpdateOrganizations,
  batchPatchOrganizations,
  batchDeleteOrganizations,
  activateOrganizations,
  deactivateOrganizations,
  activateOrganization,
  deactivateOrganization,
} as const;
