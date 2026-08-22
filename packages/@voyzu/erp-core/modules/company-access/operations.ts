import "server-only";

import * as service from "./server/lib/company-access.service";

function operation<TArgs extends unknown[], TResult>(implementation: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => implementation(...args);
}

export const listCompanyAccess = operation(service.listCompanyAccess);
export const listCompanyIdsForUser = operation(service.listCompanyIdsForUser);
export const replaceUserCompanyAccess = operation(service.replaceUserCompanyAccess);

export const operations = {
  listCompanyAccess,
  listCompanyIdsForUser,
  replaceUserCompanyAccess,
} as const;
