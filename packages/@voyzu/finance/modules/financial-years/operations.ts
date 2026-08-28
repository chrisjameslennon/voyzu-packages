import "server-only";
import { operation as platformOperation } from "@voyzu/capability/operations";
import Type from "typebox";
import { FinancialPeriodResponseDto } from "@voyzu/finance/types/modules/financial-periods";
import { FinancialYearCreateRequestDto, FinancialYearPatchRequestDto, FinancialYearResponseDto } from "@voyzu/finance/types/modules/financial-years";



export const listFinancialYears = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(FinancialYearResponseDto) },
  () => import("./server/lib/financial-year.service").then((module) => module.listFinancialYears),
);
export const getFinancialYear = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([FinancialYearResponseDto, Type.Null()]) },
  () => import("./server/lib/financial-year.service").then((module) => module.getFinancialYear),
);
export const createFinancialYear = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), FinancialYearCreateRequestDto]), result: FinancialYearResponseDto },
  () => import("./server/lib/financial-year.service").then((module) => module.createFinancialYear),
);
export const patchFinancialYear = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String(), FinancialYearPatchRequestDto]), result: FinancialYearResponseDto },
  () => import("./server/lib/financial-year.service").then((module) => module.patchFinancialYear),
);
export const deleteFinancialYear = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Undefined() },
  () => import("./server/lib/financial-year.service").then((module) => module.deleteFinancialYear),
);
export const openFinancialYear = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: FinancialYearResponseDto },
  () => import("./server/lib/financial-year.service").then((module) => module.openFinancialYear),
);
export const closeFinancialYear = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: FinancialYearResponseDto },
  () => import("./server/lib/financial-year.service").then((module) => module.closeFinancialYear),
);
export const reopenFinancialYear = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: FinancialYearResponseDto },
  () => import("./server/lib/financial-year.service").then((module) => module.reopenFinancialYear),
);
export const exportFinancialYearsWithPeriods = platformOperation.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), Type.Array(Type.Number())]),
    result: Type.Object({
      years: Type.Array(FinancialYearResponseDto),
      periods: Type.Array(FinancialPeriodResponseDto),
    }, { additionalProperties: false }),
  },
  () => import("./server/lib/financial-year.service").then((module) => module.exportFinancialYearsWithPeriods),
);
export const listPeriods = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(FinancialPeriodResponseDto) },
  () => import("./server/periods/lib/financial-period.service").then((module) => module.listPeriods),
);
export const closePeriod = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String(), Type.String()]), result: FinancialPeriodResponseDto },
  () => import("./server/periods/lib/financial-period.service").then((module) => module.closePeriod),
);
export const reopenPeriod = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String(), Type.String()]), result: FinancialPeriodResponseDto },
  () => import("./server/periods/lib/financial-period.service").then((module) => module.reopenPeriod),
);
export const seedPeriodsForYear = platformOperation.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.Number(), Type.String(), Type.String()]), result: Type.Undefined() },
  () => import("./server/periods/lib/financial-period.service").then((module) => module.seedPeriodsForYear),
);

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
