import "server-only";

import * as service from "./server/lib/company.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const createCompany = operation(service.createCompany);
export const getCompany = operation(service.getCompany);
export const updateCompany = operation(service.updateCompany);
export const patchCompany = operation(service.patchCompany);
export const deleteCompany = operation(service.deleteCompany);
export const listCompanies = operation(service.listCompanies);
export const filterCompanies = operation(service.filterCompanies);
export const searchCompanies = operation(service.searchCompanies);
export const batchCreateCompanies = operation(service.batchCreateCompanies);
export const batchGetCompanies = operation(service.batchGetCompanies);
export const batchUpdateCompanies = operation(service.batchUpdateCompanies);
export const batchPatchCompanies = operation(service.batchPatchCompanies);
export const batchDeleteCompanies = operation(service.batchDeleteCompanies);
export const activateCompanies = operation(service.activateCompanies);
export const deactivateCompanies = operation(service.deactivateCompanies);
export const activateCompany = operation(service.activateCompany);
export const deactivateCompany = operation(service.deactivateCompany);

export const operations = {
  createCompany,
  getCompany,
  updateCompany,
  patchCompany,
  deleteCompany,
  listCompanies,
  filterCompanies,
  searchCompanies,
  batchCreateCompanies,
  batchGetCompanies,
  batchUpdateCompanies,
  batchPatchCompanies,
  batchDeleteCompanies,
  activateCompanies,
  deactivateCompanies,
  activateCompany,
  deactivateCompany,
} as const;
