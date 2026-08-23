import "server-only";

import * as service0 from "./server/organization-selection.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const filterSelectableOrganizations = operation(service0.filterSelectableOrganizations);
export const filterAccessibleOrganizations = operation(service0.filterAccessibleOrganizations);
export const resolveOrganizationSelection = operation(service0.resolveOrganizationSelection);
export const listSelectableOrganizationsForCurrentUser = operation(service0.listSelectableOrganizationsForCurrentUser);
export const listAccessibleOrganizationsForCurrentUser = operation(service0.listAccessibleOrganizationsForCurrentUser);
export const resolveOrganizationSelectionForCurrentUser = operation(service0.resolveOrganizationSelectionForCurrentUser);

export const operations = {
  filterSelectableOrganizations,
  filterAccessibleOrganizations,
  resolveOrganizationSelection,
  listSelectableOrganizationsForCurrentUser,
  listAccessibleOrganizationsForCurrentUser,
  resolveOrganizationSelectionForCurrentUser,
} as const;
