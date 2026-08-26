import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import * as service from "./server/lib/finance-company.service";

function operation<TArgs extends unknown[], TResult>(fn: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => fn(...args);
}

export const listFinanceCompanies = operation(service.listFinanceCompanies);
export const getFinanceCompany = operation(service.getFinanceCompany);
export const activateFinanceCompany = operation(service.activateFinanceCompany);
export const updateFinanceCompany = operation(service.updateFinanceCompany);
export const listSelectableFinanceCompaniesForCurrentUser = operation(service.listSelectableFinanceCompaniesForCurrentUser);
export const resolveFinanceCompanySelectionForCurrentUser = operation(service.resolveFinanceCompanySelectionForCurrentUser);
export const deleteFinanceCompanyForErpOrganization = platformOperation.define(
  {
    parameters: Type.Tuple([Type.Number(), Type.Any()]),
    result: Type.Undefined(),
  },
  service.deleteFinanceCompanyForErpOrganization,
);

export const operations = {
  listFinanceCompanies,
  getFinanceCompany,
  activateFinanceCompany,
  updateFinanceCompany,
  listSelectableFinanceCompaniesForCurrentUser,
  resolveFinanceCompanySelectionForCurrentUser,
  deleteFinanceCompanyForErpOrganization,
} as const;
