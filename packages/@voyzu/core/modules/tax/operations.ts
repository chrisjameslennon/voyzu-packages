import "server-only";

import * as service0 from "./server/lib/tax.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const createTaxAuthority = operation(service0.createTaxAuthority);
export const getTaxAuthority = operation(service0.getTaxAuthority);
export const listTaxAuthorities = operation(service0.listTaxAuthorities);
export const listApplicableTaxAuthorities = operation(service0.listApplicableTaxAuthorities);
export const updateTaxAuthority = operation(service0.updateTaxAuthority);
export const patchTaxAuthority = operation(service0.patchTaxAuthority);
export const deleteTaxAuthority = operation(service0.deleteTaxAuthority);
export const createTaxRule = operation(service0.createTaxRule);
export const getTaxRule = operation(service0.getTaxRule);
export const listTaxRules = operation(service0.listTaxRules);
export const updateTaxRule = operation(service0.updateTaxRule);
export const patchTaxRule = operation(service0.patchTaxRule);
export const deleteTaxRule = operation(service0.deleteTaxRule);
export const createTaxComponent = operation(service0.createTaxComponent);
export const getTaxComponent = operation(service0.getTaxComponent);
export const listTaxComponents = operation(service0.listTaxComponents);
export const updateTaxComponent = operation(service0.updateTaxComponent);
export const patchTaxComponent = operation(service0.patchTaxComponent);
export const deleteTaxComponent = operation(service0.deleteTaxComponent);
export const getCountryTaxConfiguration = operation(service0.getCountryTaxConfiguration);

export const operations = {
  createTaxAuthority,
  getTaxAuthority,
  listTaxAuthorities,
  listApplicableTaxAuthorities,
  updateTaxAuthority,
  patchTaxAuthority,
  deleteTaxAuthority,
  createTaxRule,
  getTaxRule,
  listTaxRules,
  updateTaxRule,
  patchTaxRule,
  deleteTaxRule,
  createTaxComponent,
  getTaxComponent,
  listTaxComponents,
  updateTaxComponent,
  patchTaxComponent,
  deleteTaxComponent,
  getCountryTaxConfiguration,
} as const;
