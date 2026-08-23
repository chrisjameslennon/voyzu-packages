import type { FinancialYearCreateRequestDto } from "@voyzu/finance/types/modules/financial-years";
import type { FinancialYearPatchRequestDto } from "@voyzu/finance/types/modules/financial-years";
import type { FinancialYearResponseDto } from "@voyzu/finance/types/modules/financial-years";
import { runtime } from "@voyzu/capability/runtime";
import { BusinessRuleError, ConflictError, NotFoundError, InputValidationError, DataError } from "@voyzu/capability/errors";
import { getDb } from "@voyzu/capability/db";
import { createCreationAuditStamp, createUpdateAuditStamp, withAuditActors, withCreationAudit, withUpdateAudit, type UpdateAuditStamp } from "../../../common/server";

import type { FinancialPeriodResponseDto } from "@voyzu/finance/types/modules/financial-periods";
import { FinancialYearRepo } from "../db/financial-year.repo";
import { toDto, toInsertRow } from "./financial-year.mapper";
import { validateFinancialYearDateRange } from "./financial-year.validator";
import { seedPeriodsForYear } from "../periods/lib/financial-period.service";
import { FinancialPeriodRepo } from "../periods/db/financial-period.repo";
import { toDto as toPeriodDto } from "../periods/lib/financial-period.mapper";
import {
  ChangeCode,
  Close,
  Delete,
  Open,
  OpenYearsContiguous,
  Reopen,
  type FinancialYearOperationState,
} from "../../domain/operation-policy";

async function enrichRow(row: Parameters<typeof toDto>[0]): Promise<FinancialYearResponseDto> {
  return await withAuditActors(toDto(row), row);
}

function operationState(year: {
  id: number;
  code: string;
  start_date: string;
  status: string;
  has_postings: boolean;
}): FinancialYearOperationState {
  return {
    id: year.id,
    code: year.code,
    startDate: year.start_date,
    status: year.status as FinancialYearOperationState["status"],
    hasPostings: year.has_postings,
  };
}

function dtoOperationState(year: FinancialYearResponseDto): FinancialYearOperationState {
  return {
    id: year.id,
    code: year.code,
    startDate: year.startDate,
    status: year.status,
    hasPostings: year.hasPostings,
  };
}

function enforce(blockers: ReturnType<typeof Open>): void {
  if (blockers.length) {
    throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));
  }
}

function checkOpenYearsContiguous(
  allYears: Array<{ id: number; code: string; start_date: string; status: string; has_postings: boolean }>,
): void {
  enforce(OpenYearsContiguous(allYears.map(operationState)));
}

async function openYear(
  year: FinancialYearResponseDto,
  repo: FinancialYearRepo,
  companyId: number,
  audit: UpdateAuditStamp,
): Promise<void> {
  const allYears = await repo.listByCompany(companyId);
  enforce(Open(dtoOperationState(year), allYears.map(operationState)));

  await repo.updateStatus(year.id, "OPEN", audit);
  await seedPeriodsForYear(year.companyId, year.id, year.startDate, year.endDate);
}

async function closeYear(
  year: FinancialYearResponseDto,
  repo: FinancialYearRepo,
  companyId: number,
  audit: UpdateAuditStamp,
): Promise<void> {
  const allYears = await repo.listByCompany(companyId);
  const openPeriods = await repo.openPeriodsCount(year.id);
  enforce(Close(dtoOperationState(year), allYears.map(operationState), openPeriods));

  await repo.updateStatus(year.id, "CLOSED", audit);
}

async function reopenYear(
  year: FinancialYearResponseDto,
  repo: FinancialYearRepo,
  companyId: number,
  audit: UpdateAuditStamp,
): Promise<void> {
  const allYears = await repo.listByCompany(companyId);
  enforce(Reopen(dtoOperationState(year), allYears.map(operationState)));

  await repo.updateStatus(year.id, "OPEN", audit);
}

async function deleteYear(
  year: FinancialYearResponseDto,
  repo: FinancialYearRepo,
  companyId: number,
): Promise<void> {
  const allYears = await repo.listByCompany(companyId);
  enforce(Delete(dtoOperationState(year), allYears.map(operationState)));
  await repo.delete(companyId, year.code);
}

// ── List ──────────────────────────────────────────────────────

export async function listFinancialYears(companyId: number): Promise<FinancialYearResponseDto[]> {
  const rows = await new FinancialYearRepo(getDb()).listByCompany(companyId);
  return Promise.all(rows.map((r) => enrichRow(r)));
}

// ── Get ───────────────────────────────────────────────────────

export async function getFinancialYear(companyId: number, code: string): Promise<FinancialYearResponseDto | null> {
  const row = await new FinancialYearRepo(getDb()).get(companyId, code);
  if (!row) return null;
  return enrichRow(row);
}

// ── Create ────────────────────────────────────────────────────

export async function createFinancialYear(
  companyId: number,
  input: FinancialYearCreateRequestDto,
): Promise<FinancialYearResponseDto> {
  const errors = validateFinancialYearDateRange(input.startDate, input.endDate);
  if (errors.length) throw new InputValidationError(errors.join("; "));

  const repo = new FinancialYearRepo(getDb());

  try {
    const row = await repo.insert(withCreationAudit(toInsertRow(input, companyId), await createCreationAuditStamp()));
    const dto = await enrichRow(row);

    // If created directly as OPEN, validate contiguity and seed periods
    if (input.status === "OPEN") {
      const allYears = await repo.listByCompany(companyId);
      checkOpenYearsContiguous(allYears);
      await seedPeriodsForYear(companyId, dto.id, dto.startDate, dto.endDate);
    }

    return enrichRow(await repo.getById(dto.id) ?? row);
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("A financial year with this code already exists for this company");
    }
    if (err instanceof Error && err.message.includes("overlaps")) {
      throw new ConflictError("The date range overlaps with an existing financial year for this company");
    }
    throw err;
  }
}

// ── Patch ─────────────────────────────────────────────────────

export async function patchFinancialYear(
  companyId: number,
  code: string,
  input: FinancialYearPatchRequestDto,
): Promise<FinancialYearResponseDto> {
  const repo = new FinancialYearRepo(getDb());

  try {
    const existing = await repo.get(companyId, code);
    if (!existing) throw new NotFoundError(`Financial year ${code} not found`);
    const errors = validateFinancialYearDateRange(
      input.startDate ?? existing.start_date,
      input.endDate ?? existing.end_date,
    );
    if (errors.length) throw new InputValidationError(errors.join("; "));
    if (input.code !== undefined) {
      const blockers = ChangeCode({ code: existing.code, hasPostings: existing.has_postings }, input.code);
      if (blockers.length) throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));
    }
    const patchRow: Parameters<typeof repo.patch>[2] = {};
    if (input.code !== undefined) patchRow.code = input.code;
    if (input.name !== undefined) patchRow.name = input.name;
    if (input.startDate !== undefined) patchRow.start_date = input.startDate;
    if (input.endDate !== undefined) patchRow.end_date = input.endDate;

    const row = await repo.patch(companyId, code, withUpdateAudit(patchRow, await createUpdateAuditStamp()));
    return enrichRow(row);
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("A financial year with this code already exists for this company");
    }
    if (err instanceof Error && err.message.includes("overlaps")) {
      throw new ConflictError("The date range overlaps with an existing financial year for this company");
    }
    if (err instanceof DataError) {
      throw new NotFoundError(`Financial year ${code} not found`);
    }
    throw err;
  }
}

// ── Delete ────────────────────────────────────────────────────

export async function deleteFinancialYear(companyId: number, code: string): Promise<void> {
  const repo = new FinancialYearRepo(getDb());
  const row = await repo.get(companyId, code);
  if (!row) throw new NotFoundError(`Financial year ${code} not found`);
  await deleteYear(await enrichRow(row), repo, companyId);
}

// ── Lifecycle ─────────────────────────────────────────────────

export async function openFinancialYear(companyId: number, code: string): Promise<FinancialYearResponseDto> {
  const repo = new FinancialYearRepo(getDb());
  const row = await repo.get(companyId, code);
  if (!row) throw new NotFoundError(`Financial year ${code} not found`);
  const dto = await enrichRow(row);
  await openYear(dto, repo, companyId, await createUpdateAuditStamp());
  return enrichRow(await repo.get(companyId, row.code) ?? row);
}

export async function closeFinancialYear(companyId: number, code: string): Promise<FinancialYearResponseDto> {
  const repo = new FinancialYearRepo(getDb());
  const row = await repo.get(companyId, code);
  if (!row) throw new NotFoundError(`Financial year ${code} not found`);
  const dto = await enrichRow(row);
  await closeYear(dto, repo, companyId, await createUpdateAuditStamp());
  return enrichRow(await repo.get(companyId, row.code) ?? row);
}

export async function reopenFinancialYear(companyId: number, code: string): Promise<FinancialYearResponseDto> {
  const repo = new FinancialYearRepo(getDb());
  const row = await repo.get(companyId, code);
  if (!row) throw new NotFoundError(`Financial year ${code} not found`);
  const dto = await enrichRow(row);
  await reopenYear(dto, repo, companyId, await createUpdateAuditStamp());
  return enrichRow(await repo.get(companyId, row.code) ?? row);
}

// ── Export ────────────────────────────────────────────────────

export async function exportFinancialYearsWithPeriods(
  companyId: number,
  yearIds: number[],
): Promise<{ years: FinancialYearResponseDto[]; periods: FinancialPeriodResponseDto[] }> {
  const db = getDb();
  const yearRepo = new FinancialYearRepo(db);
  const allRows = await yearRepo.listByCompany(companyId);
  const filteredRows = yearIds.length > 0
    ? allRows.filter((r) => yearIds.includes(r.id))
    : allRows;
  const years = await Promise.all(filteredRows.map((r) => enrichRow(r)));
  const periodRows = await new FinancialPeriodRepo(db).listByYearIds(filteredRows.map((r) => r.id));
  const periods = periodRows.map((r) => toPeriodDto(r));
  return { years, periods };
}
