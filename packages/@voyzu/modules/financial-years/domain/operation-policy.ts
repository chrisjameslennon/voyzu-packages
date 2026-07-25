import type { FinancialYearStatus } from "@voyzu/types/modules/financial-years";
import { CodeChange, Deletion, type OperationBlocker } from "@voyzu/modules/common/domain/operation-policy";

export interface FinancialYearOperationState {
  id: number;
  code: string;
  startDate: string;
  status: FinancialYearStatus;
  hasPostings: boolean;
}

export function ChangeCode(
  current: Pick<FinancialYearOperationState, "code" | "hasPostings">,
  proposedCode: string,
): OperationBlocker[] {
  return CodeChange(current, proposedCode, "Financial year");
}

function nonContiguousOpenYear(
  years: readonly FinancialYearOperationState[],
  statusOverrides: ReadonlyMap<number, FinancialYearStatus> = new Map(),
): FinancialYearOperationState | undefined {
  const sorted = [...years].sort((left, right) => left.startDate.localeCompare(right.startDate));
  const openIndices = sorted
    .map((year, index) => (statusOverrides.get(year.id) ?? year.status) === "OPEN" ? index : -1)
    .filter((index) => index >= 0);
  if (openIndices.length < 2) return undefined;

  const firstOpen = openIndices[0];
  const lastOpen = openIndices[openIndices.length - 1];
  return sorted
    .slice(firstOpen, lastOpen + 1)
    .find((year) => (statusOverrides.get(year.id) ?? year.status) !== "OPEN");
}

function contiguousOpenYearsBlocker(
  years: readonly FinancialYearOperationState[],
  statusOverrides: ReadonlyMap<number, FinancialYearStatus>,
  operation: "open" | "close" | "reopen" | "delete",
): OperationBlocker[] {
  const gap = nonContiguousOpenYear(years, statusOverrides);
  if (!gap) return [];
  return [{
    code: "OPEN_FINANCIAL_YEARS_NOT_CONTIGUOUS",
    message: `Cannot ${operation} financial year: open financial years must form one contiguous block. ${gap.code} (${statusOverrides.get(gap.id) ?? gap.status}) would sit between open financial years.`,
  }];
}

export function OpenYearsContiguous(
  allYears: readonly FinancialYearOperationState[],
): OperationBlocker[] {
  return contiguousOpenYearsBlocker(allYears, new Map(), "open");
}

export function Open(
  current: FinancialYearOperationState,
  allYears: readonly FinancialYearOperationState[],
): OperationBlocker[] {
  const blockers: OperationBlocker[] = [];
  if (current.status !== "INACTIVE" && current.status !== "PLANNED") {
    blockers.push({
      code: "FINANCIAL_YEAR_CANNOT_BE_OPENED_FROM_STATUS",
      message: `Cannot open financial year: current status is ${current.status}. Must be INACTIVE or PLANNED.`,
    });
  }
  blockers.push(...contiguousOpenYearsBlocker(allYears, new Map([[current.id, "OPEN"]]), "open"));
  return blockers;
}

export function Close(
  current: FinancialYearOperationState,
  allYears: readonly FinancialYearOperationState[],
  openPeriodCount: number,
): OperationBlocker[] {
  const blockers: OperationBlocker[] = [];
  if (current.status !== "OPEN") {
    blockers.push({
      code: "FINANCIAL_YEAR_CANNOT_BE_CLOSED_FROM_STATUS",
      message: `Cannot close financial year: current status is ${current.status}. Must be OPEN.`,
    });
  }
  if (openPeriodCount > 0) {
    blockers.push({
      code: "FINANCIAL_YEAR_HAS_OPEN_PERIODS",
      message: `Cannot close financial year: ${openPeriodCount} open financial period(s) remain. All periods must be closed first.`,
    });
  }
  blockers.push(...contiguousOpenYearsBlocker(allYears, new Map([[current.id, "CLOSED"]]), "close"));
  return blockers;
}

export function Reopen(
  current: FinancialYearOperationState,
  allYears: readonly FinancialYearOperationState[],
): OperationBlocker[] {
  const blockers: OperationBlocker[] = [];
  if (current.status !== "CLOSED") {
    blockers.push({
      code: "FINANCIAL_YEAR_CANNOT_BE_REOPENED_FROM_STATUS",
      message: `Cannot reopen financial year: current status is ${current.status}. Must be CLOSED.`,
    });
  }
  blockers.push(...contiguousOpenYearsBlocker(allYears, new Map([[current.id, "OPEN"]]), "reopen"));
  return blockers;
}

export function Delete(
  current: FinancialYearOperationState,
  allYears: readonly FinancialYearOperationState[],
): OperationBlocker[] {
  const blockers = Deletion(current, "Financial year", { blockWhenHasPostings: true });
  const sorted = [...allYears].sort((left, right) => left.startDate.localeCompare(right.startDate));
  const index = sorted.findIndex((year) => year.id === current.id);
  if (index > 0 && index < sorted.length - 1) {
    blockers.push({
      code: "FINANCIAL_YEAR_CALENDAR_GAP",
      message: `Cannot delete financial year: it sits between ${sorted[index - 1].code} and ${sorted[index + 1].code}. Deleting it would create a gap in the financial calendar.`,
    });
  }

  const remainingYears = allYears.filter((year) => year.id !== current.id);
  blockers.push(...contiguousOpenYearsBlocker(remainingYears, new Map(), "delete"));
  return blockers;
}
