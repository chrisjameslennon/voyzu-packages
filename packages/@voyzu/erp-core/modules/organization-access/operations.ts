import "server-only";

import * as service from "./server/lib/organization-access.service";

function operation<TArgs extends unknown[], TResult>(implementation: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => implementation(...args);
}

export const listOrganizationAccess = operation(service.listOrganizationAccess);
export const listOrganizationIdsForUser = operation(service.listOrganizationIdsForUser);
export const replaceUserOrganizationAccess = operation(service.replaceUserOrganizationAccess);

export const operations = {
  listOrganizationAccess,
  listOrganizationIdsForUser,
  replaceUserOrganizationAccess,
} as const;
