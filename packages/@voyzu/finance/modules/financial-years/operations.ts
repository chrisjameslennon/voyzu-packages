import "server-only";

import * as service0 from "./server/lib/financial-year.service";
import * as service1 from "./server/periods/lib/financial-period.service";

function operation<TArgs extends unknown[], TResult>(service: (...args: TArgs) => TResult) {
  return (...args: TArgs): TResult => service(...args);
}

export const listFinancialYears = operation(service0.listFinancialYears);
export const getFinancialYear = operation(service0.getFinancialYear);
export const createFinancialYear = operation(service0.createFinancialYear);
export const patchFinancialYear = operation(service0.patchFinancialYear);
export const deleteFinancialYear = operation(service0.deleteFinancialYear);
export const openFinancialYear = operation(service0.openFinancialYear);
export const closeFinancialYear = operation(service0.closeFinancialYear);
export const reopenFinancialYear = operation(service0.reopenFinancialYear);
export const exportFinancialYearsWithPeriods = operation(service0.exportFinancialYearsWithPeriods);
export const listPeriods = operation(service1.listPeriods);
export const closePeriod = operation(service1.closePeriod);
export const reopenPeriod = operation(service1.reopenPeriod);
export const seedPeriodsForYear = operation(service1.seedPeriodsForYear);

export const operations = {
  listFinancialYears,
  getFinancialYear,
  createFinancialYear,
  patchFinancialYear,
  deleteFinancialYear,
  openFinancialYear,
  closeFinancialYear,
  reopenFinancialYear,
  exportFinancialYearsWithPeriods,
  listPeriods,
  closePeriod,
  reopenPeriod,
  seedPeriodsForYear,
} as const;
