import "server-only";
import { command as platformCommand } from "@voyzu/capability/commands";
import Type from "typebox";
import { FinancialPeriodResponseDto } from "@voyzu/finance/types/modules/financial-periods";
import { FinancialYearCreateRequestDto, FinancialYearPatchRequestDto, FinancialYearResponseDto } from "@voyzu/finance/types/modules/financial-years";



export const listFinancialYears = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(FinancialYearResponseDto) },
  () => import("./server/lib/financial-year.service").then((module) => module.listFinancialYears),
);
export const getFinancialYear = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Union([FinancialYearResponseDto, Type.Null()]) },
  () => import("./server/lib/financial-year.service").then((module) => module.getFinancialYear),
);
export const createFinancialYear = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), FinancialYearCreateRequestDto]), result: FinancialYearResponseDto },
  () => import("./server/lib/financial-year.service").then((module) => module.createFinancialYear),
);
export const patchFinancialYear = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String(), FinancialYearPatchRequestDto]), result: FinancialYearResponseDto },
  () => import("./server/lib/financial-year.service").then((module) => module.patchFinancialYear),
);
export const deleteFinancialYear = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: Type.Undefined() },
  () => import("./server/lib/financial-year.service").then((module) => module.deleteFinancialYear),
);
export const openFinancialYear = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: FinancialYearResponseDto },
  () => import("./server/lib/financial-year.service").then((module) => module.openFinancialYear),
);
export const closeFinancialYear = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: FinancialYearResponseDto },
  () => import("./server/lib/financial-year.service").then((module) => module.closeFinancialYear),
);
export const reopenFinancialYear = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String()]), result: FinancialYearResponseDto },
  () => import("./server/lib/financial-year.service").then((module) => module.reopenFinancialYear),
);
export const exportFinancialYearsWithPeriods = platformCommand.defineLazy(
  {
    parameters: Type.Tuple([Type.Number(), Type.Array(Type.Number())]),
    result: Type.Object({
      years: Type.Array(FinancialYearResponseDto),
      periods: Type.Array(FinancialPeriodResponseDto),
    }, { additionalProperties: false }),
  },
  () => import("./server/lib/financial-year.service").then((module) => module.exportFinancialYearsWithPeriods),
);
export const listPeriods = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number()]), result: Type.Array(FinancialPeriodResponseDto) },
  () => import("./server/periods/lib/financial-period.service").then((module) => module.listPeriods),
);
export const closePeriod = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String(), Type.String()]), result: FinancialPeriodResponseDto },
  () => import("./server/periods/lib/financial-period.service").then((module) => module.closePeriod),
);
export const reopenPeriod = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.String(), Type.String()]), result: FinancialPeriodResponseDto },
  () => import("./server/periods/lib/financial-period.service").then((module) => module.reopenPeriod),
);
export const seedPeriodsForYear = platformCommand.defineLazy(
  { parameters: Type.Tuple([Type.Number(), Type.Number(), Type.String(), Type.String()]), result: Type.Undefined() },
  () => import("./server/periods/lib/financial-period.service").then((module) => module.seedPeriodsForYear),
);

export const commands = {
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
