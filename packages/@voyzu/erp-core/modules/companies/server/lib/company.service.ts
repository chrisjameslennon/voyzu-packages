import { getDb, withTransaction, type DbExecutor } from "@voyzu/capability/db";
import { ConflictError, DataError, InputValidationError, NotFoundError } from "@voyzu/capability/errors";
import { events as platformEvents } from "@voyzu/capability/events";
import { createCreationAuditStamp, createUpdateAuditStamp, withAuditActors, withCreationAudit, withUpdateAudit } from "@voyzu/erp-core/common/server";
import type {
  CompanyBatchPatchRequestDto,
  CompanyBatchUpdateRequestDto,
  CompanyCreateRequestDto,
  CompanyPatchRequestDto,
  CompanyResponseDto,
  CompanyUpdateRequestDto,
} from "@voyzu/erp-core/types/modules/companies";
import type { Filter, ListOptions } from "@voyzu/types/params";

import { events } from "../../events";
import { CompanyRepo } from "../db/company.repo";
import type { CompanyRow } from "../db/company.row.types";
import { toDto, toInsertRow, toPatchRow, toUpdateRow } from "./company.mapper";

async function enrichRow(row: CompanyRow): Promise<CompanyResponseDto> {
  return withAuditActors(toDto(row), row);
}

function enrichRows(rows: CompanyRow[]): Promise<CompanyResponseDto[]> {
  return Promise.all(rows.map(enrichRow));
}

function normalizeCodes(codes: string[]): string[] {
  return [...new Set(codes.map((code) => code.trim().toUpperCase()).filter(Boolean))];
}

function translateWriteError(error: unknown, notFoundMessage?: string): never {
  if (error instanceof DataError && notFoundMessage) throw new NotFoundError(notFoundMessage);
  if (error instanceof Error && error.message.includes("duplicate key value")) {
    throw new ConflictError("A company with this code already exists");
  }
  throw error;
}

export async function createCompany(input: CompanyCreateRequestDto): Promise<CompanyResponseDto> {
  try {
    return await withTransaction(async (db) => {
      const row = toInsertRow(input);
      const created = await new CompanyRepo(db).insert(withCreationAudit(row, await createCreationAuditStamp()));
      return enrichRow(created);
    });
  } catch (error) {
    return translateWriteError(error);
  }
}

export async function getCompany(code: string): Promise<CompanyResponseDto | null> {
  const row = await new CompanyRepo(getDb()).get(code.trim().toUpperCase());
  return row ? enrichRow(row) : null;
}

export async function updateCompany(code: string, input: CompanyUpdateRequestDto): Promise<CompanyResponseDto> {
  try {
    const row = await new CompanyRepo(getDb()).update(
      code.trim().toUpperCase(),
      withUpdateAudit(toUpdateRow(input), await createUpdateAuditStamp()),
    );
    return enrichRow(row);
  } catch (error) {
    return translateWriteError(error, `Company ${code} not found`);
  }
}

export async function patchCompany(code: string, input: CompanyPatchRequestDto): Promise<CompanyResponseDto> {
  try {
    return await withTransaction(async (db) => {
      const row = await new CompanyRepo(db).patch(
        code.trim().toUpperCase(),
        withUpdateAudit(toPatchRow(input), await createUpdateAuditStamp()),
      );
      const company = await enrichRow(row);
      await platformEvents.dispatch(events.companyUpdated, company, { transaction: db });
      return company;
    });
  } catch (error) {
    return translateWriteError(error, `Company ${code} not found`);
  }
}

export async function deleteCompany(code: string): Promise<void> {
  await withTransaction(async (db) => {
    const normalized = code.trim().toUpperCase();
    const repo = new CompanyRepo(db);
    const row = await repo.get(normalized);
    if (!row) throw new NotFoundError(`Company ${normalized} not found`);
    const company = await enrichRow(row);
    await platformEvents.dispatch(events.companyDeleted, company, { transaction: db });
    await repo.delete(normalized);
  });
}

export async function listCompanies(): Promise<CompanyResponseDto[]> {
  return enrichRows(await new CompanyRepo(getDb()).listAll());
}

export async function filterCompanies(filters: Filter[], options?: ListOptions): Promise<CompanyResponseDto[]> {
  return enrichRows(await new CompanyRepo(getDb()).filter(filters, options));
}

export async function searchCompanies(phrase: string, options?: ListOptions): Promise<CompanyResponseDto[]> {
  return enrichRows(await new CompanyRepo(getDb()).search(phrase, options));
}

export async function batchCreateCompanies(inputs: CompanyCreateRequestDto[]): Promise<CompanyResponseDto[]> {
  try {
    return await withTransaction(async (db) => {
      const repo = new CompanyRepo(db);
      const audit = await createCreationAuditStamp();
      const rows: CompanyRow[] = [];
      for (const input of inputs) {
        rows.push(await repo.insert(withCreationAudit(toInsertRow(input), audit)));
      }
      return enrichRows(rows);
    });
  } catch (error) {
    return translateWriteError(error);
  }
}

export async function batchGetCompanies(codes: string[]): Promise<CompanyResponseDto[]> {
  return enrichRows(await new CompanyRepo(getDb()).batchGet(normalizeCodes(codes)));
}

export async function batchUpdateCompanies(inputs: CompanyBatchUpdateRequestDto[]): Promise<CompanyResponseDto[]> {
  try {
    return await withTransaction(async (db) => {
      const repo = new CompanyRepo(db);
      const audit = await createUpdateAuditStamp();
      const rows: CompanyRow[] = [];
      for (const input of inputs) rows.push(await repo.update(input.code, withUpdateAudit(toUpdateRow(input), audit)));
      return enrichRows(rows);
    });
  } catch (error) {
    return translateWriteError(error, "One or more companies not found");
  }
}

export async function batchPatchCompanies(inputs: CompanyBatchPatchRequestDto[]): Promise<CompanyResponseDto[]> {
  try {
    return await withTransaction(async (db) => {
      const repo = new CompanyRepo(db);
      const audit = await createUpdateAuditStamp();
      const rows: CompanyRow[] = [];
      for (const input of inputs) {
        const { code, ...patch } = input;
        rows.push(await repo.patch(code, withUpdateAudit(toPatchRow(patch), audit)));
      }
      return enrichRows(rows);
    });
  } catch (error) {
    return translateWriteError(error, "One or more companies not found");
  }
}

export async function batchDeleteCompanies(codes: string[]): Promise<void> {
  const normalized = normalizeCodes(codes);
  if (!normalized.length) throw new InputValidationError("At least one company code is required");
  await withTransaction(async (db) => {
    const repo = new CompanyRepo(db);
    const rows = await repo.batchGet(normalized);
    const found = new Set(rows.map((row) => row.code));
    const missing = normalized.filter((code) => !found.has(code));
    if (missing.length) throw new NotFoundError(`Company ${missing.join(", ")} not found`);
    for (const company of await enrichRows(rows)) {
      await platformEvents.dispatch(events.companyDeleted, company, { transaction: db });
    }
    await repo.batchDelete(normalized);
  });
}

async function transitionStatus(codes: string[], status: "ACTIVE" | "INACTIVE"): Promise<CompanyResponseDto[]> {
  const normalized = normalizeCodes(codes);
  if (!normalized.length) throw new InputValidationError("At least one company code is required");
  const repo = new CompanyRepo(getDb());
  const existing = await repo.batchGet(normalized);
  const found = new Set(existing.map((row) => row.code));
  const missing = normalized.filter((code) => !found.has(code));
  if (missing.length) throw new NotFoundError(`Company ${missing.join(", ")} not found`);
  return enrichRows(await repo.batchUpdateStatus(normalized, status, await createUpdateAuditStamp()));
}

export function activateCompanies(codes: string[]): Promise<CompanyResponseDto[]> { return transitionStatus(codes, "ACTIVE"); }
export function deactivateCompanies(codes: string[]): Promise<CompanyResponseDto[]> { return transitionStatus(codes, "INACTIVE"); }
export async function activateCompany(code: string): Promise<CompanyResponseDto> { return (await activateCompanies([code]))[0]; }
export async function deactivateCompany(code: string): Promise<CompanyResponseDto> { return (await deactivateCompanies([code]))[0]; }
