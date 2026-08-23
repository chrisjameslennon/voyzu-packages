import { getDb, withTransaction } from "@voyzu/capability/db";
import { BusinessRuleError, ConflictError, DataError, InputValidationError, NotFoundError } from "@voyzu/capability/errors";
import type {
  GlAccountCategoryBatchPatchRequestDto,
  GlAccountCategoryBatchUpdateRequestDto,
  GlAccountCategoryCreateRequestDto,
  GlAccountCategoryPatchRequestDto,
  GlAccountCategoryResponseDto,
  GlAccountCategoryUpdateRequestDto,
} from "@voyzu/finance/types/modules/gl-account-categories";
import type { Filter, ListOptions } from "@voyzu/types/params";
import { createCreationAuditStamp, createUpdateAuditStamp, withAuditActors, withCreationAudit, withUpdateAudit } from "../../../server";

import { assertCompanySettingsWritable, resolveEffectiveSettingsCompanyId, resolveTemplateSettingsScope } from "../../../server/settings-scope";
import { Deactivate, Delete } from "../../domain/operation-policy";
import { GlAccountCategoryRepo } from "../db/gl-account-category.repo";
import type { GlAccountCategoryRow } from "../db/gl-account-category.row.types";

import { toDto, toInsertRow, toPatchRow, toUpdateRow } from "./gl-account-category.mapper";

async function enrichRow(row: GlAccountCategoryRow): Promise<GlAccountCategoryResponseDto> {
  return withAuditActors(toDto(row), row);
}

function enrichRows(rows: GlAccountCategoryRow[]): Promise<GlAccountCategoryResponseDto[]> {
  return Promise.all(rows.map((row) => enrichRow(row)));
}

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

export async function createGlAccountCategory(input: GlAccountCategoryCreateRequestDto, companyId?: number): Promise<GlAccountCategoryResponseDto> {
  await assertWritableScope(companyId);

  try {
    const row = await new GlAccountCategoryRepo(getDb()).insert(withCreationAudit(
      toInsertRow(input, await scopedCompanyId(companyId)),
      await createCreationAuditStamp(),
    ));
    return enrichRow(row);
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key value")) {
      throw new ConflictError("A GL account category with this code already exists");
    }
    throw error;
  }
}

export async function getGlAccountCategory(code: string, companyId?: number): Promise<GlAccountCategoryResponseDto | null> {
  const row = await new GlAccountCategoryRepo(getDb()).get(await scopedCompanyId(companyId), code);
  return row ? enrichRow(row) : null;
}

export async function updateGlAccountCategory(code: string, input: GlAccountCategoryUpdateRequestDto, companyId?: number): Promise<GlAccountCategoryResponseDto> {
  await assertWritableScope(companyId);

  try {
    const resolvedCompanyId = await scopedCompanyId(companyId);
    return await withTransaction(async (client) => {
      const repo = new GlAccountCategoryRepo(client);
      const existing = await repo.get(resolvedCompanyId, code);
      if (!existing) throw new DataError(`GL account category ${code} not found`);
      return enrichRow(await repo.update(resolvedCompanyId, code, withUpdateAudit(toUpdateRow(input), await createUpdateAuditStamp())));
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key value")) {
      throw new ConflictError("A GL account category with the target code already exists");
    }
    if (error instanceof DataError) throw new NotFoundError(`GL account category ${code} not found`);
    throw error;
  }
}

export async function patchGlAccountCategory(code: string, input: GlAccountCategoryPatchRequestDto, companyId?: number): Promise<GlAccountCategoryResponseDto> {
  await assertWritableScope(companyId);

  try {
    const resolvedCompanyId = await scopedCompanyId(companyId);
    return await withTransaction(async (client) => {
      const repo = new GlAccountCategoryRepo(client);
      const existing = await repo.get(resolvedCompanyId, code);
      if (!existing) throw new DataError(`GL account category ${code} not found`);
      return enrichRow(await repo.patch(resolvedCompanyId, code, withUpdateAudit(toPatchRow(input), await createUpdateAuditStamp())));
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key value")) {
      throw new ConflictError("A GL account category with the target code already exists");
    }
    if (error instanceof DataError) throw new NotFoundError(`GL account category ${code} not found`);
    throw error;
  }
}

export async function deleteGlAccountCategory(code: string, companyId?: number): Promise<void> {
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  await withTransaction(async (client) => {
    const repo = new GlAccountCategoryRepo(client);
    const existing = await repo.get(resolvedCompanyId, code);
    if (!existing) throw new NotFoundError(`GL account category ${code} not found`);
    throwIfBlocked(Delete({ code: existing.code, linkedBy: existing.linked_by }));
    await repo.delete(resolvedCompanyId, code);
  });
}

export async function listGlAccountCategories(companyId?: number): Promise<GlAccountCategoryResponseDto[]> {
  return enrichRows(await new GlAccountCategoryRepo(getDb()).listAll(await scopedCompanyId(companyId)));
}

export async function filterGlAccountCategories(filters: Filter[], options?: ListOptions, companyId?: number): Promise<GlAccountCategoryResponseDto[]> {
  return enrichRows(await new GlAccountCategoryRepo(getDb()).filter(await scopedCompanyId(companyId), filters, options));
}

export async function searchGlAccountCategories(phrase: string, options?: ListOptions, companyId?: number): Promise<GlAccountCategoryResponseDto[]> {
  return enrichRows(await new GlAccountCategoryRepo(getDb()).search(await scopedCompanyId(companyId), phrase, options));
}
export async function batchCreateGlAccountCategories(inputs: GlAccountCategoryCreateRequestDto[], companyId?: number): Promise<GlAccountCategoryResponseDto[]> {
  await assertWritableScope(companyId);

  const resolvedCompanyId = await scopedCompanyId(companyId);
  try {
    return await withTransaction(async (client) => {
      const repo = new GlAccountCategoryRepo(client);
      const results: GlAccountCategoryResponseDto[] = [];
      const audit = await createCreationAuditStamp();
      for (const input of inputs) {
        results.push(await enrichRow(await repo.insert(withCreationAudit(toInsertRow(input, resolvedCompanyId), audit))));
      }
      return results;
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("duplicate key value")) {
      throw new ConflictError("One or more codes already exist");
    }
    throw error;
  }
}

export async function batchGetGlAccountCategories(codes: string[], companyId?: number): Promise<GlAccountCategoryResponseDto[]> {
  return enrichRows(await new GlAccountCategoryRepo(getDb()).batchGet(await scopedCompanyId(companyId), codes));
}

export async function batchUpdateGlAccountCategories(inputs: GlAccountCategoryBatchUpdateRequestDto[], companyId?: number): Promise<GlAccountCategoryResponseDto[]> {
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  return withTransaction(async (client) => {
    const repo = new GlAccountCategoryRepo(client);
    const results: GlAccountCategoryResponseDto[] = [];
    const audit = await createUpdateAuditStamp();
    for (const input of inputs) {
      const existing = await repo.get(resolvedCompanyId, input.code);
      if (!existing) throw new NotFoundError(`GL account category ${input.code} not found`);
      results.push(await enrichRow(await repo.update(resolvedCompanyId, input.code, withUpdateAudit(toUpdateRow(input), audit))));
    }
    return results;
  });
}

export async function batchPatchGlAccountCategories(inputs: GlAccountCategoryBatchPatchRequestDto[], companyId?: number): Promise<GlAccountCategoryResponseDto[]> {
  await assertWritableScope(companyId);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  return withTransaction(async (client) => {
    const repo = new GlAccountCategoryRepo(client);
    const results: GlAccountCategoryResponseDto[] = [];
    const audit = await createUpdateAuditStamp();
    for (const input of inputs) {
      const existing = await repo.get(resolvedCompanyId, input.code);
      if (!existing) throw new NotFoundError(`GL account category ${input.code} not found`);
      results.push(await enrichRow(await repo.patch(resolvedCompanyId, input.code, withUpdateAudit(toPatchRow(input), audit))));
    }
    return results;
  });
}

export async function batchDeleteGlAccountCategories(codes: string[], companyId?: number): Promise<void> {
  await assertWritableScope(companyId);
  const normalizedCodes = normalizeCodes(codes);
  const resolvedCompanyId = await scopedCompanyId(companyId);
  await withTransaction(async (client) => {
    const repo = new GlAccountCategoryRepo(client);
    const rows = await repo.batchGet(resolvedCompanyId, normalizedCodes);
    const byCode = new Map(rows.map((row) => [row.code, row]));
    for (const code of normalizedCodes) {
      const existing = byCode.get(code);
      if (!existing) throw new NotFoundError(`GL account category ${code} not found`);
      throwIfBlocked(Delete({ code: existing.code, linkedBy: existing.linked_by }));
    }
    await repo.batchDelete(resolvedCompanyId, normalizedCodes);
  });
}

export async function activateGlAccountCategories(codes: string[], companyId?: number): Promise<GlAccountCategoryResponseDto[]> {
  return transitionGlAccountCategoryStatus(codes, "ACTIVE", companyId);
}

export async function activateGlAccountCategory(code: string, companyId?: number): Promise<GlAccountCategoryResponseDto> {
  const [category] = await activateGlAccountCategories([code], companyId);
  return category;
}

export async function deactivateGlAccountCategories(codes: string[], companyId?: number): Promise<GlAccountCategoryResponseDto[]> {
  return transitionGlAccountCategoryStatus(codes, "INACTIVE", companyId);
}

export async function deactivateGlAccountCategory(code: string, companyId?: number): Promise<GlAccountCategoryResponseDto> {
  const [category] = await deactivateGlAccountCategories([code], companyId);
  return category;
}

async function transitionGlAccountCategoryStatus(
  codes: string[],
  status: "ACTIVE" | "INACTIVE",
  companyId?: number,
): Promise<GlAccountCategoryResponseDto[]> {
  const normalizedCodes = normalizeCodes(codes);
  if (normalizedCodes.length === 0) throw new InputValidationError("At least one GL account category code is required");
  await assertWritableScope(companyId);

  const resolvedCompanyId = await scopedCompanyId(companyId);
  return withTransaction(async (client) => {
    const repo = new GlAccountCategoryRepo(client);
    const results: GlAccountCategoryResponseDto[] = [];
    const audit = await createUpdateAuditStamp();
    for (const code of normalizedCodes) {
      const existing = await repo.get(resolvedCompanyId, code);
      if (!existing) throw new NotFoundError(`GL account category ${code} not found`);
      if (status === "INACTIVE") throwIfBlocked(Deactivate({ code: existing.code, linkedBy: existing.linked_by }));
      results.push(await enrichRow(await repo.patch(resolvedCompanyId, code, withUpdateAudit({ status }, audit))));
    }
    return results;
  });
}
