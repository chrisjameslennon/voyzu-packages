import type { Filter } from "@voyzu/types/params";
import type { ListOptions } from "@voyzu/types/params";
import type { DimensionCreateRequestDto } from "@voyzu/types/modules/dimensions";
import type { DimensionUpdateRequestDto } from "@voyzu/types/modules/dimensions";
import type { DimensionPatchRequestDto } from "@voyzu/types/modules/dimensions";
import type { DimensionBatchPatchRequestDto, DimensionBatchUpdateRequestDto } from "@voyzu/types/modules/dimensions";
import type { DimensionResponseDto } from "@voyzu/types/modules/dimensions";
import type { DimensionValueCreateRequestDto } from "@voyzu/types/modules/dimensions";
import type { DimensionValuePatchRequestDto } from "@voyzu/types/modules/dimensions";
import type { DimensionValueResponseDto } from "@voyzu/types/modules/dimensions";
import { runtime } from "@voyzu/capability/runtime";
import { BusinessRuleError, ConflictError, NotFoundError, InputValidationError , DataError } from "@voyzu/capability/errors";
import { ChangeCode, ChangeValueName, Deactivate, Delete, DeleteValue } from "@voyzu/modules/common/dimensions/domain/operation-policy";
import { getDb, withTransaction } from "@voyzu/capability/db";
import { createCreationAuditStamp, createUpdateAuditStamp, withAuditActors, withCreationAudit, withUpdateAudit } from "../../../server";

import { DimensionRepo } from "../db/dimension.repo";
import { DimensionValueRepo } from "../db/dimension-value.repo";
import { assertCompanySettingsWritable, resolveEffectiveSettingsCompanyId, resolveTemplateSettingsScope } from "../../../server/settings-scope";

import { toDto, toInsertRow, toUpdateRow, toPatchRow } from "./dimension.mapper";
import { toValueDto, toInsertValueRow } from "./dimension-value.mapper";
import { validateCreate, validateDimensionValueCreate, validateDimensionValuePatch, validateUpdate, validatePatch, validateResponse } from "./dimension.validator";

function checkedResponse(dto: DimensionResponseDto): DimensionResponseDto {
  const errors = validateResponse(dto);
  if (errors.length) {
    const message = `Invalid dimension response (id=${dto.id}): ${errors.join("; ")}`;
    if (runtime.isDevLike) {
      throw new Error(message);
    }
    console.error(message);
  }
  return dto;
}

async function enrichRow(row: Parameters<typeof toDto>[0], values?: DimensionValueResponseDto[]): Promise<DimensionResponseDto> {
  return checkedResponse(await withAuditActors(toDto(row, values), row));
}

// Item operations.

async function scopedCompanyId(companyId?: number): Promise<number> {
  return companyId === undefined
    ? (await resolveTemplateSettingsScope()).companyId
    : resolveEffectiveSettingsCompanyId(companyId);
}

async function assertWritableScope(companyId?: number): Promise<void> {
  if (companyId !== undefined) await assertCompanySettingsWritable(companyId);
}

function normalizeCodes(codes: string[]): string[] {
  return [...new Set(codes.map((code) => code.trim().toUpperCase()).filter(Boolean))];
}

function throwIfBlocked(blockers: ReturnType<typeof Delete>): void {
  if (blockers.length) throw new BusinessRuleError(blockers.map((blocker) => blocker.message).join("; "));
}

export async function createDimension(input: DimensionCreateRequestDto, companyId?: number): Promise<DimensionResponseDto> {
  const errors = validateCreate(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));
  await assertWritableScope(companyId);

  try {
    const row = await new DimensionRepo(getDb()).insert(withCreationAudit(
      toInsertRow(input, await scopedCompanyId(companyId)),
      await createCreationAuditStamp(),
    ));
    return enrichRow(row, []);
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("A dimension with this code already exists");
    }
    throw err;
  }
}

export async function getDimension(code: string, companyId?: number): Promise<DimensionResponseDto | null> {
  const resolvedCompanyId = await scopedCompanyId(companyId);
  const row = await new DimensionRepo(getDb()).get(resolvedCompanyId, code);
  if (!row) return null;
  const valueRows = await new DimensionValueRepo(getDb()).listByDimensionId(resolvedCompanyId, row.id);
  return enrichRow(row, valueRows.map(toValueDto));
}

export async function updateDimension(code: string, input: DimensionUpdateRequestDto, companyId?: number): Promise<DimensionResponseDto> {
  const errors = validateUpdate(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));
  await assertWritableScope(companyId);

  try {
    const resolvedCompanyId = await scopedCompanyId(companyId);
    const repo = new DimensionRepo(getDb());
    const existing = await repo.get(resolvedCompanyId, code);
    if (!existing) throw new DataError(`Dimension ${code} not found`);
    const row = await repo.update(resolvedCompanyId, code, withUpdateAudit(toUpdateRow(input), await createUpdateAuditStamp()));
    const valueRows = await new DimensionValueRepo(getDb()).listByDimensionId(resolvedCompanyId, row.id);
    return enrichRow(row, valueRows.map(toValueDto));
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("A dimension with the target code already exists");
    }
    if (err instanceof DataError) {
      throw new NotFoundError(`Dimension ${code} not found`);
    }
    throw err;
  }
}

export async function patchDimension(code: string, input: DimensionPatchRequestDto, companyId?: number): Promise<DimensionResponseDto> {
  const normalizedInput = input.code === undefined
    ? input
    : { ...input, code: input.code.trim().toUpperCase() };
  const errors = validatePatch(normalizedInput);
  if (errors.length) throw new InputValidationError(errors.join("; "));
  await assertWritableScope(companyId);

  try {
    const resolvedCompanyId = await scopedCompanyId(companyId);
    const repo = new DimensionRepo(getDb());
    const existing = await repo.get(resolvedCompanyId, code);
    if (!existing) throw new DataError(`Dimension ${code} not found`);
    throwIfBlocked(ChangeCode(
      { code: existing.code, hasPostings: existing.has_postings },
      normalizedInput.code ?? existing.code,
    ));
    const row = await repo.patch(resolvedCompanyId, code, withUpdateAudit(toPatchRow(normalizedInput), await createUpdateAuditStamp()));
    const valueRows = await new DimensionValueRepo(getDb()).listByDimensionId(resolvedCompanyId, row.id);
    return enrichRow(row, valueRows.map(toValueDto));
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("A dimension with the target code already exists");
    }
    if (err instanceof DataError) {
      throw new NotFoundError(`Dimension ${code} not found`);
    }
    throw err;
  }
}

export async function deleteDimension(code: string, companyId?: number): Promise<void> {
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  const repo = new DimensionRepo(getDb());
  const existing = await repo.get(resolvedCompanyId, code);
  if (!existing) throw new NotFoundError(`Dimension ${code} not found`);
  throwIfBlocked(Delete({ code: existing.code, hasPostings: existing.has_postings }));
  await repo.delete(resolvedCompanyId, code);
}

// Collection operations.

export async function listDimensions(companyId?: number): Promise<DimensionResponseDto[]> {
  const resolvedCompanyId = await scopedCompanyId(companyId);
  const rows = await new DimensionRepo(getDb()).listAll(resolvedCompanyId);
  const allValues = await new DimensionValueRepo(getDb()).listAll(resolvedCompanyId);

  const valuesByDimensionId = new Map<number, DimensionValueResponseDto[]>();
  for (const v of allValues) {
    const dto = toValueDto(v);
    const list = valuesByDimensionId.get(v.dimension_id) ?? [];
    list.push(dto);
    valuesByDimensionId.set(v.dimension_id, list);
  }

  return Promise.all(rows.map((r) => enrichRow(r, valuesByDimensionId.get(r.id) ?? [])));
}

export async function filterDimensions(
  filters: Filter[],
  options?: ListOptions,
  companyId?: number,
): Promise<DimensionResponseDto[]> {
  const rows = await new DimensionRepo(getDb()).filter(await scopedCompanyId(companyId), filters, options);
  return Promise.all(rows.map((r) => enrichRow(r)));
}

export async function searchDimensions(
  phrase: string,
  options?: ListOptions,
  companyId?: number,
): Promise<DimensionResponseDto[]> {
  const rows = await new DimensionRepo(getDb()).search(await scopedCompanyId(companyId), phrase, options);
  return Promise.all(rows.map((r) => enrichRow(r)));
}
// Batch operations.

export async function batchCreateDimensions(inputs: DimensionCreateRequestDto[], companyId?: number): Promise<DimensionResponseDto[]> {
  for (const input of inputs) {
    const errors = validateCreate(input);
    if (errors.length) throw new InputValidationError(errors.join("; "));
  }
  await assertWritableScope(companyId);

  const resolvedCompanyId = await scopedCompanyId(companyId);
  try {
    return await withTransaction(async (client) => {
      const repo = new DimensionRepo(client);
      const results: DimensionResponseDto[] = [];
      const audit = await createCreationAuditStamp();
      for (const input of inputs) {
        const row = await repo.insert(withCreationAudit(toInsertRow(input, resolvedCompanyId), audit));
        results.push(await enrichRow(row, []));
      }
      return results;
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("One or more codes already exist");
    }
    throw err;
  }
}

export async function batchGetDimensions(codes: string[], companyId?: number): Promise<DimensionResponseDto[]> {
  const rows = await new DimensionRepo(getDb()).batchGet(await scopedCompanyId(companyId), codes);
  return Promise.all(rows.map((r) => enrichRow(r)));
}

export async function batchUpdateDimensions(inputs: DimensionBatchUpdateRequestDto[], companyId?: number): Promise<DimensionResponseDto[]> {
  for (const input of inputs) {
    const errors = validateUpdate(input);
    if (errors.length) throw new InputValidationError(errors.join("; "));
  }
  await assertWritableScope(companyId);

  const resolvedCompanyId = await scopedCompanyId(companyId);
  try {
    return await withTransaction(async (client) => {
      const repo = new DimensionRepo(client);
      const results: DimensionResponseDto[] = [];
      const audit = await createUpdateAuditStamp();
      for (const input of inputs) {
        const existing = await repo.get(resolvedCompanyId, input.code);
        if (!existing) throw new DataError(`Dimension ${input.code} not found`);
        const row = await repo.update(resolvedCompanyId, input.code, withUpdateAudit(toUpdateRow(input), audit));
        results.push(await enrichRow(row, []));
      }
      return results;
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("One or more target codes already exist");
    }
    if (err instanceof DataError) {
      throw new NotFoundError("One or more dimensions not found");
    }
    throw err;
  }
}

export async function batchPatchDimensions(inputs: DimensionBatchPatchRequestDto[], companyId?: number): Promise<DimensionResponseDto[]> {
  for (const input of inputs) {
    const errors = validatePatch(input);
    if (errors.length) throw new InputValidationError(errors.join("; "));
  }
  await assertWritableScope(companyId);

  const resolvedCompanyId = await scopedCompanyId(companyId);
  try {
    return await withTransaction(async (client) => {
      const repo = new DimensionRepo(client);
      const results: DimensionResponseDto[] = [];
      const audit = await createUpdateAuditStamp();
      for (const input of inputs) {
        const existing = await repo.get(resolvedCompanyId, input.code);
        if (!existing) throw new DataError(`Dimension ${input.code} not found`);
        const row = await repo.patch(resolvedCompanyId, input.code, withUpdateAudit(toPatchRow(input), audit));
        results.push(await enrichRow(row));
      }
      return results;
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("One or more target codes already exist");
    }
    if (err instanceof DataError) {
      throw new NotFoundError("One or more dimensions not found");
    }
    throw err;
  }
}

export async function batchDeleteDimensions(codes: string[], companyId?: number): Promise<void> {
  await assertWritableScope(companyId);
  const normalizedCodes = normalizeCodes(codes);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  await withTransaction(async (client) => {
    const repo = new DimensionRepo(client);
    const rows = await repo.batchGet(resolvedCompanyId, normalizedCodes);
    const byCode = new Map(rows.map((row) => [row.code, row]));
    for (const code of normalizedCodes) {
      const existing = byCode.get(code);
      if (!existing) throw new NotFoundError(`Dimension ${code} not found`);
      throwIfBlocked(Delete({ code: existing.code, hasPostings: existing.has_postings }));
    }
    await repo.batchDelete(resolvedCompanyId, normalizedCodes);
  });
}

export async function activateDimensions(codes: string[], companyId?: number): Promise<DimensionResponseDto[]> {
  return transitionDimensionStatus(codes, "ACTIVE", companyId);
}

export async function activateDimension(code: string, companyId?: number): Promise<DimensionResponseDto> {
  const [dimension] = await activateDimensions([code], companyId);
  return dimension;
}

export async function deactivateDimensions(codes: string[], companyId?: number): Promise<DimensionResponseDto[]> {
  return transitionDimensionStatus(codes, "INACTIVE", companyId);
}

export async function deactivateDimension(code: string, companyId?: number): Promise<DimensionResponseDto> {
  const [dimension] = await deactivateDimensions([code], companyId);
  return dimension;
}

async function transitionDimensionStatus(
  codes: string[],
  status: "ACTIVE" | "INACTIVE",
  companyId?: number,
): Promise<DimensionResponseDto[]> {
  const normalizedCodes = normalizeCodes(codes);
  if (normalizedCodes.length === 0) throw new InputValidationError("At least one dimension code is required");
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  return withTransaction(async (client) => {
    const repo = new DimensionRepo(client);
    const results: DimensionResponseDto[] = [];
    const audit = await createUpdateAuditStamp();
    for (const code of normalizedCodes) {
      const existing = await repo.get(resolvedCompanyId, code);
      if (!existing) throw new NotFoundError(`Dimension ${code} not found`);
      if (status === "INACTIVE") throwIfBlocked(Deactivate({ code: existing.code, hasPostings: existing.has_postings }));
      results.push(await enrichRow(await repo.patch(resolvedCompanyId, code, withUpdateAudit({ status }, audit))));
    }
    return results;
  });
}

// Dimension value operations.

export async function createDimensionValue(dimensionCode: string, input: DimensionValueCreateRequestDto, companyId?: number): Promise<DimensionValueResponseDto> {
  await assertWritableScope(companyId);
  const normalizedInput = { ...input, name: input.name?.trim() };
  const errors = validateDimensionValueCreate(normalizedInput);
  if (errors.length) throw new InputValidationError(errors.join("; "));

  const resolvedCompanyId = await scopedCompanyId(companyId);
  const dimension = await new DimensionRepo(getDb()).get(resolvedCompanyId, dimensionCode);
  if (!dimension) throw new NotFoundError(`Dimension ${dimensionCode} not found`);

  const repo = new DimensionValueRepo(getDb());
  if (await repo.nameExists(resolvedCompanyId, dimension.id, normalizedInput.name)) {
    throw new ConflictError("A dimension value with this name already exists");
  }
  try {
    const row = await repo.insert(withCreationAudit(
      toInsertValueRow(resolvedCompanyId, dimension.id, normalizedInput),
      await createCreationAuditStamp(),
    ));
    return toValueDto(row);
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("A dimension value with this name already exists");
    }
    throw err;
  }
}

export async function listDimensionValues(dimensionCode: string, companyId?: number): Promise<DimensionValueResponseDto[]> {
  const resolvedCompanyId = await scopedCompanyId(companyId);
  const dimension = await new DimensionRepo(getDb()).get(resolvedCompanyId, dimensionCode);
  if (!dimension) throw new NotFoundError(`Dimension ${dimensionCode} not found`);

  const rows = await new DimensionValueRepo(getDb()).listByDimensionId(resolvedCompanyId, dimension.id);
  return rows.map(toValueDto);
}

export async function patchDimensionValue(id: number, input: DimensionValuePatchRequestDto, companyId?: number): Promise<DimensionValueResponseDto> {
  await assertWritableScope(companyId);
  input = input.name === undefined ? input : { ...input, name: input.name.trim() };
  const errors = validateDimensionValuePatch(input);
  if (errors.length) throw new InputValidationError(errors.join("; "));
  const resolvedCompanyId = await scopedCompanyId(companyId);
  const repo = new DimensionValueRepo(getDb());
  const existing = await repo.getById(resolvedCompanyId, id);
  if (!existing) throw new NotFoundError(`Dimension value ${id} not found`);
  if (input.name !== undefined) {
    const proposedName = input.name;
    throwIfBlocked(ChangeValueName({ name: existing.name, hasPostings: existing.has_postings }, proposedName));
    if (await repo.nameExists(resolvedCompanyId, existing.dimension_id, proposedName, existing.id)) {
      throw new ConflictError("A dimension value with this name already exists");
    }
  }

  try {
    const row = await repo.patchById(resolvedCompanyId, id, withUpdateAudit(input, await createUpdateAuditStamp()));
    return toValueDto(row);
  } catch (err) {
    if (err instanceof Error && err.message.includes("duplicate key value")) {
      throw new ConflictError("A dimension value with this name already exists");
    }
    throw err;
  }
}

export async function deleteDimensionValue(id: number, companyId?: number): Promise<void> {
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  const repo = new DimensionValueRepo(getDb());
  const existing = await repo.getById(resolvedCompanyId, id);
  if (!existing) throw new NotFoundError(`Dimension value ${id} not found`);
  throwIfBlocked(DeleteValue({ name: existing.name, hasPostings: existing.has_postings }));
  await repo.deleteById(resolvedCompanyId, id);
}

