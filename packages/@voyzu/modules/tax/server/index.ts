export {
  createTaxAuthority,
  createTaxComponent,
  createTaxRule,
  deleteTaxAuthority,
  deleteTaxComponent,
  deleteTaxRule,
  getCountryTaxConfiguration,
  getTaxAuthority,
  getTaxComponent,
  getTaxRule,
  listApplicableTaxAuthorities,
  listTaxAuthorities,
  listTaxComponents,
  listTaxRules,
  patchTaxAuthority,
  patchTaxComponent,
  patchTaxRule,
  updateTaxAuthority,
  updateTaxComponent,
  updateTaxRule,
} from "./lib/tax.service";

export {
  handleGetTaxAuthority,
  handleListTaxAuthorities,
} from "./api/tax.http.handlers";
